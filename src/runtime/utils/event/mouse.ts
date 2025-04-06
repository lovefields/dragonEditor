import type { Ref } from "vue";

export function _contentMouseupEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log("_contentMouseupEvent");
}

export function _contentMousedownEvnet(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log("_contentMousedownEvnet");
}

export function _editorMousemoveEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log("_editorMousemoveEvent");
}

export function _editorMouseupEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log("_editorMouseupEvent");
}

export function _editorMouseleaveEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log("_editorMouseleaveEvent");
}

export function _checkOthersideClick(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log(store);
    console.log("_checkOthersideClick");
}
