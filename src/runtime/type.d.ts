type DEContentData = DEBlockData[];

type DEBlockData = DETextBlock | DEHeadingBlock | DEListBlock | DEImageBlock | DECodeBlock | DECustomBlock;

type DEIconKind = "plus" | "bold" | "italic" | "underline" | "strikethrough" | "codeblock" | "add-link" | "remove-link" | "image" | "align-center" | "align-left" | "align-right" | "align-justify" | "move-up" | "move-down";

type DECodeTheme = "github";

type DEDecoration = "bold" | "italic" | "underline" | "strikethrough" | "code";

type DETextalign = "left" | "right" | "center" | "justify";

type DEBlock = "text" | "heading" | "ul" | "ol" | "image" | "code" | "custom";

type DEBlockMenutype = "text" | "heading1" | "heading2" | "heading3" | "ul" | "ol" | "image" | "code" | "custom";

type DEListStyle = "disc" | "square" | "decimal" | "lower-alpha" | "upper-alpha" | "lower-roman" | "upper-roman";

type DECodeblockTheme = "github" | "github-dark-dimmed";

type DECodeblockLang = "text" | "bash" | "csharp" | "c" | "cpp" | "css" | "django" | "dockerfile" | "go" | "html" | "json" | "java" | "js" | "ts" | "kotlin" | "lua" | "md" | "nginx" | "php" | "python" | "ruby" | "scss" | "sql" | "shell" | "swift" | "yml";

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
    firstData: DEContentData;
    menuBarTop: number;
    activeStatus: {
        addBlockMenu: boolean;
        anchorInputArea: boolean;
        resizeEvent: boolean;
    };
    eventStatus: {
        preComposing: boolean;
        resizeEventStartX: number;
        resizeEventType: "right" | "left";
        resizeEventEndX: number;
        resizeCurruntWidth: number;
    };
    controlStatus: {
        curruntblockType: DEBlock;
        codeBlockTheme: DECodeTheme;
        codeBlockLang: string;
        listBlockStyle: DEListStyle;
        anchorTabType: "url" | "heading";
        anchorHeadingList: DEHeadingItem[];
        anchorHref: string;
        $anchorInput: HTMLInputElement | null;
        $curruntblock: HTMLDivElement | null;
    };
    $editor: HTMLDivElement | null;
    $body: HTMLDivElement | null;
    $controlbar: HTMLDivElement | null;
    $currentBlock: HTMLElement | null;
    $parentWrap: HTMLElement | Window | null;
    windowClickEvent(event: MouseEvent): void;
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

interface DEImage {
    src: string;
    width: number;
    height: number;
    classList?: string[];
    caption?: string;
}

interface DECodeItem {
    text: string;
    code: string;
}

interface DEHeadingItem {
    name: string;
    id: string;
}

// 컴포넌트 메서드용 타입
interface DragonEditor {
    addBlock: (type: DEBlock) => void;
    addImageBlock: (data: DEImage) => void;
    setDecoration: (data: DEDecoration) => void;
    setTextAlign: (type: DETextalign) => void;
    getContentData: () => DEContentData;
    setContentData: (data: DEContentData) => void;
    addCustomBlock: (HTML: string, classList: string[]) => void;
}

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

interface DEListBlock {
    type: "list";
    element: "ul" | "ol";
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
