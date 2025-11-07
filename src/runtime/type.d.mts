import type { codeToHtml } from "shiki";

type DEContentData = DEBlockData[];

type DEBlockData = DETextBlock | DEHeadingBlock | DEListBlock | DEImageBlock | DECodeBlock | DECustomBlock | DEDividerBlock;

type DEIconKind = "plus" | "bold" | "italic" | "underline" | "strikethrough" | "codeblock" | "add-link" | "remove-link" | "image" | "align-center" | "align-left" | "align-right" | "align-justify" | "move-up" | "move-down" | "indent-decrease" | "indent-increase";

type DEDecoration = "bold" | "italic" | "underline" | "strikethrough" | "code";

type DETextalign = "left" | "right" | "center" | "justify";

type DEBlock = "text" | "heading" | "ul" | "ol" | "image" | "code" | "custom";

type DEBlockMenutype = "text" | "heading1" | "heading2" | "heading3" | "ul" | "ol" | "image" | "code" | "custom" | "divider";

type DEListStyle = "disc" | "square" | "decimal" | "lower-alpha" | "upper-alpha" | "lower-roman" | "upper-roman";

type DECodeblockTheme = "github-light" | "github-dark-dimmed";

type DECodeblockLang = "text" | "csharp" | "c" | "cpp" | "css" | "django" | "dockerfile" | "go" | "html" | "json" | "java" | "javascript" | "typescript" | "kotlin" | "lua" | "markdown" | "nginx" | "php" | "python" | "ruby" | "scss" | "sql" | "shellscript" | "swift" | "yaml";

type DEBlockElement = HTMLParagraphElement | HTMLHeadingElement | HTMLElement | HTMLDivElement;

type DEListElementName = "ul" | "ol";

interface DragonEditorStore {
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
    screenChangePoint: number;
    firstData: DEContentData;
    menuBarTop: number;
    activeStatus: {
        addBlockMenu: boolean;
        anchorInputArea: boolean;
        imageResizeEvent: boolean;
    };
    eventStatus: {
        imageResizeEventStartX: number;
        imageResizeEventType: "right" | "left";
        imageResizeEventEndX: number;
        imageResizeCurrentWidth: number;
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
    codeToHtml: codeToHtml;
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

interface DECodeItem<T = string> {
    text: string;
    code: T;
}

interface DEHeadingItem {
    name: string;
    id: string;
}

// 컴포넌트 메서드용 타입
interface DragonEditor {
    addBlock: (type: DEBlockData) => void;
    setDecoration: (data: DEDecoration) => void;
    setTextAlign: (type: DETextalign) => void;
    changeEditorData: (data: DEContentData) => void;
    updateLayout: () => void;
    checkDataEmpty: (data?: DEContentData) => boolean;
}

interface DETextBlock {
    type: "text";
    classList: string[];
    depth?: number;
    textContent: string;
}

interface DEHeadingBlock {
    type: "heading";
    level: number;
    id: string;
    depth?: number;
    classList: string[];
    textContent: string;
}

interface DEListItem {
    classList: string[];
    textContent: string;
}

interface DEListBlock {
    type: "list";
    element: DEListElementName;
    depth?: number;
    style: DEListStyle;
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

interface DECodeBlock {
    type: "code";
    language: DECodeblockLang;
    theme: DECodeblockTheme;
    filename: string;
    textContent: string;
}

interface DECustomBlock {
    type: "custom";
    classList: string[];
    textContent: string;
}

interface DEDividerBlock {
    type: "divider";
}
