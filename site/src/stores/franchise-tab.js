import { writable } from "svelte/store";

const { subscribe, set, update } = writable("Trends");

export const franchiseTab = {
	subscribe,
	set,
	update,
};
