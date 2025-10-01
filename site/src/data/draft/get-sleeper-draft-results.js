// sleeper_draft_results.js
// Run: node sleeper_draft_results.js
// Node >=18: fetch is built in. For Node 16, install node-fetch.

import fs from "fs";

const leagueIds = [
	// "938149318836469760", // 2023
	// "1066785946089164800", // 2024
	"1188634301885292544", // 2025
];

async function getJSON(url) {
	const r = await fetch(url);
	if (!r.ok) throw new Error(`Fetch failed ${r.status}: ${url}`);
	return r.json();
}

async function fetchDraftResults(leagueId) {
	const [league, users, rosters, players, drafts] = await Promise.all([
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}`),
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}/users`),
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
		getJSON(`https://api.sleeper.app/v1/players/nfl`),
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}/drafts`),
	]);

	const season = league.season;

	// roster_id → team name
	const rosterMap = {};
	for (const r of rosters) {
		const user = users.find((u) => u.user_id === r.owner_id);
		rosterMap[r.roster_id] = user?.metadata?.team_name?.trim() || user?.display_name || `Team ${r.roster_id}`;
	}

	const results = [];

	for (const draft of drafts) {
		const [picks, tradedPicks] = await Promise.all([
			getJSON(`https://api.sleeper.app/v1/draft/${draft.draft_id}/picks`),
			getJSON(`https://api.sleeper.app/v1/draft/${draft.draft_id}/traded_picks`),
		]);

		// Build map of traded picks: "round-slot" → previous_owner_id
		const tradedMap = {};
		for (const tp of tradedPicks) {
			tradedMap[`${tp.round}-${tp.draft_slot}`] = tp.previous_owner_id;
		}

		for (const p of picks) {
			const player = players[p.player_id] || {};
			const key = `${p.round}-${p.draft_slot}`;
			const tradedFromId = tradedMap[key];

			results.push({
				season,
				round: p.round,
				pick_no: p.pick_no, // overall pick number
				pick: `${p.round}.${p.draft_slot}`, // round.pick notation
				team: rosterMap[p.roster_id],
				player: {
					name: player.full_name || `${p.metadata?.first_name || ""} ${p.metadata?.last_name || ""}`.trim(),
					pos: player.position || "",
				},
				...(tradedFromId ? { traded_from: rosterMap[tradedFromId] } : {}),
			});
		}
	}

	return results;
}

async function main() {
	const allDrafts = [];
	for (const leagueId of leagueIds) {
		console.log(`🔎 Fetching draft results for league ${leagueId}`);
		const results = await fetchDraftResults(leagueId);
		allDrafts.push(...results);
	}

	fs.writeFileSync("sleeper_draft_results.json", JSON.stringify(allDrafts, null, 2));
	console.log(`✅ Saved ${allDrafts.length} draft picks (with traded_from + round.pick notation) across ${leagueIds.length} seasons`);
}

main().catch(console.error);
