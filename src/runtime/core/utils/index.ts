import { textBlock, userCustomMenu, allBlock, imageBlock } from "../../../types/index";


function generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 20; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

// 텍스트 블럭 생성
function createTextBlock(): textBlock {
    return {
        type: "text",
        id: generateId(),
        classList: [],
        content: "",
    };
}

// 이미지 블럭 생성
function createImageBlock(data): imageBlock {
    const totalSize = data.width + data.height;
    const w = Math.round((100 / totalSize) * data.width);
    const h = Math.round((100 / totalSize) * data.height);
    const contrast = w - h;
    let classList: string[] = ["d-align-center"];

    switch (true) { // 이미지 비율에 따른 초기 사이즈 조정
        case contrast < -40:
            classList.push("--5");
            break;
        case contrast < -15:
            classList.push("--10");
            break;
        default:
            classList.push("--20");
    }

    return {
        type: "image",
        id: generateId(),
        classList: classList,
        src: data.src,
        width: data.width,
        height: data.height,
        webp: data.webp,
        caption: data.caption,
    };
}

export function createBlock(name: string, value?: object): allBlock {
    let blockData: allBlock;

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
        case "image":
            blockData = createImageBlock(value);
            break;
        default:
            blockData = createTextBlock();
    }

    return blockData;
}


export * from "./keyboard";
export * from "./cursor";
export * from "./style";
export * from "./element";