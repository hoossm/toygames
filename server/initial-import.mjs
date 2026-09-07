import { db, getSetting, setSetting } from './db.mjs';
import { getAppList, getAppDetails, sleep } from './steam-api.mjs';

const DETAIL_BATCH_SIZE = Number(process.env.STEAM_DETAIL_BATCH_SIZE || 50);
const DETAIL_DELAY_MS = Number(process.env.STEAM_DETAIL_DELAY_MS || 5000);

// Optional safety limit for testing.
// Example: STEAM_IMPORT_MAX_APPS=100
// If unset, the importer keeps the normal full-catalog behavior.
const MAX_APPS_THIS_RUN = Math.max(0, Number(process.env.STEAM_IMPORT_MAX_APPS || 0));
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

function unixNow() {
  return Math.floor(Date.now() / 1000);
}

async function importAppList() {
  let lastAppId = Number(getSetting('initial_last_app_id') || 0);
  let total = Number(getSetting('initial_apps_seen') || 0);
  let importedThisRun = 0;

  while (true) {
    const remaining = MAX_APPS_THIS_RUN
      ? MAX_APPS_THIS_RUN - importedThisRun
      : 50000;

    if (remaining <= 0) break;

    const page = await getAppList({
      lastAppId,
      maxResults: Math.min(50000, remaining)
    });

    const apps = page?.response?.apps || page?.apps || [];
    if (!apps.length) break;

    const now = unixNow();
    const tx = db.prepare('BEGIN');
    tx.run();

    try {
      for (const app of apps) {
        if (!Number.isInteger(Number(app.appid)) || !app.name) continue;

        upsertApp.run(
          Number(app.appid),
          app.name,
          app.last_modified ?? null,
          app.price_change_number ?? null,
          now,
          now
        );

        total += 1;
        importedThisRun += 1;

        if (MAX_APPS_THIS_RUN && importedThisRun >= MAX_APPS_THIS_RUN) break;
      }

      db.prepare('COMMIT').run();
    } catch (error) {
      db.prepare('ROLLBACK').run();
      throw error;
    }

    lastAppId = Number(apps[apps.length - 1].appid);
    setSetting('initial_last_app_id', lastAppId);
    setSetting('initial_apps_seen', total);

    console.log(
      `[catalog] list page: ${apps.length} apps, last_appid=${lastAppId}, total_seen=${total}, this_run=${importedThisRun}`
    );

    if (importedThisRun >= MAX_APPS_THIS_RUN && MAX_APPS_THIS_RUN) break;
    if (apps.length < 50000) break;
  }

  if (!MAX_APPS_THIS_RUN) {
    setSetting('initial_list_complete', Date.now());
    return total;
  }

  console.log(`[catalog] TEST LIMIT reached: ${importedThisRun} apps this run`);
  return total;
}

async function importDetails() {
  let processed = Number(getSetting('initial_details_processed') || 0);
  let processedThisRun = 0;

  while (true) {
    if (MAX_APPS_THIS_RUN && processedThisRun >= MAX_APPS_THIS_RUN) break;

    const remaining = MAX_APPS_THIS_RUN
      ? Math.min(DETAIL_BATCH_SIZE, MAX_APPS_THIS_RUN - processedThisRun)
      : DETAIL_BATCH_SIZE;

    const rows = db.prepare(`
      SELECT steam_app_id FROM games
      WHERE last_metadata_update IS NULL
      ORDER BY steam_app_id
      LIMIT ?
    `).all(remaining);

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
          db.prepare(
            'UPDATE games SET last_metadata_update = ?, updated_at = ? WHERE steam_app_id = ?'
          ).run(now, now, id);
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
    processedThisRun += ids.length;

    setSetting('initial_details_processed', processed);
    console.log(
      `[catalog] details: +${ids.length}, processed=${processed}, this_run=${processedThisRun}`
    );

    if (MAX_APPS_THIS_RUN && processedThisRun >= MAX_APPS_THIS_RUN) break;
    await sleep(DETAIL_DELAY_MS);
  }

  if (!MAX_APPS_THIS_RUN) {
    setSetting('initial_details_complete', Date.now());
  } else {
    console.log(`[catalog] TEST LIMIT reached: ${processedThisRun} detail records this run`);
  }
}

const total = await importAppList();
console.log(`[catalog] initial app-list import complete: ${total} rows`);

if (IMPORT_DETAILS) await importDetails();

if (!MAX_APPS_THIS_RUN) {
  console.log('[catalog] initial import complete');
} else {
  console.log('[catalog] small test import complete — full import was NOT started');
}
