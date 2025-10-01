<script>
	import InfoNotification from "$components/info-notification.svelte";
	import PageWrapper from "$components/page-wrapper.svelte";
	let { data } = $props();
</script>

<PageWrapper header="Draft Results" isFullWidth={false}>
	<div class="mb-4">
		<InfoNotification header="Badge Definitions">
			<!-- const isRecent = Number(season) >= new Date().getFullYear() - 6;
		const isEarlyRound = pick.round === 1;
		const isTop50 = !!(match && match.rank <= 50);
		const isBust = isRecent && isEarlyRound ? !match || match.rank > 150 : false;
		const isGoodValue = pick.round >= 2 && match?.rank <= 100;
		const isLegendary = pick.round >= 2 && match?.rank <= 25; -->
			<p>BUST = draft pick within 6 years from now, is first rounder, ovr rank over 150</p>
			<p>GOOD VALUE = round 2-4, ovr rank less than 100</p>
			<p>LEGENDARY = round 2-4, ovr rank less than 25</p>
		</InfoNotification>
	</div>
	<div class="space-y-12">
		{#each data.seasons as season}
			<div>
				<h2 class="border-brand-red bg-brand-red -mx-4 px-4 py-2 text-lg font-bold text-white md:mx-0 md:rounded-t-xl md:border-b-4">
					{season.season} Draft
				</h2>

				<div class="border-brand-red -mx-4 grid grid-cols-1 gap-6 rounded-b-xl border-t-0 p-4 pl-6 md:mx-0 md:border-4 lg:grid-cols-4">
					{#each Object.keys(season.rounds).sort((a, b) => a - b) as round}
						<div>
							<h3 class="mb-2 text-sm font-bold uppercase text-gray-700">
								Round {round} <span class="inline-block lg:hidden">({season.season})</span>
							</h3>
							<div class="space-y-2">
								{#each season.rounds[round] as pick}
									<div class="relative rounded-lg border-2 border-gray-200 bg-white px-3 py-2">
										<!-- Draft pick circle -->
										<div class="absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2">
											<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
												{pick.pick}
											</div>
										</div>

										<!-- Card content -->
										<div class="ml-5">
											<div class="flex justify-between font-bold">
												<span>{pick.player.name}</span>
												<span>{pick.player.pos}</span>
											</div>

											<div class="text-xs text-gray-600">
												{pick.team}
												{#if pick.traded_from}
													<span class="text-xs">← {pick.traded_from}</span>
												{/if}
											</div>

											<!-- Enriched flags -->
											<div class="z-10 mt-1 flex flex-wrap gap-2 text-xs font-semibold">
												{#if pick.player.isLegendary}
													<span class="rounded bg-green-700 px-2 py-0.5 text-white">Legendary</span>
												{:else if pick.player.isGoodValue}
													<span class="rounded bg-blue-700 px-2 py-0.5 text-white">Good Value</span>
												{:else if pick.player.isBust}
													<span class="rounded bg-red-700 px-2 py-0.5 text-white">Bust</span>
												{/if}
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</PageWrapper>
