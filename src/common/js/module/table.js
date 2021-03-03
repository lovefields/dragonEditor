const { typeCheckThrow } = require("./default");
const { openOptionPop } = require("./pop");
const { setCursor } = require("./cursor");
const { findParentByClass, findContenteditable, getChild } = require("./selector");

export function changeTableCell(type, _0 = typeCheckThrow(type, "string")) {
    let $editableItem = findContenteditable(condition.baseNode);
    let html = $editableItem.innerHTML;

    $editableItem.insertAdjacentHTML("afterend", `<${type} contenteditable="true">${html}</${type}>`);
    setCursor($editableItem.nextElementSibling, 0);
    condition.activeElement = $editableItem.nextElementSibling;
    $editableItem.remove();
    openOptionPop();
}

export function tableCellControl(type, action, x, y, _0 = typeCheckThrow(type, "string"), _1 = typeCheckThrow(action, "string"), _2 = typeCheckThrow(x, "string"), _3 = typeCheckThrow(y, "string")) {
    let $item = findParentByClass(condition.baseNode, "djs-item");
    let colCount = getChild($item, "col");
    let $trList = getChild($item, "tr");
    let $targetCell;
    x = parseInt(x);
    y = parseInt(y);

    if (type == "row") {
        if ($trList.length == 1 && action == "delete") {
            return;
        }

        let html = "";

        html += "<tr>";
        colCount.forEach((col, index) => {
            html += `<td contenteditable="true" data-x="${index}" data-y="${y + 1}"></td>`;
        });
        html += "</tr>";

        $trList.forEach(($tr, index) => {
            if (index == y) {
                if (action == "add") {
                    $tr.insertAdjacentHTML("afterend", html);
                } else {
                    $tr.remove();
                }
            } else if (index > y) {
                let $cellList = getChild($tr, `*[data-x]`);

                $cellList.forEach(($cell) => {
                    let cellY = parseInt($cell.dataset["y"]);

                    if (action == "add") {
                        $cell.dataset["y"] = cellY + 1;
                    } else {
                        $cell.dataset["y"] = cellY - 1;
                    }
                });
            }
        });

        if (action == "add") {
            $targetCell = getChild($item, `td[data-x="${x}"][data-y="${y + 1}"]`, false);
        } else {
            $targetCell = getChild($item, `*[data-x="${x}"][data-y="${y - 1}"]`, false);
        }
    } else if (type == "col") {
        if (colCount.length == 1 && action == "delete") {
            return;
        }

        $trList.forEach(($tr) => {
            let $cellList = getChild($tr, `*[data-x]`);

            $cellList.forEach(($cell, index) => {
                let cellX = parseInt($cell.dataset["x"]);
                let cellY = parseInt($cell.dataset["y"]);

                if (action == "add") {
                    if (index == x) {
                        $cell.insertAdjacentHTML("afterend", `<td contenteditable="true" data-x="${x + 1}" data-y="${cellY}"></td>`);
                    } else if (index > x) {
                        $cell.dataset["x"] = cellX + 1;
                    }
                } else {
                    if (index == x) {
                        $cell.remove();
                    } else if (index > x) {
                        $cell.dataset["x"] = cellX - 1;
                    }
                }
            });
        });

        if (action == "add") {
            colCount[x].insertAdjacentHTML("afterend", `<col data-size="100">`);
            $targetCell = getChild($item, `*[data-x="${x + 1}"][data-y="${y}"]`, false);
        } else {
            colCount[x].remove();
            $targetCell = getChild($item, `*[data-x="${x - 1}"][data-y="${y}"]`, false);
        }
    }

    if ($targetCell !== null) {
        setCursor($targetCell, 0);
    }
}

export function setTableColSize(value, _0 = typeCheckThrow(value, "string")) {
    let $item = findParentByClass(condition.baseNode, "djs-item");
    let cell = findContenteditable(condition.baseNode);
    let x = parseInt(cell.dataset["x"]);
    let col = getChild($item, "col")[x];

    col.dataset["size"] = value;
}
