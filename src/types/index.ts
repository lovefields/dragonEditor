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
    type: string;
    startNode: HTMLElement | TextNode | null;
    startOffset: number | null;
    endNode: HTMLElement | TextNode | null;
    endOffset: number | null;
}
