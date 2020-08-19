const { typeCheckThrow } = require("./module/default");
const { condition } = require("./module/condition");

module.exports = class {
    constructor(
        wrap = ".editor-dragon",
        options = {},
        _0 = typeCheckThrow(wrap, "string"),
        _1 = typeCheckThrow(options, "object"),
    ) {
        console.log(wrap, options);

        global.editorCondition = new condition(wrap, options);
        console.log(editorCondition);

        //     storage.activeElement = storage.wrap;
        //     if (storage.multiUpload === true) {
        //         storage.fileInput.setAttribute("multiple", true);
        //     }
        //     if (storage.loading === true) {
        //         storage.popBgArea.classList.remove("act");
        //         storage.lodingArea.classList.remove("act");
        //     }
        //bindingEvent();

        return this;
    }

    // langChangeTrigger
    // 
};

// export function getOptionValue(name) {
//     if (storage[name] === undefined) {
//         console.error(`Optins name "${name}" is didn't have.`);
//         return false;
//     } else {
//         return storage[name];
//     }
// }

// export function getContentData() {
//     let json = getContentJSON();
//     storage.contentData[storage.langStatus] = json;
//     return storage.contentData;
// }

// export function getStorage() {
//     return storage;
// }

// export function getActiveElement() {
//     return storage.activeElement;
// }

// export function getEditableElement() {
//     return findContenteditable(storage.activeElement);
// }

// export function getItemElement() {
//     return findParent(storage.activeElement, "item");
// }

// export function setContentData(json) {
//     storage.contentData = json;
//     setContent(storage.contentData[storage.langStatus]);
// }

// export function setOptionValue(name, value) {
//     if (storage[name] === undefined) {
//         console.error("Can not set other option name.");
//         return false;
//     } else {
//         storage[name] = value;
//         return storage[name];
//     }
// }

// export function addLanguage(lang) {
//     if (storage.contentData[lang] === undefined) {
//         storage.contentData[lang] = [];
//         return true;
//     } else {
//         console.error(`"${lang}" is already exists.`);
//         return false;
//     }
// }

// export function addContent(html) {
//     let childCount = storage.contentArea.childElementCount;
//     let $lastEl = getEl(".lastset");
//     let $target =
//         $lastEl === null
//             ? storage.contentArea.children[childCount - 1]
//             : $lastEl;
//     $target.insertAdjacentHTML("afterend", html);
// }
