<script>
	import PageWrapper from "$components/page-wrapper.svelte";

	const { data } = $props();

	const { champs, mostPointsScored, bestSeasonAvgPoints, bestRecord, mostChampionships, mostDivisionTitles } = data;
</script>

<PageWrapper header="" isFullWidth={false}>
	<div class="grid grid-cols-6 items-stretch gap-4 xl:pt-12">
		<div class="col-span-6 flex lg:col-span-3">
			<img class="mx-auto w-[80%] self-start" src="/logo-optimized.svg" alt="Biggest TDs logo" />
		</div>

		<div class="col-span-6 flex lg:col-span-3">
			<div class="grid flex-1 grid-cols-6 gap-4">
				<div class="col-span-6 xl:col-span-3">
					<div class="h-full rounded-xl border-4 border-gray-200 bg-white p-6">
						<h3 class="mb-4 text-xs font-bold uppercase tracking-wider">Champions</h3>
						<div class="relative">
							<div class="absolute left-2 top-0 h-full w-0.5 bg-gray-300"></div>

							{#each champs as champion}
								<div class="relative mb-3 flex items-center">
									<div class="absolute left-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-400 bg-white">
										<div class="h-2 w-2 rounded-full bg-brand-red"></div>
									</div>
									<div class="ml-8">
										<div class="text-sm font-bold text-brand-red">{champion.year}</div>
										<div>{champion.team}</div>
										{#if champion.year === 2022}
											<div class="-ml-2 block max-w-max rounded-md bg-brand-gold px-2 py-0.5 text-xs">Hamlin year</div>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="col-span-6 flex flex-col space-y-4 xl:col-span-3">
					<div class="flex flex-1 flex-col justify-center rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Most Championships</h3>
						{#each mostChampionships as holder}
							<div>{holder}</div>
						{/each}
					</div>

					<div class="flex flex-1 flex-col justify-center rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Most Division Titles</h3>
						{#each mostDivisionTitles as holder}
							<div>{holder}</div>
						{/each}
					</div>

					<div class="flex flex-1 flex-col justify-center rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Most Points Scored</h3>
						<div>{mostPointsScored}</div>
					</div>

					<div class="flex flex-1 flex-col justify-center rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Best Avg Reg Season Score</h3>
						<div>{bestSeasonAvgPoints}</div>
					</div>

					<div class="flex flex-1 flex-col justify-center rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Best Regular Season Record</h3>
						<div>{bestRecord}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="mt-8 lg:hidden">
		<h2 class="mb-2 text-xl font-bold">Pages</h2>
		<div class="grid grid-cols-2 gap-4">
			<div class="col-span-1">
				<a
					class="border-offset-4 block rounded-xl border-4 border-brand-red bg-black px-3 py-2
				font-bold uppercase tracking-wider
				text-white hover:border-black hover:bg-brand-red xl:px-5"
					href="/standings/"
					>Standings
				</a>
			</div>
			<div class="col-span-1">
				<a
					class="border-offset-4 block rounded-xl border-4 border-brand-red bg-black px-3 py-2
				font-bold uppercase tracking-wider
				text-white hover:border-black hover:bg-brand-red xl:px-5"
					href="/drafts/"
					>Drafts
				</a>
			</div>
			<div class="col-span-1">
				<a
					class="border-offset-4 block rounded-xl border-4 border-brand-red bg-black px-3 py-2
				font-bold uppercase tracking-wider
				text-white hover:border-black hover:bg-brand-red xl:px-5"
					href="/trades/"
					>Trades
				</a>
			</div>
			<div class="col-span-1">
				<a
					class="border-offset-4 block rounded-xl border-4 border-brand-red bg-black px-3 py-2
				font-bold uppercase tracking-wider
				text-white hover:border-black hover:bg-brand-red xl:px-5"
					href="/franchises/"
					>Franchises
				</a>
			</div>
		</div>
	</div>
</PageWrapper>
