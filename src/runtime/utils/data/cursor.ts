import { useEditorStore } from "../../store/editor";
import type { DELinePosition, DECurSorPosition, DECursorOffset } from "../../type.mjs";

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

        if (position.curruntLine < 1) {
            position.curruntLine = 1;
        }

        if (position.lineCount < 1) {
            position.lineCount = 1;
        }
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

        data.beforeHTML = tempDivBefore.innerHTML;
        data.afterHTML = tempDivAfter.innerHTML === "<br>" ? "" : tempDivAfter.innerHTML;
    }

    return data;
}

// 현재 커서 위치
export function _isCursorAtLineBoundary(): DECurSorPosition {
    const editorStore = useEditorStore();
    const result = { isStart: false, isEnd: false };

    if (editorStore.cursorSelection !== null) {
        if (editorStore.cursorSelection.rangeCount === 0) {
            return result;
        }

        const originalRange = editorStore.cursorSelection.getRangeAt(0).cloneRange();

        try {
            let currentRect = originalRange.getBoundingClientRect();
            if (currentRect.height === 0) {
                const rects = originalRange.getClientRects();
                if (rects.length > 0) {
                    currentRect = rects[0]!;
                }
            }
            const currentTop = currentRect.top;

            // 1. 가장 앞(Start) 여부 확인
            editorStore.cursorSelection.modify("move", "left", "character");
            let leftRect = editorStore.cursorSelection.getRangeAt(0).getBoundingClientRect();
            if (leftRect.height === 0) {
                const rects = editorStore.cursorSelection.getRangeAt(0).getClientRects();
                if (rects.length > 0) {
                    leftRect = rects[0]!;
                }
            }

            if (leftRect.top < currentTop - 5 || (leftRect.top === currentTop && leftRect.left === currentRect.left)) {
                result.isStart = true;
            }

            // Selection 복구
            editorStore.cursorSelection.removeAllRanges();
            editorStore.cursorSelection.addRange(originalRange);

            // 2. 가장 뒤(End) 여부 확인
            editorStore.cursorSelection.modify("move", "right", "character");
            let rightRect = editorStore.cursorSelection.getRangeAt(0).getBoundingClientRect();
            if (rightRect.height === 0) {
                const rects = editorStore.cursorSelection.getRangeAt(0).getClientRects();
                if (rects.length > 0) {
                    rightRect = rects[0]!;
                }
            }

            if (rightRect.top > currentTop + 5 || (rightRect.top === currentTop && rightRect.left === currentRect.left)) {
                result.isEnd = true;
            }
        } catch (e) {
            console.error("[Dragon Editor]: Failed to check cursor line boundary", e);
        } finally {
            editorStore.cursorSelection.removeAllRanges();
            editorStore.cursorSelection.addRange(originalRange);
        }
    }

    return result;
}

// 에디팅 영역의 마지막커서 위치 반환
export function _getEditorbleEndPosition($element: HTMLElement): DECursorOffset {
    const data = { nodeIndex: 0, offset: 0 };
    const lastIndex = $element.childNodes.length - 1;
    const $lastChild = $element.childNodes[lastIndex];

    if ($lastChild !== undefined) {
        data.nodeIndex = lastIndex;
        data.offset = $lastChild.textContent?.length ?? 0;
    }

    return data;
}

// 에디팅 영역의 현재 커서 위치 반환
export function _getEditorbleCursorPosition($element: HTMLElement): DECursorOffset {
    const editorStore = useEditorStore();
    const data = { nodeIndex: 0, offset: 0 };

    if (editorStore.cursorSelection !== null && editorStore.cursorSelection.rangeCount > 0) {
        const range = editorStore.cursorSelection.getRangeAt(0);
        let container = range.startContainer;

        // startContainer가 $element 자체인 경우
        if (container === $element) {
            data.nodeIndex = range.startOffset;
            data.offset = 0;
        } else {
            // startContainer가 $element의 하위 노드인 경우, 직계 자식이 될 때까지 부모를 타고 올라감
            while (container.parentNode !== null && container.parentNode !== $element) {
                container = container.parentNode;
            }

            if (container.parentNode === $element) {
                data.nodeIndex = Array.prototype.indexOf.call($element.childNodes, container);
                data.offset = range.startOffset;
            }
        }
    }

    return data;
}
