const API_KEY = process.env.STEAM_API_KEY;

const APP_LIST_URL =
  "https://api.steampowered.com/IStoreService/GetAppList/v1/";

const APP_DETAILS_URL =
  "https://store.steampowered.com/api/appdetails/";

function requiredKey() {
  if (!API_KEY) {
    throw new Error("STEAM_API_KEY is not set");
  }

  return API_KEY;
}

async function fetchJson(url, options = {}, retries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          Accept: "application/json",
          "User-Agent": "ToyGamesCatalog/1.0",
          ...(options.headers || {})
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await sleep(1500 * attempt);
      }
    }
  }

  throw lastError;
}

export async function getAppList({
  lastAppId = 0,
  ifModifiedSince = null,
  maxResults = 50000
} = {}) {
  const input = {
    include_games: true,
    include_dlc: false,
    include_software: false,
    include_videos: false,
    include_hardware: false,
    max_results: maxResults,
    ...(lastAppId ? { last_appid: lastAppId } : {}),
    ...(ifModifiedSince ? { if_modified_since: ifModifiedSince } : {})
  };

  const params = new URLSearchParams({
    key: requiredKey(),
    input_json: JSON.stringify(input)
  });

  return fetchJson(`${APP_LIST_URL}?${params}`);
}

export async function getAppDetails(
  appIds,
  {
    country = "us",
    language = "english",
    delayMs = 1500
  } = {}
) {
  const results = {};

  for (const appId of appIds) {
    try {
      const params = new URLSearchParams({
        appids: String(appId),
        cc: country,
        l: language
      });

      results[appId] = await fetchJson(
        `${APP_DETAILS_URL}?${params}`
      );
    } catch (error) {
      results[appId] = {
        success: false,
        error: error.message
      };
    }

    if (delayMs > 0) {
      await sleep(delayMs);
    }
  }

  return results;
}

export const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));