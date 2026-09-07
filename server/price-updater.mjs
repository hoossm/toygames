// Price updater contract only.
// The market-price source(s) are intentionally not hard-coded yet.
// Once chosen, implement getCheapestMarketPrice(steamAppId) and keep the
// pricing rule here: ToyGames price = cheapest valid market price + $2.

import { db } from './db.mjs';

export function applyToyGamesPrice(steamAppId, cheapestPriceCents) {
  if (!Number.isInteger(cheapestPriceCents) || cheapestPriceCents < 0) return;
  const toyPrice = cheapestPriceCents + 200;
  db.prepare(`UPDATE games SET toy_price_cents = ?, last_price_update = ?, updated_at = ? WHERE steam_app_id = ?`)
    .run(toyPrice, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000), steamAppId);
}
