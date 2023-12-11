import "../../types/global.d.ts";
import { generateId } from "./key";

export function createTextBlock(textContent?: string): DEditorDataType {
    let blockData: DEditorDataType = {
        type: "text",
        key: generateId(),
        classList: [],
        textContent: "",
    };

    if (textContent !== undefined) {
        blockData.textContent = textContent;
    }

    return blockData;
}
