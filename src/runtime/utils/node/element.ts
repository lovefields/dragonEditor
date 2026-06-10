import { _getBlockType } from "../data";

// 커서가 가능한 블럭 찾기
export function _findFocusableBlock($block: HTMLElement, direction: "up" | "down"): HTMLElement | null {
    const $sibling = (direction === "up" ? $block.previousElementSibling : $block.nextElementSibling) as HTMLElement | null;

    if ($sibling === null) {
        return null;
    } else {
        const type = _getBlockType($sibling);

        if (type !== "custom" && type !== "divider") {
            return $sibling;
        } else {
            return _findFocusableBlock($sibling, direction);
        }
    }
}

// 에디터 가능한 요소 찾기
export function _findEditableElement($block: HTMLElement, direction: "up" | "down"): HTMLElement | null {
    const targetBlockType = _getBlockType($block as HTMLElement);
    let $editableTarget: HTMLElement | null = $block as HTMLElement;

    switch (targetBlockType) {
        case "list":
            const children = $block.querySelectorAll(".de-item");

            if (children.length > 0) {
                $editableTarget = (direction === "up" ? children[children.length - 1] : children[0]) as HTMLElement;
            }
            break;

        case "code":
            if (direction === "up") {
                $editableTarget = $block.querySelector(".de-code-content");
            } else {
                $editableTarget = $block.querySelector(".de-filename");
            }
            break;

        case "image":
            $editableTarget = $block.querySelector(".de-caption") as HTMLElement | null;
            break;

        case "custom":
            const customNerbyElement = _findFocusableBlock($block, direction);

            if (customNerbyElement !== null) {
                $editableTarget = _findEditableElement(customNerbyElement, direction);
            } else {
                $editableTarget = null;
            }
            break;

        case "divider":
            const dividerNerbyElement = _findFocusableBlock($block, direction);

            if (dividerNerbyElement !== null) {
                $editableTarget = _findEditableElement(dividerNerbyElement, direction);
            } else {
                $editableTarget = null;
            }
            break;
    }

    return $editableTarget;
}

// 부모 블럭 찾기
export function _findParentBlock($element: HTMLElement): HTMLElement | null {
    const $parent = $element.parentElement;

    if ($parent !== null) {
        const hasClass = $parent.classList.contains("de-block");

        if (hasClass === true) {
            return $parent;
        } else {
            return _findParentBlock($parent);
        }
    } else {
        return null;
    }
}
