export type DEContentData = DEBlockData[];

export type DEBlockData = DETextBlock | DEHeadingBlock | DEListBlock | DEImageBlock | DECodeBlock | DECustomBlock;

export type DEIconKind = "plus" | "bold" | "italic" | "underline" | "strikethrough" | "codeblock" | "add-link" | "remove-link" | "image" | "align-center" | "align-left" | "align-right" | "align-justify" | "move-up" | "move-down" | "indent-decrease" | "indent-increase";

export type DEDecoration = "bold" | "italic" | "underline" | "strikethrough" | "code";

export type DETextalign = "left" | "right" | "center" | "justify";

export type DEBlock = "text" | "heading" | "ul" | "ol" | "image" | "code" | "custom";

export type DEBlockMenutype = "text" | "heading1" | "heading2" | "heading3" | "ul" | "ol" | "image" | "code" | "custom";

export type DEListStyle = "disc" | "square" | "decimal" | "lower-alpha" | "upper-alpha" | "lower-roman" | "upper-roman";

export type DECodeblockTheme = "github" | "github-dark-dimmed";

export type DECodeblockLang = "text" | "bash" | "csharp" | "c" | "cpp" | "css" | "django" | "dockerfile" | "go" | "html" | "json" | "java" | "js" | "ts" | "kotlin" | "lua" | "md" | "nginx" | "php" | "python" | "ruby" | "scss" | "sql" | "shell" | "swift" | "yml";

export type DEBlockElement = HTMLParagraphElement | HTMLHeadingElement | HTMLElement | HTMLDivElement;

export type DEListElementName = "ul" | "ol";

export interface DragonEditorStore {
    cursorData: DEditorCursor | null;
    message: { [key: string]: string };
    controlBar: {
        active: boolean;
        x: number;
        y: number;
        $element: HTMLDivElement | null;
    };
    useMenuBar: boolean;
    imageHostURL: string;
    firstData: DEContentData;
    menuBarTop: number;
    activeStatus: {
        addBlockMenu: boolean;
        anchorInputArea: boolean;
        imageResizeEvent: boolean;
    };
    eventStatus: {
        preComposing: boolean;
        imageResizeEventStartX: number;
        imageResizeEventType: "right" | "left";
        imageResizeEventEndX: number;
        imageResizeCurrentWidth: number;
        keyboardEnterCount: number;
    };
    controlStatus: {
        isMobile: boolean;
        anchorValidation: boolean;
        currentBlockType: DEBlock;
        codeBlockTheme: DECodeblockTheme;
        codeBlockLang: DECodeblockLang;
        listBlockStyle: DEListStyle;
        anchorTabType: "url" | "heading";
        anchorHeadingList: DEHeadingItem[];
        anchorHref: string;
        previousCorsorData: DEditorCursor | null;
        $anchorInput: HTMLInputElement | null;
        $currentBlock: HTMLDivElement | null;
    };
    codeBlockTheme: DECodeItem<DECodeblockTheme>[];
    listUlType: DECodeItem<DEListStyle>[];
    listOlType: DECodeItem<DEListStyle>[];
    $editor: HTMLDivElement | null;
    $body: HTMLDivElement | null;
    $controlBar: HTMLDivElement | null;
    $parentWrap: HTMLElement | Window | null;
    windowClickEvent(event: MouseEvent): void;
    windowResizeEvent(event: Event): void;
    windowMouseUpEvent(event: MouseEvent): void;
    parentWrapScollEvent(event: Event): void;
    emit: {
        (e: "update:modelValue", data: DEContentData): void;
        (e: "uploadImageEvent", file: File): void;
    };
}

export interface DEditorCursor {
    type: "Range" | "Caret" | "None";
    startNode: Node;
    startOffset: number;
    endNode: Node;
    endOffset: number;
}

export interface DEArrangeCursorData {
    startNode: Node;
    startNodeIdx: number;
    startOffset: number;
    endNode: Node;
    endNodeIdx: number;
    endOffset: number;
}

export interface DECodeItem<T = string> {
    text: string;
    code: T;
}

export interface DEHeadingItem {
    name: string;
    id: string;
}

// 컴포넌트 메서드용 타입
export interface DragonEditor {
    addBlock: (type: DEBlockData) => void;
    setDecoration: (data: DEDecoration) => void;
    setTextAlign: (type: DETextalign) => void;
}

export interface DETextBlock {
    type: "text";
    classList: string[];
    depth?: number;
    textContent: string;
}

export interface DEHeadingBlock {
    type: "heading";
    level: number;
    id: string;
    depth?: number;
    classList: string[];
    textContent: string;
}

export interface DEListItem {
    classList: string[];
    textContent: string;
}

export interface DEListBlock {
    type: "list";
    element: DEListElementName;
    depth?: number;
    style: DEListStyle;
    child: DEListItem[];
}

export interface DEImageBlock {
    type: "image";
    maxWidth: number;
    src: string;
    width: number;
    height: number;
    caption: string;
    classList: string[];
}

export interface DECodeBlock {
    type: "code";
    language: DECodeblockLang;
    theme: DECodeblockTheme;
    filename: string;
    textContent: string;
}

export interface DECustomBlock {
    type: "custom";
    classList: string[];
    textContent: string;
}
