import type { Ref } from "vue";

export function _contentTouchstartEvent(event: TouchEvent, store: Ref<DragonEditorStore>): void {
    console.log("_contentTouchstartEvent");
}

export function _editorTouchmoveEvent(event: TouchEvent, store: Ref<DragonEditorStore>): void {
    console.log("_editorTouchmoveEvent");
}

export function _editorTouchendEvent(event: TouchEvent, store: Ref<DragonEditorStore>): void {
    console.log("_editorTouchendEvent");
}
