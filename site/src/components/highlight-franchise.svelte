<script>
	import { highlightedFranchiseId } from "$stores/highlighted-franchise-id.js";

	import { page } from "$app/stores";
</script>

<div class="w-full">
	<div class="input-wrapper">
		<label for="highlight">Highlight a Franchise</label>
		<select bind:value={$highlightedFranchiseId} id="highlight">
			<option class="text-gray-400" value="">Select Franchise</option>
			{#each $page.data.teamListWithIds as team}
				<option value={team.franchiseId}>
					{team.latestTeamName}
				</option>
			{/each}
		</select>
	</div>
</div>
