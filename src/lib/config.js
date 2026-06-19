// ─────────────────────────────────────────────────────────────────────────
//  ZOR CONFIG — Shaw, put your credentials here.
//
//  CLIENT_ID    : already filled in (from your Google Cloud OAuth client).
//  SHEET_ID     : already filled in (from your Zor Data sheet URL).
//  CLIENT_SECRET: NOT needed for this app. The Google Identity Services
//                 token flow used here is the browser "implicit" flow and
//                 does NOT use a client secret. Do not paste it anywhere.
//                 (A client secret in front-end code would be public and
//                  insecure — that's why we don't use it.)
//
//  When you deploy to Vercel and get your URL (e.g. https://zor.vercel.app),
//  go back to Google Cloud Console → Credentials → your OAuth client and add
//  that URL to BOTH "Authorized JavaScript origins" and "Authorized redirect
//  URIs". Until you do, sign-in will fail on the deployed site.
// ─────────────────────────────────────────────────────────────────────────

export const CONFIG = {
  CLIENT_ID:
    "252044268610-vos6gofe50bnmnpq4cjhqfacs7q4ohic.apps.googleusercontent.com",
  SHEET_ID: "1ztifojigVrhRVbGYAf7AStZGcPVh7p1JaqzNHG8U3HA",
  USER_NAME: "Shaw",
  USER_EMAIL: "shauryamanglik@gmail.com",
};
