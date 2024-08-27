interface EditorStore {
    cursorData: DEditorCursor | null;
    message: { [key: string]: string };
    $editor: HTMLDivElement | null;
    $content: HTMLDivElement | null;
    $currentBlock: HTMLElement | null;
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

interface DEImage {
    src: string;
    width: number;
    height: number;
    classList?: string[];
    caption?: string;
}

type DEDecoration = "bold" | "italic" | "underline" | "strikethrough" | "code";

type DETextalign = "left" | "right" | "center" | "justify";

// 컴포넌트 메서드용 타입
interface DragonEditor {
    addBlock: (type: DEBlock) => void;
    addImageBlock: (data: DEImage) => void;
    setDecoration: (data: DEDecoration) => void;
    setTextAlign: (type: DETextalign) => void;
    getContentData: () => DEContentData;
    setContentData: (data: DEContentData) => void;
}

// Block type
type DEBlock = "text" | "heading" | "ul" | "ol" | "image";

interface DETextBlock {
    type: "text";
    classList: string[];
    textContent: string;
}

interface DEHeadingBlock {
    type: "heading";
    level: number;
    id: string;
    classList: string[];
    textContent: string;
}

interface DEListItem {
    classList: string[];
    textContent: string;
}

interface DEUListBlock {
    type: "ul";
    child: DEListItem[];
}

interface DEOListBlock {
    type: "ol";
    pattern: "a" | "i" | "1" | "A" | "I";
    child: DEListItem[];
}

interface DEImageBlock {
    type: "image";
    maxWidth: number;
    src: string;
    width: number;
    height: number;
    caption: string;
    classList: string[];
}

type DEContentData = (DETextBlock | DEHeadingBlock | DEUListBlock | DEOListBlock | DEImageBlock)[];
