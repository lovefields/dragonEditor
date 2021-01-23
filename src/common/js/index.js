const { typeCheckThrow } = require("./module/default");
const { storage } = require("./module/condition");
const { makeView, setEmoticonList, setMediaList, getContentData, addBlockToContent } = require("./module/layout");
const { refreshScroll } = require("./module/scroll");
const { setEvent, setEmoticonBtnEvent } = require("./module/event");
const { jsonToHtml } = require("./module/convertor");

module.exports = class {
    constructor(options = {}, _0 = typeCheckThrow(options, "object")) {
        global.condition = new storage(options);
        condition.wrap.dataset["layout"] = condition.layout;

        makeView();
        condition.setElement(options);
        setEvent();

        return this;
    }

    setEmoticon(data, _0 = typeCheckThrow(data, "array")) {
        setEmoticonList(data);
        refreshScroll();
        setEmoticonBtnEvent();
    }

    setMedia(data, _0 = typeCheckThrow(data, "array")) {
        setMediaList(data);
        refreshScroll();
    }

    setContentData(data, _0 = typeCheckThrow(data, "object")) {
        let object = {};

        for (const [key, value] of Object.entries(data)) {
            if (condition.langCategory.indexOf(key) > -1) {
                object[key] = value;
            }
        }

        condition.contentData = object;
        condition.areaContent.innerHTML = jsonToHtml(object[condition.lang]);
    }

    getContentData() {
        condition.contentData[condition.lang] = getContentData();
        return condition.contentData;
    }

    addItem(html, _0 = typeCheckThrow(html, "string")) {
        addBlockToContent(`<div class="editor-item djs-item" data-type="other">${html}</div>`);
    }

    getStatus() {
        return condition;
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

// export function setOptionValue(name, value) {
//     if (storage[name] === undefined) {
//         console.error("Can not set other option name.");
//         return false;
//     } else {
//         storage[name] = value;
//         return storage[name];
//     }
// }
