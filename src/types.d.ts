type DEMode = "view" | "edit";

interface DEditorOption {
    mode?: DEMode;
    data?: DEditorData;
    blockList?: BlockType[];
}

type DEditorData = DEditorBlockType[];

type BlockType = "text" | "numberList" | "dotList" | "heading1" | "heading2" | "heading3" | "heading4" | "heading5" | "heading6" | "table";

interface DEditorBlockDefaultType {
    type: BlockType;
    classList: string[];
}

type DEditorBlockType = DEditorTextBlock;

interface DEditorTextBlock extends DEditorBlockDefaultType {}

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
