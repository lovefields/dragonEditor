const { typeCheckThrow, classControl } = require("./default");
const { isTextSelect, setCursor } = require("./cursor");
const { getChild, findContenteditable } = require("./selector");
const { getTextBlockHTML, getListChildHTML, addBlockToContent } = require("./layout");

export function contentEnterKeyEvent($item, $editableItem, shiftKey, e, _0 = typeCheckThrow($item, "node"), _1 = typeCheckThrow($editableItem, "node"), _2 = typeCheckThrow(shiftKey, "boolean")) {
    if (shiftKey == false && condition.enterCount == 0) {
        e.preventDefault();

        let type = $item.dataset["type"];

        condition.enterCount += 1;

        if (isTextSelect() == true) {
            // to-do : select enter
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
                            console.log(childNodes, childNodesCount);
                            let value = splitEditableNodeByNoSelect(childNodes, childNodesCount);

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
                        } else if (condition.baseNode == findContenteditable(childNodes[0]) && condition.baseOffset == 0) {
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

export function contentTabKeyEvent($item, $editableItem, shiftKey, e, _0 = typeCheckThrow($item, "node"), _1 = typeCheckThrow($editableItem, "node"), _2 = typeCheckThrow(shiftKey, "boolean")) {
    e.preventDefault();
    setCursor(condition.baseNode, condition.baseOffset);

    setTimeout(() => {
        let type = $item.dataset["type"];
        let depth = parseInt($editableItem.dataset["depth"] == undefined ? 0 : $editableItem.dataset["depth"]);

        if (shiftKey == true) {
            if (depth > 0) {
                depth -= 1;
            }
        } else {
            if (depth < 3) {
                depth += 1;
            }
        }

        if (type == "text" || type == "ol" || type == "ul") {
            if (depth == 0) {
                $editableItem.removeAttribute("data-depth");
            } else {
                $editableItem.dataset["depth"] = depth;
            }
        } else if (type == "table") {
            let editableItemName = $editableItem.constructor.name;

            if (editableItemName == "HTMLTableCellElement") {
                let x = parseInt($editableItem.dataset["x"]);
                let y = parseInt($editableItem.dataset["y"]);

                if (shiftKey == true) {
                    x -= 1;
                } else {
                    x += 1;
                }

                let $target = getChild($item, `*[data-x="${x}"][data-y="${y}"]`, false);

                if ($target != null) {
                    let hasChildNode = $target.childNodes.length > 0 ? true : false;

                    if (hasChildNode == true) {
                        setCursor($target.childNodes[0], 0);
                    } else {
                        setCursor($target, 0);
                    }
                }
            }
        }
    }, 150);
}

export function contentBackspaceKeyEvent($item, $editableItem, e, _0 = typeCheckThrow($item, "node"), _1 = typeCheckThrow($editableItem, "node")) {
    let type = $item.dataset["type"];
    let itemCount = condition.areaContent.childElementCount;
    let hasPrevEl = $item.previousElementSibling == null ? false : true;
    let hasText = $editableItem.textContent.length > 0 ? true : false;
    let $preEl = $item.previousElementSibling;

    if (isTextSelect() == true) {
        // to-do : select backspace
    } else {
        if (condition.baseOffset == 0) {
            e.preventDefault();

            if (hasPrevEl == true) {
                let preElType = $preEl.dataset["type"];
                let preElHasText = $preEl.textContent.length > 0 ? true : false;
                let position = preElHasText == true ? 1 : 0;

                if (type == "text") {
                    if (hasText == true) {
                        if (preElType == "text") {
                            if (preElHasText == true) {
                                let $preChilds = $preEl.childNodes;
                                let preChildCount = $preChilds.length;
                                let text = $preEl.innerHTML + $item.innerHTML;
                                position = $preChilds[preChildCount - 1].textContent.length;

                                $preEl.innerHTML = text;
                                $item.remove();
                                setCursor($preEl.childNodes[preChildCount - 1], position);
                            } else {
                                $preEl.remove();
                            }
                        } else {
                            $preEl.remove();
                        }
                    } else {
                        $item.remove();

                        if (preElType == "text") {
                            let $preElChild = $preEl.childNodes;
                            let preElChildLength = $preElChild.length;
                            let $target;

                            if (preElChildLength > 0) {
                                // 이전 아이템에 자식이 있을경우
                                $target = $preElChild[preElChildLength - 1];
                                position = $target.length;
                            } else {
                                $target = $preEl;
                                position = 0;
                            }

                            setCursor($target, position);
                        } else {
                            let $preEditableChild = getChild($preEl, `*[contenteditable="true"]`);
                            let count = $preEditableChild.length;
                            let preEditableHasText = $preEditableChild[count - 1].textContent.length > 0 ? true : false;

                            position = preEditableHasText == true ? 1 : 0;

                            setCursor($preEditableChild[count - 1], position);
                        }
                    }
                } else if (type == "ol" || type == "ul") {
                    let text = $editableItem.innerHTML;
                    let childCount = getChild($item, `*[contenteditable="true"]`).length;
                    let $preEditable = $editableItem.previousElementSibling;
                    let hasPreEditable = $preEditable == null ? false : true;

                    if (childCount > 1) {
                        // 리스트가 여러개일 경우
                        if (hasPreEditable == true) {
                            // 이전 에디팅 요소가 있을경우
                            let $preChilds = $preEditable.childNodes;
                            let preChildCount = $preChilds.length;
                            let $target;

                            if (hasText == false) {
                                if (preChildCount > 0) {
                                    $target = $preChilds[preChildCount - 1];
                                    position = $target.length;
                                } else {
                                    $target = $preEditable;
                                    position = 0;
                                }
                            } else {
                                if (preChildCount > 0) {
                                    let html = $preEditable.innerHTML + text;
                                    position = $preChilds[preChildCount - 1].textContent.length;
                                    $preEditable.innerHTML = html;
                                    $target = $preEditable.childNodes[preChildCount - 1];
                                } else {
                                    $preEditable.innerHTML = text;
                                    $target = $preEditable;
                                    position = 0;
                                }
                            }

                            $editableItem.remove();
                            setCursor($target, position);
                            condition.activeItem = $preEditable;
                            condition.baseNode = $target;
                        } else {
                            $item.insertAdjacentHTML("beforebegin", getTextBlockHTML(text));
                            setCursor($item.previousElementSibling, 0);
                            $item.remove();
                        }
                    } else {
                        $item.insertAdjacentHTML("afterend", getTextBlockHTML(text));
                        setCursor($item.nextElementSibling, 0);
                        $item.remove();
                    }
                }
            } else {
                if (hasText == false) {
                    $item.remove();
                    classControl(condition.popOption, "remove", "--act");
                    condition.activeItem = condition.wrap;

                    if (itemCount == 1) {
                        condition.areaContent.insertAdjacentHTML("beforeend", getTextBlockHTML());
                    }
                }
            }
        }
    }
}

// 브라우저 단축키 내부 로직으로 변경
export function blockHotKey(e) {
    let $target = null;
    let isCtrlKey = e.ctrlKey || e.metaKey;
    let event = document.createEvent("HTMLEvents");
    event.initEvent("click", true, false);

    if (isCtrlKey == true) {
        switch (e.keyCode) {
            case 73:
                e.preventDefault();
                $target = condition.btnToggleItalic;
                break;
            case 66:
                e.preventDefault();
                $target = condition.btnToggleBold;
                break;
        }

        if ($target !== null) {
            $target.dispatchEvent(event);
        }
    }
}

function splitEditableNodeByNoSelect(childNodes, childNodesCount, _0 = typeCheckThrow(childNodes, "nodelist"), _1 = typeCheckThrow(childNodesCount, "number")) {
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
