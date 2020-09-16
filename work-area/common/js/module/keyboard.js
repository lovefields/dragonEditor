const { typeCheckThrow } = require("./default");
const { isTextSelect, setCursor } = require("./cursor");
const { openOptionPop } = require("./pop");
const { findContenteditable, getChild } = require("./selector");
const { getTextBlockHTML, getListChildHTML, addBlockToContent } = require("./layout");

export function contentEnterKeyEvent($item, $editableItem, shiftKey, e, _0 = typeCheckThrow($item, Node), _1 = typeCheckThrow($editableItem, Node), _2 = typeCheckThrow(shiftKey, "boolean")) {
    if (shiftKey == false && condition.enterCount == 0) {
        e.preventDefault();

        let type = $item.dataset["type"];

        condition.enterCount += 1;

        if (isTextSelect() == true) {
        } else {
            let childNodes = $editableItem.childNodes;
            let childNodesCount = childNodes.length;

            setCursor(condition.baseNode, condition.baseOffset);

            setTimeout(() => {
                if (type == "text") {
                    if (childNodesCount > 0) {
                        let lastChildNode = childNodes[childNodesCount - 1];
                        let lastChildNodeText = lastChildNode.textContent.length;

                        if (condition.baseNode == lastChildNode && condition.baseOffset == lastChildNodeText) {
                            $item.insertAdjacentHTML("afterend", getTextBlockHTML());
                            setCursor($item.nextElementSibling, 0);
                        } else if (condition.baseNode == childNodes[0] && condition.baseOffset == 0) {
                            $item.insertAdjacentHTML("beforebegin", getTextBlockHTML());
                        } else {
                            let value = splitEditableNodeByNoSelect(childNodes, childNodesCount);

                            $item.innerHTML = value.beforeHTML;
                            $item.childNodes[value.childNumber].textContent = value.beforeText;
                            $item.insertAdjacentHTML("afterend", getTextBlockHTML(value.afterHTML));
                            $item.nextElementSibling.childNodes[0].textContent = value.afterText;
                            setCursor($item.nextElementSibling.childNodes[0], 0);
                        }
                    } else {
                        $item.insertAdjacentHTML("afterend", getTextBlockHTML());
                        setCursor($item.nextElementSibling, 0);
                    }
                } else if (type == "ol" || type == "ul") {
                    if (childNodesCount > 0) {
                        let lastChildNode = childNodes[childNodesCount - 1];
                        let lastChildNodeText = lastChildNode.textContent.length;

                        if (condition.baseNode == lastChildNode && condition.baseOffset == lastChildNodeText) {
                            $editableItem.insertAdjacentHTML("afterend", getListChildHTML());
                            setCursor($editableItem.nextElementSibling, 0);
                        } else if (condition.baseNode == childNodes[0] && condition.baseOffset == 0) {
                            $editableItem.insertAdjacentHTML("beforebegin", getListChildHTML());
                        } else {
                            let value = splitEditableNodeByNoSelect(childNodes, childNodesCount);

                            $editableItem.innerHTML = value.beforeHTML;
                            $editableItem.childNodes[value.childNumber].textContent = value.beforeText;
                            $editableItem.insertAdjacentHTML("afterend", getListChildHTML(value.afterHTML));
                            $editableItem.nextElementSibling.childNodes[0].textContent = value.afterText;
                            setCursor($editableItem.nextElementSibling.childNodes[0], 0);
                        }
                    } else {
                        let $liList = getChild($item, `[contenteditable="true"]`);
                        let liCount = $liList.length;

                        if (liCount > 1) {
                            let isLastChild = false;

                            $liList.forEach(($row, index) => {
                                if ($row == $editableItem && index == liCount - 1) {
                                    isLastChild = true;
                                }
                            });

                            if (isLastChild == true) {
                                $editableItem.remove();
                                addBlockToContent(getTextBlockHTML());
                            } else {
                                $editableItem.insertAdjacentHTML("afterend", getListChildHTML());
                                setCursor($editableItem.nextElementSibling, 0);
                            }
                        } else {
                            $editableItem.insertAdjacentHTML("afterend", getListChildHTML());
                            setCursor($editableItem.nextElementSibling, 0);
                        }
                    }
                } else if (type == "table") {
                    let editableItemName = $editableItem.constructor.name;

                    if (editableItemName == "HTMLTableCaptionElement") {
                        let $target = getChild($item, `*[data-x="0"][data-y="0"]`, false);
                        let hasChildNode = $target.childNodes.length > 0 ? true : false;

                        if (hasChildNode == true) {
                            setCursor($target.childNodes[0], 0);
                        } else {
                            setCursor($target, 0);
                        }
                    } else {
                        let x = parseInt($editableItem.dataset["x"]);
                        let y = parseInt($editableItem.dataset["y"]) + 1;
                        let $target = getChild($item, `*[data-x="${x}"][data-y="${y}"]`, false);

                        if ($target != null) {
                            let hasChildNode = $target.childNodes.length > 0 ? true : false;

                            if (hasChildNode == true) {
                                setCursor($target.childNodes[0], 0);
                            } else {
                                setCursor($target, 0);
                            }
                        } else {
                            $item.insertAdjacentHTML("afterend", getTextBlockHTML());
                            setCursor($item.nextElementSibling, 0);
                        }
                    }
                } else {
                    $item.insertAdjacentHTML("afterend", getTextBlockHTML());
                    setCursor($item.nextElementSibling, 0);
                }
            }, 50);
        }

        setTimeout(() => {
            condition.enterCount = 0;
        }, 150);
    } else if (condition.enterCount != 0) {
        e.preventDefault();
    }
}

function splitEditableNodeByNoSelect(childNodes, childNodesCount, _0 = typeCheckThrow(childNodes, NodeList), _1 = typeCheckThrow(childNodesCount, "number")) {
    let childNumber = -1;
    let beforeHTML = "";
    let afterHTML = "";
    let $targetChild, targetChldText, targetChldConstructorName;

    for (let i = 0; i < childNodesCount; i += 1) {
        if (childNodes[i] == condition.baseNode) {
            childNumber = i;
            break;
        }
    }

    if (childNumber < 0) {
        for (let j = 0; j < childNodesCount; j += 1) {
            if (childNodes[j] == condition.baseNode.parentNode) {
                childNumber = j;
                break;
            }
        }
    }

    $targetChild = childNodes[childNumber];
    targetChldConstructorName = $targetChild.constructor.name;
    targetChldText = $targetChild.textContent;

    if (targetChldConstructorName == "Text") {
        afterHTML += $targetChild.textContent;
    } else {
        afterHTML += $targetChild.outerHTML;
    }

    for (let k = 0; k < childNodesCount; k += 1) {
        let constructorName = childNodes[k].constructor.name;

        if (k > childNumber) {
            if (constructorName == "Text") {
                afterHTML += childNodes[k].textContent;
            } else {
                afterHTML += childNodes[k].outerHTML;
            }
        } else if (k < childNumber) {
            if (constructorName == "Text") {
                beforeHTML += childNodes[k].textContent;
            } else {
                beforeHTML += childNodes[k].outerHTML;
            }
        }
    }

    if (targetChldConstructorName == "Text") {
        beforeHTML += $targetChild.textContent;
    } else {
        beforeHTML += $targetChild.outerHTML;
    }

    return {
        beforeHTML: beforeHTML,
        afterHTML: afterHTML,
        beforeText: targetChldText.substring(0, condition.baseOffset),
        afterText: targetChldText.substring(condition.baseOffset, targetChldText.length),
        childNumber: childNumber,
    };
}
