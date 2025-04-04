import type { Ref } from "vue";

// 키보드 이벤트트
export function _contentKeydownEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    console.log("event", event);
    console.log("store", store);
}

// 붙여넣기 이벤트
export function _contentPasteEvent(event: ClipboardEvent, store: Ref<DragonEditorStore>) {
    console.log("paste");
}
