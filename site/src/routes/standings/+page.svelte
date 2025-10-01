<script>
	import PageWrapper from "$components/page-wrapper.svelte";

	import standings from "../../data/standings/standings-historical.json";
</script>

<PageWrapper header="Standings">
	<p>The Standings page goes here</p>

	<pre class="text-xs">

		{JSON.stringify(standings, null, 2)}
	</pre>
</PageWrapper>
