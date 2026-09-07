const STEAM_URL = "https://store.steampowered.com/api/appdetails";

export default async function handler(req, res) {
  const raw = Array.isArray(req.query?.appids) ? req.query.appids.join(",") : req.query?.appids;
  const appids = String(raw || "").split(",").map(x => x.trim()).filter(x => /^\d+$/.test(x)).slice(0, 50);

  if (!appids.length) return res.status(400).json({ error: "Missing appids" });

  try {
    const upstream = await fetch(`${STEAM_URL}?appids=${encodeURIComponent(appids.join(","))}&cc=us&l=english`, {
      headers: { Accept: "application/json" }
    });
    if (!upstream.ok) return res.status(502).json({ error: `Steam returned ${upstream.status}` });
    const data = await upstream.json();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: "Steam unavailable" });
  }
}
