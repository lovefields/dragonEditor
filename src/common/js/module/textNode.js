const { typeCheckThrow } = require("./default");
const { findParentByClass, findContenteditable } = require("./selector");
const { itemStructureValidation } = require("./item");
const { setOptionPopValue } = require("./pop");
const { setCursor } = require("./cursor");

export function getTextNodeStyle($node, _0 = typeCheckThrow($node, "*")) {
    let $item = findParentByClass($node, "djs-item");
    let itemType = $item.dataset["type"];
    let attr = {
        color: "",
        fontsize: "",
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
export function textNodeStyleing(type, value, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "*")) {
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
            styleControlByMerge(type, value);
        }
    } else {
        if (isDifferentNode == false) {
            if (isSelection == false) {
                styleControlByStyleNode($target, type, value);
            } else {
                styleControlByInnerStyleNode($target, type, value);
            }
        } else {
            styleControlByMerge(type, value);
        }
    }

    setOptionPopValue();
}

// 에디터블 아이템 스타일
function styleControlByEditableElement($target, type, value) {
    let isRemove = false;

    if (type == "fontsize" && value == "1") {
        isRemove = true;
    } else if (type == "color" && condition.defaultColor == value) {
        isRemove = true;
    } else if (value == false) {
        isRemove = true;
    }

    if (isRemove == false) {
        $target.dataset[type] = value;
    } else {
        delete $target.dataset[type];
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
function styleControlByStyleNode($target, type, value) {
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
        if (type == "fontsize" && value == "1") {
            delete $target.dataset[type];
            $editableElement.focus();
        } else if (type == "color" && condition.defaultColor == value) {
            delete $target.dataset[type];
            $editableElement.focus();
        } else {
            $target.dataset[type] = value;
            $target.focus();
        }
    }

    itemStructureValidation();
}

// 스타일 노드 내부 스타일 부여 (분리)
function styleControlByInnerStyleNode($target, type, value) {
    const $editableElement = findContenteditable($target);
    let styleValue = getTextNodeStyle($target);
    let typeTag = getTagNameByType(type);
    let tagName = $target.tagName;
    let dataCount = $target.attributes.length;
    let text = $target.textContent;
    let childIdx;

    soltOffset();

    $editableElement.childNodes.forEach((child, index) => {
        if (child == $target) {
            childIdx = index;
        }
    });

    if (condition.baseOffset == 0 && condition.focusOffset == text.length) {
        styleControlByStyleNode($target, type, value);
    } else {
        let firstText = text.substring(0, condition.baseOffset);
        let middleText = text.substring(condition.baseOffset, condition.focusOffset);
        let lastText = text.substring(condition.focusOffset, text.length);
        let tag = tagName.toLowerCase();

        if (value == false) {
            if (dataCount == 0) {
                firstText = getWrappingNode(type, firstText, value);
                lastText = getWrappingNode(type, lastText, value);

                $target.insertAdjacentHTML("afterend", `${firstText}${middleText}${lastText}`);
                $target.remove();
                setCursor($editableElement.childNodes[childIdx + 1], $editableElement.childNodes[childIdx + 1].textContent.length);
            } else {
                let option = "";
                let html = "";
                styleValue[type] = "";

                for (let [key, value] of Object.entries(styleValue)) {
                    if (value !== "") {
                        option += ` data-${key}="${value}"`;
                    }
                }

                if (tagName == typeTag) {
                    html += `<${tag}${option}>${firstText}</${tag}><span${option}>${middleText}</span><${tag}${option}>${lastText}</${tag}>`;
                } else {
                    html += `<${tag}${option}>${firstText}</${tag}><${tag}${option}>${middleText}</${tag}><${tag}${option}>${lastText}</${tag}>`;
                }

                $target.insertAdjacentHTML("afterend", html);
                $target.remove();
                setCursor($editableElement.childNodes[childIdx + 1], 1);
            }
        } else {
            if (dataCount == 0) {
                $target.insertAdjacentHTML("afterend", `<${tag}>${firstText}</${tag}><${tag}>${middleText}</${tag}><${tag}>${lastText}</${tag}>`);
                $target.remove();
                $editableElement.childNodes[childIdx + 1].dataset[type] = value;
                setCursor($editableElement.childNodes[childIdx + 1], 1);
            } else {
                let preOption = "";
                let nextOption = "";
                let html = "";

                for (let [key, value] of Object.entries(styleValue)) {
                    if (value !== "") {
                        preOption += ` data-${key}="${value}"`;
                    }
                }

                styleValue[type] = value;

                for (let [key, value] of Object.entries(styleValue)) {
                    if (value !== "") {
                        nextOption += ` data-${key}="${value}"`;
                    }
                }

                html += `<${tag}${preOption}>${firstText}</${tag}><${tag}${nextOption}>${middleText}</${tag}><${tag}${preOption}>${lastText}</${tag}>`;
                $target.insertAdjacentHTML("afterend", html);
                $target.remove();
                setCursor($editableElement.childNodes[childIdx + 1], 1);
            }
        }
    }
}

// 서로 다른 노드 상태에서 스타일 부여 (합병)
function styleControlByMerge(type, value) {
    const $editableElement = findContenteditable(condition.baseNode);
    let baseIdx, focusIdx;
    let baseNode = condition.baseNode;
    let focusNode = condition.focusNode;
    let baseText = baseNode.textContent;
    let focusText = focusNode.textContent;
    let text = "";
    let junk = [];

    if (baseNode.parentNode !== $editableElement) {
        baseNode = baseNode.parentNode;
    }

    if (focusNode.parentNode !== $editableElement) {
        focusNode = focusNode.parentNode;
    }

    $editableElement.childNodes.forEach((child, index) => {
        if (child == baseNode) {
            baseIdx = index;
        } else if (focusNode == child) {
            focusIdx = index;
        }
    });

    if (baseIdx > focusIdx) {
        let node01 = baseNode;
        let node02 = focusNode;
        let idx01 = baseIdx;
        let idx02 = focusIdx;
        let offset01 = condition.baseOffset;
        let offset02 = condition.focusOffset;

        baseNode = node02;
        focusNode = node01;
        baseIdx = idx02;
        focusIdx = idx01;
        condition.baseOffset = offset02;
        condition.focusOffset = offset01;
    }

    text += baseText.substring(condition.baseOffset, baseText.length);
    $editableElement.childNodes.forEach((child, index) => {
        if (index > baseIdx && index < focusIdx) {
            junk.push(child);
            text += child.textContent;
        }
    });
    text += focusText.substring(0, condition.focusOffset);

    if (focusNode.constructor.name !== "Text") {
        junk.forEach((item) => {
            item.remove();
        });

        baseNode.textContent = baseText.substring(0, condition.baseOffset);
        focusNode.textContent = focusText.substring(condition.focusOffset, focusText.length);
    }

    if (baseNode.constructor.name == "Text") {
        if (focusNode.constructor.name == "Text") {
            let html = "";

            $editableElement.childNodes.forEach((child, index) => {
                if (index < baseIdx) {
                    if (child.constructor.name == "Text") {
                        html += child.textContent;
                    } else {
                        html += child.outerHTML;
                    }
                } else if (index == baseIdx) {
                    html += baseText.substring(0, condition.baseOffset);
                    html += getWrappingNode(type, text, value);
                } else if (index == focusIdx) {
                    html += focusText.substring(condition.focusOffset, focusText.length);
                } else if (index > focusIdx) {
                    if (child.constructor.name == "Text") {
                        html += child.textContent;
                    } else {
                        html += child.outerHTML;
                    }
                }
            });

            junk.forEach((item) => {
                item.remove();
            });

            $editableElement.innerHTML = html;
            setCursor($editableElement.childNodes[baseIdx + 1], 1);
        } else {
            focusNode.insertAdjacentHTML("beforebegin", getWrappingNode(type, text, value));
            setCursor(baseNode.nextElementSibling, 1);
        }
    } else {
        baseNode.insertAdjacentHTML("afterend", getWrappingNode(type, text, value));
        setCursor(baseNode.nextElementSibling, 1);
    }
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
