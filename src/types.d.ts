type DEMode = "view" | "edit" | "command";

interface DEditorOption {
    mode?: DEMode;
    blockList?: BlockType[];
    message?: DEMessage;
}

type DEditorData = DEditorBlockType[];

type BlockType = "text" | "orderedList" | "unorderedList" | "heading1" | "heading2" | "heading3" | "ul" | "ol";

interface DEditorBlockDefaultType {
    type: BlockType;
    classList: string[];
}

type DEditorBlockType = DEditorTextBlock | DEditorHeadingBlock;

interface DEditorTextBlock extends DEditorBlockDefaultType {
    content: string;
}

interface DEditorHeadingBlock extends DEditorBlockDefaultType {
    level: number;
    id: string;
    content: string;
}

// 부수적 타입
interface DEditorCursor {
    type: "Range" | "Caret" | "None";
    startNode: Node;
    startOffset: number;
    endNode: Node;
    endOffset: number;
}

interface DEBlockListItem {
    name: string;
    value: BlockType;
}

interface DEArrangeCursorData {
    startNode: Node;
    startNodeIdx: number;
    startOffset: number;
    endNode: Node;
    endNodeIdx: number;
    endOffset: number;
}

// 에디터에서 사용하는 모든 메세지
interface DEMessage {
    linkTextNoStyle: string;
}

// 유저가 넣는 이미지 데이터
interface DEImageData {
    url: string;
    width: number;
    height: number;
}
