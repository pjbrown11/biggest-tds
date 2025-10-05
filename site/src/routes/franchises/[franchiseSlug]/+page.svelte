<script>
	import PageWrapper from "$components/page-wrapper.svelte";
	import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id";
	import { getOrdinal } from "$helpers/get-ordinal.js";

	let { data } = $props();
</script>

<PageWrapper header={data.franchiseName}>
	<p>Franchise: {data.franchiseName} - {data.franchiseId}</p>
	<div class="mt-6 bg-white xl:mt-12">
		<h2 class="border-brand-red bg-brand-red -mx-4 px-4 py-2 text-lg font-bold text-white md:mx-0 md:rounded-t-xl md:border-b-4 md:bg-auto">Season Data</h2>

		<div class="border-brand-red hidden overflow-x-auto rounded-b-xl border-4 border-t-0 pl-4 pt-2 md:block">
			<table class="w-full text-left text-sm">
				<thead class=" text-xs uppercase">
					<tr>
						<th class="px-4 py-2">Season</th>
						<th class="px-4 py-2">Place</th>
						<th class="px-4 py-2">Owner</th>
						<th class="px-4 py-2">Division</th>
						<th class="px-4 py-2">Record</th>
						<th class="px-4 py-2">Avg Pts</th>
						<th class="px-4 py-2">vs League Avg</th>
						<th class="px-4 py-2">Best Game</th>
					</tr>
				</thead>
				<tbody>
					{#each data.records as season}
						<tr class="border-b last:border-b-0">
							<td class="px-4 py-2">{season.year}</td>
							<td class="px-4 py-2">{season.finalPlace}</td>
							<td class="px-4 py-2">{season.owner}</td>
							<td class="flex items-center px-4 py-2">
								{season.division}
								{#if season.regDivisionPlace === 1}
									<img class="ml-1 size-6 min-w-6" src="/div-win.svg" alt="divison winner" />
								{/if}
							</td>
							<td class="px-4 py-2">{season.regWins}-{season.regLosses}</td>
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

		<div class="border-brand-red -mx-4 border-y-4 bg-white md:hidden">
			{#each data.records as season, i}
				<div class="py-3 pl-3 pr-4 {i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}">
					<div class="flex items-center justify-between font-bold">
						<div class="flex items-center space-x-2">
							<div class="bg-brand-red flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white">
								{season.finalPlace}
								<sup class="ml-[1px] text-[8px] font-bold">{getOrdinal(season.finalPlace)}</sup>
							</div>
							<div>
								{season.team}
								<span class="text-xs font-normal lowercase">
									| {season.division}
									{#if season.regDivisionPlace === 1}
										<img class="mb-1 inline size-4 min-w-4" src="/div-win.svg" alt="division winner" />
									{/if}
								</span>
							</div>
						</div>
						<div>
							{season.regWins}-{season.regLosses}
						</div>
					</div>

					<div class="mt-1 flex justify-between text-sm">
						<div class="pl-9">
							Avg Pts: {season.regAvgPtsFor}
							<span class="font-bold {season.plusMinus > 0 ? 'text-green-600' : season.plusMinus < 0 ? 'text-red-600' : 'text-gray-600'}">
								({season.plusMinus > 0 ? `+${season.plusMinus}` : season.plusMinus})
							</span>
						</div>
						<div class="text-sm {season.isBestGameLeader ? 'block rounded-lg bg-green-700 px-2 py-1 font-bold tracking-wider text-white' : ''}">
							Best Game: {season.bestGamePts}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</PageWrapper>
