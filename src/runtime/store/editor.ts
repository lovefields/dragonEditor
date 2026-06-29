import { defineStore } from "pinia";
import type { DragonEditorStore, DEOption } from "../type.mjs";

export const useEditorStore = defineStore("editorStore", {
    state: (): DragonEditorStore => ({
        data: [],
        selectedBlockId: "",
        selectedBlockIndex: -1,
        option: {
            mediaHostURL: "",
            isMobile: false,
            codeBlockSpaces: 4,
        },
        cursorSelection: null,
        element: {
            body: null,
        },
        fn: {
            updateEditorData: null,
            uploadImage: null,
        },
    }),
    actions: {},
});
