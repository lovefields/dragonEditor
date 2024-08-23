interface EditorStore {
    cursorData: DEditorCursor | null;
    message: { [key: string]: string };
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

interface DETextBlock {
    type: "text";
    textContent: string;
}

interface DEHeadingBlock {
    type: "heading";
    level: number;
    id: string;
    textContent: string;
}

interface DEUListBlock {
    type: "ul";
    child: string[];
}

interface DEOListBlock {
    type: "ol";
    pattern: "a" | "i" | "1" | "A" | "I";
    child: string[];
}

type DEContentData = (DETextBlock | DEHeadingBlock | DEUListBlock | DEOListBlock)[];
