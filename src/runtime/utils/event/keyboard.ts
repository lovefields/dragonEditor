import { nextTick } from "#imports";
import { useEditorStore } from "../../store/editor";
import { _updateCursorData } from "./index";
import { _createTextBlockData } from "../data";
import type { DETextBlock, DEHeadingBlock, DEContentData } from "../../type.mjs";

// 내용 짤라서 새로운 텍스트 블럭 생성 (엔터 이벤트)
export async function _sliceAndNewTextBlock(event: KeyboardEvent, data: DETextBlock | DEHeadingBlock, index: number): Promise<void> {
    const editorStore = useEditorStore();

    event.preventDefault();
    _updateCursorData();

    if (editorStore.cursorSelection !== null && editorStore.fn.updateEditorData !== null) {
        const newData = JSON.parse(JSON.stringify(editorStore.data)) as DEContentData;
        const range = editorStore.cursorSelection.getRangeAt(0);
        const cloneRange = range.cloneRange();
        const $target = event.currentTarget as HTMLElement;

        cloneRange.selectNodeContents($target);
        cloneRange.setEnd(range.endContainer, range.endOffset);

        const extractedFragment = cloneRange.extractContents();
        const tempDiv = document.createElement("div");

        tempDiv.appendChild(extractedFragment);

        const beforeHTML = tempDiv.innerHTML;
        const afterHTLM = $target.innerHTML;

        if (beforeHTML === "" && afterHTLM !== "") {
            // 커서 앞이 빈 경우
            newData.splice(index, 0, _createTextBlockData());
            editorStore.fn.updateEditorData(newData);
        } else if ((beforeHTML !== "" && afterHTLM === "") || (beforeHTML === "" && afterHTLM === "")) {
            // 커서 뒤가 빈 경우 && 내용이 빈 경우
            newData.splice(index + 1, 0, _createTextBlockData());
            editorStore.fn.updateEditorData(newData);
            await nextTick();
            $target.innerHTML = beforeHTML;
            $target.dispatchEvent(new Event("input"));
            await nextTick();
            ($target.nextElementSibling as HTMLParagraphElement).focus();
        } else {
            // 중간인 경우
            newData.splice(index, 0, _createTextBlockData(beforeHTML));
            editorStore.fn.updateEditorData(newData);
            await nextTick();
            $target.innerHTML = afterHTLM;
            $target.dispatchEvent(new Event("input"));
        }
    }
}
