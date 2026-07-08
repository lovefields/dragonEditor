import { _isStrictlyEqualArrays } from "./index";

export function _arrangementNodeList(list: Node[], cursorStartNode: Node | null, cursorStartNodeOffset: number, cursorEndNode: Node | null, cursorEndNodeOffset: number): { list: Node[]; cursorStartNode: Node | null; cursorStartNodeOffset: number; cursorEndNode: Node | null; cursorEndNodeOffset: number } {
    const arrangementNodeList: Node[] = [];

    list.forEach((node) => {
        if (arrangementNodeList.length === 0) {
            arrangementNodeList.push(node);
        } else {
            if (node !== undefined && node !== null && node.textContent !== "") {
                const prevNode = arrangementNodeList[arrangementNodeList.length - 1]!;

                if (prevNode.nodeType === Node.TEXT_NODE && node.nodeType === Node.TEXT_NODE) {
                    if (prevNode.textContent !== null && node.textContent !== null) {
                        if (cursorStartNode === node) {
                            cursorStartNode = prevNode;
                            cursorStartNodeOffset += prevNode.textContent.length;
                        }

                        if (cursorEndNode === node) {
                            cursorEndNode = prevNode;
                            cursorEndNodeOffset += prevNode.textContent.length;
                        }

                        prevNode.textContent += node.textContent;
                    }
                } else if (prevNode.nodeType === Node.ELEMENT_NODE && node.nodeType === Node.ELEMENT_NODE) {
                    const $prevNode = prevNode as HTMLElement;
                    const $node = node as HTMLElement;

                    if ($prevNode.tagName === "A" && $node.tagName === "A") {
                        if (($prevNode as HTMLAnchorElement).href === ($node as HTMLAnchorElement).href) {
                            if (cursorStartNode !== null && cursorStartNode.parentElement === $node) {
                                cursorStartNode = $prevNode;
                                cursorStartNodeOffset += $prevNode.textContent.length;
                            }

                            if (cursorEndNode !== null && cursorEndNode.parentElement === $node) {
                                cursorEndNode = $prevNode;
                                cursorEndNodeOffset += $prevNode.textContent.length;
                            }

                            $prevNode.textContent += $node.textContent;
                        } else {
                            arrangementNodeList.push(node);
                        }
                    } else {
                        if (_isStrictlyEqualArrays(Array.from($prevNode.classList), Array.from($node.classList)) === true) {
                            if (cursorStartNode !== null && cursorStartNode.parentElement === $node) {
                                cursorStartNode = $prevNode;
                                cursorStartNodeOffset += $prevNode.textContent.length;
                            }

                            if (cursorEndNode !== null && cursorEndNode.parentElement === $node) {
                                cursorEndNode = $prevNode;
                                cursorEndNodeOffset += $prevNode.textContent.length;
                            }

                            $prevNode.textContent += $node.textContent;
                        } else {
                            arrangementNodeList.push(node);
                        }
                    }
                } else {
                    arrangementNodeList.push(node);
                }
            }
        }
    });

    return {
        list: arrangementNodeList,
        cursorStartNode: cursorStartNode,
        cursorStartNodeOffset: cursorStartNodeOffset,
        cursorEndNode: cursorEndNode,
        cursorEndNodeOffset: cursorEndNodeOffset,
    };
}

// 히든 스타일 가진 요소 찾기
export function _findHiddenStyleElement($target: HTMLElement): HTMLElement | null {
    const $wrap = $target.parentElement;

    if ($wrap !== null) {
        const style = window.getComputedStyle($wrap);

        if (style.overflow === "hidden") {
            return $wrap;
        } else {
            if ($wrap.tagName === "HTML") {
                return null;
            } else {
                return _findHiddenStyleElement($wrap);
            }
        }
    } else {
        return null;
    }
}

// 스크롤 가능한 요소 찾기
export function _findScrollingElement($target: HTMLElement): HTMLElement | Window {
    const $wrap = $target.parentElement;

    if ($wrap !== null) {
        const style = window.getComputedStyle($wrap);

        if (style.overflow !== "visible" && style.overflow !== "hidden") {
            return $wrap;
        } else {
            if ($wrap.tagName === "BODY") {
                return window;
            } else {
                return _findScrollingElement($wrap);
            }
        }
    } else {
        return window;
    }
}