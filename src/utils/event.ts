import type EditorInit from "./init";
import { elementKeyEvent } from "./keyboardEvent";
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

        if (findContentEditableElement(store.cursorData.startNode) === null) {
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
            // TODO : 스타일 값 추출
        }
    });

    // console.log($targetList);
}
