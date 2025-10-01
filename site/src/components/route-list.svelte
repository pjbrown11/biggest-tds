<script>
	import { mobileMenu } from "$stores/mobile-menu";
	import { page } from "$app/stores";

	let { isMobile } = $props();

	let allRoutes = [
		{ url: "/about/", name: "About" },
		{ url: "/contact/", name: "Contact" },
		{ url: "/dashboard/", name: "Dashboard" },
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
		class="no-global-styling block rounded-full px-3 py-3 transition-all ease-out xl:px-5 {isActiveRoute({
			currentUrl: $page.url.pathname,
			route,
		})
			? 'text-white'
			: 'text-brand-blue'} {isMobile ? 'my-4 text-xl' : 'text-sm'} font-bold uppercase tracking-wider {!$page.url.pathname.includes(route.url)
			? 'relative underline underline-offset-8 before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:origin-right before:scale-x-0 before:bg-brand-green-600 before:transition-transform before:duration-300 hover:no-underline hover:before:origin-left hover:before:scale-x-100'
			: ''}"
		class:bg-brand-blue-600={isActiveRoute({ currentUrl: $page.url.pathname, route })}
		class:hover:bg-brand-blue-600={isActiveRoute({ currentUrl: $page.url.pathname, route })}
		>{route.name}
	</a>
{/each}

<style>
	/* #call-to-action:hover svg {
		fill: white;
		transform: rotate(25deg);
	} */
</style>
