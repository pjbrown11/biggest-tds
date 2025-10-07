// Run with: node scrape-dynasty-rankings.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.resolve(__dirname, "dynasty-rankings.json");
const URL = "https://www.fantasypros.com/nfl/rankings/dynasty-overall.php";

function normalizeFlat(name = "") {
	return name
		.toLowerCase()
		.replace(/\./g, "")
		.replace(/'/g, "")
		.replace(/ jr$| sr$| iii$| ii$| iv$/g, "")
		.replace(/\s+/g, "")
		.trim();
}

async function main() {
	const browser = await puppeteer.launch({
		headless: "new",
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	try {
		const page = await browser.newPage();
		await page.goto(URL, { waitUntil: "networkidle2" });
		await page.waitForSelector("tr.player-row");

		// Scroll until the table stabilizes
		let previousCount = 0;
		let sameCountSteps = 0;
		while (sameCountSteps < 3) {
			const count = await page.$$eval("tr.player-row", (rows) => rows.length);
			if (count === previousCount) {
				sameCountSteps++;
			} else {
				sameCountSteps = 0;
				previousCount = count;
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

main().catch((err) => {
	console.error("❌ Failed to scrape dynasty rankings:", err);
	process.exit(1);
});
