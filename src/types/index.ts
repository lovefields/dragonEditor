export interface userCustomMenu {
    name: string;
    icon: string;
    action: Function;
}

export interface editorMenu {
    name: string;
    hasIcon: boolean;
    icon: string;
    action: Function;
}

export interface userStyleMenu {
    name: string;
    icon: string;
    type: string[];
    action: Function;
}

export interface EditorOptions {
    blockMenu?: string[];
    customBlockMenu?: userCustomMenu[];
    customStyleMenu?: userStyleMenu[];
    medaiURL?: string;
}

// data types
export interface ImageCreateData {
    src: string;
    width: number;
    height: number;
    caption?: string;
}

export type AllBlock = TextBlock | ImageBlock | ListBlock | OtherBlock;

export type EditorContentType = AllBlock[];

// Block types
export interface TextBlock {
    type: string;
    key?: string;
    classList: string[];
    content: string;
}

export interface commentBlock {
    classList: string[];
    content: string;
}

export interface ImageBlock {
    key?: string;
    type: string;
    classList: string[];
    src: string;
    width: number;
    height: number;
    caption: string;
}

export interface liItem {
    classList: string[];
    content: string;
}

export interface ListBlock {
    type: string;
    key?: string;
    classList: string[];
    childList: liItem[];
}

export interface OtherBlock {
    type: string;
    key?: string;
    innerHTML: string;
}

// detail type
export interface CursorSelection {
    type: string; // "Caret" | "Range";
    startNode: Node | null;
    startOffset: number | null;
    endNode: Node | null;
    endOffset: number | null;
}

export interface arrangementCursorData {
    editableNode: HTMLElement;
    childCount: number;
    length: number;
}

export interface styleActiveType {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    through: boolean;
    link: boolean;
    code: boolean;
}

export interface styleFunctionArgument {
    type: string;
    url?: string;
}

export interface styleUtilArgument {
    kind: string;
    blockData: AllBlock;
    $target: HTMLElement;
    url?: string;
    cursorData: CursorSelection;
}
