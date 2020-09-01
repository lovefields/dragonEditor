const { typeCheckThrow, classControl } = require("./default");
const { getElement } = require("./selector");

export function openPop(type, _0 = typeCheckThrow(type, "string")) {
    let trigger = getElement(".djs-trigger");

    classControl(trigger, "remove", "--act");
    switch (type) {
        case "linkboxBlock":
            break;
        case "emoticonBlock":
            classControl(editorCondition.popEmoticon, "toggle", "--act");
            break;
        case "youtubeBlock":
            break;
        case "codepenBlock":
            break;
    }
    console.log(type);
}
