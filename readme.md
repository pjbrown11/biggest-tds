## Local development

```bash
# one-time, install deps from root and SvelteKit project (/site)
npm i
cd site && npm i && cd ../

# generate data files needed for development (and prod builds)
npm run build-site

# local dev
npm run dev-site
```

## CI & Deploy

- The workflow runs weekly on **Tuesdays at 6:00 AM Central** and can also be triggered manually from **Actions → Build & Deploy (Netlify) → Run workflow**.
- We install **Google Chrome Stable** in CI and set `CHROME_PATH=/usr/bin/google-chrome-stable`.  
  Our dynasty rankings scraper uses that browser path (and falls back to the last saved file if scraping fails).
- Generated data that gets committed by CI:
    - `site/src/data/trades/trades-current-year.json`
    - `site/src/data/standings/standings-current-year.json`
    - `site/src/data/drafts/dynasty-rankings.json`

<!-- CI-BUILD-BLOCK -->

## Latest CI build

![Build & Deploy (Netlify)](https://github.com/pjbrown11/biggest-tds/actions/workflows/deploy-netlify.yml/badge.svg?branch=main)

**When:** 2025-10-21T11:17:59.325Z
**Workflow run:** [#18682061398](https://github.com/pjbrown11/biggest-tds/actions/runs/18682061398)

