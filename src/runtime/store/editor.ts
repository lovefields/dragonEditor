import { defineStore } from "pinia";
import type { DragonEditorStore, DEOption } from "../type.mjs";

export const useEditorStore = defineStore("editorStore", {
    state: (): DragonEditorStore => ({
        data: [],
        selectedBlockIndex: -1,
        option: {
            mediaHostURL: "",
            isMobile: false,
        },
        cursorSelection: null,
        element: {
            body: null,
        },
        fn: {
            updateEditorData: null,
        },
    }),
    actions: {},
});
