const { typeCheckThrow } = require("./default");
const { openOptionPop } = require("./pop");
const { findParentByClass, findContenteditable } = require("./selector");

export function itemClickEvent(e, _0 = typeCheckThrow(e, Event)) {
    let $target = e.target;
    let $item = findParentByClass($target, "djs-item");
    let $editableItem = findContenteditable($target);

    if ($item !== null || $editableItem !== null) {
        let typeArr = ["all"];
        let offset = $item.getBoundingClientRect();
        let itemType = $item.dataset["type"];

        if ($editableItem !== null) {
            let selection = window.getSelection();
            let focusNode = selection.focusNode;
            let baseNode = selection.baseNode;
            let focusOffset = selection.focusOffset;
            let baseOffset = selection.baseOffset;

            switch ($editableItem.constructor.name) {
                case "HTMLLIElement":
                    typeArr.push("li");
                    break;

                case "HTMLTableCellElement":
                    if ($editableItem.tagName == "TD") {
                        typeArr.push("td");
                    } else if ($editableItem.tagName == "TH") {
                        typeArr.push("th");
                    }
                    break;
            }

            if (focusNode == baseNode && focusOffset !== baseOffset) {
                typeArr.push("word");
            }
        }

        typeArr.push(itemType);

        condition.activeItem = $item;
        condition.activeElement = $editableItem;

        openOptionPop(
            {
                top: offset.top - 48,
                left: offset.left,
            },
            typeArr,
        );
    }
}

export function itemKeyboardEvent(e, _0 = typeCheckThrow(e, Event)) {
    console.log(e);
}
