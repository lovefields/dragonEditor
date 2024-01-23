// 스크롤 가능한 요소 찾기
export function findScrollingElement($target: HTMLElement): HTMLElement | Window {
    if ($target.scrollHeight > $target.clientHeight) {
        return $target;
    } else {
        if ($target.parentElement.tagName === "BODY") {
            return window;
        } else {
            return findScrollingElement($target.parentElement);
        }
    }
}

// 에디팅 요소 찾기
export function findContentEditableElement($target: Node): HTMLElement | null {
    if ($target.constructor.name === "Text") {
        $target = $target.parentNode;
    }

    const $baseElement = $target as HTMLElement;

    if ($baseElement.parentElement.tagName === "BODY") {
        return null;
    } else {
        if ($baseElement.getAttribute("contentEditable") === null) {
            return findContentEditableElement($baseElement.parentNode);
        } else {
            return $baseElement;
        }
    }
}

// 타겟이 텍스트 인경우 상위 엘리먼트 추출
export function getParentElementIfNodeIsText($target: Node): HTMLElement {
    if ($target.constructor.name === "Text") {
        $target = $target.parentElement;
    }

    return $target as HTMLElement;
}
