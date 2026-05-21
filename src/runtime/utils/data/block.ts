import { _generateId } from "../data";
import type { DETextBlock, DEHeadingBlock } from "../../type.mjs";

// 텍스트 블럭 데이터 생성
export function _createTextBlockData(textContent: string = ""): DETextBlock {
    return {
        id: _generateId(),
        type: "text",
        classList: [],
        textContent: textContent,
    };
}
