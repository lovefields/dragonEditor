export function findEditableElement(node: Node): HTMLElement {
    if (node.constructor.name === "Text") {
        return findEditableElement(node.parentNode as HTMLElement);
    } else {
        const hasAttr = (node as HTMLElement).getAttribute("contenteditable") !== null;

        if (hasAttr) {
            return node as HTMLElement;
        } else {
            return findEditableElement(node.parentNode as HTMLElement);
        }
    }
}