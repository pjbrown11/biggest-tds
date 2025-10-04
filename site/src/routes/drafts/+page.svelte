<script>
	import InfoNotification from "$components/info-notification.svelte";
	import PageWrapper from "$components/page-wrapper.svelte";
	let { data } = $props();
</script>

<PageWrapper header="Draft Results" isFullWidth={false}>
	<div class="mb-4">
		<InfoNotification header="Badge Definitions">
			<div class="mt-2 text-xs">
				<div class="mb-2 flex items-center">
					<div class="mr-1 inline-block min-w-24 rounded bg-red-700 px-2 py-1 text-center font-bold font-semibold text-white xl:mr-2">Bust</div>
					<div>1st round pick between 2 and 6 years ago, ovr rank over 150</div>
				</div>
				<div class="mb-2 flex items-center">
					<div class="mr-1 inline-block min-w-24 rounded bg-blue-700 px-2 py-1 text-center font-bold font-semibold text-white xl:mr-2">Value</div>
					<div>2nd round top 75, 3rd round top 100, 4th round top 125</div>
				</div>

				<div class="mb-2 flex items-center">
					<div class="mr-1 inline-block min-w-24 rounded bg-green-700 px-2 py-1 text-center font-bold font-semibold text-white xl:mr-2">
						Legendary
					</div>

					<div>3rd/4th round top 25</div>
				</div>
			</div></InfoNotification
		>
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
									<div class="relative flex min-h-24 items-center rounded-lg border-2 border-gray-200 bg-white px-3 py-2">
										<!-- Draft pick circle -->
										<div class="absolute left-1 top-1/2 -translate-x-1/2 -translate-y-1/2">
											<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
												{pick.pick}
											</div>
										</div>

										<!-- Card content -->
										<div class="ml-5 w-full">
											<div class="flex justify-between font-bold">
												<span>{pick.player.name} </span>
												<span>{pick.player.pos}</span>
											</div>

											<div class="text-xs text-gray-600">
												{pick.team}
												{#if pick.traded_from}
													<span class="text-xs">← {pick.traded_from}</span>
												{/if}
											</div>

											<!-- Enriched flags -->
											<div class="z-10 flex flex-wrap gap-2 text-xs font-semibold">
												{#if pick.player.isLegendary}
													<div class="mt-2 flex items-center">
														<a
															class="no-global-styling"
															href="https://www.fantasypros.com/nfl/rankings/dynasty-overall.php"
															target="_blank"
															rel="noopener noreferrer nofollow"
														>
															<span class="rounded bg-green-700 px-2 py-0.5 text-white">Legendary</span><span
																class="ml-1 text-green-700">Ovr Dyntasy Rank {pick.player.rank}</span
															>
														</a>
													</div>
												{:else if pick.player.isGoodValue}
													<div class="mt-2 flex items-center">
														<a
															class="no-global-styling"
															href="https://www.fantasypros.com/nfl/rankings/dynasty-overall.php"
															target="_blank"
															rel="noopener noreferrer nofollow"
														>
															<span class="rounded bg-blue-700 px-2 py-0.5 text-white">Value</span><span
																class="ml-1 text-blue-700">Ovr Dyntasy Rank {pick.player.rank}</span
															>
														</a>
													</div>
												{:else if pick.player.isMiss}
													<div class="mt-2 flex items-center">
														<a
															class="no-global-styling"
															href="https://www.fantasypros.com/nfl/rankings/dynasty-overall.php"
															target="_blank"
															rel="noopener noreferrer nofollow"
														>
															<span class="rounded bg-red-700 px-2 py-0.5 text-white">Dart Miss</span><span
																class="ml-1 text-red-700">Ovr Dyntasy Rank {pick.player.rank}</span
															>
														</a>
													</div>
												{:else if pick.player.isBust}
													<div class="mt-2 flex items-center">
														<a
															class="no-global-styling"
															href="https://www.fantasypros.com/nfl/rankings/dynasty-overall.php"
															target="_blank"
															rel="noopener noreferrer nofollow"
														>
															<span class="rounded bg-red-700 px-2 py-0.5 text-white">Bust</span><span class="ml-1 text-red-700"
																>Ovr Dyntasy Rank {pick.player.rank || "∞"}</span
															>
														</a>
													</div>
												{/if}
											</div>
											<!-- <div class="">Rank {pick.player.rank}</div> -->
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
