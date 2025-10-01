<script>
	import { mobileMenu } from "$stores/mobile-menu";
	import { page } from "$app/stores";

	let { isMobile } = $props();

	let allRoutes = [
		{
			name: "Standings",
			url: "/standings/",
		},
		{
			name: "Drafts",
			url: "/drafts/",
		},
		{
			name: "Trades",
			url: "/trades/",
		},
		{
			name: "Franchises",
			url: "/franchises/",
		},
	];

	function isActiveRoute({ currentUrl, route }) {
		if (route.name === "Home" && currentUrl === route.url) {
			return true;
		} else if (route.name !== "Home" && currentUrl.includes(route.url)) {
			return true;
		} else {
			return false;
		}
	}
</script>

{#each allRoutes as route}
	<a
		href={route.url}
		onclick={mobileMenu.close}
		class="border-offset-4 block rounded-xl border-4 bg-black px-3 py-2 font-bold uppercase tracking-wider text-white xl:px-5 {isActiveRoute({
			currentUrl: $page.url.pathname,
			route,
		})
			? 'border-black '
			: 'border-brand-red hover:bg-brand-red hover:border-black'} {isMobile ? 'my-4 text-xl' : 'text-sm'}"
		class:bg-brand-red={isActiveRoute({ currentUrl: $page.url.pathname, route })}
		>{route.name}
	</a>
{/each}

<style>
	/* #call-to-action:hover svg {
		fill: white;
		transform: rotate(25deg);
	} */
</style>
