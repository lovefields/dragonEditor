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

export function findContentEditableElement($target: Node): HTMLElement {
    if ($target.constructor.name === "Text") {
        $target = $target.parentNode;
    }

    const $baseElement = $target as HTMLElement;

    if ($baseElement.isContentEditable === false) {
        return findContentEditableElement($baseElement.parentNode);
    } else {
        return $baseElement;
    }
}
