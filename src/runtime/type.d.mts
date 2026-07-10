// 컨텐츠 데이터
export type DEContentData = DEBlockData[];

// 컨텐츠 타입
export type DEBlockData = DETextBlock | DEHeadingBlock | DEListBlock | DEImageBlock | DECodeBlock | DECustomBlock | DEDividerBlock;

// 블록 타입
export type DEBlockType = DEBlockData["type"];

// 리스트 엘리먼트 태그 명
export type DEListElementName = "ul" | "ol";

// 해딩 테그 레벨
export type DEHeadingElementLevel = 1 | 2 | 3;

// 아이콘 종류
export type DEIconKind = "plus" | "bold" | "italic" | "underline" | "strikethrough" | "codeblock" | "add-link" | "remove-link" | "image" | "align-center" | "align-left" | "align-right" | "align-justify" | "move-up" | "move-down" | "move-first" | "move-last" | "indent-decrease" | "indent-increase";

// 메뉴용 블럭 추가 타입
export type DEBlockMenutype = Exclude<DEBlockType, "heading" | "list" | "image"> | "heading1" | "heading2" | "heading3" | "unordered-list" | "ordered-list";

// 정렬 종류
export type DETextalign = "left" | "right" | "center" | "justify";

// 데코레이션 클레스 종류
export type DEDecorationClass = "de-bold" | "de-italic" | "de-underline" | "de-strikethrough" | "de-code";

// 에디터 컴포넌트
export interface DragonEditor {
    addBlock(name: DEBlockMenutype, textContent: string = ""): Promise<void>;
    addImageBlock(src: string, caption: string = ""): Promise<void>;
    updateLayout(): void;
    checkDataIsEmpty(data?: DEContentData): boolean;
    setDecoration(type: "bold" | "italic" | "underline" | "strikethrough" | "code"): void;
    setAlign(align: DETextalign): void;
}

// 스토어 구조체
export interface DragonEditorStore {
    data: DEContentData;
    selectedBlockId: string;
    selectedBlockIndex: number;
    option: DEOption;
    status: {
        isParentOverflowHidden: boolean;
        isImageResizeActive: boolean;
        anchorHerf: string;
        menuTop: number;
    };
    cursorSelection: null | Selection;
    cursorRange: null | Range;
    fn: {
        updateEditorData: ((data: DEContentData) => void) | null;
        uploadImage: ((files: File[]) => void) | null;
    };
    element: {
        editor: null | HTMLDivElement;
        body: null | HTMLDivElement;
        scrollParentElement: HTMLElement | Window | null;
    };
    codeBlockLnaguageList: { [key: string]: string };
}

// 스토어용 에디터 옵션
export interface DEOption {
    mediaHostURL: string;
    isMobile: boolean;
    codeBlockSpaces: number;
    acceptImageFormat: string;
    anchorTagTarget: string;
}

// 컨텐츠 블럭 타입
export interface DETextBlock {
    id: string;
    type: "text";
    classList: string[];
    depth?: number;
    textContent: string;
}

// 컨텐츠 해딩 타입
export interface DEHeadingBlock {
    id: string;
    type: "heading";
    classList: string[];
    level: DEHeadingElementLevel;
    depth?: number;
    textContent: string;
}

// 컨텐츠 리스트 자식 타입
export interface DEListItem {
    id: string;
    classList: string[];
    depth?: number;
    textContent: string;
}

// 컨텐츠 리스트 타입
export interface DEListBlock {
    id: string;
    type: "list";
    element: DEListElementName;
    child: DEListItem[];
}

// 컨텐츠 이미지 타입
export interface DEImageBlock {
    id: string;
    type: "image";
    classList: string[];
    maxWidth: number;
    src: string;
    caption: string;
}

// 컨텐츠 코드 블럭 타입
export interface DECodeBlock {
    id: string;
    type: "code";
    language: string;
    filename: string;
    textContent: string;
}

// 컨텐츠 커스텀 타입
export interface DECustomBlock {
    id: string;
    type: "custom";
    textContent: string;
}

// 컨텐츠 구분선 타입
export interface DEDividerBlock {
    id: string;
    type: "divider";
}

// 멀티라인 포지션
export interface DELinePosition {
    curruntLine: number;
    lineCount: number;
}

// 커서 포지션
export interface DECurSorPosition {
    isStart: boolean;
    isEnd: boolean;
}

// 커서 오프샛
export interface DECursorOffset {
    nodeIndex: number;
    offset: number;
}
