// sleeper_stats.js
// Run with: node sleeper_stats.js
// Node >=18 has fetch built-in. For Node 16/17, uncomment next line and `npm i node-fetch`.
// import fetch from "node-fetch";
import fs from "fs";

const leagueId = "1066785946089164800";
const REG_WEEKS = 14;
const MAX_WEEKS = 17; // include playoffs for best game

async function getJSON(url) {
	const r = await fetch(url);
	if (!r.ok) throw new Error(`Fetch failed ${r.status}: ${url}`);
	return r.json();
}

function csvEscape(val) {
	if (val === null || val === undefined) return "";
	const s = String(val).normalize("NFKC");
	return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function calcPF(settings) {
	const base = Number(settings.fpts || 0);
	const dec = Number(settings.fpts_decimal || 0) / 1000;
	return base + dec;
}
function calcPA(settings) {
	const base = Number(settings.fpts_against || 0);
	const dec = Number(settings.fpts_against_decimal || 0) / 1000;
	return base + dec;
}

async function main() {
	const [users, rosters] = await Promise.all([
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}/users`),
		getJSON(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
	]);

	const rosterInfo = new Map();
	for (const r of rosters) {
		const user = users.find((u) => u.user_id === r.owner_id);
		rosterInfo.set(r.roster_id, {
			rid: r.roster_id,
			division: r.settings?.division ?? 0,
			team:
				user?.metadata?.team_name?.trim() ||
				user?.display_name ||
				`Team ${r.roster_id}`,
			wins: Number(r.settings?.wins ?? 0),
			losses: Number(r.settings?.losses ?? 0),
			pfSeason: calcPF(r.settings || {}),
			paSeason: calcPA(r.settings || {}),
			regAvgFor: 0,
			regAvgAgainst: 0,
			bestGamePts: 0,
		});
	}

	const scoresFor = new Map();
	const scoresAgainst = new Map();

	for (let wk = 1; wk <= MAX_WEEKS; wk++) {
		const matchups = await getJSON(
			`https://api.sleeper.app/v1/league/${leagueId}/matchups/${wk}`
		);
		const grouped = new Map();
		for (const m of matchups) {
			if (!grouped.has(m.matchup_id)) grouped.set(m.matchup_id, []);
			grouped.get(m.matchup_id).push(m);
		}
		for (const pair of grouped.values()) {
			for (const m of pair) {
				const rid = m.roster_id;
				if (!scoresFor.has(rid)) scoresFor.set(rid, []);
				if (!scoresAgainst.has(rid)) scoresAgainst.set(rid, []);
				const pts = Number(m.points || 0);
				scoresFor.get(rid)[wk - 1] = pts;
				const opp = pair.find((x) => x.roster_id !== rid);
				scoresAgainst.get(rid)[wk - 1] = Number(opp?.points || 0);
			}
		}
	}

	for (const info of rosterInfo.values()) {
		const pfWeeks = (scoresFor.get(info.rid) || []).slice(0, REG_WEEKS);
		const paWeeks = (scoresAgainst.get(info.rid) || []).slice(0, REG_WEEKS);
		const avg = (arr) =>
			arr.length ? arr.reduce((a, b) => a + (b || 0), 0) / arr.length : 0;
		info.regAvgFor = avg(pfWeeks);
		info.regAvgAgainst = avg(paWeeks);
		const allWeeks = scoresFor.get(info.rid) || [];
		info.bestGamePts = allWeeks.length
			? Math.max(...allWeeks.filter((x) => x !== undefined))
			: 0;
	}

	// Division placement (wins, PF, PA tiebreakers)
	const divisions = new Map();
	for (const v of rosterInfo.values()) {
		if (!divisions.has(v.division)) divisions.set(v.division, []);
		divisions.get(v.division).push(v);
	}
	const divisionPlace = new Map();
	for (const teams of divisions.values()) {
		teams.sort((a, b) => {
			if (b.wins !== a.wins) return b.wins - a.wins;
			if (b.pfSeason !== a.pfSeason) return b.pfSeason - a.pfSeason;
			if (b.paSeason !== a.paSeason) return b.paSeason - a.paSeason;
			return a.team.localeCompare(b.team);
		});
		teams.forEach((t, i) => divisionPlace.set(t.rid, i + 1));
	}

	const rows = Array.from(rosterInfo.values())
		.map((v) => ({
			team: v.team,
			regWins: v.wins,
			regLosses: v.losses,
			regDivisionPlace: divisionPlace.get(v.rid) ?? "-",
			regAvgPtsFor: v.regAvgFor.toFixed(2),
			regAvgPtsAgainst: v.regAvgAgainst.toFixed(2),
			bestGamePts: v.bestGamePts.toFixed(2),
		}))
		.sort((a, b) => a.team.localeCompare(b.team));

	// League-wide average regAvgPtsFor
	const leagueAvg = (
		rows.reduce((sum, r) => sum + parseFloat(r.regAvgPtsFor), 0) /
		rows.length
	).toFixed(2);

	rows.push({
		team: "League Average",
		regWins: "",
		regLosses: "",
		regDivisionPlace: "",
		regAvgPtsFor: leagueAvg,
		regAvgPtsAgainst: "",
		bestGamePts: "",
	});

	const headers = [
		"team",
		"regWins",
		"regLosses",
		"regDivisionPlace",
		"regAvgPtsFor",
		"regAvgPtsAgainst",
		"bestGamePts",
	];
	const csv = [
		headers.join(","),
		...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")),
	].join("\n");

	fs.writeFileSync("sleeper_stats.csv", "\uFEFF" + csv, "utf8");
	console.log(
		"✅ sleeper_stats.csv written with league average row at the bottom."
	);
}

main().catch((err) => console.error(err));
