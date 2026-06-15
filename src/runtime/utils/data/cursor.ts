import { useEditorStore } from "../../store/editor";
import type { DELinePosition } from "../../type.mjs";

// 현재 멀티라인 줄 위치
export function _getMultilinePosition(element: HTMLElement): DELinePosition {
    const editorStore = useEditorStore();
    let position: DELinePosition = { curruntLine: 1, lineCount: 1 };

    if (editorStore.cursorSelection !== null && editorStore.cursorSelection.rangeCount !== 0) {
        const range = editorStore.cursorSelection.getRangeAt(0);
        const elemRect = element.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(element);
        const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
        const elemTop = elemRect.top + paddingTop;
        const elementHeight = Math.floor(elemRect.height - paddingTop - paddingBottom);
        let rect = range.getBoundingClientRect();
        let lineHeight = parseInt(computedStyle.lineHeight);

        if (rect.height === 0) {
            const rects = range.getClientRects();

            if (rects.length > 0) {
                rect = rects[0]!;
            }
        }

        if (isNaN(lineHeight) == true) {
            lineHeight = parseFloat(computedStyle.fontSize) * 1.2;
        }

        position.curruntLine = Math.floor((rect.top - paddingTop - elemTop) / lineHeight) + 1;
        position.lineCount = Math.floor(elementHeight / lineHeight);
    }

    return position;
}

// 커서기준 앞뒤 HTML 추출
export function _getBeforeAndAfterHTMLOfCursor($target: HTMLElement): { beforeHTML: string; afterHTML: string } {
    const editorStore = useEditorStore();
    const data: { beforeHTML: string; afterHTML: string } = { beforeHTML: "", afterHTML: "" };

    if (editorStore.cursorSelection !== null) {
        const range = editorStore.cursorSelection.getRangeAt(0);
        const cloneRangeBefore = range.cloneRange();
        const cloneRangeAfter = range.cloneRange();

        cloneRangeBefore.selectNodeContents($target);
        cloneRangeBefore.setEnd(range.endContainer, range.endOffset);
        cloneRangeAfter.selectNodeContents($target);
        cloneRangeAfter.setStart(range.endContainer, range.endOffset);

        const fragmentBefore = cloneRangeBefore.cloneContents();
        const tempDivBefore = document.createElement("div");
        const fragmentAfter = cloneRangeAfter.cloneContents();
        const tempDivAfter = document.createElement("div");

        tempDivBefore.appendChild(fragmentBefore);
        tempDivAfter.appendChild(fragmentAfter);

        // // 하위 중첩 리스트 엘리먼트 제거
        // const subListsBefore = tempDivBefore.querySelectorAll(".de-list-sub");
        // subListsBefore.forEach(sub => sub.remove());
        // const subListsAfter = tempDivAfter.querySelectorAll(".de-list-sub");
        // subListsAfter.forEach(sub => sub.remove());

        data.beforeHTML = tempDivBefore.innerHTML;
        data.afterHTML = tempDivAfter.innerHTML === "<br>" ? "" : tempDivAfter.innerHTML;
    }

    return data;
}
