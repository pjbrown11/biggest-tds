import draftsRaw from "../../data/drafts/draft-rookies-historical.json";
import puppeteer from "puppeteer";
import Fuse from "fuse.js";
import { writeFile } from "node:fs/promises";

// --- Normalize into one flat string (lowercase, strip punctuation/suffixes, remove spaces) ---
function normalizeFlat(name) {
	return name
		.toLowerCase()
		.replace(/\./g, "")
		.replace(/'/g, "")
		.replace(/ jr$| sr$| iii$| ii$| iv$/g, "")
		.replace(/\s+/g, "") // remove all spaces
		.trim();
}

// --- Scraper ---
async function fetchDynastyRankings() {
	const url = "https://www.fantasypros.com/nfl/rankings/dynasty-overall.php";
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "networkidle2" });

	// Wait for table rows to appear
	await page.waitForSelector("tr.player-row");

	// Scroll until stable
	let prevCount = 0;
	let same = 0;

	while (same < 3) {
		const count = await page.$$eval("tr.player-row", (rows) => rows.length);
		if (count === prevCount) {
			same++;
		} else {
			same = 0;
			prevCount = count;
		}
		await page.evaluate(() => window.scrollBy(0, window.innerHeight));
		await new Promise((r) => setTimeout(r, 1000));
	}

	// Extract rows
	const players = await page.evaluate(() => {
		const rows = document.querySelectorAll("tr.player-row");
		return Array.from(rows).map((row) => {
			const rank = parseInt(row.querySelector("td")?.innerText.trim(), 10);
			const name = row.querySelector("a.player-cell-name")?.innerText.trim();
			const pos = row.querySelector("td:nth-child(4)")?.innerText.trim();
			return { rank, name, pos };
		});
	});

	await browser.close();

	// Add normalized fields
	return players.map((p) => ({
		...p,
		nameFlat: normalizeFlat(p.name),
	}));
}

// --- Matching helper ---
function createFindMatch(dynastyRankings) {
	const fuse = new Fuse(dynastyRankings, {
		keys: ["nameFlat"],
		threshold: 0.05, // extremely strict (only catches tiny typos)
		distance: 20,
		minMatchCharLength: 4,
		ignoreLocation: true,
		includeScore: true,
	});

	return function findMatch(playerName, season, pick) {
		const normFlat = normalizeFlat(playerName);

		// 1. Exact full flat name
		let exact = dynastyRankings.find((p) => p.nameFlat === normFlat);
		if (exact) return exact;

		// 2. Fuse fallback (only near-identical typos)
		const results = fuse.search(normFlat);
		if (results.length > 0) {
			const { item: match, score } = results[0];
			if (score <= 0.05) {
				console.log(`🔎 Fuzzy matched: ${playerName} -> ${match.name} (score ${score.toFixed(3)})`);
				return match;
			}
		}

		// 3. No match
		// console.log(`❌ No match for -> ${season} ${pick} ${playerName}`);
		return null;
	};
}

// --- Loader ---
export async function load() {
	const dynastyRankings = await fetchDynastyRankings();
	console.log("Scraped count:", dynastyRankings.length);

	await writeFile("dynasty-rankings.debug.json", JSON.stringify(dynastyRankings, null, 2), "utf8");

	const findMatch = createFindMatch(dynastyRankings);
	const bySeason = {};

	for (const pick of draftsRaw) {
		const season = pick.season;
		const match = findMatch(pick.player.name, season, pick.pick);

		// Evaluation flags
		const isRecent = Number(season) >= new Date().getFullYear() - 6;
		const isCurrentYear = Number(season) === new Date().getFullYear();
		const isEarlyRound = pick.round === 1;
		const isTop50 = !!(match && match.rank <= 50);
		const isBust = isRecent && !isCurrentYear && isEarlyRound ? !match || match.rank > 150 : false;
		const isGoodValue =
			(pick.round === 2 && match && match?.rank <= 75) ||
			(pick.round === 3 && match && match?.rank <= 100) ||
			(pick.round === 4 && match && match?.rank <= 125);
		const isLegendary = pick.round > 2 && match && match?.rank <= 25;

		const enrichedPick = {
			...pick,
			player: {
				...pick.player,
				rank: match ? match.rank : null,
				isTop50,
				isBust,
				isGoodValue,
				isLegendary,
			},
		};

		if (!bySeason[season]) {
			bySeason[season] = { season, rounds: {} };
		}
		if (!bySeason[season].rounds[pick.round]) {
			bySeason[season].rounds[pick.round] = [];
		}
		bySeason[season].rounds[pick.round].push(enrichedPick);
	}

	// sort rounds and picks
	for (const season of Object.values(bySeason)) {
		for (const round of Object.keys(season.rounds)) {
			season.rounds[round].sort((a, b) => a.pick_no - b.pick_no);
		}
	}

	const seasons = Object.values(bySeason).sort((a, b) => b.season - a.season);
	return { seasons };
}
