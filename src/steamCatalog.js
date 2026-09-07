const STEAM_ENDPOINT = "/api/steam";

// Steam supplies public metadata. ToyGames keeps its own commercial fields.
export async function loadSteamCatalog(seedGames) {
  const ids = seedGames.map(g => g.steamAppId || g.id).join(",");
  const url = `${STEAM_ENDPOINT}?appids=${encodeURIComponent(ids)}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 7000);

  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Steam proxy failed: ${res.status}`);
    const data = await res.json();

    return seedGames.map(game => {
      const steamId = game.steamAppId || game.id;
      const payload = data?.[steamId];
      if (!payload?.success || !payload.data) return game;
      const d = payload.data;
      return {
        ...game,
        steamAppId: steamId,
        t: d.name || game.t,
        g: d.genres?.[0]?.description || game.g,
        img: d.header_image || game.img,
        description: d.short_description || game.description
      };
    });
  } finally {
    clearTimeout(timer);
  }
}
