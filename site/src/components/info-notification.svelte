<script>
	let { header = "", message = "", cssString = "", isSuccess = false, iconCssString = "", children } = $props();
</script>

<div
	class="flex max-w-2xl items-start rounded border-l-4 p-4 text-gray-900 {cssString}  relative {isSuccess
		? 'border-green-700 bg-green-100'
		: 'border-indigo-600 bg-indigo-100'}"
	role="alert"
>
	{#if isSuccess}
		<svg
			data-slot="icon"
			fill="currentColor"
			class="absolute -top-5 right-4 h-10 w-10 flex-shrink-0 rounded-full bg-gray-50 fill-green-700 lg:-top-6 lg:h-12 lg:w-12 {iconCssString}"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				clip-rule="evenodd"
				fill-rule="evenodd"
				d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
			></path>
		</svg>
	{:else}
		<svg
			class="absolute -top-5 right-4 h-10 w-10 flex-shrink-0 rounded-full bg-gray-50 fill-indigo-600 lg:-top-6 lg:h-12 lg:w-12 {iconCssString}"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
				clip-rule="evenodd"
			/>
		</svg>
	{/if}

	<div class="ml-3">
		{#if header}
			<strong class="text-lg"> {header} </strong>
		{/if}
		{#if message}
			<p class="mt-1">{@html message}</p>
		{/if}
		{@render children?.()}
	</div>
</div>
