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

export interface editorOptions {
    blockMenu?: string[];
    customBlockMenu?: userCustomMenu[];
    customStyleMenu?: userStyleMenu[];
    medaiURL?: string;
}

export type allBlock = TextBlock | ImageBlock | ListBlock | OtherBlock;

export type EditorContentType = allBlock[];

// Block types
export interface TextBlock {
    type: string;
    classList: string[];
    content: string;
}

export interface commentBlock {
    classList: string[];
    content: string;
}

export interface ImageBlock {
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
    classList: string[];
    childList: liItem[];
}

export interface OtherBlock {
    type: string;
    innerHTML: string;
}

// detail type
export interface cursorSelection {
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
    blockData: allBlock;
    $target: HTMLElement;
    url?: string;
    cursorData: cursorSelection;
}
