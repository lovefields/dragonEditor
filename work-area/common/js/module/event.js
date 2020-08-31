const { typeCheckThrow, eventBinding, classControl, hasClass } = require("./default");
const { getElement, findParentByClass, getChild, getActiveElement } = require("./selector");
const { setScroll, getScrollInfo } = require("./scroll");
const { getDefaultBlockHTML } = require("./layout");
const { setCursor } = require("./cursor");

export function setEvent() {
    setGlobalEvent();
    setMenuEvent();
    setScroll(getElement(".djs-scroll"));

    console.log("set Event");
}

function setGlobalEvent() {
    let resizeFn;
    eventBinding(window, "resize", function (e) {
        clearTimeout(resizeFn);
        resizeFn = setTimeout(() => {
            editorCondition.windowWidth = window.innerWidth;
            editorCondition.windowHeight = window.innerHeight;
        }, 250);
    });

    eventBinding(document, "click", function (e) {
        let $target = e.target;
        let $list = getElement(".djs-trigger");
        let checkTrigger = findParentByClass($target, "djs-trigger") == null ? false : true;
        let checkBtn1 = findParentByClass($target, "djs-open-target") == null ? false : true;
        let checkBtn2 = findParentByClass($target, "djs-toggle-target") == null ? false : true;

        if (checkBtn1 == false && checkBtn2 == false) {
            if (checkTrigger == false && $list.length > 0) {
                classControl($list, "remove", "--act");
            }
        }
    });

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

    eventBinding(editorCondition.btnAddBlock, "click", function () {
        let type = this.dataset["type"];

        if(type === "block"){
            let value = this.dataset["value"];
            let $target = getActiveElement();
            let block = getDefaultBlockHTML(value);
            let $selectedItem = getElement(".--djs-selected");

            $target.insertAdjacentHTML("afterend", block);
            setCursor($target.nextElementSibling, 0);

            if($selectedItem.length > 0){
                classControl($selectedItem, "remove", "--djs-selected");
            }
            editorCondition.activeItem = $target.nextElementSibling;
        }else if(type === "pop"){

        }else if(type === "file"){
            
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
