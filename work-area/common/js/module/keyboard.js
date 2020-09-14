const { typeCheckThrow } = require("./default");
const { isTextSelect } = require("./cursor");
const { getTextItemOption } = require("./option");
const { getTextBlockHTML, getListChildHTML, addBlockToContent } = require("./layout");

export function contentEnterKeyEvent($item, $editableItem, shiftKey, e, _0 = typeCheckThrow($item, Node), _1 = typeCheckThrow($editableItem, Node), _2 = typeCheckThrow(shiftKey, "boolean")) {
    if ((shiftKey == false) & (condition.enterCount == 0)) {
        e.preventDefault();

        let type = $item.dataset["type"];

        condition.enterCount += 1;

        if (type == "text") {
            let childNodes = $editableItem.childNodes;
            let childNodesCount = childNodes.length;

            if (isTextSelect() == true) {
            } else {
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

                        // to-do 엔터로 텍스트 분리
                        console.log(afterHTML, beforeHTML);
                        // console.log(getOption);
                    }

                    console.log(lastChildNodeText, condition.baseOffset);
                } else {
                    addBlockToContent(getTextBlockHTML());
                }
            }

            console.log(childNodes, childNodesCount);
        } else if (type == "ol" || type == "ul") {
        } else if (type == "table") {
        } else {
            addBlockToContent(getTextBlockHTML());
        }

        setTimeout(() => {
            condition.enterCount = 0;
        }, 150);
    } else if (condition.enterCount != 0) {
        e.preventDefault();
    }
}
