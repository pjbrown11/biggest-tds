// site/src/data/drafts/get-dynasty-rankings.js
// Run with: node get-dynasty-rankings.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.resolve(__dirname, "dynasty-rankings.json");
const URL = "https://www.fantasypros.com/nfl/rankings/dynasty-overall.php";

// Prefer system Chrome (CI) if provided
const chromePath = process.env.CHROME_PATH || null;

function normalizeFlat(name = "") {
	return name
		.toLowerCase()
		.replace(/\./g, "")
		.replace(/'/g, "")
		.replace(/ jr$| sr$| iii$| ii$| iv$/g, "")
		.replace(/\s+/g, "")
		.trim();
}

async function scrape() {
	const browser = await puppeteer.launch({
		headless: "new",
		executablePath: chromePath || undefined,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		const page = await browser.newPage();
		await page.goto(URL, { waitUntil: "networkidle2" });
		await page.waitForSelector("tr.player-row");

		// Scroll until stable
		let prev = 0,
			same = 0;
		while (same < 3) {
			const count = await page.$$eval("tr.player-row", (rows) => rows.length);
			if (count === prev) same++;
			else {
				same = 0;
				prev = count;
			}
			await page.evaluate(() => window.scrollBy(0, window.innerHeight));
			await new Promise((r) => setTimeout(r, 800));
		}

		const players = await page.evaluate(() => {
			const rows = document.querySelectorAll("tr.player-row");
			return Array.from(rows).map((row) => {
				const rank = parseInt(row.querySelector("td")?.innerText.trim(), 10);
				const name = row.querySelector("a.player-cell-name")?.innerText.trim();
				const pos = row.querySelector("td:nth-child(4)")?.innerText.trim();
				return { rank, name, pos };
			});
		});

		const withFlat = players.filter((p) => p?.name && Number.isFinite(p?.rank)).map((p) => ({ ...p, nameFlat: normalizeFlat(p.name) }));

		fs.writeFileSync(OUTPUT_PATH, JSON.stringify(withFlat, null, 2), "utf8");
		console.log(`✅ Wrote ${withFlat.length} rankings to ${OUTPUT_PATH}`);
	} finally {
		await browser.close();
	}
}

async function main() {
	try {
		await scrape();
	} catch (err) {
		console.error("❌ Failed to scrape dynasty rankings:", err?.message || err);
		if (fs.existsSync(OUTPUT_PATH)) {
			console.warn("⚠️  Falling back to previously saved dynasty-rankings.json so the build can continue.");
			// No-op: keep last file
			return;
		}
		// Nothing to fall back to — fail the build
		process.exit(1);
	}
}

main();
