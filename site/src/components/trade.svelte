<script>
	const { trade, highlightedFranchiseId } = $props();
</script>

<div
	class="rounded-lg border-2 border-gray-200 bg-white"
	class:bg-blue-200={trade.teams.some((t) => t.franchiseId === highlightedFranchiseId)}
	class:bg-white={!trade.teams.some((t) => t.franchiseId === highlightedFranchiseId)}
>
	<div class="border-b-2 border-gray-200 px-4 py-2 text-center text-xs">
		{new Date(trade.date).toLocaleDateString()}
	</div>

	<div class="flex flex-col md:flex-row">
		<div class="flex-1 p-4 text-center md:text-right">
			<h3 class="border-brand-red mb-2 inline-block border-b-2 text-base font-bold">
				{trade.teams[0].team}
			</h3>
			<ul class="space-y-1">
				{#each trade.teams[0].received as item}
					<li class="text-sm">
						{item.name}
						{#if item.pos}
							<span class="">{item.pos}</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex items-center justify-center text-sm md:w-12 md:py-0">
			<img src="/handshake.svg" alt="handshake" class="size-8 min-w-8 rounded-full outline outline-dashed outline-2 outline-offset-4" />
		</div>

		<div class="flex-1 p-4 text-center md:text-left">
			<h3 class="border-brand-red mb-2 inline-block border-b-2 text-base font-bold">
				{trade.teams[1].team}
			</h3>
			<ul class="space-y-1">
				{#each trade.teams[1].received as item}
					<li class="text-sm">
						{item.name}
						{#if item.pos}
							<span class="">{item.pos}</span>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
