const { typeCheckThrow, eventBinding, classControl, hasClass } = require("./default");
const { getElement, findParentByClass, getChild, getActiveElement } = require("./selector");
const { setScroll, getScrollInfo } = require("./scroll");
const { getDefaultBlockHTML, getYoutubeBlock } = require("./layout");
const { setCursor } = require("./cursor");
const { openPop } = require("./pop");

export function setEvent() {
    setGlobalEvent();
    setMenuEvent();
    setScroll(getElement(".djs-scroll"));

    console.log("set Event");
}

function setGlobalEvent() {
    // window size update
    let resizeFn;
    eventBinding(window, "resize", function (e) {
        clearTimeout(resizeFn);
        resizeFn = setTimeout(() => {
            editorCondition.windowWidth = window.innerWidth;
            editorCondition.windowHeight = window.innerHeight;
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
    eventBinding(editorCondition.btnToggleTarget, "click", function (e) {
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

    // add block(item) event
    eventBinding(editorCondition.btnAddBlock, "click", function () {
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
            editorCondition.activeItem = $target.nextElementSibling;
        } else if (type === "pop") {
            openPop(value, this);
        } else if (type === "file") {
            openFile(value);
        }
    });

    // add link(linkbox, youtube, codepen, link) event
    eventBinding(editorCondition.btnLinkbox, "click", function () {
        let $target = getActiveElement();
        let $selectedItem = getElement(".--djs-selected");
        let $input = getChild(editorCondition.popLinkbox, ".djs-input", false);
        let value = $input.value;
        let type = this.dataset["value"];
        let boolean = false;
        let html;

        if (type == "linkbox") {
            console.log("linkbox");
        } else if (type == "youtube") {
            if (editorCondition.regList["youtubeURL"].test(value)) {
                let code = value.replace(editorCondition.regList["youtubeCode"], "$7");

                html = getYoutubeBlock(code);
                boolean = true;
            }
        } else if (type == "codepen") {
            console.log("codepen");
        } else if (type == "word") {
            console.log("word");
        }

        if (boolean == true) {
            $target.insertAdjacentHTML("afterend", html);
            setCursor($target.nextElementSibling, 0);

            if ($selectedItem.length > 0) {
                classControl($selectedItem, "remove", "--djs-selected");
            }
            editorCondition.activeItem = $target.nextElementSibling;
            $input.value = "";
            classControl(editorCondition.popLinkbox, "remove", "--act");
        } else {
            classControl($input, "add", "--wrong");
            $input.focus();
            setTimeout(() => {
                classControl($input, "remove", "--wrong");
            }, 1000);
        }
    });

    eventBinding(getChild(editorCondition.popLinkbox, ".djs-input", false), "keydown", function (e) {
        if (e.code == "Enter") {
            let event = document.createEvent("HTMLEvents");
            event.initEvent("click", true, false);
            editorCondition.btnLinkbox.dispatchEvent(event);
        }
    });
}

function setMenuEvent() {
    eventBinding(editorCondition.btnChangeLang, "click", function () {
        let lang = this.dataset["value"];

        classControl(editorCondition.btnChangeLang, "remove", "--act");
        classControl(this, "add", "--act");

        console.log(editorCondition.lang);
        editorCondition.triggerLangChange(lang);
    });

    eventBinding(editorCondition.btnSwitchDevice, "click", function () {
        classControl(editorCondition.areaContent, "toggle", "--mobile");
        classControl(this, "toggle", "--act");
    });
}

export function bindingScrollEvent($wrap, _0 = typeCheckThrow($wrap, Node)) {
    let $content = getChild($wrap, ".djs-scroll-content", false);
    let $bar = getChild($wrap, ".djs-scroll-bar", false);
    let value = getScrollInfo($wrap);

    eventBinding($content, "scroll", function () {
        let scrollTop = this.scrollTop;
        let scrollPercent = Math.floor((100 / value.maxScrollTop) * scrollTop);
        let barTop = Math.floor((scrollPercent / 100) * value.maxBarTop);

        $bar.style.transform = `translateY(${barTop}px)`;
    });
}
