export function findEditableElement(node: Node): (HTMLElement | null) {
    if (node) {
        if (node.constructor.name === "Text") {
            return findEditableElement(node.parentNode as HTMLElement);
        } else {
            if ((node as HTMLElement).getAttribute) {

                const hasAttr = (node as HTMLElement).getAttribute("contenteditable") !== null;

                if (hasAttr) {
                    return node as HTMLElement;
                } else {
                    return findEditableElement(node.parentNode as HTMLElement);
                }
            } else {
                return null
            }
        }
    } else {
        return null;
    }
}

export function findChildNumber(parent: HTMLElement, child: Node) {
    let idx = 0;

    parent.childNodes.forEach((item, count) => {
        if (item === child) {
            idx = count;
        }
    });

    return idx;
}