<script>
	import HighlightFranchise from "$components/highlight-franchise.svelte";
	import InfoNotification from "$components/info-notification.svelte";
	import PageWrapper from "$components/page-wrapper.svelte";
	import { highlightedFranchiseId } from "$stores/highlighted-franchise-id.js";

	let { data } = $props();
	const sortedTrades = [...data.trades].sort((a, b) => new Date(b.date) - new Date(a.date));
</script>

<PageWrapper header="Trades" isFullWidth={false}>
	<div class="mb-4 block items-end justify-between lg:flex">
		<InfoNotification header="Info">
			<p>Trades show who each team received.</p>
		</InfoNotification>
		<div class="mt-4 block xl:mt-0">
			<div>
				<HighlightFranchise />
			</div>
		</div>
	</div>

	<div class="mt-8">
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			{#each sortedTrades as trade}
				<div
					class="rounded-lg border-2 border-gray-200 bg-white"
					class:bg-blue-200={trade.teams.some((t) => t.franchiseId === $highlightedFranchiseId)}
					class:bg-white={!trade.teams.some((t) => t.franchiseId === $highlightedFranchiseId)}
				>
					<!-- Centered date -->
					<div class="border-b-2 border-gray-200 px-4 py-2 text-center text-xs">
						{new Date(trade.date).toLocaleDateString()}
					</div>

					<!-- Teams section -->
					<div class="flex flex-col md:flex-row">
						<!-- Left team -->
						<div class="flex-1 p-4 text-center md:text-right">
							<h3 class="border-brand-red mb-2 inline-block border-b-2 text-base font-bold">
								{trade.teams[0].team}
							</h3>
							<ul class="space-y-1">
								{#each trade.teams[0].received as item}
									<li class="text-sm">
										{item.name}
										{#if item.pos}
											<span class="">{item.pos}</span>
										{/if}
									</li>
								{/each}
							</ul>
						</div>

						<!-- Middle divider -->
						<div class="flex items-center justify-center text-sm md:w-12 md:py-0">
							<img src="/handshake.svg" alt="handshake" class="size-8 min-w-8 rounded-full outline outline-dashed outline-2 outline-offset-4" />
						</div>

						<!-- Right team -->
						<div class="flex-1 p-4 text-center md:text-left">
							<h3 class="border-brand-red mb-2 inline-block border-b-2 text-base font-bold">
								{trade.teams[1].team}
							</h3>
							<ul class="space-y-1">
								{#each trade.teams[1].received as item}
									<li class="text-sm">
										{item.name}
										{#if item.pos}
											<span class="">{item.pos}</span>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</PageWrapper>
