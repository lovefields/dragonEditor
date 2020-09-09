const { typeCheckThrow, eventBinding, classControl, hasClass, fetchURL } = require("./default");
const { getElement, findParentByClass, getChild, getActiveElement } = require("./selector");
const { setScroll, getScrollInfo } = require("./scroll");
const { getDefaultBlockHTML, getYoutubeBlock, getCodepenBlock, getLinkboxBlock, getEmoticonBlockHTML } = require("./layout");
const { openFile } = require("./file");
const { setCursor } = require("./cursor");
const { openPop } = require("./pop");
const { message } = require("./message");

export function setEvent() {
    setGlobalEvent();
    setMenuEvent();
    setScroll();
    setContentEvent();
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
    eventBinding(document, "click", function (e) {
        let $target = e.target;
        let $list = getElement(".djs-trigger");
        let checkTrigger = findParentByClass($target, "djs-trigger") == null ? false : true;
        let checkBtn = findParentByClass($target, "djs-btn-ignore") == null ? false : true;

        if (checkBtn == false && checkTrigger == false) {
            if ($list.length > 0) {
                classControl($list, "remove", "--act");
            }
        }
    });

    // toggle target event
    eventBinding(condition.btnToggleTarget, "click", function (e) {
        let targetName = this.dataset["target"];
        let $target = getElement(targetName, false);
        let $itemList = getElement(".djs-trigger");
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
            let $target = getActiveElement();
            let block = getDefaultBlockHTML(value);
            let $selectedItem = getElement(".--djs-selected");

            $target.insertAdjacentHTML("afterend", block);
            setCursor($target.nextElementSibling, 0);

            if ($selectedItem.length > 0) {
                classControl($selectedItem, "remove", "--djs-selected");
            }

            condition.activeItem = $target.nextElementSibling;
        } else if (type === "pop") {
            openPop(value, this);
        } else if (type === "file") {
            openFile(value);
        }
    });

    // add link(linkbox, youtube, codepen, link) event
    eventBinding(condition.btnLinkbox, "click", async function () {
        let $target = getActiveElement();
        let $selectedItem = getElement(".--djs-selected");
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
            $target.insertAdjacentHTML("afterend", html);
            setCursor($target.nextElementSibling, 0);

            if ($selectedItem.length > 0) {
                classControl($selectedItem, "remove", "--djs-selected");
            }
            condition.activeItem = $target.nextElementSibling;
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
            let contentScroll = status.scrollY + value;

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
        let $target = getActiveElement();
        let $selectedItem = getElement(".--djs-selected");

        $target.insertAdjacentHTML("afterend", block);

        if ($selectedItem.length > 0) {
            classControl($selectedItem, "remove", "--djs-selected");
        }

        condition.activeItem = $target.nextElementSibling;
    });
}

export function setMediaEvent(){
    eventBinding(condition.listMedia, "click", function(e){
        switch(true){
            case findParentByClass(e.target, "djs-add-media") !== null :
                console.log("add");
            break;
            case findParentByClass(e.target, "djs-del-media") !== null :
                console.log("del");
            break;
            case findParentByClass(e.target, "djs-name") !== null :
                console.log("edit");
            break;
        }
    });

    console.log("media event");
}

function setContentEvent() {
    console.log("set content event");
}
