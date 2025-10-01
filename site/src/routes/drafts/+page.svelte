<script>
	import PageWrapper from "$components/page-wrapper.svelte";

	import drafts from "../../data/drafts/draft-rookies-historical.json";
</script>

<PageWrapper header="Drafts">
	<p>The Drafts page goes here</p>

	<pre class="text-xs">
		{JSON.stringify(drafts, null, 2)}
	</pre>
</PageWrapper>
