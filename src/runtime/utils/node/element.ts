// 스크롤 가능한 요소 찾기
export function _findScrollingElement($target: HTMLElement): HTMLElement | Window {
    const $wrap = $target.parentElement;

    if ($wrap !== null) {
        const style = window.getComputedStyle($wrap);

        if (style.overflow !== "visible") {
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

// transform 스타일을 가진 요소 찾기
export function _findTransformElement($target: HTMLElement): HTMLElement | null {
    const $wrap = $target.parentElement;

    if ($wrap !== null) {
        const style = window.getComputedStyle($wrap);

        if (style.transform !== "none") {
            return $wrap;
        } else {
            if ($wrap.tagName === "BODY") {
                return null;
            } else {
                return _findTransformElement($wrap);
            }
        }
    } else {
        return null;
    }
}

// 타겟이 텍스트 인경우 상위 엘리먼트 추출
export function _getParentElementIfNodeIsText($target: Node, $block: HTMLElement): Node {
    if ($target.constructor.name === "Text") {
        const $parent = $target.parentElement as HTMLElement;

        if ($parent !== $block) {
            $target = $parent;
        }
    }

    return $target as Node;
}

// 에디팅 요소 찾기
export function _findContentEditableElement($target: Node): HTMLElement | null {
    if ($target.constructor.name === "Text") {
        $target = $target.parentNode as Node;
    }

    const $baseElement = $target as HTMLElement;

    if ($baseElement.parentElement === null) {
        return null;
    } else {
        if (($baseElement.parentElement as HTMLElement).tagName === "BODY") {
            return null;
        } else {
            if ($baseElement.getAttribute("contentEditable") === null) {
                return _findContentEditableElement($baseElement.parentNode as Node);
            } else {
                return $baseElement;
            }
        }
    }
}

// 이전 텍스트 노드 찾기
export function _findPoverTextNode(node: Element, idx: number) {
    if (node.previousSibling !== null) {
        if (node.previousSibling.constructor.name === "Text") {
            return _findPoverTextNode(node.previousSibling as Element, (idx -= 1));
        } else {
            return idx;
        }
    } else {
        return idx;
    }
}
