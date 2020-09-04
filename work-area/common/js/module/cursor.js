const { typeCheckThrow } = require("./default");

export function setCursor($node, position, _0 = typeCheckThrow($node, Node), _1 = typeCheckThrow(position, "number")) {
    let contentEditable = Boolean($node.contentEditable);
    let select = window.getSelection();
    let range = document.createRange();

    if (contentEditable !== true) {
        $node = $node.querySelector('*[contentEditable="true"]');
    }

    range.setStart($node, position);
    range.collapse(true);
    select.removeAllRanges();
    select.addRange(range);
}
