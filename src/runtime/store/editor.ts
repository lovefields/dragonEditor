import { defineStore } from "pinia";
import type { DragonEditorStore, DEOption } from "../type.mjs";

export const useEditorStore = defineStore("editorStore", {
    state: (): DragonEditorStore => ({
        data: [],
        selectedBlockId: "",
        selectedBlockIndex: -1,
        status: {
            isImageResizeActive: false,
            anchorHerf: "",
        },
        option: {
            mediaHostURL: "",
            isMobile: false,
            codeBlockSpaces: 4,
            acceptImageFormat: "",
            anchorTagTarget: "",
        },
        cursorSelection: null,
        cursorRange: null,
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
