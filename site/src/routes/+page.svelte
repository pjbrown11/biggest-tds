<script>
	import LineChart from "$components/line-chart.svelte";
	import PageWrapper from "$components/page-wrapper.svelte";
	import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id";
	import originalDraft from "../data/draft/draft_original.json";
	import standings from "../data/standings/standings-historical.json";

	function getChamps({ standings }) {
		return standings
			.filter((entry) => entry.finalPlace === 1)
			.sort((a, b) => b.year - a.year)
			.map((champ) => (champ.year === 2022 ? { team: "Old No. 7 / Autodraft Jesus", year: 2022 } : champ))
			.filter((champ, index, self) => index === self.findIndex((c) => c.year === champ.year));
	}

	function getMostPointsScored({ standings }) {
		const top = standings.reduce((max, entry) => (entry.bestGamePts > (max?.bestGamePts || 0) ? entry : max));

		return `${top.bestGamePts} | ${getLatestTeamNameByFranchiseId({ franchiseId: top.franchiseId })} | ${top.year}`;
	}

	function getBestSeasonAvgPoints({ standings }) {
		const top = standings.reduce((max, entry) => (entry.regAvgPtsFor > (max?.regAvgPtsFor || 0) ? entry : max));

		return `${top.regAvgPtsFor} | ${getLatestTeamNameByFranchiseId({
			franchiseId: top.franchiseId,
		})} | ${top.year}`;
	}

	function getBestRecord({ standings }) {
		const top = standings.reduce((max, entry) => (entry.regWins > (max?.regWins || 0) ? entry : max));

		return `${top.regWins}-${top.regLosses} | ${getLatestTeamNameByFranchiseId({
			franchiseId: top.franchiseId,
		})} | ${top.year}`;
	}

	function getMostChampionships({ standings }) {
		const counts = standings.reduce((acc, entry) => {
			if (entry.finalPlace === 1) {
				acc[entry.franchiseId] = (acc[entry.franchiseId] || 0) + 1;
			}
			return acc;
		}, {});

		const max = Math.max(...Object.values(counts));

		const winners = Object.keys(counts)
			.filter((fid) => counts[fid] === max)
			.map((fid) => `${counts[fid]} - ${getLatestTeamNameByFranchiseId({ franchiseId: fid })}`);

		return winners;
	}

	function getMostDivisionTitles({ standings }) {
		const counts = standings.reduce((acc, entry) => {
			if (entry.regDivisionPlace === 1) {
				acc[entry.franchiseId] = (acc[entry.franchiseId] || 0) + 1;
			}
			return acc;
		}, {});

		const max = Math.max(...Object.values(counts));

		const winners = Object.keys(counts)
			.filter((fid) => counts[fid] === max)
			.map(
				(fid) =>
					`${counts[fid]} - ${getLatestTeamNameByFranchiseId({
						franchiseId: fid,
					})}`,
			);

		return winners;
	}
</script>

<PageWrapper header="" isFullWidth={false}>
	<div class="grid grid-cols-6 items-stretch gap-4 xl:pt-24">
		<div class="col-span-6 flex lg:col-span-3">
			<img class="mx-auto w-[80%] self-start" src="/logo-optimized.svg" alt="Biggest TDs logo" />
		</div>

		<div class="col-span-6 flex lg:col-span-3">
			<div class="grid flex-1 grid-cols-6 gap-4">
				<div class="col-span-6 xl:col-span-3">
					<div class="h-full rounded-xl border-4 border-gray-200 bg-white p-6">
						<h3 class="mb-4 text-xs font-bold uppercase tracking-wider">Champions</h3>
						<div class="relative">
							<div class="absolute left-2 top-0 h-full w-0.5 bg-gray-300"></div>

							{#each getChamps({ standings }) as champion}
								<div class="relative mb-3 flex items-center">
									<div class="absolute left-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-gray-400 bg-white">
										<div class="bg-brand-red h-2 w-2 rounded-full"></div>
									</div>
									<div class="ml-8">
										<div class="text-brand-red text-sm font-bold">{champion.year}</div>
										<div>{champion.team}</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="col-span-6 flex flex-col space-y-4 xl:col-span-3">
					<div class="flex flex-1 flex-col justify-center rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Most Championships</h3>
						{#each getMostChampionships({ standings }) as holder}
							<div>{holder}</div>
						{/each}
					</div>

					<div class="flex flex-1 flex-col justify-center rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Most Division Titles</h3>
						{#each getMostDivisionTitles({ standings }) as holder}
							<div>{holder}</div>
						{/each}
					</div>

					<div class="flex flex-1 flex-col justify-center rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Most Points Scored</h3>
						<div>{getMostPointsScored({ standings })}</div>
					</div>

					<div class="flex flex-1 flex-col justify-center rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Best Avg Reg Season Score</h3>
						<div>{getBestSeasonAvgPoints({ standings })}</div>
					</div>

					<div class="flex flex-1 flex-col justify-center rounded-xl border-4 border-gray-200 bg-white p-4">
						<h3 class="mb-2 text-xs font-bold uppercase tracking-wider">Best Regular Season Record</h3>
						<div>{getBestRecord({ standings })}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</PageWrapper>
