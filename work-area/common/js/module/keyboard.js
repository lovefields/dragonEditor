const { typeCheckThrow } = require("./default");
const { isTextSelect, setCursor } = require("./cursor");
const { getTextItemOption } = require("./option");
const { getTextBlockHTML, getListChildHTML, addBlockToContent } = require("./layout");

export function contentEnterKeyEvent($item, $editableItem, shiftKey, e, _0 = typeCheckThrow($item, Node), _1 = typeCheckThrow($editableItem, Node), _2 = typeCheckThrow(shiftKey, "boolean")) {
    if (shiftKey == false && condition.enterCount == 0) {
        e.preventDefault();

        let type = $item.dataset["type"];

        condition.enterCount += 1;

        if (isTextSelect() == true) {
        } else {
            setCursor(condition.baseNode, condition.baseOffset);

            if (type == "text") {
                let childNodes = $editableItem.childNodes;
                let childNodesCount = childNodes.length;

                setTimeout(() => {
                    if (childNodesCount > 0) {
                        let lastChildNode = childNodes[childNodesCount - 1];
                        let lastChildNodeText = lastChildNode.textContent.length;

                        if (condition.baseNode == lastChildNode && condition.baseOffset == lastChildNodeText) {
                            addBlockToContent(getTextBlockHTML());
                        } else if (condition.baseNode == childNodes[0] && condition.baseOffset == 0) {
                            $item.insertAdjacentHTML("beforebegin", getTextBlockHTML());
                        } else {
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

                            $item.insertAdjacentHTML("afterend", getTextBlockHTML(afterHTML));
                            $targetChild.textContent = targetChldText.substring(0, condition.baseOffset);
                            $item.nextElementSibling.childNodes[0].textContent = targetChldText.substring(condition.baseOffset, targetChldText.length);
                            setCursor($item.nextElementSibling.childNodes[0], 0);
                        }
                    } else {
                        addBlockToContent(getTextBlockHTML());
                    }
                }, 50);
            } else if (type == "ol" || type == "ul") {
            } else if (type == "table") {
            } else {
                addBlockToContent(getTextBlockHTML());
            }
        }

        setTimeout(() => {
            condition.enterCount = 0;
        }, 150);
    } else if (condition.enterCount != 0) {
        e.preventDefault();
    }
}
