// Google Sheets two-way sync for Zor.
// Uses Google Identity Services (GIS) token client for OAuth, and the
// Sheets REST API for read/write. Data survives app deletion because the
// source of truth is your Google Sheet.

import { CONFIG } from "./config";

const SHEET_ID = CONFIG.SHEET_ID;
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const TOKEN_KEY = "zor_token";
const TOKEN_EXP_KEY = "zor_token_exp";

// The tabs Zor uses and their header rows.
export const TABS = {
  Daily_Meals: ["date", "slot", "meal", "protein", "carbs", "fat", "fiber", "kcal", "status", "extraId", "time"],
  Workouts: ["date", "session", "exercise", "set", "weight", "reps", "unit", "pr", "warmup", "minutes", "speed", "incline", "distance"],
  Sessions: ["date", "name", "durationMin", "volume", "rpe", "notes"],
  Body_Stats: ["date", "weight", "chest", "waist", "arms", "notes"],
  Grocery_Lists: ["week", "item", "category", "qty", "checked"],
  Supplement_Log: ["date", "supplement", "time"],
  Prep_Log: ["date", "task", "completed"],
  PRs: ["date", "exercise", "weight", "reps", "est1rm"],
  Settings: ["key", "value"],
};

let tokenClient = null;
let accessToken = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export async function initGoogle() {
  await loadScript("https://accounts.google.com/gsi/client");
  // Restore cached token if still valid
  const cached = localStorage.getItem(TOKEN_KEY);
  const exp = Number(localStorage.getItem(TOKEN_EXP_KEY) || 0);
  if (cached && Date.now() < exp) {
    accessToken = cached;
  }
  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CONFIG.CLIENT_ID,
    scope: SCOPES,
    callback: () => {}, // set per-request
  });
}

export function isSignedIn() {
  const exp = Number(localStorage.getItem(TOKEN_EXP_KEY) || 0);
  return !!accessToken && Date.now() < exp;
}

// Silently refresh the token if it's within 5 min of expiring.
async function ensureFreshToken() {
  const exp = Number(localStorage.getItem(TOKEN_EXP_KEY) || 0);
  if (accessToken && Date.now() < exp - 5 * 60 * 1000) return; // still good
  if (!tokenClient) return;
  await new Promise((resolve) => {
    tokenClient.callback = (resp) => {
      if (!resp.error) {
        accessToken = resp.access_token;
        const newExp = Date.now() + (resp.expires_in ? resp.expires_in * 1000 : 3500 * 1000);
        localStorage.setItem(TOKEN_KEY, accessToken);
        localStorage.setItem(TOKEN_EXP_KEY, String(newExp));
      }
      resolve();
    };
    // empty prompt = silent refresh, no popup, if the user already consented
    tokenClient.requestAccessToken({ prompt: "" });
  });
}

export function signIn() {
  return new Promise((resolve, reject) => {
    if (!tokenClient) return reject(new Error("Google not initialised"));
    tokenClient.callback = (resp) => {
      if (resp.error) return reject(resp);
      accessToken = resp.access_token;
      // GIS tokens last ~3600s
      const exp = Date.now() + (resp.expires_in ? resp.expires_in * 1000 : 3500 * 1000);
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(TOKEN_EXP_KEY, String(exp));
      resolve(accessToken);
    };
    tokenClient.requestAccessToken({ prompt: isSignedIn() ? "" : "consent" });
  });
}

export function signOut() {
  accessToken = null;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXP_KEY);
}

async function api(path, options = {}) {
  if (!accessToken) throw new Error("Not signed in");
  await ensureFreshToken();
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );
  if (res.status === 401) {
    signOut();
    throw new Error("Session expired — sign in again");
  }
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Sheets API ${res.status}: ${t}`);
  }
  return res.json();
}

// Ensure every required tab exists with its header row.
export async function ensureTabs() {
  const meta = await api("");
  const existing = (meta.sheets || []).map((s) => s.properties.title);
  const toCreate = Object.keys(TABS).filter((t) => !existing.includes(t));
  if (toCreate.length) {
    await api(":batchUpdate", {
      method: "POST",
      body: JSON.stringify({
        requests: toCreate.map((title) => ({ addSheet: { properties: { title } } })),
      }),
    });
  }
  // Write or update headers. If a tab's header row is empty OR shorter than the
  // current schema (older version), rewrite just the header row to match.
  for (const [tab, headers] of Object.entries(TABS)) {
    const r = await api(`/values/${tab}!A1:Z1`);
    const existing = r.values && r.values.length ? r.values[0] : [];
    if (!existing.length || existing.length < headers.length) {
      await api(`/values/${tab}!A1?valueInputOption=RAW`, {
        method: "PUT",
        body: JSON.stringify({ values: [headers] }),
      });
    }
  }
}

export async function readTab(tab) {
  const r = await api(`/values/${tab}!A2:Z10000`);
  const headers = TABS[tab];
  return (r.values || []).map((row) => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = row[i] ?? ""));
    return obj;
  });
}

export async function appendRow(tab, rowObj) {
  const headers = TABS[tab];
  const row = headers.map((h) => rowObj[h] ?? "");
  await api(`/values/${tab}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    body: JSON.stringify({ values: [row] }),
  });
}

export async function overwriteTab(tab, rows) {
  const headers = TABS[tab];
  const values = [headers, ...rows.map((r) => headers.map((h) => r[h] ?? ""))];
  // Clear then write
  await api(`/values/${tab}!A1:Z10000:clear`, { method: "POST" });
  await api(`/values/${tab}!A1?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    body: JSON.stringify({ values }),
  });
}

// Settings stored as key/value rows — used to persist overrides.
export async function saveSetting(key, value) {
  const rows = await readTab("Settings");
  const filtered = rows.filter((r) => r.key !== key);
  filtered.push({ key, value: typeof value === "string" ? value : JSON.stringify(value) });
  await overwriteTab("Settings", filtered);
}

export async function loadSettings() {
  const rows = await readTab("Settings");
  const out = {};
  rows.forEach((r) => {
    try {
      out[r.key] = JSON.parse(r.value);
    } catch {
      out[r.key] = r.value;
    }
  });
  return out;
}
