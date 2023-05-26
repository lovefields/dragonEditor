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
    type: "Caret" | "Range";
    startNode: HTMLElement | TextNode | null;
    startOffset: number | null;
    endNode: HTMLElement | TextNode | null;
    endOffset: number | null;
}

export interface arrangementCursorData {
    editableNode: HTMLElement;
    childCount: number;
    length: number;
}
