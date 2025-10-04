import owners from "../data/owners.json";

function normalizeTeamName(name) {
	return name.toLowerCase().replace(/[^a-z0-9]/g, ""); // remove all non-alphanumeric characters
}

export function getFranchiseIdByTeamName({ team }) {
	if (!team) return null;

	const normalizedTeam = normalizeTeamName(team);

	for (const [franchiseId, teamHistory] of Object.entries(owners)) {
		const hasMatch = teamHistory.some((entry) => normalizeTeamName(entry.team) === normalizedTeam);
		if (hasMatch) return Number(franchiseId);
	}

	return null;
}
