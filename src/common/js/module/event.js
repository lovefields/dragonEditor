const { typeCheckThrow, eventBinding, classControl, hasClass, fetchURL, isMobile } = require("./default");
const { getElement, findParentByClass, getChild, findContenteditable } = require("./selector");
const { setScroll, getScrollInfo } = require("./scroll");
const { getDefaultBlockHTML, getYoutubeBlock, getCodepenBlock, getLinkboxBlock, getEmoticonBlockHTML, addBlockToContent, getImageBlockHTML, getContentData } = require("./layout");
const { itemClickEvent, itemKeyboardEvent, itemStructureValidation, nodeEffect, textStylingNode, changeTableCell, itemMove, removeNodeEffect } = require("./item");
const { openFile, fileUpload, mediaNameUpdate } = require("./file");
const { openPop, closeOptionPop, openOptionPop, openLinkPop } = require("./pop");
const { contentPasteEvent } = require("./clipboard");
const { isTextSelect } = require("./cursor");
const { jsonToHtml } = require("./convertor");
const { textNodeStyleing } = require("./textNode");
const { message } = require("./message");

export function setEvent() {
    setGlobalEvent();
    setMenuEvent();
    setScroll();
    setContentEvent();
    setOptionEvent();
}

function setGlobalEvent() {
    // window size update & option pop close
    let resizeFn;
    eventBinding(window, "resize", function () {
        clearTimeout(resizeFn);
        resizeFn = setTimeout(() => {
            condition.windowWidth = window.innerWidth;
            condition.windowHeight = window.innerHeight;
            condition.popOption.removeAttribute("style");
            classControl(condition.popOption, "remove", "--act");
        }, 250);
    });

    // modal
    eventBinding(document, "mousedown", function (e) {
        let $target = e.target;
        let $list = getElement(".djs-trigger.--act");
        let checkTrigger = findParentByClass($target, "djs-trigger") == null ? false : true;
        let checkBtn = findParentByClass($target, "djs-btn-ignore") == null ? false : true;

        if (checkBtn == false && checkTrigger == false) {
            if ($list.length > 0) {
                classControl($list, "remove", "--act");
            }
        }

        closeOptionPop(e.target);
    });

    // toggle target event
    eventBinding(condition.btnToggleTarget, "click", function (e) {
        let targetName = this.dataset["target"];
        let $target = getElement(targetName, false);
        let $itemList = getElement(".djs-trigger.--act");
        let hasScroll = hasClass($target, ".djs-scroll");

        $itemList.forEach(($item) => {
            if ($item !== $target) {
                classControl($item, "remove", "--act");

                if (hasScroll == true) {
                    let scrollContent = $target.querySelector(".djs-scroll-content");
                    scrollContent.scrollTo(0, 0);
                }
            }
        });

        classControl($target, "toggle", "--act");
    });
}

function setMenuEvent() {
    if (condition.uploadURL !== "") {
        eventBinding(condition.uploadInput, "change", function () {
            fileUpload();
        });
    }

    if (condition.multiLang == true) {
        // change language event
        eventBinding(condition.btnChangeLang, "click", function () {
            let lang = this.dataset["value"];
            let data = getContentData();
            let html;

            classControl(condition.btnChangeLang, "remove", "--act");
            classControl(this, "add", "--act");

            condition.contentData[condition.lang] = data;

            if (condition.contentData[lang].length == 0) {
                let duplicate = confirm(message.noContentData(lang));

                if (duplicate == true) {
                    condition.contentData[lang] = data;
                } else {
                    condition.contentData[lang] = condition.defaultContentData;
                }
            }

            html = jsonToHtml(condition.contentData[lang]);

            condition.activeItem = condition.wrap;
            condition.activeElement = condition.wrap;
            condition.lang = lang;
            condition.areaContent.innerHTML = html;
            condition.triggerLangChange(lang);
        });
    }

    // device switch event
    eventBinding(condition.btnSwitchDevice, "click", function () {
        classControl(condition.areaContent, "toggle", "--mobile");
        classControl(this, "toggle", "--act");
    });

    // add block(item) event
    eventBinding(condition.btnAddBlock, "click", function () {
        let type = this.dataset["type"];
        let value = this.dataset["value"];

        if (type == "block") {
            let block = getDefaultBlockHTML(value);

            addBlockToContent(block);
            openOptionPop();
        } else if (type == "pop") {
            openPop(value, this);
        } else if (type == "file") {
            openFile(value);
        } else if (type == "custom") {
            condition.defaultMenu[value].fn();
        }
    });

    // add link(linkbox, youtube, codepen, link) event
    eventBinding(condition.btnLinkbox, "click", async function () {
        let $input = getChild(condition.popLinkbox, ".djs-input", false);
        let value = $input.value;
        let type = this.dataset["value"];
        let boolean = false;
        let html;

        if (type == "linkbox") {
            let data = {};

            if (condition.regList["defaultURL"].test(value)) {
                classControl(this, "add", "--ing");

                if (condition.linkBoxApi === "") {
                    let request = await fetchURL(`https://api.allorigins.win/get?url=${value}`);

                    if (request.response !== false) {
                        let text = request.contents;
                        let regTitleCheck = new RegExp('property=\\"og:title\\"', "g");
                        let regTitle01 = new RegExp('([^])*\\<title>([^"]*)<\\/title>([^]*)', "g");
                        let regTitle02 = new RegExp('([^]*)\\<meta property=\\"og:title\\" content=\\"([^"]*)(?=\\")"([^]*)', "g");
                        let regImgCheck = new RegExp('property=\\"og:image\\"', "g");
                        let regImg01 = new RegExp('([^])*\\<meta name=\\"image\\" content=\\"([^"]*)"\\>([^]*)', "g");
                        let regImg02 = new RegExp('([^])*\\<meta property=\\"og:image\\" content=\\"([^"]*)(?=\\")([^]*)', "g");
                        let regDecripCheck = new RegExp('property=\\"og:description\\"', "g");
                        let regDecrip01 = new RegExp('([^])*\\<meta name=\\"description\\" content=\\"([^"]*)(?=\\")([^]*)', "g");
                        let regDecrip02 = new RegExp('([^])*\\<meta property=\\"og:description\\" content=\\"([^"]*)(?=\\")([^]*)', "g");

                        if (regTitleCheck.test(text) == true) {
                            data.title = text.replace(regTitle02, "$2");
                        } else {
                            data.title = text.replace(regTitle01, "$2");
                        }

                        if (regImgCheck.test(text) == true) {
                            data.img = text.replace(regImg02, "$2");
                        } else {
                            let img = text.replace(regImg01, "$2");
                            if (img.length > 500) {
                                data.img = "";
                            } else {
                                data.img = img;
                            }
                        }

                        if (regDecripCheck.test(text) == true) {
                            data.description = text.replace(regDecrip02, "$2");
                        } else {
                            let description = text.replace(regDecrip01, "$2");
                            if (description.length > 500) {
                                data.description = "";
                            } else {
                                data.description = description;
                            }
                        }

                        if (value.indexOf("://") > -1) {
                            data.domain = value.split("/")[2];
                        } else {
                            data.domain = value.split("/")[0];
                        }

                        data.domain = data.domain.split(":")[0];

                        data.url = value;

                        html = getLinkboxBlock(data);
                        boolean = true;
                    } else {
                        console.error(request.error);
                        alert(message.apiNotWorking);
                    }
                } else {
                    let request = await fetchURL(condition.linkBoxApi, {
                        method: "POST",
                        body: {
                            url: value,
                        },
                    });

                    if (request.response == true) {
                        request.data.url = value;
                        html = getLinkboxBlock(request.data);
                        boolean = true;
                    } else {
                        alert(request.error.message);
                    }
                }

                classControl(this, "remove", "--ing");
            }
        } else if (type == "youtube") {
            if (condition.regList["youtubeURL"].test(value)) {
                let code = value.replace(condition.regList["youtubeCode"], "$7");

                html = getYoutubeBlock(code);
                boolean = true;
            }
        } else if (type == "codepen") {
            if (condition.regList["codepenURL"].test(value)) {
                let nickname = value.replace(condition.regList["codepenCode"], "$2");
                let code = value.replace(condition.regList["codepenCode"], "$4");

                html = getCodepenBlock(nickname, code);
                boolean = true;
            }
        } else if (type == "word") {
            let $tag = condition.baseNode.parentNode;

            $tag.insertAdjacentHTML("afterend", `<span>${$tag.textContent}</span>`);
            $tag.remove();

            itemStructureValidation();
            classControl(condition.popLinkbox, "remove", "--act");
        } else if (type == "link") {
            if (condition.regList["defaultURL"].test(value)) {
                nodeEffect("link", value);
                boolean = true;
            }
        }

        if (boolean == true) {
            if (type != "link") {
                addBlockToContent(html);
            }
            $input.value = "";
            classControl(condition.popLinkbox, "remove", "--act");
        } else {
            if (type != "word") {
                classControl(condition.popLinkbox, "add", "--wrong");
                $input.focus();
                setTimeout(() => {
                    classControl(condition.popLinkbox, "remove", "--wrong");
                }, 1000);
            }
        }
    });

    eventBinding(getChild(condition.popLinkbox, ".djs-input", false), "keydown", function (e) {
        if (e.code == "Enter") {
            let event = document.createEvent("HTMLEvents");
            event.initEvent("click", true, false);
            condition.btnLinkbox.dispatchEvent(event);
        }
    });

    // media event
    eventBinding(condition.listMedia, "click", async function (e) {
        let $editableNode = getChild(this, `*[contenteditable="true"]`);
        let $item = findParentByClass(e.target, "djs-media");
        let type = "";
        let idx = "";
        let data;

        if ($editableNode.length > 0) {
            $editableNode.forEach((node) => {
                mediaNameUpdate(node);
            });
        }

        if ($item != null) {
            let $area = getChild($item, ".djs-add-media", false);
            data = {
                src: $area.dataset["src"],
                alt: $area.dataset["alt"],
                hasWebp: $area.dataset["webp"],
                defaultFormat: $area.dataset["defaultFormat"],
                webp: $area.dataset["webp"],
                width: parseInt($area.dataset["width"]),
                height: parseInt($area.dataset["height"]),
            };

            type = $item.dataset["type"];
            idx = $item.dataset["idx"];
        }

        if (type == "image") {
            switch (true) {
                case findParentByClass(e.target, "djs-add-media") !== null:
                    let setWidth = 700;
                    let block;

                    if (isMobile() == true) {
                        setWidth = 300;
                    } else {
                        if (data.width < data.height) {
                            setWidth = 400;
                        }
                    }
                    block = getImageBlockHTML(data, setWidth);

                    addBlockToContent(block);
                    break;
                case findParentByClass(e.target, "djs-del-media") !== null:
                    let url = condition.uploadURL;
                    let lastStrIsSlat = url.substr(url.length - 1, url.length) == "/" ? true : false;

                    if (lastStrIsSlat == false) {
                        url += "/";
                    }

                    let request = await fetchURL(`${url}${idx}`, {
                        method: "DELETE",
                    });

                    if (request.response == true) {
                        let $blockList = getChild(condition.areaContent, `img[src="${data.src}.${data.defaultFormat}"]`);

                        $blockList.forEach(($img) => {
                            let $block = findParentByClass($img, "djs-item");
                            $block.remove();
                        });
                        $item.remove();
                        condition.activeItem = condition.wrap;
                    } else {
                        alert(request.error.message);
                    }
                    break;
                case findParentByClass(e.target, "djs-name") !== null:
                    let $textEl = findParentByClass(e.target, "djs-name");
                    $textEl.setAttribute("contenteditable", "true");
                    $textEl.focus();
                    $textEl.dataset["preText"] = $textEl.textContent;
                    break;
            }
        }
    });

    eventBinding(condition.listMedia, "keydown", function (e) {
        let isTextField = findParentByClass(e.target, "djs-name") !== null ? true : false;

        if (e.code == "Enter" && isTextField == true) {
            e.preventDefault();
            mediaNameUpdate(e.target);
        }
    });
}

export function bindingScrollEvent($wrap, _0 = typeCheckThrow($wrap, "node")) {
    let $content = getChild($wrap, ".djs-scroll-content", false);
    let $bar = getChild($wrap, ".djs-scroll-bar", false);
    let value = getScrollInfo($wrap);
    let status = {
        activity: false,
        mouseY: 0,
        scrollY: 0,
    };

    eventBinding($content, "scroll", function () {
        let scrollTop = this.scrollTop;
        let scrollPercent = Math.floor((100 / value.maxScrollTop) * scrollTop);
        let barTop = Math.floor((scrollPercent / 100) * value.maxBarTop);

        $bar.style.transform = `translateY(${barTop}px)`;
    });

    eventBinding($wrap, "mousemove", function (e) {
        if (status.activity == true) {
            let value = -(status.mouseY - e.clientY);
            let contentScroll = status.scrollY + value * 2;

            $content.scrollTo(0, contentScroll);
        }
    });

    eventBinding($bar, "mousedown", function (e) {
        status.activity = true;
        status.mouseY = e.clientY;
        status.scrollY = $content.scrollTop;
    });

    eventBinding($wrap, "mouseup", function () {
        status.activity = false;
    });
}

export function setEmoticonBtnEvent() {
    condition.btnEmoticon = getChild(condition.listEmoticon, ".djs-add-emoticon");

    eventBinding(condition.btnEmoticon, "click", function () {
        let code = this.innerHTML.trim();
        let block = getEmoticonBlockHTML(code);

        addBlockToContent(block);
    });
}

function setContentEvent() {
    let status = {
        resize: false,
        client: {
            x: 0,
            y: 0,
        },
        type: "",
        item: "",
        position: "",
    };

    eventBinding(condition.areaContent, "paste", function (e) {
        contentPasteEvent(e);
    });

    eventBinding(condition.areaContent, "mousedown,touchstart", function (e) {
        let $target = e.target;
        let hasClass = $target.classList.contains("djs-resize");

        if (hasClass == true) {
            if (isMobile() == true) {
                status.client.x = Math.floor(e.touches[0].clientX);
                status.client.y = Math.floor(e.touches[0].clientY);
            } else {
                status.client.x = e.clientX;
                status.client.y = e.clientY;
            }

            status.resize = true;
            status.item = findParentByClass($target, "djs-item");
            status.type = status.item.dataset["type"];
            status.position = $target.dataset["position"];

            if (status.type == "image") {
                status.target = getChild(status.item, ".djs-size", false);
                status.defaultValue = parseInt(status.target.dataset["width"]);
            } else if (status.type == "codepen") {
                status.target = getChild(status.item, ".djs-iframe", false);
                status.defaultValue = parseInt(status.target.height);
                classControl(status.item, "add", "--act");
            }
        }
    });

    eventBinding(condition.areaContent, "mousemove,touchmove", function (e) {
        if (status.resize == true) {
            let clientX, clientY;

            if (isMobile() == true) {
                clientX = Math.floor(e.touches[0].clientX);
                clientY = Math.floor(e.touches[0].clientY);
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            if (status.type == "image") {
                let diff;

                if (status.position == "left") {
                    diff = clientX - status.client.x;
                } else if (status.position == "right") {
                    diff = status.client.x - clientX;
                }

                let multiple = Math.floor(diff / 50);
                let count = 50 * multiple;
                let width = status.defaultValue - count;

                if (width > condition.maxImageWidth) {
                    width = condition.maxImageWidth;
                } else if (width < 50) {
                    width = 50;
                }

                status.target.dataset["width"] = width;
            } else if (status.type == "codepen") {
                let diff = status.client.y - clientY;
                let multiple = Math.floor(diff / 50);
                let count = 50 * multiple;
                let height = status.defaultValue - count;

                if (height < 300) {
                    height = 300;
                } else if (height > condition.maxCodepenHeight) {
                    height = condition.maxCodepenHeight;
                }

                status.target.height = height;
            }
        }
    });

    eventBinding(condition.areaContent, "mouseup,touchend", function (e) {
        status.resize = false;

        if (status.type == "codepen") {
            classControl(status.item, "remove", "--act");
        }

        itemClickEvent(e);
    });

    // 키보드 이벤트
    eventBinding(condition.areaContent, "keydown", function (e) {
        itemKeyboardEvent(e);
    });

    // let contentKeyupFn;
    eventBinding(condition.areaContent, "keyup", function (e) {
        itemClickEvent(e);
        // clearTimeout(contentKeyupFn);
        // contentKeyupFn = setTimeout(() => {
        //     codeBlockHighlight(e);
        // }, 250);
    });
}

function setOptionEvent() {
    // font size event
    eventBinding(condition.btnFontSize, "click", function () {
        let $btn = getElement(".djs-fontsize", false);
        let value = this.dataset["value"];
        let text = this.textContent;
        let event = document.createEvent("HTMLEvents");
        event.initEvent("click", true, false);

        textNodeStyleing("fontSize", value, this);
        getChild($btn, ".djs-text", false).textContent = text;
        $btn.dispatchEvent(event);
    });

    // color event
    eventBinding(condition.btnColor, "click", function () {
        let $btn = getElement(".djs-color", false);
        let value = this.dataset["value"];
        let event = document.createEvent("HTMLEvents");
        event.initEvent("click", true, false);

        textNodeStyleing("color", value, this);
        $btn.dataset["value"] = value;
        $btn.dispatchEvent(event);
    });

    // align event
    eventBinding(condition.btnAlign, "click", function () {
        let $target = findContenteditable(condition.baseNode);
        let value = this.dataset["value"];
        let isAct = this.classList.contains("--act");

        if ($target == null) {
            $target = findParentByClass(condition.baseNode, "djs-item");
        }

        if (isAct == true) {
            $target.removeAttribute("data-align");
            classControl(this, "remove", "--act");
        } else {
            $target.dataset["align"] = value;
            classControl(condition.btnAlign, "remove", "--act");
            classControl(this, "add", "--act");
        }
    });

    // bold event
    eventBinding(condition.btnToggleBold, "click", function () {
        let isAct = this.classList.contains("--act");

        textNodeStyleing("bold", !isAct, this);
    });

    // italic event
    eventBinding(condition.btnToggleItalic, "click", function () {
        let isAct = this.classList.contains("--act");

        textNodeStyleing("italic", !isAct, this);
    });

    // underline event
    eventBinding(condition.btnToggleUnderline, "click", function () {
        let isAct = this.classList.contains("--act");

        textNodeStyleing("underline", !isAct, this);
    });

    // strikethrough event
    eventBinding(condition.btnToggleStrikethrough, "click", function () {
        let isAct = this.classList.contains("--act");

        textNodeStyleing("strikethrough", !isAct, this);
    });

    // list style event
    eventBinding(condition.btnListType, "click", function () {
        let $item = findParentByClass(condition.baseNode, "djs-item");
        let value = this.dataset["value"];

        $item.dataset["style"] = value;
    });

    // table change event
    eventBinding(condition.btnTableHeader, "click", function () {
        changeTableCell("th");
    });

    eventBinding(condition.btnTableBody, "click", function () {
        changeTableCell("td");
    });

    // code theme event
    eventBinding(condition.btnThemeSet, "click", function () {
        let $item = findParentByClass(condition.baseNode, "djs-item");
        let value = this.dataset["value"];
        let $btn = getElement(".djs-code-theme", false);
        let event = document.createEvent("HTMLEvents");
        event.initEvent("click", true, false);

        $item.dataset["theme"] = value;
        $btn.dispatchEvent(event);
    });

    // code lang event
    eventBinding(condition.btnLangSet, "click", function () {
        let $item = findParentByClass(condition.baseNode, "djs-item");
        let $editableItem = findContenteditable(condition.baseNode);
        let value = this.dataset["value"];
        let $btn = getElement(".djs-code-lang", false);
        let text = getElement(".djs-code-lang .djs-text", false);
        let event = document.createEvent("HTMLEvents");
        event.initEvent("click", true, false);

        if (value == "text") {
            value = "nohighlight";
        }

        $item.dataset["lang"] = value;
        $editableItem.classList = `${value} editor-code djs-code`;
        $editableItem.textContent = $editableItem.textContent;
        hljs.highlightBlock($editableItem);

        if (value == "nohighlight") {
            text.textContent = "text";
            $item.dataset["lang"] = "text";
        } else {
            text.textContent = value;
        }

        $btn.dispatchEvent(event);
        $editableItem.focus();
        condition.baseNode = $editableItem;
    });

    // move item event
    eventBinding(condition.btnItemMobeUp, "click", function () {
        itemMove("up");
    });

    eventBinding(condition.btnItemMobeDown, "click", function () {
        itemMove("down");
    });

    // word block event
    eventBinding(condition.btnWordBlock, "click", function () {
        let isAct = this.classList.contains("--act");

        if (isTextSelect() == true) {
            nodeEffect("wordblock");
        } else {
            textStylingNode("wordblock", "CODE", isAct);
        }

        classControl(this, "toggle", "--act");
    });

    // open word link pop
    eventBinding(condition.btnWordLink, "click", function () {
        let isAct = this.classList.contains("--act");
        let $node, nodeOffset;
        let offset = {};

        if (condition.baseNode.constructor.name == "Text") {
            $node = condition.baseNode.parentNode;
        } else {
            $node = condition.baseNode;
        }
        nodeOffset = $node.getBoundingClientRect();

        offset.top = nodeOffset.top - 37;
        offset.right = nodeOffset.right + 230;
        offset.width = nodeOffset.width;

        classControl(condition.popOption, "remove", "--act");
        if (isAct == true) {
            openLinkPop("word", offset);
        } else {
            openLinkPop("link", offset);
        }
    });

    // item delete event
    eventBinding(condition.btnItemDelete, "click", function () {
        let $item = findParentByClass(condition.baseNode, "djs-item");
        let itemCount = condition.areaContent.childElementCount;
        $item.remove();
        condition.activeItem = condition.wrap;

        classControl(condition.popOption, "remove", "--act");
        if (itemCount == 1) {
            condition.areaContent.insertAdjacentHTML("beforeend", getDefaultBlockHTML("textBlock"));
        }
    });
}

function textDecorationEvent($btn, type, tagName, _0 = typeCheckThrow($btn, "node"), _1 = typeCheckThrow(type, "string"), _2 = typeCheckThrow(tagName, "string")) {
    let isAct = $btn.classList.contains("--act");
    let $editable = findContenteditable(condition.baseNode);

    if ($editable.textContent != "") {
        if (isTextSelect() == true) {
            if (isAct == true) {
                removeNodeEffect(type, tagName);
            } else {
                nodeEffect(type);
            }
        } else {
            textStylingNode(type, tagName, isAct);
        }

        classControl($btn, "toggle", "--act");
    }
}
