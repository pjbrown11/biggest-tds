<script>
	import HighlightFranchise from "$components/highlight-franchise.svelte";
	import PageWrapper from "$components/page-wrapper.svelte";
	import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id.js";
	import { getOrdinal } from "$helpers/get-ordinal.js";
	import { highlightedFranchiseId } from "$stores/highlighted-franchise-id.js";

	let { data } = $props();
</script>

<PageWrapper header="Standings" isFullWidth={false}>
	<div class="ml-auto block lg:flex xl:float-right xl:-mt-12">
		<HighlightFranchise />
	</div>
	<div class="space-y-12">
		{#each data.seasons as season}
			<div class="mt-6 bg-white xl:mt-12">
				<h2 class="-mx-4 border-brand-red bg-brand-red px-4 pb-1 pt-2 text-lg font-bold text-white md:mx-0 md:rounded-t-xl md:border-b-4 md:bg-auto">
					{season.year} - League Avg: {season.leagueAvg}
					{#if season.year === 2025}
						<span class="ml-2 rounded-md bg-black px-2 py-1 text-xs uppercase text-white">unofficial</span>
					{/if}
				</h2>

				<div class="hidden overflow-x-auto rounded-b-xl border-4 border-t-0 border-brand-red pl-4 pt-2 md:block">
					<table class="w-full text-left text-sm">
						<thead class=" text-xs uppercase">
							<tr>
								<th class="px-4 py-2">Place</th>
								<th class="px-4 py-2">Team</th>
								<th class="px-4 py-2">Owner</th>
								<th class="px-4 py-2">Division</th>
								<th class="px-4 py-2">Record</th>
								{#if season.year >= 2025}
									<th class="px-4 py-2">vs Median</th>
								{/if}
								<th class="px-4 py-2">Avg Pts</th>
								<th class="px-4 py-2">vs League Avg</th>
								<th class="px-4 py-2">Best Game</th>
							</tr>
						</thead>
						<tbody>
							{#each season.teams as t}
								<tr class="{$highlightedFranchiseId === t.franchiseId ? 'bg-blue-200 font-bold lg:text-xl' : ''} border-b last:border-b-0">
									<td class="px-4 py-2">{t.finalPlace}</td>
									<td class="px-4 py-2">{t.team} </td>
									<td class="px-4 py-2">{t.owner}</td>
									<td class="flex items-center px-4 py-2">
										{t.division}
										{#if t.regDivisionPlace === 1}
											<img class="ml-1 size-6 min-w-6" src="/div-win.svg" alt="divison winner" />
										{/if}
									</td>
									<td class="px-4 py-2">{t.regWins}-{t.regLosses}</td>
									{#if season.year >= 2025}
										<td class="px-4 py-2">{t.regExtraWins}-{t.regExtraLosses}</td>
									{/if}
									<td class="px-4 py-2">{t.regAvgPtsFor}</td>
									<td
										class="px-4 py-2 font-semibold {t.plusMinus > 0
											? 'text-green-600'
											: t.plusMinus < 0
												? 'text-red-600'
												: 'text-gray-600'}"
									>
										{t.plusMinus > 0 ? `+${t.plusMinus}` : t.plusMinus}
									</td>
									<td
										class="px-4 py-2 {t.isBestGameLeader
											? 'inline-block rounded-lg font-bold tracking-wider text-green-700 outline-4 outline-green-700'
											: ''}">{t.bestGamePts}</td
									>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="-mx-4 border-y-4 border-brand-red bg-white md:hidden">
					{#each season.teams as t, i}
						<div
							class="py-3 pl-3 pr-4 {$highlightedFranchiseId === t.franchiseId
								? 'bg-black font-bold text-white lg:text-xl'
								: i % 2 === 0
									? 'bg-gray-100'
									: 'bg-white'}"
						>
							<div class="flex items-center justify-between font-bold">
								<div class="flex items-center space-x-2">
									<div class="flex h-7 w-7 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
										{t.finalPlace || "-"}
										{#if t.finalPlace}
											<sup class="ml-[1px] text-[8px] font-bold">{getOrdinal(t.finalPlace)}</sup>
										{/if}
									</div>
									<div>
										{t.team}
									</div>
								</div>
								<div>
									{t.regWins}-{t.regLosses}
								</div>
							</div>
							<div class="flex justify-between text-sm">
								<div class="pl-9">
									<span class="text-sm font-normal {$highlightedFranchiseId !== t.franchiseId ? '' : ''}"
										>{t.division}

										{#if t.regDivisionPlace === 1}
											<img class="mb-1 inline size-4 min-w-4" src="/div-win.svg" alt="divison winner" />
										{/if}
									</span>
								</div>
								<div class="text-sm">
									Avg: {t.regAvgPtsFor}
									<span class="font-bold {t.plusMinus > 0 ? 'text-green-600' : t.plusMinus < 0 ? 'text-red-600' : 'text-gray-600'}">
										({t.plusMinus > 0 ? `+${t.plusMinus}` : t.plusMinus})
									</span>
									<span class={t.isBestGameLeader ? "rounded-lg bg-green-700 px-2 py-1 font-bold tracking-wider text-white" : ""}>
										Best:
										{t.bestGamePts}
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</PageWrapper>
