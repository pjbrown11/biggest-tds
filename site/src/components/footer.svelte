<script>
	import { fly } from "svelte/transition";
	import leagues from "../data/leagues.json";

	let isShowingContactEmail = false;
	let contactEmailPart1 = "go";
	let contactEmailPart2 = "at@starter";
	let contactEmailConnected = "";

	function showEmail() {
		contactEmailConnected = contactEmailPart1 + contactEmailPart2;
		isShowingContactEmail = true;
	}

	const pageList = [
		{
			name: "Home",
			path: "/",
		},
		{
			name: "Standings",
			path: "/standings/",
		},
		{
			name: "Drafts",
			path: "/drafts/",
		},
		{
			name: "Trades",
			path: "/trades/",
		},
		{
			name: "Franchises",
			path: "/franchises/",
		},
	];
</script>

<footer class="bg-brand-orange border-brand-red border-t-4 px-4 py-24 text-sm">
	<div class="mx-auto max-w-7xl">
		<div class="grid grid-cols-3 gap-12 px-8 2xl:px-0">
			<div class="col-span-3 xl:col-span-1">
				<h3 class="mb-4 text-xl font-bold uppercase tracking-wider">League Links</h3>
				{#each leagues as league}
					<div class="mb-3">
						<a href={league.url} target="_blank" class="link font-normal">{league.year} {league.sleeperId ? "Sleeper" : "MFL"}</a>
					</div>
				{/each}
			</div>
			<div class="col-span-3 xl:col-span-1">
				<h3 class="mb-4 text-xl font-bold uppercase tracking-wider">Site Pages</h3>
				{#each pageList as page}
					<div class="mb-3">
						<a href={page.path} class="link font-normal">{page.name}</a>
					</div>
				{/each}
			</div>
			<div class="col-span-3 mt-12 flex-col items-start justify-start xl:col-span-1 xl:mt-0">
				<img src="/logo-optimized.svg" class="mx-auto w-full max-w-sm" alt="logo" />
			</div>
		</div>
	</div>
</footer>

<style>
</style>
