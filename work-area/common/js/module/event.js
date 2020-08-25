const { eventBinding, classControl } = require("./default");
const { getElement, findParentByClass } = require("./selector");

export function setEvent() {
    setGlobalEvent();
    setMenuEvent();

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
        let $list = getElement(".js-trigger");
        let checkTrigger = findParentByClass($target, "js-trigger") == null ? false : true;
        let checkBtn1 = findParentByClass($target, "js-open-target") == null ? false : true;
        let checkBtn2 = findParentByClass($target, "js-toggle-target") == null ? false : true;

        if (checkBtn1 == false && checkBtn2 == false) {
            if (checkTrigger == false && $list.length > 0) {
                classControl($list, "remove", "--act");
            }
        }
    });

    eventBinding(editorCondition.btnToggleTarget, "click", function (e) {
        let targetName = this.dataset["target"];
        let $target = getElement(targetName);

        classControl($target, "toggle", "--act");
    });
}

function setMenuEvent() {
    eventBinding(editorCondition.btnChangeLang, "click", function () {
        let lang = this.dataset["value"];

        classControl(editorCondition.btnChangeLang, "remove", "--act");
        classControl(this, "add", "--act");

        editorCondition.triggerLangChange(lang);
    });

    eventBinding(editorCondition.btnSwitchDevice, "click", function () {
        classControl(editorCondition.areaContent, "toggle", "--mobile");
        classControl(this, "toggle", "--act");
    });
}
