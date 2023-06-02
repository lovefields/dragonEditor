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
}

export type allBlock = (textBlock | commentBlock);

export type editorContentType = allBlock[];

// Block types
export interface textBlock {
    type: string,
    id: string,
    classList: string[],
    content: string,
}

export interface commentBlock {
    type: string;
    classList: string[],
    content: string,
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
    kind: string,
    blockData: allBlock,
    $target: HTMLElement,
    url?: string,
    cursorData: cursorSelection
}
