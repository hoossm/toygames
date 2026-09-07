const STEAM_ENDPOINT = "https://store.steampowered.com/api/appdetails/";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const appids = String(req.query?.appids || "");
  const ids = appids
    .split(",")
    .map(id => id.trim())
    .filter(id => /^\d+$/.test(id));

  if (!ids.length || ids.length > 50) {
    return res.status(400).json({ error: "Provide 1-50 numeric Steam app IDs" });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6500);

  try {
    const steamUrl = `${STEAM_ENDPOINT}?appids=${encodeURIComponent(ids.join(","))}&cc=us&l=english`;
    const response = await fetch(steamUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "ToyGames/1.0"
      }
    });

    if (!response.ok) {
      return res.status(502).json({ error: "Steam request failed" });
    }

    const data = await response.json();

    // Let Vercel/CDNs reuse the same catalog response briefly.
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=3600");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({
      error: error?.name === "AbortError" ? "Steam request timed out" : "Unable to reach Steam"
    });
  } finally {
    clearTimeout(timeout);
  }
}
