const { typeCheckThrow } = require("./default");

export function setCursor($node, position, _0 = typeCheckThrow($node, Node), _1 = typeCheckThrow(position, "number")) {
    let select = window.getSelection();
    let range = document.createRange();

    range.setStart($node, position);
    range.collapse(true);
    select.removeAllRanges();
    select.addRange(range);
}

export function isTextSelect(){
    if((condition.focusNode == condition.baseNode) && (condition.focusOffset == condition.baseOffset)){
        return false;
    }else{
        return true;
    }
}