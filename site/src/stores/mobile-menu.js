import { writable } from "svelte/store";

const { subscribe, set, update } = writable(false);

export const mobileMenu = {
	subscribe,
	set,
	close: () => {
		set(false)
	},
	toggle: () => {
		update(existingMenuState => {
			return !existingMenuState
		})
	}
}