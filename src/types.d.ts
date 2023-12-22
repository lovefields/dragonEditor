type DEMode = "view" | "edit";

interface DEditorOption {
    mode?: DEMode;
    data?: DEditorData;
}

type DEditorData = DEditorBlockType[];

interface DEditorBlockDefaultType {
    type: "text" | "numberList" | "dotList" | "heading" | "table";
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
