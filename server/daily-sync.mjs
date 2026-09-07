import { db, getSetting, setSetting } from './db.mjs';
import { getAppList, getAppDetails, sleep } from './steam-api.mjs';

const DETAIL_BATCH_SIZE = Number(process.env.STEAM_DETAIL_BATCH_SIZE || 50);
const DETAIL_DELAY_MS = Number(process.env.STEAM_DETAIL_DELAY_MS || 5000);
const now = Math.floor(Date.now() / 1000);
const previous = Number(getSetting('last_incremental_sync') || (now - 86400));

const upsertApp = db.prepare(`
  INSERT INTO games(steam_app_id, name, steam_last_modified, steam_price_change_number, created_at, updated_at)
  VALUES(?, ?, ?, ?, ?, ?)
  ON CONFLICT(steam_app_id) DO UPDATE SET
    name = excluded.name,
    steam_last_modified = excluded.steam_last_modified,
    steam_price_change_number = excluded.steam_price_change_number,
    updated_at = excluded.updated_at
`);

let lastAppId = 0;
let changed = 0;
const changedIds = new Set();

while (true) {
  const page = await getAppList({ lastAppId, ifModifiedSince: previous });
  const apps = page?.response?.apps || page?.apps || [];
  if (!apps.length) break;

  for (const app of apps) {
    const id = Number(app.appid);
    if (!id || !app.name) continue;
    const existing = db.prepare('SELECT steam_price_change_number FROM games WHERE steam_app_id = ?').get(id);
    upsertApp.run(id, app.name, app.last_modified ?? null, app.price_change_number ?? null, now, now);
    changed += 1;
    if (!existing || existing.steam_price_change_number !== app.price_change_number) changedIds.add(id);
  }

  lastAppId = Number(apps[apps.length - 1].appid);
  if (apps.length < 50000) break;
}

for (const batch of chunk([...changedIds], DETAIL_BATCH_SIZE)) {
  const data = await getAppDetails(batch);
  const update = db.prepare(`UPDATE games SET name=?, description=?, short_description=?, header_image=?, capsule_image=?, genres_json=?, developers_json=?, publishers_json=?, steam_price_cents=?, steam_currency=?, last_metadata_update=?, updated_at=? WHERE steam_app_id=?`);
  for (const id of batch) {
    const payload = data?.[id];
    if (!payload?.success || !payload.data) continue;
    const game = payload.data;
    const price = game.price_overview;
    update.run(game.name || `Steam App ${id}`, game.detailed_description || null, game.short_description || null, game.header_image || null, game.capsule_image || null, JSON.stringify(game.genres || []), JSON.stringify(game.developers || []), JSON.stringify(game.publishers || []), price?.final ?? null, price?.currency ?? null, now, now, id);
  }
  await sleep(DETAIL_DELAY_MS);
}

setSetting('last_incremental_sync', now);
console.log(`[catalog] daily sync complete: changed=${changed}, price-sensitive=${changedIds.size}`);

function chunk(items, size) {
  const result = [];
  for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
  return result;
}
