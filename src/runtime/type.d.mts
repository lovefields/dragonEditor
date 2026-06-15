import { DECodeLanguage } from "./enums/codeLanguage";
import type { codeToHtml } from "shiki";

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

// 스토어 구조체
interface DragonEditorStore {
    data: DEContentData;
    selectedBlockIndex: number; // TODO : ID로 교체
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
    level: DEHeadingElementLevel;
    depth?: number;
    classList: string[];
    textContent: string;
}

// 컨텐츠 리스트 자식 타입
interface DEListItem {
    id: string;
    depth?: number;
    classList: string[];
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
    maxWidth: number;
    src: string;
    width: number;
    height: number;
    caption: string;
    classList: string[];
}

// 컨텐츠 코드 블럭 타입
interface DECodeBlock {
    id: string;
    type: "code";
    language: keyof typeof DECodeLanguage;
    filename: string;
    textContent: string;
}

// 컨텐츠 커스텀 타입
interface DECustomBlock {
    id: string;
    type: "custom";
    classList: string[];
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

/**
 * 레거시
 */
type DEIconKind = "plus" | "bold" | "italic" | "underline" | "strikethrough" | "codeblock" | "add-link" | "remove-link" | "image" | "align-center" | "align-left" | "align-right" | "align-justify" | "move-up" | "move-down" | "indent-decrease" | "indent-increase";

type DEDecoration = "bold" | "italic" | "underline" | "strikethrough" | "code";

type DETextalign = "left" | "right" | "center" | "justify";

type DEBlock = "text" | "heading" | "ul" | "ol" | "image" | "code" | "divider" | "custom";

type DEBlockMenutype = "text" | "heading1" | "heading2" | "heading3" | "ul" | "ol" | "image" | "code" | "custom" | "divider";

type DECodeblockTheme = "github-light" | "github-dark-dimmed";

// type DECodeblockLang = "text" | "csharp" | "c" | "cpp" | "css" | "django" | "dockerfile" | "go" | "html" | "json" | "java" | "javascript" | "typescript" | "kotlin" | "lua" | "markdown" | "nginx" | "php" | "python" | "ruby" | "scss" | "sql" | "shellscript" | "swift" | "yaml";

type DEBlockElement = HTMLParagraphElement | HTMLHeadingElement | HTMLElement | HTMLDivElement;

interface DECodeItem<T = string> {
    text: string;
    value: T;
}

interface DEHeadingItem {
    name: string;
    id: string;
}

interface DEArrangeCursorData {
    startNode: Node;
    startNodeIdx: number;
    startOffset: number;
    endNode: Node;
    endNodeIdx: number;
    endOffset: number;
}
