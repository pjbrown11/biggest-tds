import tradesHistorical from "../../data/trades/trades-historical.json";
import tradesCurrentYear from "../../data/trades/trades-current-year.json";
import { getFranchiseIdByTeamName } from "$helpers/get-franchise-id-by-team-name.js";

export function load() {
	// Combine both sources
	const allTrades = [...tradesHistorical, ...tradesCurrentYear];

	const enrichedTrades = allTrades.map((trade, index) => {
		// Ensure we have a valid teams array
		if (!trade.teams || !Array.isArray(trade.teams)) {
			console.warn(`⚠️ Trade #${index} is missing 'teams' array`, trade);
			return { ...trade, teams: [] };
		}

		const teams = trade.teams.map((teamData) => {
			if (!teamData || !teamData.team) {
				console.warn(`⚠️ Trade #${index} has invalid team entry`, teamData);
				return { ...teamData, franchiseId: null };
			}

			const franchiseId = getFranchiseIdByTeamName({
				team: teamData.team,
			});

			return {
				...teamData,
				franchiseId,
			};
		});

		return {
			...trade,
			teams,
		};
	});

	return {
		trades: enrichedTrades,
	};
}
