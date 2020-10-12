const { typeCheckThrow } = require("./default");
const { setSelection } = require("./selection");

export function setCursor($node, position, _0 = typeCheckThrow($node, Node), _1 = typeCheckThrow(position, "number")) {
    let select = window.getSelection();
    let range = document.createRange();

    range.setStart($node, position);
    range.collapse(true);
    select.removeAllRanges();
    select.addRange(range);

    setSelection();
}

export function isTextSelect() {
    if (condition.focusNode == condition.baseNode && condition.focusOffset == condition.baseOffset) {
        return false;
    } else {
        return true;
    }
}
