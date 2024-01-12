type DEMode = "view" | "edit";

interface DEditorOption {
    mode?: DEMode;
    data?: DEditorData;
    blockList?: BlockType[];
}

type DEditorData = DEditorBlockType[];

type BlockType = "text" | "orderedList" | "unorderedList" | "heading1" | "heading2" | "heading3" | "table";

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
    type: "Range" | "Caret";
    startNode: Node;
    startOffset: number;
    endNode: Node;
    endOffset: number;
}

interface BlockListItem {
    name: string;
    value: BlockType;
}
