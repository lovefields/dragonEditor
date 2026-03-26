import { defineStore } from "pinia";

export const useEditorStore = defineStore("editorStore", {
    state: (): { selectedBlockIndex: number } => ({
        selectedBlockIndex: -1,
    }),
});
