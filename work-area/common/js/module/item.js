const { typeCheckThrow, classControl } = require("./default");
const { openOptionPop } = require("./pop");
const { contentEnterKeyEvent, contentTabKeyEvent } = require("./keyboard");
const { getTextItemOption, setTextItemOption } = require("./option");
const { setCursor, isTextSelect } = require("./cursor");
const { findParentByClass, findContenteditable, getChild } = require("./selector");
const { message } = require("./message");

export function itemClickEvent(e, _0 = typeCheckThrow(e, Event)) {
    let $target = e.target;
    let $item = findParentByClass($target, "djs-item");
    let $editableItem = findContenteditable($target);

    if ($item !== null || $editableItem !== null) {
        condition.activeItem = $item;
        condition.activeElement = $editableItem;
        condition.baseNode = $target;

        openOptionPop();
    }
}

export function getItemType($item, $editableItem) {
    let typeArr = ["all"];
    let itemType = $item.dataset["type"];

    if ($editableItem !== null) {
        let selection = window.getSelection();

        if (selection.baseNode != null || selection.anchorNode != null) {
            let $node;

            condition.focusNode = selection.focusNode;
            condition.focusOffset = selection.focusOffset;
            condition.baseNode = selection.baseNode == undefined ? selection.anchorNode : selection.baseNode;
            condition.baseOffset = selection.baseOffset == undefined ? selection.anchorOffset : selection.baseOffset;

            if (condition.baseNode.constructor.name == "Text") {
                $node = condition.baseNode.parentNode;
            } else {
                $node = condition.baseNode;
            }

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

            classControl(condition.btnWordLink, "remove", "--act");
            classControl(condition.btnWordBlock, "remove", "--act");

            switch ($node.tagName) {
                case "A":
                    typeArr.push("link");
                    classControl(condition.btnWordLink, "add", "--act");
                    break;
                case "CODE":
                    if (itemType != "codeblock") {
                        typeArr.push("wordblock");
                        classControl(condition.btnWordBlock, "add", "--act");
                    }
                    break;
            }

            if (isTextSelect() == true) {
                let nodeName = condition.baseNode.constructor.name;

                if (itemType != "codeblock") {
                    if ((nodeName = "HTMLAnchorElement")) {
                        typeArr.push("link");
                    }

                    typeArr.push("word");
                }
            }
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
        case "Tab":
            contentTabKeyEvent($item, $editableItem, e.shiftKey, e);
            // to-do Tab key event
            break;
        case "Backspace":
            // to-do Backspage key event
            break;
    }
}

export function wrappingNode(type, value, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "string")) {
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

export function brokenNode(type, value, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "string")) {
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

export function margeNode(type, value, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "string")) {
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
    if ($editableItem.childNodes[baseIndex + 1] == undefined) {
        setCursor($editableItem.childNodes[0], 1);
    } else {
        setCursor($editableItem.childNodes[baseIndex + 1], 1);
    }
}

function getWrappingNode(type, value, text, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "string"), _2 = typeCheckThrow(text, "string")) {
    let html;

    switch (type) {
        case "fontSize":
            html = `<span data-font-size="${value}">${text}</span>`;
            break;
        case "color":
            html = `<span data-color="${value}">${text}</span>`;
            break;
        case "bold":
            html = `<b>${text}</b>`;
            break;
        case "italic":
            html = `<i>${text}</i>`;
            break;
        case "underline":
            html = `<u>${text}</u>`;
            break;
        case "strikethrough":
            html = `<del>${text}</del>`;
            break;
        case "wordblock":
            html = `<code>${text}</code>`;
            break;
        case "link":
            html = `<a href="${value}" rel="nofollow">${text}</a>`;
            break;
    }

    return html;
}

export function nodeEffect(type, value = "true", _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "string")) {
    if (condition.baseNode == condition.focusNode) {
        let $editable = findContenteditable(condition.baseNode);
        let $parentNode = condition.baseNode.parentNode;

        if ($editable == $parentNode) {
            if (condition.baseOffset == 0 && $parentNode.textContent.length == condition.focusOffset) {
                $parentNode.dataset[type] = value;
            } else {
                wrappingNode(type, value);
            }
        } else {
            let $parentParentNode = $parentNode.parentNode;

            if ($editable == $parentParentNode) {
                brokenNode(type, value);
            } else {
                itemStructureValidation();
                alert(message.wrongItemStructure);
            }
        }
    } else {
        margeNode(type, value);
    }
}

export function removeNodeEffect(type, tagName, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(tagName, "string")) {
    let $editable = findContenteditable(condition.baseNode);
    let $parentNode = condition.baseNode.parentNode;

    if ($editable == $parentNode) {
        $editable.dataset[type] = "";
    } else {
        textStylingNode(type, tagName, true);
    }
    console.log(condition.baseNode);
}

export function textStylingNode(type, tagName, isAct, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(tagName, "string"), _2 = typeCheckThrow(isAct, "boolean")) {
    let constructorName = condition.baseNode.constructor.name;
    let $target;

    if (constructorName == "Text") {
        $target = condition.baseNode.parentNode;
    } else {
        $target = condition.baseNode;
    }

    let name = $target.tagName;

    if (name == tagName) {
        let hasData = Object.keys($target.dataset) == 0 ? false : true;

        if (hasData == true) {
            let option = getTextItemOption($target);
            option[type] = "";

            $target.insertAdjacentHTML("afterend", `<span>${$target.textContent}</span>`);
            setTextItemOption($target.nextElementSibling, option);
            $target.nextElementSibling.focus();
            $target.remove();
        } else {
            $target.outerHTML = $target.textContent;
            $target.focus();
        }
    } else {
        if (isAct == true) {
            $target.removeAttribute(`data-${type}`);
        } else {
            $target.setAttribute(`data-${type}`, "true");
        }

        $target.focus();
    }
}

export function changeTableCell(type, _0 = typeCheckThrow(type, "string")) {
    let $editableItem = findContenteditable(condition.baseNode);
    let html = $editableItem.innerHTML;

    $editableItem.insertAdjacentHTML("afterend", `<${type} contenteditable="true">${html}</${type}>`);
    setCursor($editableItem.nextElementSibling, 0);
    condition.activeElement = $editableItem.nextElementSibling;
    $editableItem.remove();
    openOptionPop();
}

export function itemMove(type, _0 = typeCheckThrow(type, "string")) {
    let $item = findParentByClass(condition.baseNode, "djs-item");
    let $target, html;

    if ($item != null) {
        if (type == "up") {
            $target = $item.previousElementSibling;
        } else if (type == "down") {
            $target = $item.nextElementSibling;
        }

        if ($target != null) {
            html = $target.outerHTML;

            if (type == "up") {
                $item.insertAdjacentHTML("afterend", html);
            } else if (type == "down") {
                $item.insertAdjacentHTML("beforebegin", html);
            }

            $target.remove();
        }

        openOptionPop();
        $item.focus();
    } else {
        alert(message.missingSelect);
    }
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
                        if (hasData == false) {
                            if (wrongTagList.indexOf(tagName) > -1) {
                                $node.outerHTML = $node.textContent;
                            } else if (tagName == "span") {
                                $node.outerHTML = $node.textContent;
                            }
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
