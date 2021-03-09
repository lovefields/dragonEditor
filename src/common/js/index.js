const { typeCheckThrow } = require("./module/default");
const { storage } = require("./module/condition");
const { makeView, setEmoticonLayout, setMediaList, getContentData, addBlockToContent } = require("./module/layout");
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

    setEmoticon(data, _0 = typeCheckThrow(data, "object")) {
        if (condition.useEmoticon == false) {
            console.warn(`DRAGON EDITOR - If you want using Emoticon? set "useEmoticion" first.`);
            return;
        }

        condition.emoticonData = data;
        setEmoticonLayout();
        setEmoticonBtnEvent();
        refreshScroll();
    }

    setMedia(data, _0 = typeCheckThrow(data, "array")) {
        if (condition.uploadURL == "") {
            console.warn(`DRAGON EDITOR - If you want using Media? set "uploadURL" first.`);
            return;
        }

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
