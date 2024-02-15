import type EditorInit from "./init";
import { elementKeyEvent, elementKeyAfterEvent, hotKeyEvent, copyEvent, pasteEvent } from "./keyboardEvent";
import { setCursorData } from "./cursor";
import { setControlbarEvetn } from "./controlbarEvent";
import { findContentEditableElement } from "./element";

export function setEvent(store: EditorInit) {
    setContentEditorbleElementEvent(store);
    setControlbarEvetn(store);

    // 마우스 조작시 커서 데이터 업데이트
    store.wrap.addEventListener("mouseup", function (e: MouseEvent) {
        const originalCursorData = store.cursorData;

        setCursorData(store);

        if (store.cursorData !== null && findContentEditableElement(store.cursorData.startNode) === null) {
            // 비정상 커서 값일 경우 초기화
            store.cursorData = originalCursorData;
        }
        // TODO : 스타일 값 추출
    });
}

// 에디팅 요소 이벤트
function setContentEditorbleElementEvent(store: EditorInit) {
    // 키보드 이벤트
    store.wrap.addEventListener("keydown", function (e: KeyboardEvent) {
        if ((e.target as HTMLElement).isContentEditable === true) {
            elementKeyEvent(e, store);
            hotKeyEvent(e, store);
            // TODO : 스타일 값 추출
        }
    });

    // 복사 이벤트
    store.wrap.addEventListener("copy", function (e: KeyboardEvent) {
        e.preventDefault();
        copyEvent(e, store);
    });

    // 붙여넣기 이벤트
    store.wrap.addEventListener("paste", function (e: KeyboardEvent) {
        e.preventDefault();
        pasteEvent(e, store);
    });
}
