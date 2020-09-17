const { typeCheckThrow, eventBinding, classControl, hasClass, fetchURL, isMobile } = require("./default");
const { getElement, findParentByClass, getChild, findContenteditable } = require("./selector");
const { setScroll, getScrollInfo } = require("./scroll");
const { getDefaultBlockHTML, getYoutubeBlock, getCodepenBlock, getLinkboxBlock, getEmoticonBlockHTML, addBlockToContent, getImageBlockHTML } = require("./layout");
const { itemClickEvent, itemKeyboardEvent, itemStructureValidation, wrappingNode, brokenNode, margeNode } = require("./item");
const { openFile } = require("./file");
const { openPop, closeOptionPop, openOptionPop } = require("./pop");
const { isTextSelect } = require("./cursor");
const { message } = require("./message");

export function setEvent() {
    setGlobalEvent();
    setMenuEvent();
    setScroll();
    setContentEvent();
    setOptionEvent();
}

function setGlobalEvent() {
    // window size update
    let resizeFn;
    eventBinding(window, "resize", function (e) {
        clearTimeout(resizeFn);
        resizeFn = setTimeout(() => {
            condition.windowWidth = window.innerWidth;
            condition.windowHeight = window.innerHeight;
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
    // change language event
    eventBinding(condition.btnChangeLang, "click", function () {
        let lang = this.dataset["value"];

        classControl(condition.btnChangeLang, "remove", "--act");
        classControl(this, "add", "--act");

        console.log(condition.lang);
        condition.triggerLangChange(lang);
    });

    // device switch event
    eventBinding(condition.btnSwitchDevice, "click", function () {
        classControl(condition.areaContent, "toggle", "--mobile");
        classControl(this, "toggle", "--act");
    });

    // add block(item) event
    eventBinding(condition.btnAddBlock, "click", function () {
        let type = this.dataset["type"];
        let value = this.dataset["value"];

        if (type === "block") {
            let block = getDefaultBlockHTML(value);

            addBlockToContent(block);
            openOptionPop();
        } else if (type === "pop") {
            openPop(value, this);
        } else if (type === "file") {
            openFile(value);
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

                    if (request.respon !== false) {
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
                    // to-do : make self post
                    console.log("self!");
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
            // to-do make link form word
            console.log("word");
        }

        if (boolean == true) {
            addBlockToContent(html);
            $input.value = "";
            classControl(condition.popLinkbox, "remove", "--act");
        } else {
            classControl(condition.popLinkbox, "add", "--wrong");
            $input.focus();
            setTimeout(() => {
                classControl(condition.popLinkbox, "remove", "--wrong");
            }, 1000);
        }
    });

    eventBinding(getChild(condition.popLinkbox, ".djs-input", false), "keydown", function (e) {
        if (e.code == "Enter") {
            let event = document.createEvent("HTMLEvents");
            event.initEvent("click", true, false);
            condition.btnLinkbox.dispatchEvent(event);
        }
    });
}

export function bindingScrollEvent($wrap, _0 = typeCheckThrow($wrap, Node)) {
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

export function setMediaEvent() {
    eventBinding(condition.listMedia, "click", function (e) {
        let $item = findParentByClass(e.target, "djs-media");
        let type = $item.dataset["type"];
        let idx = $item.dataset["idx"];

        if (type == "image") {
            switch (true) {
                case findParentByClass(e.target, "djs-add-media") !== null:
                    let $area = findParentByClass(e.target, "djs-add-media");
                    let data = {
                        src: $area.dataset["src"],
                        alt: $area.dataset["alt"],
                        defaultFormat: $area.dataset["defaultFormat"],
                        webp: $area.dataset["webp"],
                        width: parseInt($area.dataset["width"]),
                        height: parseInt($area.dataset["height"]),
                    };
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
                    // to-do delete media
                    console.log("del");
                    break;
                case findParentByClass(e.target, "djs-name") !== null:
                    // to-do update media
                    console.log("edit");
                    break;
            }
        }
    });

    console.log("to-do media ajax");
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

    eventBinding(condition.areaContent, "keydown", function (e) {
        itemKeyboardEvent(e);
    });

    eventBinding(condition.areaContent, "keyup", function (e) {
        itemClickEvent(e);
    });

    // bug event - why?!
    // eventBinding(condition.areaContent, "mouseenter", function (e) {
    //     console.log("in!");
    //     status.resize = false;

    //     if (status.type == "codepen") {
    //         classControl(status.item, "remove", "--act");
    //     }
    // });

    console.log("set content event");
}

function setOptionEvent() {
    // font size event
    eventBinding(condition.btnFontSize, "click", function () {
        let $btn = getElement(".djs-fontsize", false);
        let value = this.dataset["value"];
        let event = document.createEvent("HTMLEvents");
        event.initEvent("click", true, false);

        if (isTextSelect() == true) {
            nodeEffect("fontSize", value);

            getChild($btn, ".djs-text", false).textContent = value;
        } else {
            let constructorName = condition.baseNode.constructor.name;
            let $target;

            if (constructorName == "Text") {
                $target = condition.baseNode.parentNode;
            } else {
                $target = condition.baseNode;
            }

            if (condition.defaultFontSize == parseInt(value)) {
                $target.removeAttribute("data-font-size");
                itemStructureValidation();
            } else {
                $target.setAttribute("data-font-size", value);
            }
            getChild($btn, ".djs-text", false).textContent = value;
            $target.focus();
        }

        $btn.dispatchEvent(event);
    });

    // color event
    eventBinding(condition.btnColor, "click", function () {
        let $btn = getElement(".djs-color", false);
        let value = this.dataset["value"];
        let event = document.createEvent("HTMLEvents");
        event.initEvent("click", true, false);

        if (isTextSelect() == true) {
            nodeEffect("color", value);

            $btn.dataset["value"] = value;
        } else {
            let constructorName = condition.baseNode.constructor.name;
            let $target;

            if (constructorName == "Text") {
                $target = condition.baseNode.parentNode;
            } else {
                $target = condition.baseNode;
            }

            if (condition.defaultFontSize == parseInt(value)) {
                $target.removeAttribute("data-color");
                itemStructureValidation();
            } else {
                $target.setAttribute("data-color", value);
            }
            $btn.dataset["value"] = value;
            $target.focus();
        }

        $btn.dispatchEvent(event);
    });

    // align event
    eventBinding(condition.btnAlign, "click", function () {
        let $target = findContenteditable(condition.baseNode);
        let value = this.dataset["value"];
        let isAct = this.classList.contains("--act");

        if (isAct == true) {
            $target.removeAttribute("data-algin");
            classControl(this, "remove", "--act");
        } else {
            $target.setAttribute("data-algin", value);
            classControl(condition.btnAlign, "remove", "--act");
            classControl(this, "add", "--act");
        }
    });
}

function nodeEffect(type, value, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(value, "string")) {
    if (condition.baseNode == condition.focusNode) {
        let $editable = findContenteditable(condition.baseNode);
        let $parentNode = condition.baseNode.parentNode;

        if ($editable == $parentNode) {
            wrappingNode(type, value);
        } else {
            let $parentParentNode = $parentNode.parentNode;

            if ($editable == $parentParentNode) {
                brokenNode(type, value);
            } else {
                itemStructureValidation();
                alert(message.wrongItemStructure);
            }
        }
    } else {
        margeNode(type, value);
    }
}
