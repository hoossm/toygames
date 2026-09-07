import { db, getSetting, setSetting } from './db.mjs';
import { getAppList, getAppDetails, sleep } from './steam-api.mjs';

const DETAIL_BATCH_SIZE = Number(process.env.STEAM_DETAIL_BATCH_SIZE || 50);
const DETAIL_DELAY_MS = Number(process.env.STEAM_DETAIL_DELAY_MS || 5000);
const IMPORT_DETAILS = process.env.STEAM_IMPORT_DETAILS !== 'false';

const upsertApp = db.prepare(`
  INSERT INTO games(steam_app_id, name, steam_last_modified, steam_price_change_number, created_at, updated_at)
  VALUES(?, ?, ?, ?, ?, ?)
  ON CONFLICT(steam_app_id) DO UPDATE SET
    name = excluded.name,
    steam_last_modified = excluded.steam_last_modified,
    steam_price_change_number = excluded.steam_price_change_number,
    updated_at = excluded.updated_at
`);

const upsertDetails = db.prepare(`
  UPDATE games SET
    name = ?, description = ?, short_description = ?, header_image = ?, capsule_image = ?,
    genres_json = ?, developers_json = ?, publishers_json = ?,
    steam_price_cents = ?, steam_currency = ?, last_metadata_update = ?, updated_at = ?
  WHERE steam_app_id = ?
`);

function unixNow() { return Math.floor(Date.now() / 1000); }

async function importAppList() {
  let lastAppId = Number(getSetting('initial_last_app_id') || 0);
  let total = Number(getSetting('initial_apps_seen') || 0);

  while (true) {
    const page = await getAppList({ lastAppId });
    const apps = page?.response?.apps || page?.apps || [];
    if (!apps.length) break;

    const now = unixNow();
    const tx = db.prepare('BEGIN');
    tx.run();
    try {
      for (const app of apps) {
        if (!Number.isInteger(Number(app.appid)) || !app.name) continue;
        upsertApp.run(Number(app.appid), app.name, app.last_modified ?? null, app.price_change_number ?? null, now, now);
        total += 1;
      }
      db.prepare('COMMIT').run();
    } catch (error) {
      db.prepare('ROLLBACK').run();
      throw error;
    }

    lastAppId = Number(apps[apps.length - 1].appid);
    setSetting('initial_last_app_id', lastAppId);
    setSetting('initial_apps_seen', total);
    console.log(`[catalog] list page: ${apps.length} apps, last_appid=${lastAppId}, total_seen=${total}`);

    if (apps.length < 50000) break;
  }

  setSetting('initial_list_complete', Date.now());
  return total;
}

async function importDetails() {
  let processed = Number(getSetting('initial_details_processed') || 0);
  while (true) {
    const rows = db.prepare(`
      SELECT steam_app_id FROM games
      WHERE last_metadata_update IS NULL
      ORDER BY steam_app_id
      LIMIT ?
    `).all(DETAIL_BATCH_SIZE);
    if (!rows.length) break;

    const ids = rows.map(row => row.steam_app_id);
    const data = await getAppDetails(ids);
    const now = unixNow();

    const tx = db.prepare('BEGIN');
    tx.run();
    try {
      for (const id of ids) {
        const payload = data?.[id];
        if (!payload?.success || !payload.data) {
          db.prepare('UPDATE games SET last_metadata_update = ?, updated_at = ? WHERE steam_app_id = ?').run(now, now, id);
          continue;
        }
        const game = payload.data;
        const price = game.price_overview;
        upsertDetails.run(
          game.name || `Steam App ${id}`,
          game.detailed_description || null,
          game.short_description || null,
          game.header_image || null,
          game.capsule_image || null,
          JSON.stringify(game.genres || []),
          JSON.stringify(game.developers || []),
          JSON.stringify(game.publishers || []),
          price?.final ?? null,
          price?.currency ?? null,
          now,
          now,
          id
        );
      }
      db.prepare('COMMIT').run();
    } catch (error) {
      db.prepare('ROLLBACK').run();
      throw error;
    }

    processed += ids.length;
    setSetting('initial_details_processed', processed);
    console.log(`[catalog] details: +${ids.length}, processed=${processed}`);
    await sleep(DETAIL_DELAY_MS);
  }

  setSetting('initial_details_complete', Date.now());
}

const total = await importAppList();
console.log(`[catalog] initial app-list import complete: ${total} rows`);
if (IMPORT_DETAILS) await importDetails();
console.log('[catalog] initial import complete');
