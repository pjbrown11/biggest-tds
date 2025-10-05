import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id.js";
import standingsHistorical from "../../data/standings/standings-historical.json";
import standingsCurrent from "../../data/standings/standings-current-year.json";

const standingsData = [...standingsHistorical, ...standingsCurrent];

export function load() {
	const franchises = Array.from({ length: 12 }, (_, i) => {
		const franchiseId = i + 1;
		const teamName = getLatestTeamNameByFranchiseId({ franchiseId });

		const entries = standingsData.filter((e) => e.franchiseId === franchiseId);

		const totalWins = entries.reduce((sum, e) => sum + e.regWins, 0);
		const totalLosses = entries.reduce((sum, e) => sum + e.regLosses, 0);

		return {
			franchiseId,
			teamName,
			totalWins,
			totalLosses,
		};
	});

	return { franchises };
}
