const { typeCheckThrow } = require("./default");
const { openOptionPop } = require("./pop");
const { findParentByClass, findContenteditable } = require("./selector");

export function itemClickEvent(e, _0 = typeCheckThrow(e, Event)) {
    let $target = e.target;
    let $item = findParentByClass($target, "djs-item");
    let $editableItem = findContenteditable($target);

    if ($item !== null || $editableItem !== null) {
        let $offsetTarget = $editableItem == null ? $item : $editableItem;
        let typeArr = ["all"];
        let offset = $offsetTarget.getBoundingClientRect();
        let itemType = $item.dataset["type"];

        if ($editableItem !== null) {
            switch ($editableItem.constructor.name) {
                case "":
                    break;
            }
        }

        typeArr.push(itemType);

        console.log($item, $editableItem);

        openOptionPop(
            {
                top: offset.top + offset.height + 10,
                left: offset.left,
            },
            typeArr,
        );
    }
}

export function itemKeyboardEvent(e, _0 = typeCheckThrow(e, Event)) {
    console.log(e);
}
