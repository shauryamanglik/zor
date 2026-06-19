# Zor

Your body. Your discipline. Your force.
A personal fitness + nutrition PWA built for Shaw. Dark, gold, fast. Two-way Google Sheets sync so your data is yours forever.

---

## What's inside

- **Home** — daily macro rings, today's session, meals strip, supplement checklist, streak/progress
- **Food** — 7-day meal plan, one-tap logging, recipe viewer, meal swap, custom logging from your Indian staples database, auto grocery list, Sunday prep checklist
- **Gym** — full-screen one-exercise-at-a-time logger with +/- steppers (also typeable), auto weight-suggestion, auto rest timer with vibration, plate calculator, PR detection, session-complete screen, strength charts
- **Settings** — supplement manager (Active / Coming Soon / Skip), per-reminder notification toggles + times, body stats log, lbs/kg toggle, accent color, Google Sheets connect/sync, JSON export

---

## YOUR SETUP CHECKLIST (do these in order)

### 1. Put your logo in
You have a PNG. Do this:
- Rename your logo file to **`logo.png`**
- Drop it in the **`public/`** folder
- Then generate the two icon sizes from it. Easiest free way: go to https://realfavicongenerator.net or just resize your PNG to 192×192 and 512×512 and save them as:
  - `public/icon-192.png`
  - `public/icon-512.png`
- I've put placeholder gold-Z icons there already. Replace them with yours when ready. The app works fine with the placeholders until then.

> Icon must be square. If your logo isn't square, put it on a #0F1117 (dark) square background first.

### 2. Push to GitHub
```bash
cd zor
git init
git add .
git commit -m "Zor v1"
# create a new EMPTY private repo on github.com called "zor", then:
git remote add origin https://github.com/YOUR_USERNAME/zor.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Vercel
- Go to https://vercel.com and sign in with GitHub
- Click **Add New → Project**
- Import your `zor` repo
- Framework preset: **Vite** (it auto-detects)
- Click **Deploy**
- You'll get a URL like `https://zor-xxxx.vercel.app`

### 4. CRITICAL — authorize your Vercel URL in Google Cloud
Sign-in will FAIL on the live site until you do this:
- Go to https://console.cloud.google.com → your project → **APIs & Services → Credentials**
- Click your OAuth 2.0 Client ID
- Under **Authorized JavaScript origins**, click ADD URI and paste your Vercel URL (e.g. `https://zor-xxxx.vercel.app`) — no trailing slash
- Under **Authorized redirect URIs**, add the same URL
- Also add `http://localhost:5173` to both if you want to run it locally
- Save. Wait ~5 min for Google to propagate.

### 5. Install on your iPhone
- Open your Vercel URL in **Safari** (must be Safari, not Chrome, for notifications to work)
- Tap the Share button → **Add to Home Screen**
- Open Zor from the home screen icon
- Go through onboarding, tap **Connect Google Sheets**, sign in with shauryamanglik@gmail.com
- Done. It now syncs to your sheet.

---

## About your credentials

- **Client ID** and **Sheet ID** are already filled in at `src/lib/config.js`.
- **Client secret is NOT used and NOT needed.** This app uses Google's browser token flow (implicit), which never uses a secret. A secret placed in front-end code would be publicly visible and insecure — that's why there isn't one. Don't paste it anywhere.

---

## Run locally (optional)
```bash
npm install
npm run dev
# open http://localhost:5173
```

## Editing your plan later
- **Meals:** edit `src/data/meals.js`
- **Workouts:** edit `src/data/workouts.js`
- **Supplements:** edit the `SUPPLEMENTS` array in `src/data/workouts.js`
- **Targets:** `DAILY_TARGETS` in `src/data/meals.js`

Push to GitHub and Vercel redeploys automatically in ~30 seconds.

---

## Your Google Sheet tabs (auto-created on first sync)
`Daily_Meals` · `Workouts` · `Body_Stats` · `Grocery_Lists` · `Supplement_Log` · `Prep_Log` · `PRs` · `Settings`

Delete the app anytime — reinstall, connect, and everything comes back from the sheet.
