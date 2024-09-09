import { defineStore } from "pinia";
import "./type.d.ts";

export const useEditorStore = defineStore("editorStore", {
    state: (): EditorStore => ({
        cursorData: null,
        message: {
            linkTextNoStyle: "Link text can't set any style.",
        },
        controlBar: {
            active: false,
            x: 0,
            y: 0,
            $element: null,
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
        setCurrentBlock(block: HTMLElement | null) {
            this.$currentBlock = block;
        },
        setContrulBar(value: HTMLDivElement) {
            this.controlBar.$element = value;
        },
        controlBarActive() {
            if (this.$currentBlock !== null) {
                const currentRect = this.$currentBlock.getBoundingClientRect();

                this.controlBar.active = true;
                this.controlBar.x = Math.floor(currentRect.x + currentRect.width / 2);
                this.controlBar.y = Math.floor(currentRect.y - 50);
            }
        },
        controlBarDeactive() {
            this.controlBar.active = false;
        },
    },
});
