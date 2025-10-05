// sleeper_standings_inseason.js
// Run: node sleeper_standings_inseason.js
// Node >=18 has fetch built-in.
// import fetch from "node-fetch";
import fs from "fs";
import path from "path";

// === CONFIG ===
const leagueIds = [
	// "844638938554556416", // 2022
	// "938149318836469760", // 2023
	// "1066785946089164800", // 2024
	"1188634301885292544", // 2025
];

const MAX_WEEKS = 18;
const OWNERS_JSON_PATH = "../owners.json";
const OUTPUT_PATH = "./standings-current-year.json";

/**
 * Optional: quick division override map (by franchiseId).
 * If present for an id, it wins over Sleeper metadata.
 */
const DIVISION_MAP_BY_FRANCHISE_ID = {
	1: "Rosterbaters",
	2: "Rosterbaters",
	3: "Meaty Clackers",
	4: "Pocket Dogs",
	5: "Pocket Dogs",
	6: "Meaty Clackers",
	7: "Meaty Clackers",
	8: "Pocket Dogs",
	9: "Rosterbaters",
	10: "Pocket Dogs",
	11: "Rosterbaters",
	12: "Meaty Clackers",
};

// === Helpers ===
async function getJSON(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Fetch failed ${response.status}: ${url}`);
	return response.json();
}

function flatName(name = "") {
	return name
		.toLowerCase()
		.replace(/\./g, "")
		.replace(/'/g, "")
		.replace(/\s+/g, "")
		.replace(/[^a-z0-9]/g, "")
		.replace(/(jr|sr|ii|iii|iv)$/i, "");
}

function loadOwnersMap() {
	const json = fs.readFileSync(OWNERS_JSON_PATH, "utf8");
	return JSON.parse(json);
}

function getFranchiseIdByTeamNameLocal({ ownersJson, team }) {
	if (!team) return null;
	const target = flatName(team);
	for (const [franchiseId, history] of Object.entries(ownersJson)) {
		const hasMatch = history.some((entry) => flatName(entry.team) === target);
		if (hasMatch) return Number(franchiseId);
	}
	return null;
}

function getOwnerAndTeamForYear({ ownersJson, franchiseId, year }) {
	const history = ownersJson[String(franchiseId)] || [];
	if (history.length === 0) return { owner: null, team: null };
	const eligible = history.filter((entry) => entry.year <= year).sort((a, b) => b.year - a.year);
	const chosen = eligible[0] || [...history].sort((a, b) => b.year - a.year)[0];
	return { owner: chosen.owner ?? null, team: chosen.team ?? null };
}

async function fetchStandingsForLeague(leagueId, ownersJson) {
	const [league, users, rosters, nflState] = await Promise.all([
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}`),
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}/users`),
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
		getJSON("https://api.sleeper.app/v1/state/nfl"),
	]);

	const seasonYear = Number(league.season);

	// roster_id -> team name + division (from Sleeper)
	const rosterIdToTeamName = {};
	const rosterIdToDivisionMeta = {};

	for (const roster of rosters) {
		const user = users.find((u) => u.user_id === roster.owner_id);
		const teamName = user?.metadata?.team_name?.trim() || user?.display_name || `Team ${roster.roster_id}`;
		rosterIdToTeamName[roster.roster_id] = teamName;

		const divisionNameFromSleeper = roster?.metadata?.division?.trim?.() || roster?.metadata?.division_name?.trim?.() || null;
		rosterIdToDivisionMeta[roster.roster_id] = divisionNameFromSleeper;
	}

	// Stats per roster
	const statsByRosterId = new Map(); // rosterId -> { games, pf, pa, wins, losses, best }
	function ensureStats(rosterId) {
		if (!statsByRosterId.has(rosterId)) {
			statsByRosterId.set(rosterId, {
				games: 0,
				pf: 0,
				pa: 0,
				wins: 0,
				losses: 0,
				best: 0,
			});
		}
		return statsByRosterId.get(rosterId);
	}

	// Use NFL state to cap to completed weeks only
	const currentWeek = Number(nflState?.week) || 0;
	const playoffStartWeek = Number(league?.settings?.playoff_week_start) || Infinity;
	const regularSeasonEndWeek = Number.isFinite(playoffStartWeek) ? Math.max(1, playoffStartWeek - 1) : MAX_WEEKS;

	const weeksLimit = Math.max(0, Math.min(currentWeek - 1, regularSeasonEndWeek, MAX_WEEKS));

	if (weeksLimit === 0) {
		console.warn(`⚠️  No completed weeks yet for league ${leagueId}. Averages will be 0.`);
	}

	// Aggregate completed weeks only
	for (let week = 1; week <= weeksLimit; week++) {
		let matchups = [];
		try {
			matchups = await getJSON(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`);
		} catch {
			// In rare cases this endpoint can 404 mid-season; just skip the week
			continue;
		}
		if (!Array.isArray(matchups) || matchups.length === 0) continue;

		// group by matchup_id
		const groupsByMatchupId = new Map();
		for (const matchup of matchups) {
			if (matchup.matchup_id == null) continue;
			if (!groupsByMatchupId.has(matchup.matchup_id)) {
				groupsByMatchupId.set(matchup.matchup_id, []);
			}
			groupsByMatchupId.get(matchup.matchup_id).push(matchup);
		}

		// sum each paired/grouped matchup
		for (const group of groupsByMatchupId.values()) {
			for (const entry of group) {
				const rosterId = entry.roster_id;
				if (rosterId == null) continue;

				const stat = ensureStats(rosterId);
				const myPoints = Number(entry.points) || 0;
				const opponentPoints = group.filter((g) => g.roster_id !== rosterId).reduce((sum, groupEntry) => sum + (Number(groupEntry.points) || 0), 0);

				stat.games += 1;
				stat.pf += myPoints;
				stat.pa += opponentPoints;
				if (myPoints > opponentPoints) stat.wins += 1;
				else if (myPoints < opponentPoints) stat.losses += 1;
				if (myPoints > stat.best) stat.best = myPoints;
			}
		}
	}

	// Build rows
	const interimRows = [];
	for (const roster of rosters) {
		const rosterId = roster.roster_id;
		const stat = statsByRosterId.get(rosterId) || {
			games: 0,
			pf: 0,
			pa: 0,
			wins: 0,
			losses: 0,
			best: 0,
		};

		// League-wide divisor = completed weeks only
		const divisor = weeksLimit > 0 ? weeksLimit : 1;
		const avgFor = Number((stat.pf / divisor).toFixed(1));
		const avgAgainst = Number((stat.pa / divisor).toFixed(1));
		const bestGame = Number(stat.best.toFixed(1));

		const sleeperTeamName = rosterIdToTeamName[rosterId] || null;
		const franchiseId = getFranchiseIdByTeamNameLocal({ ownersJson, team: sleeperTeamName }) ?? null;

		// Prefer manual division map; else Sleeper’s metadata; else null
		const divisionOverride = franchiseId != null ? DIVISION_MAP_BY_FRANCHISE_ID[franchiseId] : undefined;
		const finalDivisionName = divisionOverride ?? rosterIdToDivisionMeta[rosterId] ?? null;

		const { owner, team } =
			franchiseId != null ? getOwnerAndTeamForYear({ ownersJson, franchiseId, year: seasonYear }) : { owner: null, team: sleeperTeamName };

		interimRows.push({
			year: seasonYear,
			owner,
			team,
			franchiseId,
			division: finalDivisionName,
			regWins: stat.wins,
			regLosses: stat.losses,
			regDivisionPlace: null, // filled after ranking
			regAvgPtsFor: avgFor,
			regAvgPtsAgainst: avgAgainst,
			bestGamePts: bestGame,
			madePlayoffs: null, // in-season unknown
			finalPlace: null, // in-season unknown
			_pf: stat.pf,
			_pa: stat.pa,
		});
	}

	// Rank within division (or overall if none)
	const anyDivisionPresent = interimRows.some((row) => row.division);
	const computeBucketKey = (row) => (anyDivisionPresent ? row.division || "—" : "OVERALL");

	const groupsByBucket = new Map();
	for (const row of interimRows) {
		const key = computeBucketKey(row);
		if (!groupsByBucket.has(key)) groupsByBucket.set(key, []);
		groupsByBucket.get(key).push(row);
	}

	for (const groupRows of groupsByBucket.values()) {
		groupRows.sort((a, b) => {
			if (b.regWins !== a.regWins) return b.regWins - a.regWins; // wins desc
			if (b._pf !== a._pf) return b._pf - a._pf; // points-for desc
			return a.regLosses - b.regLosses; // losses asc
		});
		groupRows.forEach((row, index) => (row.regDivisionPlace = index + 1));
	}

	// Strip helpers
	const finalizedRows = interimRows.map(({ _pf, _pa, ...rest }) => rest);

	return { seasonYear, weeksCompleted: weeksLimit, rows: finalizedRows };
}

async function main() {
	const ownersJson = loadOwnersMap();
	const allRows = [];

	for (const leagueId of leagueIds) {
		console.log(`🔎 Building in-season standings for league ${leagueId}...`);
		const { seasonYear, weeksCompleted, rows } = await fetchStandingsForLeague(leagueId, ownersJson);
		console.log(`• ${rows.length} teams for ${seasonYear} (weeks completed: ${weeksCompleted})`);

		const unresolved = rows.filter((row) => row.franchiseId == null);
		if (unresolved.length > 0) {
			console.warn(`⚠️  ${unresolved.length} team(s) not matched to a franchiseId (check owners.json or naming):`);
			for (const row of unresolved) {
				console.warn(`   - "${row.team}" (division: ${row.division ?? "n/a"})`);
			}
		}

		allRows.push(...rows);
	}

	// Sort by year desc, then division place asc
	allRows.sort((a, b) => b.year - a.year || a.regDivisionPlace - b.regDivisionPlace);

	fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
	fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allRows, null, 2), "utf8");

	console.log(`✅ Wrote ${allRows.length} in-season rows to ${OUTPUT_PATH}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
