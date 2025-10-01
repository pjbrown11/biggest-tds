<script>
	import PageWrapper from "$components/page-wrapper.svelte";

	import trades from "../../data/trades/trades-historical.json";
</script>

<PageWrapper header="Trades">
	<p>The Trades page goes here</p>

	<pre class="text-xs">

		{JSON.stringify(trades, null, 2)}
	</pre>
</PageWrapper>
