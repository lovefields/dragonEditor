const { typeCheckThrow } = require("./default");
const { getElement, getChild, findParentByClass, findContenteditable } = require("./selector");
const { itemStructureValidation } = require("./item");
const { setOptionPopValue } = require("./pop");
const { setCursor } = require("./cursor");

export function getTextNodeStyle($node, _0 = typeCheckThrow($node, "*")) {
    let $item = findParentByClass($node, "djs-item");
    let itemType = $item.dataset["type"];
    let attr = {
        color: "",
        fontSize: "",
        align: "",
        bold: "",
        italic: "",
        underline: "",
        strikethrough: "",
        wordblock: "",
    };

    if ($node.constructor.name == "Text") {
        $node = $node.parentNode;
    }

    if ($node.dataset != undefined) {
        for (const [key] of Object.entries(attr)) {
            attr[key] = $node.dataset[key] == undefined ? "" : $node.dataset[key];
        }
    }

    switch ($node.tagName) {
        case "B":
            attr.bold = "true";
            break;
        case "I":
            attr.italic = "true";
            break;
        case "U":
            attr.underline = "true";
            break;
        case "DEL":
            attr.strikethrough = "true";
            break;
        case "CODE":
            if (itemType != "codeblock") {
                attr.wordblock = "true";
            }
            break;
    }

    return attr;
}

// 텍스트 스타일 컨트롤
export function textNodeStyleing(type, value, $btn, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "*"), _2 = typeCheckThrow($btn, "node")) {
    const $item = findParentByClass(condition.baseNode, "djs-item");
    const $editableElement = findContenteditable(condition.baseNode);
    let isDifferentNode = false;
    let isSelection = false;
    let constructorName = condition.baseNode.constructor.name;
    let $target;

    if (constructorName == "Text") {
        $target = condition.baseNode.parentNode;
    } else {
        $target = condition.baseNode;
    }

    if (condition.baseNode !== condition.focusNode) {
        isDifferentNode = true;
    }

    if (condition.baseOffset !== condition.focusOffset) {
        isSelection = true;
    }

    if ($target == $editableElement) {
        if (isDifferentNode == false) {
            if (isSelection == false) {
                styleControlByEditableElement($target, type, value);
            } else {
                styleControlByWrapping($target, type, value);
            }
        } else {
            console.log("merge node01");
        }
    } else {
        if (isDifferentNode == false) {
            if (isSelection == false) {
                styleControllByStyleNode($target, type, value);
            } else {
                console.log("style node beak");
            }
        } else {
            console.log("merge node02");
        }
    }

    setOptionPopValue();
}

// 에디터블 아이템 스타일
function styleControlByEditableElement($target, type, value) {
    let isRemove = false;

    if (type == "fontSize" && value == "1") {
        isRemove = true;
    } else if (type == "color" && condition.defaultColor == value) {
        isRemove = true;
    } else if (value == false) {
        isRemove = true;
    }

    if (isRemove == false) {
        $target.dataset[type] = value;
    } else {
        $target.dataset[type] = "";
    }
}

// 텍스트 스타일 랩핑
function styleControlByWrapping($target, type, value) {
    let childCount = $target.childNodes.length;
    let text = condition.baseNode.textContent;

    soltOffset();

    if (childCount == 1) {
        if (text.length == condition.focusOffset && condition.baseOffset == 0) {
            styleControlByEditableElement($target, type, value);
        } else {
            let firstText = text.substring(0, condition.baseOffset);
            let middleText = text.substring(condition.baseOffset, condition.focusOffset);
            let lastText = text.substring(condition.focusOffset, text.length);
            let wrppingText = getWrappingNode(type, middleText, value);

            $target.innerHTML = `${firstText}${wrppingText}${lastText}`;

            if (condition.baseOffset == 0) {
                condition.baseNode = $target.childNodes[0];
                setCursor($target.childNodes[0], 1);
            } else {
                condition.baseNode = $target.childNodes[1];
                setCursor($target.childNodes[1], 1);
            }
        }
    } else if (childCount > 1) {
        let firstText = text.substring(0, condition.baseOffset);
        let middleText = text.substring(condition.baseOffset, condition.focusOffset);
        let lastText = text.substring(condition.focusOffset, text.length);
        let wrppingText = getWrappingNode(type, middleText, value);
        let childNodes = $target.childNodes;
        let html = "";
        let childIdx;

        for (let i = 0; i < childCount; i += 1) {
            if (childNodes[i] == condition.baseNode) {
                childIdx = i;
                break;
            }
        }

        for (let i = 0; i < childCount; i += 1) {
            if (childIdx == i) {
                html += `${firstText}${wrppingText}${lastText}`;
            } else {
                if (childNodes[i].constructor.name == "Text") {
                    html += childNodes[i].textContent;
                } else {
                    html += childNodes[i].outerHTML;
                }
            }
        }

        $target.innerHTML = html;

        if (condition.baseOffset == 0) {
            condition.baseNode = $target.childNodes[childIdx];
            setCursor($target.childNodes[childIdx], 1);
        } else {
            condition.baseNode = $target.childNodes[childIdx + 1];
            setCursor($target.childNodes[childIdx + 1], 1);
        }
    }
}

// 스타일 노드 컨트롤
function styleControllByStyleNode($target, type, value) {
    const $editableElement = findContenteditable($target);
    let styleValue = getTextNodeStyle($target);
    let typeTag = getTagNameByType(type);
    let tagName = $target.tagName;
    let dataCount = $target.attributes.length;
    let text = $target.textContent;

    if (value == false) {
        if (dataCount == 0) {
            $target.insertAdjacentText("afterend", text);
            $target.remove();
            $editableElement.innerHTML = $editableElement.innerHTML;
            setCursor($editableElement, 1);
        } else {
            if (tagName == typeTag) {
                $target.insertAdjacentHTML("afterend", `<span>${text}</span>`);
                styleValue[type] = "";

                for (let [key, value] of Object.entries(styleValue)) {
                    if (value !== "") {
                        $target.nextElementSibling.dataset[key] = value;
                    }
                }

                setCursor($target.nextElementSibling, 1);
                $target.remove();
            } else {
                delete $target.dataset[type];
                $editableElement.focus();
            }
        }
    } else {
        $target.dataset[type] = value;
        $target.focus();
    }

    itemStructureValidation();
}

function getTagNameByType(type) {
    let name;

    switch (type) {
        case "bold":
            name = "B";
            break;
        case "italic":
            name = "I";
            break;
        case "underline":
            name = "U";
            break;
        case "strikethrough":
            name = "DEL";
            break;
        case "wordblock":
            name = "CODE";
            break;
    }

    return name;
}

function soltOffset() {
    if (condition.baseOffset > condition.focusOffset) {
        let baseOffset = condition.baseOffset;
        let focusOffset = condition.focusOffset;

        condition.baseOffset = focusOffset;
        condition.focusOffset = baseOffset;
    }
}

function getWrappingNode(type, text, value, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(text, "string"), _2 = typeCheckThrow(value, "*")) {
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
