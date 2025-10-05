import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id.js";
import { getFranchiseIdByTeamName } from "$helpers/get-franchise-id-by-team-name.js";
import tradesHistorical from "../../../data/trades/trades-historical.json";
import tradesCurrent from "../../../data/trades/trades-current-year.json";
import leaguesData from "../../../data/leagues.json";
import draftsData from "../../../data/drafts/draft-rookies-historical.json";
import standingsHistorical from "../../../data/standings/standings-historical.json";
import standingsCurrent from "../../../data/standings/standings-current-year.json";

const standingsData = [...standingsHistorical, ...standingsCurrent];

// Compute fallback league averages by year from the standings themselves
const computedLeagueAvgByYear = (() => {
	const groupedByYear = standingsData.reduce((accumulator, row) => {
		(accumulator[row.year] ||= []).push(row);
		return accumulator;
	}, {});

	const entries = Object.entries(groupedByYear).map(([yearString, rows]) => {
		const values = rows.map((r) => Number(r.regAvgPtsFor)).filter((n) => Number.isFinite(n));
		const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
		return [Number(yearString), Math.round(average)];
	});

	return Object.fromEntries(entries);
})();

function getFranchiseStats(franchiseId) {
	const entries = standingsData.filter((entry) => entry.franchiseId === Number(franchiseId));

	if (entries.length === 0) return null;

	let totalWins = 0;
	let totalLosses = 0;
	let playoffAppearances = 0;
	let divisionTitles = 0;
	let totalFinalPlaces = 0;
	let championshipCount = 0;

	// Enrich each season with league average and plus/minus (with fallback)
	const enrichedEntries = entries.map((season) => {
		const leagueRow = leaguesData.find((row) => row.year === season.year);
		const jsonAvg = Number(leagueRow?.regAvgPtsScored);
		const leagueAvg = Number.isFinite(jsonAvg) && jsonAvg > 0 ? Math.round(jsonAvg) : (computedLeagueAvgByYear[season.year] ?? 0);

		const plusMinus = Math.round(Number(season.regAvgPtsFor) - leagueAvg);

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

	// Combine and enrich trades
	const allTrades = [...tradesHistorical, ...tradesCurrent].map((trade) => {
		const enrichedTeams = trade.teams.map((tradeTeam) => ({
			...tradeTeam,
			franchiseId: getFranchiseIdByTeamName({ team: tradeTeam.team }),
		}));
		return { ...trade, teams: enrichedTeams };
	});

	// Filter trades involving this franchise
	const franchiseTrades = allTrades.filter((trade) => trade.teams.some((tradeTeam) => tradeTeam.franchiseId === Number(franchiseId)));

	const sortedTrades = franchiseTrades.sort((a, b) => new Date(b.date) - new Date(a.date));

	// Group draft picks by season
	const enrichedDrafts = draftsData.map((pickRow) => ({
		...pickRow,
		franchiseId: getFranchiseIdByTeamName({ team: pickRow.team }),
	}));

	const franchisePicks = enrichedDrafts.filter((pickRow) => pickRow.franchiseId === Number(franchiseId));

	const groupedDrafts = franchisePicks.reduce((accumulator, pickRow) => {
		const season = pickRow.season;
		if (!accumulator[season]) accumulator[season] = [];
		accumulator[season].push(pickRow);
		return accumulator;
	}, {});

	// Sort picks within each season (ascending)
	for (const season in groupedDrafts) {
		groupedDrafts[season].sort((a, b) => a.pick_no - b.pick_no);
	}

	// Sort seasons ascending (oldest → newest)
	const sortedDrafts = Object.entries(groupedDrafts)
		.sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
		.reduce((accumulator, [season, picks]) => {
			accumulator[season] = picks;
			return accumulator;
		}, {});

	return {
		records: enrichedEntries.sort((a, b) => b.year - a.year),
		championshipCount,
		totalWins,
		totalLosses,
		winPct,
		playoffAppearances,
		divisionTitles,
		avgFinish,
		completedSeasonCount: leaguesData.filter((row) => row.isComplete).length,
		trades: sortedTrades,
		drafts: sortedDrafts,
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
