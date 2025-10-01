import draftsRaw from "../../data/drafts/draft-rookies-historical.json";

export function load() {
	const bySeason = {};

	for (const pick of draftsRaw) {
		if (!bySeason[pick.season]) {
			bySeason[pick.season] = { season: pick.season, rounds: {} };
		}

		if (!bySeason[pick.season].rounds[pick.round]) {
			bySeason[pick.season].rounds[pick.round] = [];
		}

		bySeason[pick.season].rounds[pick.round].push({
			...pick,
		});
	}

	// Sort rounds 1-4, and sort picks within each round by pick_no
	for (const season of Object.values(bySeason)) {
		for (const round of Object.values(season.rounds)) {
			round.sort((a, b) => a.pick_no - b.pick_no);
		}
	}

	// Sort seasons newest first
	const seasons = Object.values(bySeason).sort((a, b) => b.season - a.season);

	return { seasons };
}
