import { useEditorStore } from "../../store/editor";

export function _updateCursorData(): void {
    const editorStore = useEditorStore();

    if (window !== undefined) {
        editorStore.cursorSelection = window.getSelection() as Selection;
    } else {
        console.error("[Dragon Editor]: It's not client environment");
    }
}
