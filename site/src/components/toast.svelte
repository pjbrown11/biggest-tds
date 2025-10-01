<script>
	import { toast } from "$stores/toast";
	import { onDestroy } from "svelte";
	import { fly } from "svelte/transition";

	let paused = false;
	let timeout = 899; // ends up being 9 seconds
	let counter = setInterval(timer, 10);

	let timeOpenAndNotPaused = 0;

	// $: timeRemaining = (timeout - timeOpenAndNotPaused + 100).toString().substring(0, 1);
	$: percentRemaining = (timeout - timeOpenAndNotPaused) / timeout;

	function timer() {
		if (!paused) {
			timeOpenAndNotPaused++;

			if (timeOpenAndNotPaused > timeout) {
				toast.close();
				clearInterval(counter);
			}
		}
	}

	onDestroy(() => {
		toast.close();
		clearInterval(counter);
	});
</script>

<div class="relative max-w-7xl">
	<div
		transition:fly={{ y: 20, opacity: 0 }}
		class="fixed bottom-0 z-50 w-full rounded-none p-4 text-white lg:bottom-20 lg:right-4 lg:w-96
	lg:rounded-lg 2xl:right-[12%] 3xl:right-[16%]"
		class:bg-green-700={$toast.type === "success"}
		class:bg-red-700={$toast.type === "error"}
		class:bg-purple-700={$toast.type === "info"}
		on:mouseover={() => (paused = true)}
		on:mouseout={() => (paused = false)}
		on:focus={() => (paused = true)}
		on:blur={() => (paused = false)}
		aria-atomic="true"
		role="log"
	>
		<div class="-mt-3 w-full">
			<progress
				class="w-full"
				class:success={$toast.type === "success"}
				class:error={$toast.type === "error"}
				class:info={$toast.type === "info"}
				value={percentRemaining}
			></progress>
		</div>
		{#if $toast.type === "success"}
			<svg xmlns="http://www.w3.org/2000/svg" class="absolute -top-6 right-2 h-12 w-12 fill-green-900" viewBox="0 0 20 20">
				<circle r="6.9063253" cy="10.024096" cx="9.9638548" style="opacity:1;fill:#ffffff;" />
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
					clip-rule="evenodd"
				/>
			</svg>
		{:else if $toast.type === "error"}
			<svg xmlns="http://www.w3.org/2000/svg" class="absolute -top-6 right-2 h-12 w-12 fill-red-900" viewBox="0 0 20 20">
				<circle r="6.9063253" cy="10.024096" cx="9.9638548" style="opacity:1;fill:#ffffff;" />
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0
					00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
		{:else if $toast.type === "info"}
			<svg xmlns="http://www.w3.org/2000/svg" class="absolute -top-6 right-2 h-12 w-12 fill-purple-900" viewBox="0 0 20 20">
				<circle r="6.9063253" cy="10.024096" cx="9.9638548" style="opacity:1;fill:#ffffff;" />
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
		<div class="w-full">
			<p>{$toast.message}</p>
		</div>
		<div class="mt-2 flex justify-between">
			<button
				on:click={toast.close}
				class="ml-auto rounded-md px-3 py-2 text-center text-xs focus:outline-none focus:ring-4 focus:ring-gray-800"
				class:hover:bg-green-800={$toast.type === "success"}
				class:hover:bg-red-800={$toast.type === "error"}
				class:hover:bg-purple-800={$toast.type === "info"}
			>
				Close
			</button>
		</div>
	</div>
</div>

<style>
	progress {
		appearance: none;
		width: 100%;
		height: 12px;
		border-radius: 5px;
	}

	progress::-webkit-progress-bar {
		border-radius: 5px;
	}

	progress::-webkit-progress-value {
		border-radius: 5px;
	}

	progress::-moz-progress-bar {
		border-radius: 5px;
	}

	progress.success {
		background-color: #15803d;
	}

	progress.success::-webkit-progress-bar {
		background-color: #15803d;
	}

	progress.success::-webkit-progress-value {
		background-color: #14532d;
	}

	progress.success::-moz-progress-bar {
		background-color: #14532d;
	}

	progress.error {
		background-color: #b91c1c;
	}

	progress.error::-webkit-progress-bar {
		background-color: #b91c1c;
	}

	progress.error::-webkit-progress-value {
		background-color: #7f1d1d;
	}

	progress.error::-moz-progress-bar {
		background-color: #7f1d1d;
	}

	progress.info {
		background-color: #7e22ce;
	}

	progress.info::-webkit-progress-bar {
		background-color: #7e22ce;
	}

	progress.info::-webkit-progress-value {
		background-color: #4c1d95;
	}

	progress.info::-moz-progress-bar {
		background-color: #4c1d95;
	}
</style>
