<script>
	import { fly } from "svelte/transition";

	let isShowingContactEmail = false;
	let contactEmailPart1 = "go";
	let contactEmailPart2 = "at@starter";
	let contactEmailConnected = "";

	function showEmail() {
		contactEmailConnected = contactEmailPart1 + contactEmailPart2;
		isShowingContactEmail = true;
	}

	const pageList = [
		{
			name: "About",
			path: "/about/",
		},
		{
			name: "Contact",
			path: "/contact/",
		},
	];
</script>

<footer class="bg-brand-orange border-t-[1rem] border-brand-blue px-4 py-24 text-sm">
	<div class="mx-auto max-w-7xl">
		<div class="grid grid-cols-3 gap-12 px-8 2xl:px-0">
			<div class="col-span-3 xl:col-span-1">
				<h3 class="mb-4 text-xl font-bold uppercase tracking-wider">Get in Touch</h3>
				<div class="mb-4 flex items-center justify-start">
					<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" class="size-6 min-w-6" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M22 12C22 6.47714 17.5229 1.99999 12 1.99999C6.47715 1.99999 2 6.47714 2 12C2 16.9913 5.65686 21.1283 10.4375 21.8785V14.8906H7.89844V12H10.4375V9.79687C10.4375 7.29062 11.9304 5.90624 14.2146 5.90624C15.3087 5.90624 16.4531 6.10155 16.4531 6.10155V8.56249H15.1921C13.9499 8.56249 13.5625 9.33333 13.5625 10.1242V12H16.3359L15.8926 14.8906H13.5625V21.8785C18.3431 21.1283 22 16.9913 22 12Z"
							stroke="#000000"
							stroke-width="1.5"
							stroke-linejoin="round"
						></path>
					</svg>

					<p class="pl-2">
						<a href="https://www.facebook.com/goatstarter/" target="_blank" class="no-global-styling text-sm underline underline-offset-8">
							GOAT Starter Facebook
						</a>
					</p>
				</div>
				<div class="mb-4 flex items-center justify-start">
					<svg
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
						/>
					</svg>

					<p class="pl-2">P.O. Box 123</p>
				</div>
				<div class="mb-4 flex items-center justify-start">
					{#if isShowingContactEmail}
						<svg
							data-slot="icon"
							fill="none"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6 min-w-6"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
							></path>
						</svg>
						<a in:fly class="no-global-styling inline-block pl-2 text-sm underline underline-offset-8" href="mailto:{contactEmailConnected}"
							>{contactEmailConnected}</a
						>
					{:else}
						<button class="outline-btn-blue mt-4 px-5 py-2 text-xs" on:click={showEmail}>Email Us </button>
					{/if}
				</div>
			</div>
			<div class="col-span-3 xl:col-span-1">
				<h3 class="mb-4 text-xl font-bold uppercase tracking-wider">Site Pages</h3>
				{#each pageList as page}
					<div class="mb-3">
						<a href={page.path} class="no-global-styling text-sm underline underline-offset-8">
							{page.name}
						</a>
					</div>
				{/each}
			</div>
			<div class="col-span-3 mt-12 flex-col items-start justify-start xl:col-span-1 xl:mt-0">
				<img src="/logo-optimized.svg" class="mx-auto w-full max-w-sm" alt="logo" />
			</div>
		</div>
		<!-- <div class="flex items-center justify-start mb-2">
			<svg aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
				/>
			</svg>

			<p class="pl-2">
				<a href="tel:+15155556666" class="no-global-styling text-sm underline underline-offset-8">
					515-555-6666
				</a>
			</p>
		</div> -->
	</div>
	<div class="absolute -left-[999px]">
		<a href="https://thegoat.dev">Website Developed by The GOAT</a>
	</div>
</footer>

<style>
</style>
