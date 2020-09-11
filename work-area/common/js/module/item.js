const { typeCheckThrow } = require("./default");
const { findParentByClass, findContenteditable } = require("./selector");

export function itemClickEvent(e, _0 = typeCheckThrow(e, Event)) {
    let $target = e.target;
    let $item = findParentByClass($target, "djs-item");
    let $editableItem = findContenteditable($target);

    console.log($item, $editableItem);
}

export function itemKeyboardEvent(e, _0 = typeCheckThrow(e, Event)) {
    console.log(e);
}
