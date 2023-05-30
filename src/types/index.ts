export interface userBlockMenu {
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

export interface editorOptions {
    blockMenu?: string[];
    customBlockMenu?: userBlockMenu[];

}

export type allBlock = (textBlock);

export type editorContentType = (textBlock)[];

// Block types
export interface textBlock {
    type: string,
    id: string,
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
}
