const { typeCheckThrow } = require("./default");
const { eventBinding, classControl, removeEvent } = require("./default");
const { getElement, findParentByClass, getChild } = require("./selector");
const { setScroll, getScrollInfo } = require("./scroll");

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

        $itemList.forEach(($item) => {
            if ($item !== $target) {
                classControl($item, "remove", "--act");
            }
        });

        classControl($target, "toggle", "--act");
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
    let contentOffset = $content.getBoundingClientRect();
    let value = getScrollInfo($wrap);
    let maxScrollTop = value.contentHeight - contentOffset.height;
    let maxBarTop = (contentOffset.height - 8) - value.scrollHeight;
    let cssReg = new RegExp('[^\\d]', 'g');
    let mouseY;

    eventBinding($content, "scroll", function () {
        let scrollTop = this.scrollTop;
        let scrollPercent = Math.floor((100 / maxScrollTop) * scrollTop);
        let barTop = Math.floor((scrollPercent/100) * maxBarTop);

        $bar.style.transform = `translateY(${barTop}px)`;
    });

    function mousemoveEvent(e){
        let barTop = parseInt($bar.style.transform.replace(cssReg, ''));
        let moveValue = mouseY - e.clientY;
        let changeBarTop = barTop - moveValue;
        let percent = Math.floor((100 / maxBarTop) * changeBarTop);
        let scrollTop;

        if(percent < 0){
            percent = 0;
        }

        if(changeBarTop < 0){
            changeBarTop = 0;
        }else if(changeBarTop > maxBarTop){
            changeBarTop = maxBarTop;
        }

        scrollTop = Math.floor((maxScrollTop/100) * percent);

        // console.log(maxBarTop, changeBarTop);
        console.log(percent, scrollTop);
        $content.scrollTop = scrollTop;
        $bar.style.transform = `translateY(${changeBarTop}px)`;
        mouseY = e.clientY;
    }

    eventBinding($bar, "mousedown", function(e){
        mouseY = e.clientY;
        eventBinding($wrap, "mousemove", mousemoveEvent, true);
    });

    eventBinding($wrap, "mouseup", function(e){
        removeEvent($wrap, "mousemove", mousemoveEvent);
    });
}
