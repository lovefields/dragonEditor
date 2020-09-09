const { typeCheckThrow } = require("./module/default");
const { storage } = require("./module/condition");
const { makeView, setEmoticonList, setMediaList } = require("./module/layout");
const { refreshScroll } = require("./module/scroll");
const { setEvent, setEmoticonBtnEvent, setMediaEvent } = require("./module/event");

module.exports = class {
    constructor(wrap = "", options = {}, _0 = typeCheckThrow(wrap, "string"), _1 = typeCheckThrow(options, "object")) {
        global.condition = new storage(wrap, options);

        makeView();
        condition.setElement(options);
        setEvent();

        return this;
    }

    setEmoticon(data, _0 = typeCheckThrow(data, Array)) {
        setEmoticonList(data);
        refreshScroll();
        setEmoticonBtnEvent();
    }

    setMedia(data, _0 = typeCheckThrow(data, Array)) {
        setMediaList(data);
        refreshScroll();
        setMediaEvent();
    }
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


// export function addContent(html) {
//     let childCount = storage.contentArea.childElementCount;
//     let $lastEl = getEl(".lastset");
//     let $target =
//         $lastEl === null
//             ? storage.contentArea.children[childCount - 1]
//             : $lastEl;
//     $target.insertAdjacentHTML("afterend", html);
// }
