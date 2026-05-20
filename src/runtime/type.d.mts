import { DECodeLanguage } from "./enums/codeLanguage";
import type { codeToHtml } from "shiki";

// 컨텐츠 데이터
type DEContentData = DEBlockData[];

// 컨텐츠 타입
type DEBlockData = DETextBlock | DEHeadingBlock | DEListBlock | DEImageBlock | DECodeBlock | DECustomBlock | DEDividerBlock;

// 리스트 엘리먼트 태그 명
type DEListElementName = "ul" | "ol";

// 스토어 구조체
interface DragonEditorStore {
    option: DEOption;
    selectedBlockIndex: number;
}

// 스토어용 에디터 옵션
interface DEOption {
    mediaHostURL: string;
    isMobile: boolean;
}

// 컨텐츠 블럭 타입
interface DETextBlock {
    type: "text";
    classList: string[];
    depth?: number;
    textContent: string;
}

// 컨텐츠 해딩 타입
interface DEHeadingBlock {
    type: "heading";
    level: 1 | 2 | 3;
    id: string;
    depth?: number;
    classList: string[];
    textContent: string;
}

// 컨텐츠 리스트 자식 타입
interface DEListItem {
    classList: string[];
    textContent: string;
}

// 컨텐츠 리스트 타입
interface DEListBlock {
    type: "list";
    element: DEListElementName;
    depth?: number;
    style: DEListStyle;
    child: DEListItem[];
}

// 컨텐츠 이미지 타입
interface DEImageBlock {
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
    type: "code";
    language: keyof typeof DECodeLanguage;
    filename: string;
    textContent: string;
}

// 컨텐츠 커스텀 타입
interface DECustomBlock {
    type: "custom";
    classList: string[];
    textContent: string;
}

// 컨텐츠 구분선 타입
interface DEDividerBlock {
    type: "divider";
}

/**
 * 레거시
 */
type DEIconKind = "plus" | "bold" | "italic" | "underline" | "strikethrough" | "codeblock" | "add-link" | "remove-link" | "image" | "align-center" | "align-left" | "align-right" | "align-justify" | "move-up" | "move-down" | "indent-decrease" | "indent-increase";

type DEDecoration = "bold" | "italic" | "underline" | "strikethrough" | "code";

type DETextalign = "left" | "right" | "center" | "justify";

type DEBlock = "text" | "heading" | "ul" | "ol" | "image" | "code" | "divider" | "custom";

type DEBlockMenutype = "text" | "heading1" | "heading2" | "heading3" | "ul" | "ol" | "image" | "code" | "custom" | "divider";

type DEListStyle = "disc" | "square" | "decimal" | "lower-alpha" | "upper-alpha" | "lower-roman" | "upper-roman";

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
