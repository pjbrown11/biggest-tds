<script>
	// FranchiseFinalPlaceChart.svelte
	import { onMount } from "svelte";
	import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler } from "chart.js";

	Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip, Filler);

	let { records = [], title = "Final Place by Season (1 is best)" } = $props();

	let canvasEl;
	let chart;

	function toOrdinal(n) {
		const s = ["th", "st", "nd", "rd"];
		const v = n % 100;
		return n + (s[(v - 20) % 10] || s[v] || s[0]);
	}

	function buildData(src) {
		const rows = [...(src || [])].sort((a, b) => a.year - b.year);
		return {
			labels: rows.map((r) => String(r.year)),
			places: rows.map((r) => (Number.isFinite(r?.finalPlace) ? Number(r.finalPlace) : null)),
		};
	}

	// helper: rounded rectangle
	function roundRect(ctx, x, y, w, h, r = 6) {
		const rr = Math.min(r, w / 2, h / 2);
		ctx.beginPath();
		ctx.moveTo(x + rr, y);
		ctx.lineTo(x + w - rr, y);
		ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
		ctx.lineTo(x + w, y + h - rr);
		ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
		ctx.lineTo(x + rr, y + h);
		ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
		ctx.lineTo(x, y + rr);
		ctx.quadraticCurveTo(x, y, x + rr, y);
		ctx.closePath();
	}

	// Point label plugin with extra spacing + semi-opaque rounded bg
	const PointLabelPlugin = {
		id: "pointLabels",
		afterDatasetsDraw(chart) {
			const { ctx, data } = chart;
			const ds = data.datasets?.[0];
			if (!ds) return;
			const meta = chart.getDatasetMeta(0);

			ctx.save();
			const fontSize = 11;
			const padX = 6;
			const padY = 4;
			const offset = 20; // more space above point
			ctx.font = `700 ${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			meta.data.forEach((elem, i) => {
				const val = ds.data[i];
				if (val == null || Number.isNaN(val)) return;

				const label = toOrdinal(Math.round(val));
				const { x, y } = elem.tooltipPosition();
				const yLabel = y - offset;

				// measure text
				const metrics = ctx.measureText(label);
				const textW = metrics.width;
				const textH = fontSize; // reasonable approximation

				// bg rect dims
				const rectW = textW + padX * 2;
				const rectH = textH + padY * 2;
				const rectX = x - rectW / 2;
				const rectY = yLabel - rectH / 2;

				// rounded bg
				roundRect(ctx, rectX, rectY, rectW, rectH, 6);
				ctx.fillStyle = "rgba(255,255,255,.5)";
				ctx.fill();
				ctx.strokeStyle = "rgba(0,0,0,0.6)";
				ctx.lineWidth = 1;
				ctx.stroke();

				// text
				ctx.fillStyle = "#374151"; // gray-700
				ctx.fillText(label, x, yLabel);
			});

			ctx.restore();
		},
	};

	function upsertChart() {
		const { labels, places } = buildData(records);

		const data = {
			labels,
			datasets: [
				{
					label: "Final Place",
					data: places,
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
			layout: { padding: { top: 18 } }, // extra headroom for labels
			plugins: {
				legend: {
					position: "top",
					labels: { usePointStyle: true, pointStyle: "line" },
				},
				tooltip: {
					mode: "index",
					intersect: false,
					callbacks: {
						label: (ctx) => `${ctx.dataset.label}: ${toOrdinal(Math.round(ctx.parsed.y))}`,
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
					ticks: { autoSkip: false, font: { weight: "700" } },
					title: { display: false },
				},
				y: {
					reverse: true, // 1 at top
					min: 0,
					max: 13,
					grid: { color: "rgba(0,0,0,0.06)" },
					ticks: { display: false, font: { weight: "700" } },
					title: { display: true, text: "Final Place", font: { weight: "700" } },
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
				plugins: [PointLabelPlugin],
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
		<canvas bind:this={canvasEl} aria-label="Final place by season chart"></canvas>
	</div>
</div>
