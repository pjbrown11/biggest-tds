import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id";

export function load() {
	const teamListWithIds = Array.from({ length: 12 }, (_, i) => i + 1)
		.map((num) => {
			return {
				franchiseId: num,
				latestTeamName: getLatestTeamNameByFranchiseId({ franchiseId: num }),
			};
		})
		.sort((a, b) => a.latestTeamName.localeCompare(b.latestTeamName));

	return {
		teamListWithIds,
	};
}
