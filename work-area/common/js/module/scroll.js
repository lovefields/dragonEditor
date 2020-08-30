const { typeCheckThrow } = require("./default");
const { getChild } = require("./selector");
const { scrollButtonHTML } = require("./layout");
const { bindingScrollEvent } = require("./event");

export function setScroll(nodeList, _0 = typeCheckThrow(nodeList, NodeList)) {
    nodeList.forEach((node) => {
        node.innerHTML += scrollButtonHTML();
        setScrollHeight(node);
        bindingScrollEvent(node);
    });
}

function setScrollHeight($wrap, _0 = typeCheckThrow($wrap, Node)) {
    let $bar = getChild($wrap, ".djs-scroll-bar", false);
    let value = getScrollInfo($wrap);

    $bar.style.height = `${value.scrollHeight}px`;
}

export function refreshScroll(nodeList, _0 = typeCheckThrow(nodeList, NodeList)) {
    nodeList.forEach((node) => {
        setScrollHeight(node);
    });
}

export function getScrollInfo($wrap, _0 = typeCheckThrow($wrap, Node)) {
    let $content = getChild($wrap, ".djs-scroll-content", false);
    let wrapOffset = $wrap.getBoundingClientRect();
    let contentOffset = $content.getBoundingClientRect();
    let contentChild = $content.childNodes;
    let maxHeight = wrapOffset.height - 10;
    let contentHeight = 0;
    let percent, height,maxScrollTop,maxBarTop;

    contentChild.forEach((node) => {
        if (node.constructor.name !== "Text") {
            contentHeight += node.getBoundingClientRect().height;
        }
    });

    if (contentHeight < maxHeight) {
        contentHeight = maxHeight;
    }
    percent = (100 / contentHeight) * maxHeight;
    height = Math.floor((percent / 100) * maxHeight);
    maxScrollTop = contentHeight - contentOffset.height;
    maxBarTop = (contentOffset.height - 8) - height;

    return {
        scrollHeight: height,
        contentHeight: contentHeight,
        maxScrollTop: maxScrollTop,
        maxBarTop: maxBarTop
    };
}
