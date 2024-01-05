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
