<script>
	import PageWrapper from "$components/page-wrapper.svelte";
	import { highlightedFranchiseId } from "$stores/highlighted-franchise-id.js";
	import { slugify } from "$helpers/slugify";

	const { data } = $props();
</script>

<PageWrapper header="Franchises">
	<div class="grid grid-cols-6 gap-4">
		{#each data.franchises as franchise}
			<div class="col-span-6 md:col-span-3 xl:col-span-2">
				<a
					class="border-offset-4 hover:bg-brand-red border-brand-red block rounded-xl border-4 border-black bg-black px-3
			py-2 text-sm font-bold
			uppercase tracking-wider text-white hover:border-black md:text-base xl:px-5"
					href="/franchises/{franchise.franchiseId}-{slugify(franchise.teamName)}"
				>
					<div class="flex justify-between">
						<div>
							{franchise.teamName}
						</div>
						<div>{franchise.totalWins} - {franchise.totalLosses}</div>
					</div>
				</a>
			</div>
		{/each}
	</div>
</PageWrapper>
