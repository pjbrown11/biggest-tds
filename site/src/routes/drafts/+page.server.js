import draftsRaw from "../../data/drafts/draft-rookies-historical.json";
import Fuse from "fuse.js";
import rankings from "../../data/drafts/dynasty-rankings.json";
import { getFranchiseIdByTeamName } from "$helpers/get-franchise-id-by-team-name";

export const prerender = true;

// normalize into one flat string (lowercase, strip punctuation/suffixes, remove spaces)
function normalizeFlat(name) {
	return name
		.toLowerCase()
		.replace(/\./g, "")
		.replace(/'/g, "")
		.replace(/ jr$| sr$| iii$| ii$| iv$/g, "")
		.replace(/\s+/g, "")
		.trim();
}

function createFindMatch(dynastyRankings) {
	const fuse = new Fuse(dynastyRankings, {
		keys: ["nameFlat"],
		threshold: 0.05,
		distance: 20,
		minMatchCharLength: 4,
		ignoreLocation: true,
		includeScore: true,
	});

	return function findMatch(playerName) {
		const normFlat = normalizeFlat(playerName);

		// exact
		const exact = dynastyRankings.find((p) => p.nameFlat === normFlat);
		if (exact) return exact;

		// strict fuzzy (tiny typos only)
		const results = fuse.search(normFlat);
		if (results.length > 0) {
			const { item: match, score } = results[0];
			if (score <= 0.05) return match;
		}

		return null;
	};
}

export async function load() {
	// rankings come from the prebuild script output
	const dynastyRankings = Array.isArray(rankings) ? rankings : [];
	const findMatch = createFindMatch(dynastyRankings);

	const bySeason = {};

	for (const pick of draftsRaw) {
		const season = pick.season;
		const match = findMatch(pick.player.name);

		const franchiseId = getFranchiseIdByTeamName({ team: pick.team });
		const franchiseIdTradedFrom = getFranchiseIdByTeamName({ team: pick.traded_from });

		const isRecent = Number(season) >= new Date().getFullYear() - 6;
		const isCurrentYear = Number(season) === new Date().getFullYear();
		const isEarlyRound = pick.round === 1;
		const isTop50 = !!(match && match.rank <= 50);
		const isBust = isRecent && !isCurrentYear && isEarlyRound ? !match || match.rank > 150 : false;
		const isGoodValue =
			(pick.round === 2 && match && match?.rank <= 75) ||
			(pick.round === 3 && match && match?.rank <= 100) ||
			(pick.round === 4 && match && match?.rank <= 125);
		const isLegendary = (pick.round === 3 && match && match?.rank <= 25) || (pick.round === 4 && match && match?.rank <= 50);

		const enrichedPick = {
			...pick,
			franchiseId,
			franchiseIdTradedFrom,
			player: {
				...pick.player,
				rank: match ? match.rank : null,
				isTop50,
				isBust,
				isGoodValue,
				isLegendary,
			},
		};

		if (!bySeason[season]) bySeason[season] = { season, rounds: {} };
		if (!bySeason[season].rounds[pick.round]) bySeason[season].rounds[pick.round] = [];
		bySeason[season].rounds[pick.round].push(enrichedPick);
	}

	for (const season of Object.values(bySeason)) {
		for (const roundKey of Object.keys(season.rounds)) {
			season.rounds[roundKey].sort((a, b) => a.pick_no - b.pick_no);
		}
	}

	const seasons = Object.values(bySeason).sort((a, b) => b.season - a.season);
	return { seasons };
}
