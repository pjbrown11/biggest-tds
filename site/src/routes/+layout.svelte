<script>
	import "../../src/app.css";
	import Footer from "$components/footer.svelte";
	import { preparePageTransition } from "$helpers/page-transition";
	import { mobileMenu } from "$stores/mobile-menu";
	import MobileMenu from "$components/mobile-menu.svelte";
	import TopNav from "$components/top-nav.svelte";
	import { onMount } from "svelte";
	import { toast } from "$stores/toast";
	import Toast from "$components/toast.svelte";

	let { children } = $props();

	preparePageTransition();
</script>

<TopNav />

{#if $toast.isShowing}
	<Toast />
{/if}

<div class="min-h-screen pt-16 text-base">
	{#if $mobileMenu}
		<MobileMenu />
	{:else}
		{@render children()}
	{/if}
</div>

<Footer />

<style>
	/* :global(h1, h2, h3, h4, h5, h6) {
		@apply font-display font-bold;
	}
	
	:global(button, a) {
		@apply underline underline-offset-2;
	} */
</style>
