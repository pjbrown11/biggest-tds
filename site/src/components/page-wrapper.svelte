<script>
	let {
		isFullWidth = false,
		header = '',
		isHeaderCenter = false,
		children,
		isMinScreenHeight = true
	} = $props();
</script>

<div
	class="relative {isFullWidth ? '' : 'mx-auto max-w-7xl px-4'} {header
		? ''
		: 'pt-8 lg:pt-12'} {isMinScreenHeight ? 'min-h-screen' : ''}"
>
	{#if header}
		<h1
			class="mb-2 pt-4 text-left text-2xl font-bold lg:pt-8 {isHeaderCenter
				? 'text-center'
				: 'text-left'}"
		>
			{header}
		</h1>
	{/if}
	{@render children()}
</div>
