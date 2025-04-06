import type { Ref } from "vue";
import { _updateModelData } from "./index";

// 키 다운 이벤트
export function _contentKeydownEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    

    switch (event.key) {
        case "Enter":
            __enterEvent(event, store);
            break;
    }

    store.value.preComposingStatus = event.isComposing;
}

// 붙여넣기 이벤트
export function _contentPasteEvent(event: ClipboardEvent, store: Ref<DragonEditorStore>): void {
    console.log("paste");
}

// 키보드 엔터 이벤트 (키 다운)
function __enterEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    console.log("preComposingStatus", store.value.preComposingStatus);

    console.log("editor", store.value.$editor);
}

// 키 업 이벤트
let contentKeyupEvent: NodeJS.Timeout;
export function _contentKeyupEvent(event: KeyboardEvent, store: Ref<DragonEditorStore>): void {
    clearTimeout(contentKeyupEvent);
    contentKeyupEvent = setTimeout(() => {
        _updateModelData(store);
    }, 250);
}
