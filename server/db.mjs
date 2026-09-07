import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const dbPath = process.env.TOYGAMES_DB_PATH || './data/toygames.db';
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new DatabaseSync(dbPath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA busy_timeout = 5000;

  CREATE TABLE IF NOT EXISTS games (
    steam_app_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'Steam Account',
    description TEXT,
    short_description TEXT,
    header_image TEXT,
    capsule_image TEXT,
    genres_json TEXT,
    developers_json TEXT,
    publishers_json TEXT,
    steam_last_modified INTEGER,
    steam_price_change_number INTEGER,
    steam_price_cents INTEGER,
    steam_currency TEXT,
    toy_price_cents INTEGER,
    toy_original_price_cents INTEGER,
    last_metadata_update INTEGER,
    last_price_update INTEGER,
    active INTEGER NOT NULL DEFAULT 1,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_games_metadata_update ON games(last_metadata_update);
  CREATE INDEX IF NOT EXISTS idx_games_price_update ON games(last_price_update);
  CREATE INDEX IF NOT EXISTS idx_games_active ON games(active);

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

export function getSetting(key) {
  return db.prepare('SELECT value FROM settings WHERE key = ?').get(key)?.value ?? null;
}

export function setSetting(key, value) {
  db.prepare(`INSERT INTO settings(key, value) VALUES(?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value`).run(key, String(value));
}

export function closeDb() {
  db.close();
}
