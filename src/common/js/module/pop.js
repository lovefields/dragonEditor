const { typeCheckThrow, classControl, isMobile, hasValueArrToArr } = require("./default");
const { getElement, getChild, findParentByClass, findContenteditable } = require("./selector");
const { getTextItemOption } = require("./option");
const { getItemType, itemStructureValidation } = require("./item");

export function openPop(type, $node, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow($node, Node)) {
    let offset = $node.getBoundingClientRect();

    switch (type) {
        case "linkboxBlock":
            openLinkPop("linkbox", offset);
            break;
        case "emoticonBlock":
            openEmoticonPop(offset);
            break;
        case "youtubeBlock":
            openLinkPop("youtube", offset);
            break;
        case "codepenBlock":
            openLinkPop("codepen", offset);
            break;
    }
}

function openEmoticonPop(offset, _0 = typeCheckThrow(offset, "object")) {
    let popOffset = condition.popEmoticon.getBoundingClientRect();
    let right = condition.windowWidth - offset.right + (offset.width + 10);
    let top = offset.top;

    if (isMobile() == true) {
        let maxRight = condition.windowWidth - popOffset.width;

        top = offset.top + offset.height;

        if (right > maxRight) {
            right = maxRight;
        }
    }

    condition.popEmoticon.style.top = `${top}px`;
    condition.popEmoticon.style.right = `${right}px`;
    closePopIgnore(condition.popEmoticon);
    classControl(condition.popEmoticon, "toggle", "--act");
}

export function openLinkPop(type, offset = {}, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(offset, "object")) {
    let popOffset = condition.popLinkbox.getBoundingClientRect();
    let $input = getChild(condition.popLinkbox, ".djs-input", false);
    let $btn = getChild(condition.popLinkbox, ".djs-btn", false);
    let $aTag = getChild(condition.popLinkbox, ".djs-link", false);
    let right = condition.windowWidth - offset.right + (offset.width + 10);
    let top = offset.top;

    if (isMobile() == true) {
        let maxRight = condition.windowWidth - popOffset.width;

        top = offset.top + offset.height;

        if (right > maxRight) {
            right = maxRight;
        }
    }

    if (type == "word") {
        let $link = condition.baseNode.parentNode;

        $aTag.textContent = $link.href;
        $btn.dataset["value"] = type;
        condition.popLinkbox.dataset["type"] = "del";
        $btn.dataset["type"] = type;
        classControl(condition.popLinkbox, "add", "--act");
    } else {
        $btn.dataset["value"] = type;
        $input.value = "";
        condition.popLinkbox.style.top = `${top}px`;
        condition.popLinkbox.style.right = `${right}px`;
        closePopIgnore(condition.popLinkbox);
        classControl(condition.popLinkbox, "add", "--act");
        setTimeout(() => {
            $input.focus();
        }, 250);
    }
}

function closePopIgnore(node, _0 = typeCheckThrow(node, Node)) {
    let $popList = getElement(".djs-trigger.--act");

    if ($popList.length > 0) {
        $popList.forEach(($pop) => {
            if ($pop !== node) {
                classControl($pop, "remove", "--act");
            }
        });
    }
}

export function closeOptionPop($target, _0 = typeCheckThrow($target, Node)) {
    let isOptionPop = findParentByClass($target, "djs-option-pop") !== null ? true : false;
    let isItem = findParentByClass($target, "djs-item") !== null ? true : false;
    let $btn = findParentByClass($target, "djs-add-block");
    let isBtn = false;

    if ($btn != null) {
        let type = $btn.dataset["type"];

        if (type == "block") {
            isBtn = true;
        }
    }

    if (isOptionPop == false && isItem == false && isBtn == false) {
        classControl(condition.popOption, "remove", "--act");
    }
}

export function openOptionPop() {
    let $target = condition.activeElement == null ? condition.activeItem : condition.activeElement;
    $target = $target.constructor.name == "HTMLTableCellElement" ? condition.activeItem : $target;
    let offset = $target.getBoundingClientRect();
    let type = getItemType(condition.activeItem, condition.activeElement);
    let $colList = getChild(condition.popOption, ".editor-col");
    let popOffset = condition.popOption.getBoundingClientRect();

    if (isMobile() !== true && condition.layout != "container") {
        condition.popOption.style.top = `${offset.top - popOffset.height - 10}px`;
        condition.popOption.style.left = `${offset.left}px`;
    }

    $colList.forEach(($col) => {
        let group = $col.dataset["group"].split(",");

        if (hasValueArrToArr(group, type) == true) {
            classControl($col, "add", "--act");
        } else {
            classControl($col, "remove", "--act");
        }
    });

    setOptionPopValue();
    classControl(condition.popOption, "add", "--act");
    if (isMobile() == true) {
        let $scroll = getChild(condition.popOption, ".djs-scroll-depth", false);
        let $childs = getChild(condition.popOption, ".--act");
        let width = 0;

        $childs.forEach(($child) => {
            let childOffset = $child.getBoundingClientRect();

            width += childOffset.width;
        });

        $scroll.style.width = `${Math.ceil(width)}px`;
    }
    itemStructureValidation();
}

function setOptionPopValue() {
    let $item = findParentByClass(condition.baseNode, "djs-item");

    if ($item != null) {
        let itemType = $item.dataset["type"];
        let $editableItem = findContenteditable(condition.baseNode);
        let textStyle = getTextItemOption(condition.baseNode);
        let fontSizeText = getElement(".djs-fontsize .djs-text", false);
        let btnColor = getElement(".djs-color", false);
        let btnListStyleText = getElement(".djs-list-style .djs-text", false);
        let btnCodeLangText = getElement(".djs-code-lang .djs-text", false);

        if ($editableItem == null) {
            $editableItem = $item;
        }

        let editableStyle = getTextItemOption($editableItem);

        if (textStyle.fontSize != "") {
            fontSizeText.textContent = Math.floor(textStyle.fontSize * condition.defaultFontSize);
        } else {
            fontSizeText.textContent = condition.defaultFontSize;
        }

        if (textStyle.color != "") {
            btnColor.dataset["value"] = textStyle.color;
        } else {
            btnColor.dataset["value"] = condition.defaultColor;
        }

        if (editableStyle.align != "") {
            condition.btnAlign.forEach(($btn) => {
                let value = $btn.dataset["value"];

                if (value == editableStyle.align) {
                    classControl($btn, "add", "--act");
                } else {
                    classControl($btn, "remove", "--act");
                }
            });
        } else {
            classControl(condition.btnAlign, "remove", "--act");
        }

        if (textStyle.bold != "") {
            classControl(condition.btnToggleBold, "add", "--act");
        } else {
            classControl(condition.btnToggleBold, "remove", "--act");
        }

        if (textStyle.italic != "") {
            classControl(condition.btnToggleItalic, "add", "--act");
        } else {
            classControl(condition.btnToggleItalic, "remove", "--act");
        }

        if (textStyle.underline != "") {
            classControl(condition.btnToggleUnderline, "add", "--act");
        } else {
            classControl(condition.btnToggleUnderline, "remove", "--act");
        }

        if (itemType == "ol") {
            let text;

            condition.btnListType.forEach(($btn) => {
                let value = $btn.dataset["value"];

                if (value == $item.dataset["style"]) {
                    text = $btn.textContent;
                }
            });

            btnListStyleText.textContent = text;
        }

        if (itemType == "codeblock") {
            let lang = $item.dataset["lang"];

            btnCodeLangText.textContent = lang;
        }

        if (textStyle.wordblock != "") {
            classControl(condition.btnWordBlock, "add", "--act");
        } else {
            classControl(condition.btnWordBlock, "remove", "--act");
        }
    }
}
