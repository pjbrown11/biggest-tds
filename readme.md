## GET STARTED

`npm install` from root

`npm install` from /site

first time development `npm run build-site` to generate some dependent data files

`npm run dev-site` from root

## CI & Deploy

[![Build & Deploy (Netlify)](https://github.com/<OWNER>/<REPO>/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/build-and-deploy.yml)

- The workflow runs weekly on **Tuesdays at 6:00 AM Central** and can also be triggered manually from **Actions → Build & Deploy (Netlify) → Run workflow**.
- We install **Google Chrome Stable** in CI and set `CHROME_PATH=/usr/bin/google-chrome-stable`.  
  Our dynasty rankings scraper uses that browser path (and falls back to the last saved file if scraping fails).
- Generated data that gets committed by CI:
    - `site/src/data/trades/trades-current-year.json`
    - `site/src/data/standings/standings-current-year.json`
    - `site/src/data/drafts/dynasty-rankings.json`

## Local development

```bash
# one-time
npm i
cd site && npm i

# scrape + build (same command CI uses)
npm run build-site
```
