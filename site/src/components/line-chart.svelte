<script>
	import { onMount } from "svelte";
	import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Title } from "chart.js";

	Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Title);

	// ✅ Svelte 5 props
	let {
		data = [],
		styles = {
			colors: ["#2563eb", "#dc2626", "#16a34a", "#9333ea", "#f59e0b", "#0d9488", "#e11d48", "#1e3a8a", "#6d28d9", "#15803d", "#b91c1c", "#065f46"],
			borderWidth: 2,
			pointRadius: 4,
		},
	} = $props();

	let canvas;
	let chart;

	onMount(() => {
		const years = [...new Set(data.map((d) => d.year))].sort();

		// Group by franchiseId
		const franchises = {};
		for (const entry of data) {
			if (!franchises[entry.franchiseId]) {
				franchises[entry.franchiseId] = {
					label: `${entry.team} (${entry.owner})`,
					data: [],
				};
			}
		}

		// Fill in average points for each year
		for (const fid in franchises) {
			for (const y of years) {
				const record = data.find((d) => d.franchiseId == fid && d.year == y);
				franchises[fid].data.push(record ? record.regAvgPtsFor : null);
			}
		}

		const datasets = Object.values(franchises).map((franchise, idx) => ({
			label: franchise.label,
			data: franchise.data,
			borderColor: styles.colors[idx % styles.colors.length],
			backgroundColor: styles.colors[idx % styles.colors.length],
			borderWidth: styles.borderWidth,
			pointRadius: styles.pointRadius,
		}));

		chart = new Chart(canvas, {
			type: "line",
			data: { labels: years, datasets },
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						title: { display: true, text: "Average Points For" },
					},
					x: {
						title: { display: true, text: "Year" },
					},
				},
				plugins: {
					legend: { position: "bottom" },
					title: { display: true, text: "Average Points For by Franchise" },
					tooltip: {
						callbacks: {
							label: (ctx) => `${ctx.dataset.label}: ${ctx.raw?.toFixed(1) ?? "N/A"}`,
						},
					},
				},
			},
		});
	});
</script>

<div class="h-[600px] w-full rounded-lg bg-white p-4 shadow">
	<canvas bind:this={canvas}></canvas>
</div>
