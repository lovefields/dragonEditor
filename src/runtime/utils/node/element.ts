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