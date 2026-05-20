import { defineStore } from "pinia";
import type { DragonEditorStore, DEOption } from "../type.mjs";

export const useEditorStore = defineStore("editorStore", {
    state: (): DragonEditorStore => ({
        option: {
            mediaHostURL: "",
            isMobile: false,
        },
        selectedBlockIndex: -1,
    }),
    actions: {
        setOption(data: DEOption): void {
            this.option.isMobile = data.isMobile;
            this.option.mediaHostURL = data.mediaHostURL;
        },
    },
});
