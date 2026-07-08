export * from "./keyboard";
export * from "./cursor";
import { useEditorStore } from "../../store/editor";
import { _findHiddenStyleElement, _findScrollingElement } from "../data";

// 에디터 마운트 이벤트
export function _editorMountedEvent(): void {
    const editorStore = useEditorStore();

    if (editorStore.element.editor !== null) {
        const $scrollParent = _findScrollingElement(editorStore.element.editor);
        const $hiddenStyleElement = _findHiddenStyleElement(editorStore.element.editor);

        editorStore.status.isParentOverflowHidden = $hiddenStyleElement !== null;
        editorStore.element.scrollParentElement = $scrollParent;

        if (editorStore.element.scrollParentElement !== null) {
            editorStore.element.scrollParentElement.addEventListener("scroll", parentElementScrollEvent);
        }
    }
}

// 에디터 언마운트 이벤트
export function _eidtorUnmountEvent(): void {
    const editorStore = useEditorStore();

    if (editorStore.element.scrollParentElement !== null) {
        editorStore.element.scrollParentElement.removeEventListener("scroll", parentElementScrollEvent);
    }
}

// 부모요소 스크롤 이벤트
function parentElementScrollEvent(): void {
    const editorStore = useEditorStore();

    if (editorStore.element.scrollParentElement !== null && editorStore.element.editor !== null) {
        const editorRect = editorStore.element.editor.getBoundingClientRect();
        const $scrollElement = editorStore.element.scrollParentElement;
        let scrollY = 0;
        let value: number = 0;

        if ($scrollElement instanceof Window) {
            scrollY = $scrollElement.scrollY;
        } else {
            scrollY = $scrollElement.scrollTop;
        }

        let realElementY = editorRect.y + scrollY;

        if ($scrollElement instanceof HTMLElement) {
            const parentRect = $scrollElement.getBoundingClientRect();

            realElementY -= parentRect.y;
        }

        if (scrollY > realElementY) {
            value = scrollY - realElementY - 1;
        } else {
            value = 0;
        }

        if (value > editorRect.height - 34) {
            value = editorRect.height - 34;
        }

        editorStore.status.menuTop = Math.floor(value);
    }
}
