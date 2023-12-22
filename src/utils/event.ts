import type EditorInit from "./init";
import { elementKeyEvent } from "./keyboard";

export function setEvent(store: EditorInit) {
    setContentEditorbleElementEvent(store);
}

// 에디팅 요소 이벤트
function setContentEditorbleElementEvent(store: EditorInit) {
    store.wrap.addEventListener("keydown", function (e: KeyboardEvent) {
        if ((e.target as HTMLElement).isContentEditable === true) {
            elementKeyEvent(e, store);
        }
    });

    // console.log($targetList);
}
