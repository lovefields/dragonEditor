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