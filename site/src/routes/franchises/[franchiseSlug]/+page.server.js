import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id.js";
import standingsData from "../../../data/standings/standings-historical.json";
import leaguesData from "../../../data/leagues.json";

function getFranchiseStats(franchiseId) {
	const entries = standingsData.filter((e) => e.franchiseId === Number(franchiseId));

	if (entries.length === 0) return null;

	let totalWins = 0;
	let totalLosses = 0;
	let playoffAppearances = 0;
	let divisionTitles = 0;
	let totalFinalPlaces = 0;

	// Enrich each season with league average points
	const enrichedEntries = entries.map((season) => {
		const league = leaguesData.find((l) => l.year === season.year);
		const leagueAvg = league?.regAvgPtsScored ?? 0;
		const plusMinus = Math.round(season.regAvgPtsFor - leagueAvg);

		return {
			...season,
			leagueAvg,
			plusMinus,
			regAvgPtsFor: Math.round(season.regAvgPtsFor),
			bestGamePts: Math.round(season.bestGamePts),
		};
	});

	for (const season of enrichedEntries) {
		totalWins += season.regWins;
		totalLosses += season.regLosses;
		totalFinalPlaces += season.finalPlace;
		if (season.madePlayoffs) playoffAppearances++;
		if (season.regDivisionPlace === 1) divisionTitles++;
	}

	const totalGames = totalWins + totalLosses;
	const winPct = totalGames > 0 ? (totalWins / totalGames).toFixed(3) : "0.000";
	const avgFinish = (totalFinalPlaces / enrichedEntries.length).toFixed(1);

	return {
		records: enrichedEntries.sort((a, b) => b.year - a.year),
		summary: {
			totalWins,
			totalLosses,
			winPct,
			playoffAppearances,
			divisionTitles,
			avgFinish,
		},
		completedSeasonCount: enrichedEntries.length,
	};
}

export function load({ params }) {
	const { franchiseSlug } = params;
	const parts = franchiseSlug.split("-");
	const franchiseId = Number(parts[0]);
	const franchiseName = getLatestTeamNameByFranchiseId({ franchiseId });

	const franchiseData = getFranchiseStats(franchiseId);

	return {
		franchiseId,
		franchiseName,
		...franchiseData,
	};
}
