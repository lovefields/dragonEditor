const { typeCheckThrow } = require("./default");
const { getChild } = require("./selector");
const { scrollButtonHTML } = require("./layout");
const { bindingScrollEvent } = require("./event");

export function setScroll() {
    condition.scrollArea.forEach((node) => {
        node.insertAdjacentHTML("beforeend", scrollButtonHTML());
        setScrollHeight(node);
        bindingScrollEvent(node);
    });
}

function setScrollHeight($wrap, _0 = typeCheckThrow($wrap, Node)) {
    let $bar = getChild($wrap, ".djs-scroll-bar", false);
    let value = getScrollInfo($wrap);

    $bar.style.height = `${value.scrollHeight}px`;
}

export function refreshScroll() {
    condition.scrollArea.forEach((node) => {
        setScrollHeight(node);
        bindingScrollEvent(node);
    });
}

export function getScrollInfo($wrap, _0 = typeCheckThrow($wrap, Node)) {
    let $content = getChild($wrap, ".djs-scroll-content", false);
    let wrapOffset = $wrap.getBoundingClientRect();
    let contentOffset = $content.getBoundingClientRect();
    let contentChild = getChild($wrap, ".djs-scroll-content > *");
    let maxHeight = wrapOffset.height - 10;
    let contentHeight = 0;
    let percent, height, maxScrollTop, maxBarTop;

    contentChild.forEach((node) => {
        contentHeight += node.getBoundingClientRect().height;
    });

    if (contentHeight < maxHeight) {
        contentHeight = maxHeight;
    }

    percent = (100 / contentHeight) * maxHeight;
    height = Math.floor((percent / 100) * maxHeight);
    maxScrollTop = contentHeight - contentOffset.height;
    maxBarTop = contentOffset.height - 8 - height;

    if (height == maxHeight) {
        height = 0;
    }

    return {
        scrollHeight: height,
        contentHeight: contentHeight,
        maxScrollTop: maxScrollTop,
        maxBarTop: maxBarTop,
    };
}