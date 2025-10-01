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

<footer class="bg-brand-orange border-brand-red mt-36 border-t-4 px-4 py-24 text-sm">
	<div class="mx-auto max-w-7xl">
		<div class="grid grid-cols-3 gap-12 px-8 2xl:px-0">
			<div class="col-span-3 xl:col-span-1">
				<h3 class="mb-4 text-xl font-bold uppercase tracking-wider">Site Pages</h3>
				{#each pageList as page}
					<div class="mb-3">
						<a href={page.path} class="link font-normal">{page.name}</a>
					</div>
				{/each}
			</div>
			<div class="col-span-3 xl:col-span-1">
				<h3 class="mb-4 text-xl font-bold uppercase tracking-wider">League Links</h3>
				{#each leagues as league}
					<div class="mb-3">
						<a href={league.url} target="_blank" class="link font-normal">{league.year} {league.sleeperId ? "Sleeper" : "MFL"}</a>
					</div>
				{/each}
				<p class="mt-4 inline-block rounded-lg p-2 text-xs text-gray-700 outline-4 outline-gray-300 lg:hidden">Sleeper links don't work on mobile</p>
			</div>
			<div class="col-span-3 mt-12 flex-col items-start justify-start xl:col-span-1 xl:mt-0">
				<img src="/logo-optimized.svg" class="mx-auto w-full max-w-sm" alt="logo" />
			</div>
		</div>
	</div>
	<div class="mt-36 text-center">
		<!-- <div class="flex justify-center">
			<img class="h-36 w-36 min-w-36" src="https://thegoat.dev/img/goat-logo-vertical.svg" alt="" />
		</div> -->
		<a
			href="https://github.com/pjbrown11/biggest-tds"
			target="_blank"
			rel="noopener noreferrer"
			class="no-global-styling inline-flex items-center gap-2 text-sm uppercase"
			aria-label="View Biggest TDs on GitHub"
		>
			<svg class="h-6 w-6 min-w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M12 2C6.477 2 2 6.486 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
				0-.237-.009-.866-.014-1.7-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.607.069-.607
				1.003.071 1.53 1.032 1.53 1.032.892 1.53 2.341 1.087 2.91.832.091-.647.35-1.087.636-1.337-2.221-.253-4.555-1.113-4.555-4.951
				0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844
				c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.026 2.748-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688
				0 3.847-2.338 4.695-4.566 4.944.359.31.678.921.678 1.856 0 1.34-.012 2.421-.012 2.751 0 .268.18.58.688.481A10.019 10.019 0 0 0 22 12.017
				C22 6.486 17.523 2 12 2Z"
				/>
			</svg>

			<span class="underline underline-offset-8"> Code on Github </span>
		</a>
	</div>
</footer>

<style>
</style>
