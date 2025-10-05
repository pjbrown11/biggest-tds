<!-- <script>
	import PageWrapper from "$components/page-wrapper.svelte";
</script>

<PageWrapper header="Franchises">
	<p>The Franchises page goes here</p>

	<p class="mt-8">filterable by query param to the franchiseId</p>

	<p>chart of final place finishes</p>

	<p>chart of avg pts scored vs league average</p>

	<p>each year summary of win loss, pts, final place</p>
</PageWrapper> -->

<script>
	import { highlightedFranchiseId } from "$stores/highlighted-franchise-id.js";

	import { page } from "$app/stores";
	import { slugify } from "$helpers/slugify";
</script>

{#each $page.data.teamListWithIds as team}
	<a href="/franchises/{team.franchiseId}-{slugify(team.latestTeamName)}">
		{team.latestTeamName}
	</a>
{/each}
