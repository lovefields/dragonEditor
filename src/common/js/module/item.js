const { typeCheckThrow, classControl } = require("./default");
const { openOptionPop } = require("./pop");
const { contentEnterKeyEvent, contentTabKeyEvent, contentBackspaceKeyEvent, blockHotKey } = require("./keyboard");
const { setCursor, isTextSelect } = require("./cursor");
const { findParentByClass, findContenteditable, getChild, getElement } = require("./selector");
const { hasBaseNode, setSelection } = require("./selection");
const { getTextBlockHTML } = require("./layout");
const { message } = require("./message");

export function itemClickEvent(e, _0 = typeCheckThrow(e, "event")) {
    let $target = e.target;
    let $item = findParentByClass($target, "djs-item");
    let $editableItem = findContenteditable($target);

    if ($item !== null || $editableItem !== null) {
        let $selectedItem = getElement(".--djs-selected");

        if ($selectedItem.length > 0) {
            classControl($selectedItem, "remove", "--djs-selected");
        }
        classControl($item, "add", "--djs-selected");

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
        if (hasBaseNode() == true) {
            let $node;

            setSelection();

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

// content area keyboard event
export function itemKeyboardEvent(e, _0 = typeCheckThrow(e, "event")) {
    let $item = findParentByClass(e.target, "djs-item");
    let $editableItem = findContenteditable(e.target);
    let code = e.keyCode;

    setSelection();

    switch (code) {
        case 13:
            contentEnterKeyEvent($item, $editableItem, e.shiftKey, e);
            break;
        case 9:
            contentTabKeyEvent($item, $editableItem, e.shiftKey, e);
            break;
        case 8:
            contentBackspaceKeyEvent($item, $editableItem, e);
            break;
        default:
            blockHotKey(e);
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

// 에디터 내부 구조 교정
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
                        if (tagName != "br") {
                            $node.remove();
                        }
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

    if ($itemList.length == 0) {
        condition.areaContent.insertAdjacentHTML("beforeend", getTextBlockHTML());
    }
}
