import {textBlock, userCustomMenu, editorMenu} from "../../types/index";


function generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 20; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

export function createTextBlock(): textBlock {
    return {
        type: "text",
        id: generateId(),
        classList: [],
        content: "",
    };
}

export function createBlock(name: string) {
    switch (name) {
        // case "ol":
        //     // return createTextBlock();
        //     break;
        // case "ul":
        //     // return createTextBlock();
        //     break;
        // case "table":
        //     // return createTextBlock();
        //     break;
        // case "quotation":
        //     // return createTextBlock();
        //     break;
        default:
            return createTextBlock();
    }
}


export * from "./keyboard";
export * from "./cursor";
export * from "./style";