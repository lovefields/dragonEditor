const { typeCheckThrow } = require("./default");

export function getElement(className, multiple = true, _0 = typeCheckThrow(className, "string"), _1 = typeCheckThrow(multiple, "boolean")) {
    if (multiple == true) {
        return document.querySelectorAll(className);
    } else {
        return document.querySelector(className);
    }
}

export function getChild(parent, className, multiple = true, _0 = typeCheckThrow(parent, Node), _1 = typeCheckThrow(className, "string"), _2 = typeCheckThrow(multiple, "boolean")) {
    if (multiple == true) {
        return parent.querySelectorAll(className);
    } else {
        return parent.querySelector(className);
    }
}

function isDocumentHasElement(className, _0 = typeCheckThrow(className, "string")) {
    let $node = document.querySelector(className);
    return $node === null ? false : true;
}

export function checkElement(className = "", defaultName, multiple = true, _0 = typeCheckThrow(className, "string"), _1 = typeCheckThrow(defaultName, "string"), _2 = typeCheckThrow(multiple, "boolean")) {
    let $dumy = className == "" ? false : isDocumentHasElement(className);

    return $dumy == false ? getElement(defaultName, multiple) : getElement(className, multiple);
}

export function findParentByClass($node, className, _0 = typeCheckThrow($node, Node), _1 = typeCheckThrow(className, "string")) {
    if ($node.constructor.name !== "HTMLBodyElement" && $node.constructor.name !== "HTMLHtmlElement") {
        let check = $node.classList.contains(className);

        if (check === true) {
            return $node;
        } else {
            return findParentByClass($node.parentElement, className);
        }
    } else {
        return null;
    }
}

export function getActiveElement() {
    let childCount = editorCondition.areaContent.childElementCount;
    let childList = getElement(".djs-content > *");

    if (editorCondition.activeItem == undefined) {
        return childList[childCount - 1];
    } else {
        return editorCondition.activeItem;
    }
}

/*
export function findContenteditable(node) {
    let constructorName = node.constructor.name;
    let target;

    if (constructorName !== "HTMLBodyElement") {
        if (constructorName === "Text") {
            target = node.parentElement;
        } else {
            target = node;
        }

        let hasAttr = target.getAttribute("contenteditable");
        if (hasAttr === "true") {
            return target;
        } else {
            return this.findContenteditable(target.parentElement);
        }
    } else {
        return false;
    }
}
*/
