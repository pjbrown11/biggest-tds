import { getLatestTeamNameByFranchiseId } from "$helpers/get-latest-team-name-by-franchise-id";
import { writable } from "svelte/store";

const { subscribe, set, update } = writable("");

export const highlightedFranchiseId = {
	subscribe,
	set,
	update,
};
