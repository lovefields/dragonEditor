import { defineStore } from "pinia";
import "./type.d.ts";

export const useEditorStore = defineStore("editorStore", {
    state: (): EditorStore => ({
        cursorData: null,
        message: {
            linkTextNoStyle: "Link text can't set any style.",
        },
        $currentBlock: null,
        $editor: null,
        $content: null,
        $parentWrap: null,
    }),
    actions: {
        setWrapElement(value: HTMLDivElement) {
            this.$editor = value;
        },
        setContentElement(value: HTMLDivElement) {
            this.$content = value;
        },
        setParentWrapElement(value: HTMLElement | Window) {
            this.$parentWrap = value;
        },
        setCursorData(data: DEditorCursor) {
            this.cursorData = data;
        },
        setCurrentBlock(block: HTMLElement) {
            this.$currentBlock = block;
        },
    },
});
