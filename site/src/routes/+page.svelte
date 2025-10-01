<script>
	import LineChart from "$components/line-chart.svelte";
	import PageWrapper from "$components/page-wrapper.svelte";
	import originalDraft from "../data/draft/draft_original.json";
	import standings from "../data/standings/standings-historical.json";

	function getChamps({ standings }) {
		return standings
			.filter((entry) => entry.finalPlace === 1)
			.sort((a, b) => b.year - a.year)
			.map((champ) => (champ.year === 2022 ? { team: "Old No. 7 / Autodraft Jesus", year: 2022 } : champ)) // hack for the year Hamlin died on the field
			.filter((champ, index, self) => index === self.findIndex((c) => c.year === champ.year));
	}
</script>

<PageWrapper header="" isFullWidth={false}>
	<div class="grid grid-cols-6 gap-8">
		<div class="col-span-6 lg:col-span-3">
			<img class="w-full" src="/logo-optimized.svg" alt="Biggest TDs logo" />
		</div>
		<div class="col-span-6 lg:col-span-3">
			<div class="grid grid-cols-6 gap-8">
				<div class="col-span-6 lg:col-span-3">
					<div class="rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Champions</h3>
						{#each getChamps({ standings }) as champion}
							<div>{champion.year} {champion.team}</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</PageWrapper>
