import leaguesData from "../../data/leagues.json";

import standingsHistorical from "../../data/standings/standings-historical.json";
import standingsCurrent from "../../data/standings/standings-current-year.json";

const standingsData = [...standingsHistorical, ...standingsCurrent];

export function load() {
	// 1) Precompute fallback league average by year from standings
	const grouped = standingsData.reduce((acc, row) => {
		(acc[row.year] ||= []).push(row);
		return acc;
	}, /** @type {Record<number, any[]>} */ ({}));

	const computedLeagueAvgByYear = Object.fromEntries(
		Object.entries(grouped).map(([yearStr, rows]) => {
			const vals = rows.map((r) => Number(r.regAvgPtsFor)).filter((n) => Number.isFinite(n));
			const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
			return [Number(yearStr), Math.round(avg)];
		}),
	);

	const byYear = {};

	for (const entry of standingsData) {
		// 2) Prefer leagues.json value if valid; otherwise use computed fallback
		const league = leaguesData.find((l) => l.year === entry.year);
		const jsonAvg = Number(league?.regAvgPtsScored);
		const leagueAvg = Number.isFinite(jsonAvg) && jsonAvg > 0 ? Math.round(jsonAvg) : (computedLeagueAvgByYear[entry.year] ?? 0);

		const plusMinus = Math.round(Number(entry.regAvgPtsFor) - leagueAvg);

		if (!byYear[entry.year]) {
			byYear[entry.year] = { year: entry.year, leagueAvg, teams: [] };
		}

		byYear[entry.year].teams.push({
			...entry,
			regWins: Math.round(entry.regWins),
			regLosses: Math.round(entry.regLosses),
			regAvgPtsFor: Math.round(entry.regAvgPtsFor),
			regAvgPtsAgainst: Math.round(entry.regAvgPtsAgainst),
			bestGamePts: Math.round(entry.bestGamePts),
			plusMinus,
		});
	}

	// 3) Sort teams; handle current year where finalPlace may be null
	for (const season of Object.values(byYear)) {
		season.teams.sort((a, b) => {
			const fa = a.finalPlace ?? 999;
			const fb = b.finalPlace ?? 999;
			return fa - fb;
		});

		const maxBestGame = Math.max(...season.teams.map((t) => t.bestGamePts));
		season.teams = season.teams.map((t) => ({
			...t,
			isBestGameLeader: t.bestGamePts === maxBestGame,
		}));
	}

	const seasons = Object.values(byYear).sort((a, b) => b.year - a.year);
	return { seasons };
}
