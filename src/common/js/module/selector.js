const { typeCheckThrow } = require("./default");

export function getElement(className, multiple = true, _0 = typeCheckThrow(className, "string"), _1 = typeCheckThrow(multiple, "boolean")) {
    if (multiple == true) {
        return document.querySelectorAll(className);
    } else {
        return document.querySelector(className);
    }
}

export function getChild(parent, className, multiple = true, _0 = typeCheckThrow(parent, "node"), _1 = typeCheckThrow(className, "string"), _2 = typeCheckThrow(multiple, "boolean")) {
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

export function findParentByClass($node, className, _0 = typeCheckThrow($node, "node"), _1 = typeCheckThrow(className, "string")) {
    if ($node.constructor.name !== "HTMLBodyElement" && $node.constructor.name !== "HTMLHtmlElement") {
        if ($node.constructor.name == "Text") {
            $node = $node.parentNode;
        }

        let check = $node.classList.contains(className);

        if (check === true) {
            return $node;
        } else {
            if ($node.parentElement == null) {
                return null;
            } else {
                return findParentByClass($node.parentElement, className);
            }
        }
    } else {
        return null;
    }
}

export function getActiveElement() {
    let childCount = condition.areaContent.childElementCount;
    let childList = getElement(".djs-content > *");

    if (condition.activeItem == undefined) {
        return childList[childCount - 1];
    } else {
        if (condition.activeItem.classList.contains("djs-item") == true) {
            return condition.activeItem;
        } else {
            return childList[childCount - 1];
        }
    }
}

export function findContenteditable($node, _0 = typeCheckThrow($node, "*")) {
    let constructorName = $node.constructor.name;
    let $target;

    if (constructorName !== "HTMLBodyElement") {
        if (constructorName === "Text") {
            $target = $node.parentElement;
        } else {
            $target = $node;
        }

        let hasAttr = $target.getAttribute("contenteditable");

        if (hasAttr == "true") {
            return $target;
        } else {
            return findContenteditable($target.parentElement);
        }
    } else {
        return null;
    }
}
