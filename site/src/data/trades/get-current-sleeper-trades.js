// sleeper_trades_all.js
// Run with: node sleeper_trades_all.js
// Node >=18 has fetch built-in. For Node 16/17, uncomment below and install node-fetch.
// import fetch from "node-fetch";
import fs from "fs";

const leagueIds = [
	// "844638938554556416", // 2022
	// "938149318836469760", // 2023
	// "1066785946089164800", // 2024
	"1188634301885292544", // 2025
];

const MAX_WEEKS = 18; // adjust if your league goes to week 18

async function getJSON(url) {
	const r = await fetch(url);
	if (!r.ok) throw new Error(`Fetch failed ${r.status}: ${url}`);
	return r.json();
}

async function fetchTradesForLeague(leagueId) {
	const [league, users, rosters, players] = await Promise.all([
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}`),
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}/users`),
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
		getJSON(`https://api.sleeper.app/v1/players/nfl`),
	]);

	const season = league.season; // e.g. "2022"

	// Map roster_id -> team name
	const rosterMap = {};
	for (const r of rosters) {
		const user = users.find((u) => u.user_id === r.owner_id);
		rosterMap[r.roster_id] = user?.metadata?.team_name?.trim() || user?.display_name || `Team ${r.roster_id}`;
	}

	const trades = [];

	for (let week = 0; week <= MAX_WEEKS; week++) {
		const txns = await getJSON(`https://api.sleeper.app/v1/league/${leagueId}/transactions/${week}`);

		for (const t of txns) {
			if (t.type !== "trade") continue;

			const tradeDate = new Date(t.created).toISOString().split("T")[0];

			const tradeTeams = t.roster_ids.map((rid) => {
				const received = [];

				// Players gained
				for (const [pid, toRid] of Object.entries(t.adds || {})) {
					if (toRid === rid) {
						const p = players[pid] || {};
						received.push({
							type: "player",
							name: p.full_name || pid,
							pos: p.position || "",
						});
					}
				}

				// Draft picks gained
				for (const dp of t.draft_picks || []) {
					if (dp.owner_id === rid) {
						received.push({
							type: "pick",
							name: `Round ${dp.round} Pick (${dp.season})`,
						});
					}
				}

				return { team: rosterMap[rid], received };
			});

			trades.push({
				trade_id: t.transaction_id,
				season,
				week,
				date: tradeDate,
				status: t.status,
				teams: tradeTeams,
			});
		}
	}

	return trades;
}

async function main() {
	const allTrades = [];

	for (const leagueId of leagueIds) {
		console.log(`🔎 Fetching trades for league ${leagueId}...`);
		const trades = await fetchTradesForLeague(leagueId);
		allTrades.push(...trades);
	}

	// optional: sort across seasons by date
	allTrades.sort((a, b) => new Date(a.date) - new Date(b.date));

	fs.writeFileSync("trades-current.json", JSON.stringify(allTrades, null, 2), "utf8");

	console.log(`✅ Wrote ${allTrades.length} trades across ${leagueIds.length} seasons to sleeper_trades_all.json`);
}

main().catch((err) => console.error(err));
