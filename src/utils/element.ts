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
