import standingsData from "../../data/standings/standings-historical.json";
import leaguesData from "../../data/leagues.json";

export function load() {
	const byYear = {};

	for (const entry of standingsData) {
		const league = leaguesData.find((l) => l.year === entry.year);
		const leagueAvg = league?.regAvgPtsScored || 0;

		const plusMinus = Math.round(entry.regAvgPtsFor - leagueAvg);

		if (!byYear[entry.year]) {
			byYear[entry.year] = {
				year: entry.year,
				leagueAvg,
				teams: [],
			};
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

	for (const season of Object.values(byYear)) {
		season.teams.sort((a, b) => a.finalPlace - b.finalPlace);

		const maxBestGame = Math.max(...season.teams.map((t) => t.bestGamePts));
		season.teams = season.teams.map((t) => ({
			...t,
			isBestGameLeader: t.bestGamePts === maxBestGame,
		}));
	}

	const seasons = Object.values(byYear).sort((a, b) => b.year - a.year);

	return { seasons };
}
