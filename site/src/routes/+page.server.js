// +page.server.js
import standingsHistorical from "../data/standings/standings-historical.json";
import standingsCurrent from "../data/standings/standings-current-year.json";
import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id";

const standings = [...standingsHistorical, ...standingsCurrent];

function getChamps() {
	return standings
		.filter((entry) => entry.finalPlace === 1)
		.sort((a, b) => b.year - a.year)
		.map((champ) => (champ.year === 2022 ? { team: "Old No. 7 / Autodraft Jesus", year: 2022 } : champ))
		.filter((champ, index, self) => index === self.findIndex((c) => c.year === champ.year));
}

function getMostPointsScored() {
	const top = standings.reduce((max, entry) => (entry.bestGamePts > (max?.bestGamePts || 0) ? entry : max));

	return `${top.bestGamePts} | ${getLatestTeamNameByFranchiseId({
		franchiseId: top.franchiseId,
	})} | ${top.year}`;
}

function getBestSeasonAvgPoints() {
	const top = standings.reduce((max, entry) => (entry.regAvgPtsFor > (max?.regAvgPtsFor || 0) ? entry : max));

	return `${top.regAvgPtsFor} | ${getLatestTeamNameByFranchiseId({
		franchiseId: top.franchiseId,
	})} | ${top.year}`;
}

function getBestRecord() {
	const top = standings.reduce((max, entry) => (entry.regWins > (max?.regWins || 0) ? entry : max));

	return `${top.regWins}-${top.regLosses} | ${getLatestTeamNameByFranchiseId({
		franchiseId: top.franchiseId,
	})} | ${top.year}`;
}

function getMostChampionships() {
	const counts = standings.reduce((acc, entry) => {
		if (entry.finalPlace === 1) {
			acc[entry.franchiseId] = (acc[entry.franchiseId] || 0) + 1;
		}
		return acc;
	}, {});

	const max = Math.max(...Object.values(counts));

	return Object.keys(counts)
		.filter((fid) => counts[fid] === max)
		.map((fid) => `${counts[fid]} | ${getLatestTeamNameByFranchiseId({ franchiseId: fid })}`);
}

function getMostDivisionTitles() {
	const counts = standings.reduce((acc, entry) => {
		if (entry.regDivisionPlace === 1) {
			acc[entry.franchiseId] = (acc[entry.franchiseId] || 0) + 1;
		}
		return acc;
	}, {});

	const max = Math.max(...Object.values(counts));

	return Object.keys(counts)
		.filter((fid) => counts[fid] === max)
		.map((fid) => `${counts[fid]} | ${getLatestTeamNameByFranchiseId({ franchiseId: fid })}`);
}

export function load() {
	return {
		champs: getChamps(),
		mostPointsScored: getMostPointsScored(),
		bestSeasonAvgPoints: getBestSeasonAvgPoints(),
		bestRecord: getBestRecord(),
		mostChampionships: getMostChampionships(),
		mostDivisionTitles: getMostDivisionTitles(),
	};
}
