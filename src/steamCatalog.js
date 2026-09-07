const STEAM_ENDPOINT = "https://store.steampowered.com/api/appdetails/";

// ToyGames owns the commercial fields (price/type/discount). Steam only supplies
// the public game metadata: title, artwork and description.
export async function loadSteamCatalog(seedGames) {
  const ids = seedGames.map(g => g.steamAppId || g.id).join(",");
  const url = `${STEAM_ENDPOINT}?appids=${encodeURIComponent(ids)}&cc=us&l=english`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Steam request failed: ${res.status}`);
    const data = await res.json();

    return seedGames.map(game => {
      const steamId = game.steamAppId || game.id;
      const payload = data?.[steamId];
      if (!payload?.success || !payload.data) return game;

      const d = payload.data;
      const genre = d.genres?.[0]?.description || game.g;
      const image = d.header_image || game.img;
      const description = d.short_description || game.description;

      return { ...game, steamAppId: steamId, t: d.name || game.t, g: genre, img: image, description };
    });
  } finally {
    clearTimeout(timer);
  }
}
