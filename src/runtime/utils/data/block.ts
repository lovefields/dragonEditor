import { _generateId } from "../data";
import type { DETextBlock, DEHeadingBlock, DEHeadingElementLevel } from "../../type.mjs";

// 텍스트 블럭 데이터 생성
export function _createTextBlockData(textContent: string = ""): DETextBlock {
    return {
        id: _generateId(),
        type: "text",
        classList: [],
        textContent: textContent,
    };
}

// 해딩 블럭 생성
export function _createHeadingBlockData(level: DEHeadingElementLevel, textContent: string = ""): DEHeadingBlock {
    return {
        id: _generateId(),
        type: "heading",
        level: level,
        classList: [],
        textContent: textContent,
    };
}
