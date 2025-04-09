// 스크롤 가능한 요소 찾기
export function _findScrollingElement($target: HTMLElement): HTMLElement | Window {
    if ($target.parentElement !== null) {
        if ($target.scrollHeight > $target.clientHeight) {
            return $target;
        } else {
            if ($target.parentElement.tagName === "BODY") {
                return window;
            } else {
                return _findScrollingElement($target.parentElement);
            }
        }
    } else {
        return window;
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