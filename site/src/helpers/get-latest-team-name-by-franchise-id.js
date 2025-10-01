import owners from "../data/owners.json";

export function getLatestTeamNameByFranchiseId({ franchiseId }) {
	const franchiseIdString = franchiseId.toString();

	const history = owners[franchiseIdString];

	const latest = history.reduce((latest, entry) => (entry.year > latest.year ? entry : latest));

	return latest.team;
}
