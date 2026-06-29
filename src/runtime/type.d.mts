import { DECodeLanguage } from "./enums/codeLanguage";

// 컨텐츠 데이터
type DEContentData = DEBlockData[];

// 컨텐츠 타입
type DEBlockData = DETextBlock | DEHeadingBlock | DEListBlock | DEImageBlock | DECodeBlock | DECustomBlock | DEDividerBlock;

// 블록 타입
type DEBlockType = DEBlockData["type"];

// 리스트 엘리먼트 태그 명
type DEListElementName = "ul" | "ol";

// 해딩 테그 레벨
type DEHeadingElementLevel = 1 | 2 | 3;

// 아이콘 종류
type DEIconKind = "plus" | "bold" | "italic" | "underline" | "strikethrough" | "codeblock" | "add-link" | "remove-link" | "image" | "align-center" | "align-left" | "align-right" | "align-justify" | "move-up" | "move-down" | "move-first" | "move-last" | "indent-decrease" | "indent-increase";

// 메뉴용 블럭 추가 타입
type DEBlockMenutype = Exclude<DEBlockType, "heading" | "list" | "image"> | "heading1" | "heading2" | "heading3" | "unordered-list" | "ordered-list";

// 코드블럭 언어 리스트
type DECodeLanguageList = keyof typeof DECodeLanguage;

// 에디터 컴포넌트
interface DragonEditor {
    addBlock(name: DEBlockMenutype, textContent: string = ""): Promise<void>;
}

// 스토어 구조체
interface DragonEditorStore {
    data: DEContentData;
    selectedBlockId: string;
    selectedBlockIndex: number;
    option: DEOption;
    cursorSelection: null | Selection;
    fn: {
        updateEditorData: ((data: DEContentData) => void) | null;
    };
    element: {
        body: null | HTMLDivElement;
    };
}

// 스토어용 에디터 옵션
interface DEOption {
    mediaHostURL: string;
    isMobile: boolean;
    codeBlockSpaces: number;
}

// 컨텐츠 블럭 타입
interface DETextBlock {
    id: string;
    type: "text";
    classList: string[];
    depth?: number;
    textContent: string;
}

// 컨텐츠 해딩 타입
interface DEHeadingBlock {
    id: string;
    type: "heading";
    classList: string[];
    level: DEHeadingElementLevel;
    depth?: number;
    textContent: string;
}

// 컨텐츠 리스트 자식 타입
interface DEListItem {
    id: string;
    classList: string[];
    depth?: number;
    textContent: string;
}

// 컨텐츠 리스트 타입
interface DEListBlock {
    id: string;
    type: "list";
    element: DEListElementName;
    child: DEListItem[];
}

// 컨텐츠 이미지 타입
interface DEImageBlock {
    id: string;
    type: "image";
    classList: string[];
    maxWidth: number;
    src: string;
    width: number;
    height: number;
    caption: string;
}

// 컨텐츠 코드 블럭 타입
interface DECodeBlock {
    id: string;
    type: "code";
    language:DECodeLanguageList;
    filename: string;
    textContent: string;
}

// 컨텐츠 커스텀 타입
interface DECustomBlock {
    id: string;
    type: "custom";
    textContent: string;
}

// 컨텐츠 구분선 타입
interface DEDividerBlock {
    id: string;
    type: "divider";
}

// 멀티라인 포지션
interface DELinePosition {
    curruntLine: number;
    lineCount: number;
}

// 커서 포지션
interface DECurSorPosition {
    isStart: boolean;
    isEnd: boolean;
}

// 커서 오프샛
interface DECursorOffset {
    nodeIndex: number;
    offset: number;
}

/**
 * 레거시
 */

type DEDecoration = "bold" | "italic" | "underline" | "strikethrough" | "code";

type DETextalign = "left" | "right" | "center" | "justify";

type DEBlockMenutype = "text" | "heading1" | "heading2" | "heading3" | "ul" | "ol" | "image" | "code" | "custom" | "divider";

interface DECodeItem<T = string> {
    text: string;
    value: T;
}
