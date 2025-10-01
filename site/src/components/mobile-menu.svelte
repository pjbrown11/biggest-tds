<script>
	import { fly } from 'svelte/transition';
	import RouteList from './route-list.svelte';
</script>

<div
	transition:fly={{ x: -200 }}
	id="mobile-menu"
	class="fixed top-16 w-screen"
	style="height: calc(100vh - 64px)"
>
	<div class="flex h-full items-center bg-gray-100 px-2 pb-24">
		<div class="w-full px-4 text-center">
			<RouteList isMobile={true} />
		</div>
	</div>
</div>
