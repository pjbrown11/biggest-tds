import draftsRaw from "../../data/drafts/draft-rookies-historical.json";
import puppeteer from "puppeteer";
import Fuse from "fuse.js";

// --- Scraper ---
async function fetchDynastyRankings() {
	const url = "https://www.fantasypros.com/nfl/rankings/dynasty-overall.php";

	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "networkidle2" });

	await page.waitForSelector("tr.player-row");

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
	return players;
}

// --- Helper: Try exact last-name match first, fallback to Fuse ---
function createFindMatch(dynastyRankings) {
	const fuse = new Fuse(dynastyRankings, {
		keys: ["name"],
		threshold: 0.25,
		distance: 50,
		minMatchCharLength: 3,
		ignoreLocation: true,
		includeScore: true,
	});

	return function findMatch(playerName, season, pick) {
		const pickLast = playerName.split(" ").pop().toLowerCase();

		// Exact last-name match first
		const exact = dynastyRankings.find((p) => p.name.split(" ").pop().toLowerCase() === pickLast);
		if (exact) return exact;

		// Fuse fallback
		const results = fuse.search(playerName);
		if (results.length === 0) {
			console.log(`❌ No match for -> ${season} ${pick} ${playerName}`);
			return null;
		}

		const { item: match, score } = results[0];
		const matchLast = match.name.split(" ").pop().toLowerCase();

		return match;
	};
}

// --- Loader ---
export async function load() {
	const dynastyRankings = await fetchDynastyRankings();
	const findMatch = createFindMatch(dynastyRankings);

	const bySeason = {};

	for (const pick of draftsRaw) {
		const season = pick.season;
		const match = findMatch(pick.player.name, season, pick.pick);

		// Bust/value logic
		const isRecent = Number(season) >= new Date().getFullYear() - 6;
		const isEarlyRound = pick.round === 1;
		const isTop50 = !!(match && match.rank <= 50);
		const isBust = isRecent && isEarlyRound ? !match || match.rank > 150 : false;
		const isGoodValue = pick.round >= 2 && match?.rank <= 100;
		const isLegendary = pick.round >= 2 && match?.rank <= 25;

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
