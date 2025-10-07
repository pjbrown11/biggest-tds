<script>
	import FranchiseAvgPtsChart from "$components/franchise-avg-pts-chart.svelte";
	import FranchiseFinalPlaceChart from "$components/franchise-final-place-chart.svelte";
	import PageWrapper from "$components/page-wrapper.svelte";
	import Trade from "$components/trade.svelte";
	import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id";
	import { getOrdinal } from "$helpers/get-ordinal.js";
	import { franchiseTab } from "$stores/franchise-tab";

	let { data } = $props();

	const summaryStats = [
		{
			label: "Overall Record",
			value: `${data.totalWins}-${data.totalLosses}`,
			sub: `(${data.winPct})`,
		},
		{ label: "Championships", value: data.championshipCount || 0 },
		{ label: "Playoffs Made", value: `${data.playoffAppearances} / ${data.completedSeasonCount}` },
		{ label: "Division Titles", value: data.divisionTitles },
		{ label: "Avg Finish", value: data.avgFinish },
		{ label: "Trades", value: data.trades?.length || 0 },
	];

	const seasonEntries = Object.entries(data.drafts).sort(([seasonA], [seasonB]) => Number(seasonB) - Number(seasonA));
</script>

<PageWrapper header={data.franchiseName}>
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 xl:my-8">
		{#each summaryStats as stat}
			<div class="relative flex flex-col items-center justify-center rounded-lg border-2 border-gray-200 bg-white p-3 text-center">
				<p class="text-xs font-bold uppercase tracking-wide text-gray-500">{stat.label}</p>
				<p class="mt-1 text-lg text-gray-800 xl:text-xl">
					{stat.value}
					{#if stat.sub}
						<span class="">{stat.sub}</span>
					{/if}
				</p>
				<!-- {#if stat.label === "Overall Record"}
					<div class="absolute -bottom-2 rounded-full border-2 border-gray-200 bg-brand-gold px-2 py-0.5 text-[8px]">through 2024</div>
				{/if} -->
			</div>
		{/each}
	</div>
	<div class="mt-6 bg-white">
		<h2 class="-mx-4 border-brand-red bg-brand-red px-4 py-2 text-lg font-bold text-white md:mx-0 md:rounded-t-xl md:border-b-4 md:bg-auto">Season Data</h2>

		<div class="hidden overflow-x-auto rounded-b-xl border-4 border-t-0 border-brand-red pl-4 pt-2 md:block">
			<table class="w-full text-left text-sm">
				<thead class=" text-xs uppercase">
					<tr>
						<th class="px-4 py-2">Season</th>
						<th class="px-4 py-2">Place</th>
						<th class="px-4 py-2">Owner</th>
						<th class="px-4 py-2">Division</th>
						<th class="px-4 py-2">Record</th>
						<th class="px-4 py-2">vs Median</th>
						<th class="px-4 py-2">Avg Pts</th>
						<th class="px-4 py-2">vs League Avg</th>
						<th class="px-4 py-2">Best Game</th>
					</tr>
				</thead>
				<tbody>
					{#each data.records as season}
						<tr class="border-b last:border-b-0">
							<td class="px-4 py-2">{season.year}</td>
							<td class="px-4 py-2">{season.finalPlace || "-"}</td>
							<td class="px-4 py-2">{season.owner}</td>
							<td class="flex items-center px-4 py-2">
								{season.division}
								{#if season.regDivisionPlace === 1}
									<img class="ml-1 size-6 min-w-6" src="/div-win.svg" alt="divison winner" />
								{/if}
							</td>
							<td class="px-4 py-2">{season.regWins}-{season.regLosses}</td>
							{#if season.year >= 2025}
								<td class="px-4 py-2">{season.regExtraWins}-{season.regExtraLosses}</td>
							{:else}
								<td class="px-4 py-2">-</td>
							{/if}
							<td class="px-4 py-2">{season.regAvgPtsFor}</td>
							<td
								class="px-4 py-2 font-semibold {season.plusMinus > 0
									? 'text-green-600'
									: season.plusMinus < 0
										? 'text-red-600'
										: 'text-gray-600'}"
							>
								{season.plusMinus > 0 ? `+${season.plusMinus}` : season.plusMinus}
							</td>
							<td
								class="px-4 py-2 {season.isBestGameLeader
									? 'inline-block rounded-lg font-bold tracking-wider text-green-700 outline-4 outline-green-700'
									: ''}">{season.bestGamePts}</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="-mx-4 border-y-4 border-brand-red bg-white md:hidden">
			{#each data.records as season, i}
				<div class="py-3 pl-3 pr-4 {i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}">
					<div class="flex items-center justify-between font-bold">
						<div class="flex items-center space-x-2">
							<div class="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
								{season.finalPlace || "-"}
								{#if season.finalPlace}
									<sup class="ml-[1px] text-[8px] font-bold">{getOrdinal(season.finalPlace)}</sup>
								{/if}
							</div>
							<div>
								{season.team}
								<div class="text-sm font-normal lowercase"></div>
							</div>
						</div>
						<div>
							{season.regWins}-{season.regLosses}
						</div>
					</div>

					<div class="flex justify-between text-sm">
						<div class="pl-9">
							{season.year} | {season.division}
							{#if season.regDivisionPlace === 1}
								<img class="mb-1 inline size-4 min-w-4" src="/div-win.svg" alt="division winner" />
							{/if}
						</div>
						<div class="text-sm {season.isBestGameLeader ? 'block rounded-lg bg-green-700 px-2 py-1 font-bold tracking-wider text-white' : ''}">
							Avg: {season.regAvgPtsFor}
							<span class="font-bold {season.plusMinus > 0 ? 'text-green-600' : season.plusMinus < 0 ? 'text-red-600' : 'text-gray-600'}">
								({season.plusMinus > 0 ? `+${season.plusMinus}` : season.plusMinus})
							</span>
							| Best: {season.bestGamePts}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="mt-8">
		<h2 class="mb-2 text-xl font-bold">Trends</h2>
		<div class="grid grid-cols-6 gap-6">
			<div class="col-span-6 lg:col-span-3">
				<FranchiseAvgPtsChart records={data.records} title={`Avg PPG — ${data.franchiseName}`} />
			</div>
			<div class="col-span-6 lg:col-span-3">
				<FranchiseFinalPlaceChart records={data.records} title={`Final Places — ${data.franchiseName}`} />
			</div>
		</div>
	</div>

	<div class="mt-8">
		<h2 class="mb-2 text-xl font-bold">Draft List</h2>
		<div class="grid grid-cols-6 gap-6">
			{#each seasonEntries as [season, picks]}
				<div class="col-span-6 md:col-span-3 xl:col-span-2">
					<h3 class="mb-1 mt-4 inline border-b-2 border-brand-red text-sm font-bold">{season}</h3>
					<ul class="ml-4 mt-1 list-disc">
						{#each picks as draftPick}
							<li>
								{draftPick.pick} | {draftPick.player?.name}
								{draftPick.player.pos}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
	<div class="mt-8">
		<h2 class="mb-2 text-xl font-bold">Trade List</h2>
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{#each data.trades as trade}
				<Trade {trade} />
			{/each}
		</div>
	</div>
</PageWrapper>
