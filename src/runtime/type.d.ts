interface EditorStore {
    cursorData: DEditorCursor | null;
    $editor: HTMLDivElement | null;
    $content: HTMLDivElement | null;
    $parentWrap: HTMLElement | Window | null;
}

interface DEditorCursor {
    type: "Range" | "Caret" | "None";
    startNode: Node;
    startOffset: number;
    endNode: Node;
    endOffset: number;
}

interface DEArrangeCursorData {
    startNode: Node;
    startNodeIdx: number;
    startOffset: number;
    endNode: Node;
    endNodeIdx: number;
    endOffset: number;
}
