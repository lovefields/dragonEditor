const { typeCheckThrow } = require("./default");
const { openOptionPop } = require("./pop");
const { contentEnterKeyEvent } = require("./keyboard");
const { getTextItemOption, setTextItemOption } = require("./option");
const { setCursor } = require("./cursor");
const { findParentByClass, findContenteditable, getChild } = require("./selector");

export function itemClickEvent(e, _0 = typeCheckThrow(e, Event)) {
    let $target = e.target;
    let $item = findParentByClass($target, "djs-item");
    let $editableItem = findContenteditable($target);

    if ($item !== null || $editableItem !== null) {
        condition.activeItem = $item;
        condition.activeElement = $editableItem;

        openOptionPop();
    }
}

export function getItemType($item, $editableItem) {
    let typeArr = ["all"];
    let itemType = $item.dataset["type"];

    if ($editableItem !== null) {
        let selection = window.getSelection();
        condition.focusNode = selection.focusNode;
        condition.baseNode = selection.baseNode;
        condition.focusOffset = selection.focusOffset;
        condition.baseOffset = selection.baseOffset;

        switch ($editableItem.constructor.name) {
            case "HTMLLIElement":
                typeArr.push("li");
                break;

            case "HTMLTableCellElement":
                if ($editableItem.tagName == "TD") {
                    typeArr.push("td");
                } else if ($editableItem.tagName == "TH") {
                    typeArr.push("th");
                }
                break;
        }

        if (condition.focusNode == condition.baseNode && condition.focusOffset !== condition.baseOffset) {
            let nodeName = condition.baseNode.constructor.name;

            if ((nodeName = "HTMLAnchorElement")) {
                typeArr.push("link");
            }

            typeArr.push("word");
        }
    }

    typeArr.push(itemType);

    return typeArr;
}

export function itemKeyboardEvent(e, _0 = typeCheckThrow(e, Event)) {
    let $item = findParentByClass(e.target, "djs-item");
    let $editableItem = findContenteditable(e.target);
    let selection = window.getSelection();
    let code = e.code;

    condition.focusNode = selection.focusNode;
    condition.baseNode = selection.baseNode;
    condition.focusOffset = selection.focusOffset;
    condition.baseOffset = selection.baseOffset;

    switch (code) {
        case "Enter":
            contentEnterKeyEvent($item, $editableItem, e.shiftKey, e);
            break;
        case "":
            break;
    }

    // console.log(e);
}

export function wrappingNode(type, value = "", _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "string")) {
    let $target = condition.baseNode;
    let $editableItem = findContenteditable($target);
    let childNodes = $editableItem.childNodes;
    let text = $target.textContent;
    let beforeText = text.substring(0, condition.baseOffset);
    let middleText = text.substring(condition.baseOffset, condition.focusOffset);
    let afterText = text.substring(condition.focusOffset, text.length);
    let childHtml = beforeText;
    let targetIndex = -1;
    let html = "";

    childHtml += getWrappingNode(type, value, middleText);
    childHtml += afterText;

    childNodes.forEach((node, index) => {
        if (node == $target) {
            targetIndex = index;
        }
    });

    childNodes.forEach((node, index) => {
        if (index == targetIndex) {
            html += childHtml;
        } else {
            let name = node.constructor.name;

            if (name == "Text") {
                html += node.textContent;
            } else {
                html += node.outerHTML;
            }
        }
    });

    $editableItem.innerHTML = html;
    setCursor($editableItem.childNodes[targetIndex + 1], 1);
}

export function brokenNode(type, value = "", _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "string")) {
    let $target = condition.baseNode;
    let text = $target.textContent;
    let beforeText = text.substring(0, condition.baseOffset);
    let middleText = text.substring(condition.baseOffset, condition.focusOffset);
    let afterText = text.substring(condition.focusOffset, text.length);
    let $parentNode = $target.parentNode;
    let html = "";
    let styleValue = getTextItemOption($parentNode);

    if ((text.length == condition.focusOffset && condition.baseOffset == 0) || value == styleValue[type]) {
        let style = {};

        style[type] = value;

        setTextItemOption($parentNode, style);
    } else {
        html += `<span>${beforeText}</span>`;
        html += getWrappingNode(type, value, middleText);
        html += `<span>${afterText}</span>`;

        $parentNode.insertAdjacentHTML("afterend", html);
        setTextItemOption($parentNode.nextElementSibling, styleValue);
        setTextItemOption($parentNode.nextElementSibling.nextElementSibling.nextElementSibling, styleValue);
        setCursor($parentNode.nextElementSibling.nextElementSibling, 1);
        $parentNode.remove();
    }
    itemStructureValidation();
}

export function margeNode(type, value = "", _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "string")) {
    let $editableItem = findContenteditable(condition.baseNode);
    let $childNode = $editableItem.childNodes;
    let baseNode = condition.baseNode;
    let focusNode = condition.focusNode;
    let middleText = "";
    let html = "";
    let baseIndex, focusIndex, baseText, focusText;

    if (baseNode.parentNode != $editableItem) {
        baseNode = baseNode.parentNode;
    }

    if (focusNode.parentNode != $editableItem) {
        focusNode = focusNode.parentNode;
    }

    baseText = baseNode.textContent;
    focusText = focusNode.textContent;

    $childNode.forEach(($child, index) => {
        if ($child == baseNode) {
            baseIndex = index;
        } else if ($child == focusNode) {
            focusIndex = index;
        }
    });

    middleText += baseText.substring(condition.baseOffset, baseText.length);
    $childNode.forEach(($child, index) => {
        if (index > baseIndex && index < focusIndex) {
            middleText += $child.textContent;
        }
    });
    middleText += focusText.substring(0, condition.focusOffset);

    $childNode.forEach(($child, index) => {
        if (index < baseIndex) {
            let name = $child.constructor.name;

            if (name == "Text") {
                html += $child.textContent;
            } else {
                html += $child.outerHTML;
            }
        }
    });

    if (baseNode.constructor.name == "Text") {
        html += baseText.substring(0, condition.baseOffset);
    } else {
        baseNode.textContent = baseText.substring(0, condition.baseOffset);
        html += baseNode.outerHTML;
    }

    html += getWrappingNode(type, value, middleText);

    if (focusNode.constructor.name == "Text") {
        html += focusText.substring(condition.focusOffset, focusText.length);
    } else {
        focusNode.textContent = focusText.substring(condition.focusOffset, focusText.length);
        html += focusNode.outerHTML;
    }


    $childNode.forEach(($child, index) => {
        if (index > focusIndex) {
            let name = $child.constructor.name;

            if (name == "Text") {
                html += $child.textContent;
            } else {
                html += $child.outerHTML;
            }
        }
    });

    $editableItem.innerHTML = html;
    setCursor($editableItem.childNodes[baseIndex + 1], 1);
}

function getWrappingNode(type, value, text, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "string"), _2 = typeCheckThrow(text, "string")) {
    let html;

    switch (type) {
        case "fontSize":
            html = `<span data-font-size="${value}">${text}</span>`;
            break;
        case "":
            break;
    }

    return html;
}

export function itemStructureValidation() {
    let wrongTagList = ["font", "center", "div"];
    let $itemList = getChild(condition.areaContent, `[contenteditable="true"]`);

    $itemList.forEach(($item) => {
        let itemType = findParentByClass($item, "djs-item").dataset["type"];
        let $nodeList = $item.childNodes;

        if (itemType != "codeblock") {
            $nodeList.forEach(($node) => {
                let isTag = $node.constructor.name == "Text" ? false : true;

                if (isTag == true) {
                    let $childNode = $node.childNodes;
                    let tagName = $node.tagName.toLowerCase();
                    let hasData = Object.keys($node.dataset) == 0 ? false : true;
                    let hasText = $node.textContent == "" ? false : true;

                    $node.removeAttribute("style");

                    if (hasText == false) {
                        $node.remove();
                    } else {
                        if (hasData == false || wrongTagList.indexOf(tagName) > -1) {
                            $node.outerHTML = $node.textContent;
                        } else {
                            $childNode.forEach(($child) => {
                                let type = $child.constructor.name;

                                if (type != "Text") {
                                    $child.outerHTML = $child.innerText;
                                }
                            });
                        }
                    }
                }
            });
        }
    });
}
