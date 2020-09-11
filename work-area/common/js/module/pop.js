const { typeCheckThrow, classControl, isMobile } = require("./default");
const { getElement, getChild } = require("./selector");

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

function openLinkPop(type, offset = {}, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(offset, "object")) {
    let popOffset = condition.popLinkbox.getBoundingClientRect();
    let $input = getChild(condition.popLinkbox, ".djs-input", false);
    let $btn = getChild(condition.popLinkbox, ".djs-btn", false);
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
        $btn.dataset["value"] = type;
        condition.popLinkbox.dataset["type"] = offset.type;
        $btn.dataset["type"] = offset.type;
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

export function openOptionPop(top, left, _0 = typeCheckThrow(top, "number"), _1 = typeCheckThrow(left, "number")) {
    if (isMobile() !== true) {
        condition.popOption.style.top = `${top}px`;
        condition.popOption.style.left = `${left}px`;
    }

    classControl(condition.popOption, "add", "--act");
}
