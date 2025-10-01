<script>
	import PageWrapper from "$components/page-wrapper.svelte";
	import originalDraft from "../data/draft/draft_original.json";
</script>

<PageWrapper header="" isFullWidth={true}>
	<div class="bg-gray-200">
		<p class="py-8 text-center">full width content</p>
	</div>

	<h1>Draft Picks</h1>
	<ul>
		{#each originalDraft as pick}
			<li>{pick.pick}: {pick.player.name} ({pick.player.pos}) → {pick.team}</li>
		{/each}
	</ul>
</PageWrapper>
