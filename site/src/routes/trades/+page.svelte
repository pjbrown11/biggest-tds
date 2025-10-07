<script>
	import HighlightFranchise from "$components/highlight-franchise.svelte";
	import InfoNotification from "$components/info-notification.svelte";
	import PageWrapper from "$components/page-wrapper.svelte";
	import Trade from "$components/trade.svelte";
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
				<Trade {trade} highlightedFranchiseId={$highlightedFranchiseId} />
			{/each}
		</div>
	</div>
</PageWrapper>
