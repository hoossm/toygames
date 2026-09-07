# ToyGames VPS catalog worker

This is the first VPS-ready backend phase. The website can stay on Vercel while this worker is developed locally and later moved to the VPS.

## What it does

### Initial import
1. Calls Steam `IStoreService/GetAppList` with games-only filters.
2. Paginates with `last_appid` and stores the full game list locally.
3. Resumes from the saved checkpoint if interrupted.
4. Fetches detailed store metadata in batches.
5. Keeps progress in SQLite, so a restart does not restart the whole scan.

Steam documents `GetAppList` as paginated, with `last_appid` continuation and up to 50,000 results per call. It also exposes `if_modified_since` and `price_change_number` for later incremental updates.

### Daily sync
`daily-sync.mjs` uses `if_modified_since` to fetch only changed/new games, then refreshes their details.

### Pricing
The market-price provider is deliberately left as an adapter. Once we select the actual market sources, the updater will calculate:

`ToyGames price = cheapest valid market price + $2`

No stock/region system is included.

## Run locally

Use Node 22+.

1. Copy `.env.example` to `.env` and set `STEAM_API_KEY`.
2. Export the variables in your shell (or load them with your preferred env loader).
3. Run:

```bash
node server/initial-import.mjs
```

For the daily job:

```bash
node server/daily-sync.mjs
```

On the VPS, schedule `daily-sync.mjs` once every 24 hours with cron/systemd.

## Important

The initial full import is intentionally resumable and rate-controlled. The previously agreed ~23-hour first-run estimate is a planning estimate for the selected small-scale rate; the actual duration depends on the number of games and the final request/rate strategy.
