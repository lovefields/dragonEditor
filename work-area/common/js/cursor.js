export function setCursor($node, position){
    let select = window.getSelection();
    let range = document.createRange();

    //console.log(select.focusNode, select.focusOffset);
    range.setStart($node, position);
    range.collapse(true);
    select.removeAllRanges();
    select.addRange(range);
}

/*
if (select.empty) {  // Chrome
    select.empty();
} else if (select.removeAllRanges) {  // Firefox
    select.removeAllRanges();
}
*/