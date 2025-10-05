import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id.js";
import { getFranchiseIdByTeamName } from "$helpers/get-franchise-id-by-team-name.js";
import standingsData from "../../../data/standings/standings-historical.json";
import tradesHistorical from "../../../data/trades/trades-historical.json";
import tradesCurrent from "../../../data/trades/trades-current-year.json";
import leaguesData from "../../../data/leagues.json";

function getFranchiseStats(franchiseId) {
	const entries = standingsData.filter((entry) => entry.franchiseId === Number(franchiseId));

	if (entries.length === 0) return null;

	let totalWins = 0;
	let totalLosses = 0;
	let playoffAppearances = 0;
	let divisionTitles = 0;
	let totalFinalPlaces = 0;
	let championshipCount = 0;

	// --- Enrich each season with league average and plus/minus ---
	const enrichedEntries = entries.map((season) => {
		const league = leaguesData.find((l) => l.year === season.year);
		const leagueAvg = league?.regAvgPtsScored ?? 0;
		const plusMinus = Math.round(season.regAvgPtsFor - leagueAvg);

		if (season.finalPlace === 1) championshipCount++;

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

	// --- Combine and enrich trades ---
	const allTrades = [...tradesHistorical, ...tradesCurrent].map((trade) => {
		const enrichedTeams = trade.teams.map((team) => ({
			...team,
			franchiseId: getFranchiseIdByTeamName({ team: team.team }),
		}));
		return { ...trade, teams: enrichedTeams };
	});

	// --- Filter trades involving this franchise ---
	const franchiseTrades = allTrades.filter((trade) => trade.teams.some((team) => team.franchiseId === Number(franchiseId)));

	const sortedTrades = franchiseTrades.sort((a, b) => new Date(b.date) - new Date(a.date));

	return {
		records: enrichedEntries.sort((a, b) => b.year - a.year),
		championshipCount,
		totalWins,
		totalLosses,
		winPct,
		playoffAppearances,
		divisionTitles,
		avgFinish,
		completedSeasonCount: enrichedEntries.length,
		trades: sortedTrades,
	};
}

/**
 * Server load
 */
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
