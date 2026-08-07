# Tom Lab — Speaker Recommendations

A tiny, free, no-backend website for collecting speaker suggestions from labmates
and showing them as a searchable dashboard.

- **`index.html`** — the recommendation form (submissions email you via [Web3Forms](https://web3forms.com)).
- **`dashboard.html`** — a searchable directory that reads `speakers.json`.
- **`speakers.json`** — the vetted list of speakers you curate.

## How it works

```
Labmate fills form  →  Web3Forms emails you the submission
                    →  You review it and add approved entries to speakers.json
                    →  dashboard.html renders them, searchable + filterable
```

This keeps everything static (works on GitHub Pages) and free, and gives you a
review step so only vetted speakers appear publicly.

## Setup (about 5 minutes)

### 1. Get a free Web3Forms access key
1. Go to <https://web3forms.com>, enter the email where you want submissions sent.
2. Copy the access key they give you.
3. In `index.html`, replace `YOUR_ACCESS_KEY_HERE` with it.

No account or password needed — the key just routes submissions to your inbox.

### 2. Publish on GitHub Pages
1. Create a GitHub repo (e.g. `speaker-recs`) and upload these files.
2. Repo **Settings → Pages → Source: `main` branch, `/root`** → Save.
3. Your site goes live at `https://<username>.github.io/<repo>/`.
   - Form: `.../index.html`
   - Dashboard: `.../dashboard.html`

Share the form link with your labmates.

### 3. Add speakers to the dashboard
When a recommendation email arrives, add an entry to `speakers.json` and commit.
Each entry:

```json
{
  "name": "Dr. Ada Lovelace",
  "profile": "https://scholar.google.com/...",
  "affiliation": "MIT",
  "career_stage": "Faculty / PI",
  "keywords": ["reinforcement learning", "robotics"],
  "fit": "Why the lab would care.",
  "recommended_by": "Sukriti",
  "status": "To invite"
}
```

- `keywords` is an array — these become the filter chips on the dashboard.
- `status` is free text (e.g. `To invite`, `Contacted`, `Confirmed`). Shown as a badge.
- Only `name` is strictly required; other fields are optional and hidden if empty.

## Want the dashboard to update automatically (no manual JSON)?

The manual step above is the fully-free, no-database route (and doubles as vetting).
If you'd rather have submissions flow straight to the dashboard, swap Web3Forms for a
**Google Sheet** backend:

1. Make a Google Sheet, add an Apps Script Web App that appends form POSTs as rows.
2. Point the form's `fetch` at that Web App URL.
3. Publish the sheet as CSV (`File → Share → Publish to web`) and have `dashboard.html`
   fetch + parse that CSV instead of `speakers.json`.

More setup, but zero manual copying. Ask if you want this version built out.

## Customizing the look
Both pages share the same CSS variables at the top of each file (`--accent`, fonts,
etc.). Change `--accent` to recolor everything. Light/dark mode is automatic.
