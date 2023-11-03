import type { TextBlock, AllBlock, ImageBlock, ListBlock, ImageCreateData } from "../../../types/index";
import { generateId } from "./key";

// 텍스트 블럭 생성
export function createTextBlock(data?: { classList: []; content: string }): TextBlock {
    if (data !== undefined) {
        return {
            type: "text",
            key: generateId(),
            classList: data.classList,
            content: data.content,
        };
    } else {
        return {
            type: "text",
            key: generateId(),
            classList: [],
            content: "",
        };
    }
}

// 이미지 블럭 생성
export function createImageBlock(data: ImageCreateData): ImageBlock {
    const totalSize = data.width + data.height;
    const w = Math.round((100 / totalSize) * data.width);
    const h = Math.round((100 / totalSize) * data.height);
    const contrast = w - h;
    let classList: string[] = ["d-align-center"];

    switch (
        true // 이미지 비율에 따른 초기 사이즈 조정
    ) {
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
        classList: classList,
        key: generateId(),
        src: data.src,
        width: data.width,
        height: data.height,
        caption: data.caption ?? "",
    };
}

// 리스트 블럭 생성
function createListBlock(type: string = "ul"): ListBlock {
    return {
        type: type,
        classList: [],
        childList: [
            {
                classList: [],
                content: "",
            },
        ],
    };
}

// // 블럭 생성 함수
// export function createBlock(name: string, value?: object): AllBlock {
//     let blockData: AllBlock;

//     switch (name) {
//         case "ul":
//             blockData = createListBlock();
//             break;
//         case "ol":
//             blockData = createListBlock("ol");
//             break;
//         case "image":
//             blockData = createImageBlock(value);
//             break;
//         default:
//             // @ts-ignore | 값의 유동성에 의해 너무 많은 타입을 가지고 있음.
//             blockData = createTextBlock(value);
//     }

//     return blockData;
// }
