<script>
	// FranchiseAvgPointsChart.svelte
	import { onMount } from "svelte";
	import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler } from "chart.js";

	Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler);

	let { records = [], title = "Average Points per Game" } = $props();

	let canvasEl;
	let chart;

	function buildDatasets(src) {
		const rows = [...(src || [])].sort((a, b) => a.year - b.year);
		const labels = rows.map((r) => String(r.year));
		const league = rows.map((r) => Number(r.leagueAvg ?? 0));
		const team = rows.map((r) => Number(r.regAvgPtsFor ?? 0));
		return { labels, league, team };
	}

	function upsertChart() {
		const { labels, league, team } = buildDatasets(records);

		const data = {
			labels,
			datasets: [
				{
					label: "League Avg",
					data: league,
					borderColor: "rgba(100,116,139,1)",
					backgroundColor: "rgba(100,116,139,0.08)",
					borderWidth: 2,
					pointRadius: 2,
					pointHoverRadius: 4,
					borderDash: [6, 4],
					tension: 0.2,
					fill: false,
				},
				{
					label: "Franchise Avg",
					data: team,
					borderColor: "rgba(37,99,235,1)",
					backgroundColor: "rgba(37,99,235,0.10)",
					borderWidth: 3,
					pointRadius: 3,
					pointHoverRadius: 5,
					tension: 0.25,
					fill: false,
				},
			],
		};

		const options = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: "top",
					labels: { usePointStyle: true, pointStyle: "line" },
				},
				tooltip: {
					mode: "index",
					intersect: false,
					callbacks: {
						label: (ctx) => `${ctx.dataset.label}: ${Math.round(ctx.parsed.y)}`,
					},
				},
				title: {
					display: !!title,
					text: title,
					color: "#111827",
					font: { weight: "700", size: 14 },
				},
			},
			scales: {
				x: {
					grid: { display: false },
					ticks: {
						autoSkip: false,
						font: { weight: "700" }, // bold x-axis tick labels
					},
					title: {
						display: false,
					},
				},
				y: {
					beginAtZero: false,
					grid: { color: "rgba(0,0,0,0.06)" },
					ticks: {
						display: false,
						font: { weight: "700" }, // remains hidden, but set bold for consistency
					},
					title: {
						display: true,
						text: "Avg Points Per Game",
						font: { weight: "700" }, // bold y-axis title
					},
				},
			},
			interaction: { mode: "nearest", intersect: false },
		};

		if (chart) {
			chart.data = data;
			chart.options = options;
			chart.update();
		} else {
			chart = new Chart(canvasEl.getContext("2d"), {
				type: "line",
				data,
				options,
			});
		}
	}

	onMount(() => {
		upsertChart();
		return () => chart?.destroy();
	});

	$effect(() => {
		upsertChart();
	});
</script>

<div class="w-full rounded-lg border border-gray-200 bg-white p-3">
	<div class="relative h-72 w-full sm:h-80 md:h-96">
		<canvas bind:this={canvasEl} aria-label="Average points per game chart"></canvas>
	</div>
</div>
