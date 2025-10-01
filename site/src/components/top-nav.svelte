<script>
	import { mobileMenu } from "$stores/mobile-menu";
	import { draw, fly } from "svelte/transition";
	import { quintOut } from "svelte/easing";
	import RouteList from "./route-list.svelte";
	import { page } from "$app/stores";

	let y;
</script>

<svelte:window bind:scrollY={y} />

<nav
	class="fixed top-0 z-50 w-full overflow-visible bg-gray-100 transition-all {y === 0 && $page.url?.pathname === '/'
		? ''
		: $page.url?.pathname && y >= 0
			? 'border-brand-red border-b-4'
			: ''}"
>
	<div class="mx-auto max-w-7xl px-4">
		<div class="relative flex h-16 items-center justify-between">
			<div class="absolute inset-y-0 left-0 flex items-center lg:hidden">
				<button
					onclick={() => mobileMenu.toggle()}
					type="button"
					class="no-global-styling inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-400"
					aria-controls="mobile-menu"
					aria-expanded="false"
				>
					<span class="sr-only">Toggle main menu</span>
					{#if !$mobileMenu}
						<svg
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="#000"
							aria-hidden="true"
						>
							<path
								in:draw={{ duration: 5000, easing: quintOut }}
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>
					{:else}
						<svg
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="#000"
							aria-hidden="true"
						>
							<path in:draw={{ duration: 2500, easing: quintOut }} stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					{/if}
				</button>
			</div>
			<div class="flex flex-1 items-center justify-center lg:items-stretch lg:justify-between">
				<div class="flex flex-shrink-0 items-center">
					{#if $page.url?.pathname && y >= 0}
						{#if y !== 0 || $page.url?.pathname !== "/"}
							<div transition:fly={{ y: -50, duration: 300 }} class="block lg:hidden">
								<a onclick={mobileMenu.close} href="/" class="no-global-styling flex flex-shrink-0 items-center pl-4">
									<img
										class="h-12 w-auto transition-all duration-500
								"
										src="/logo-emblem-optimized.svg"
										alt="GOAT Starter"
									/>
								</a>
							</div>
						{/if}
						{#if y !== 0 || $page.url?.pathname !== "/"}
							<div transition:fly={{ y: -50, duration: 300 }} class="hidden lg:block">
								<a onclick={mobileMenu.close} href="/" class="no-global-styling flex items-center">
									<img
										class="h-12 w-auto transition-all duration-500
							"
										src="/logo-emblem-optimized.svg"
										alt="GOAT Starter"
									/>
								</a>
							</div>
						{/if}
					{/if}
				</div>
				<div class="hidden items-center sm:ml-6 lg:flex">
					<div class="flex space-x-1 lg:space-x-4">
						<RouteList />
					</div>
				</div>
			</div>
		</div>
	</div>
</nav>
