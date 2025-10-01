
import { writable } from "svelte/store";

const defaults = {
    isShowing: false,
    message: "",
    type: ""
}

const { subscribe, set, update } = writable({ ...defaults });

export const toast = {
    subscribe,
    close: () => { // close method is written this way so that the content stays in the toast as it fades out from display
        update(existingState => {
            return {
                ...existingState,
                isShowing: false
            }
        })
    },
    show: ({ message, type }) => set({
        isShowing: true,
        message,
        type
    }),
};
