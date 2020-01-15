export function clearCursor(){
    let select = window.getSelection();
    let range = document.createRange();

    console.log(select.getRangeAt(0));
    if (select.empty) {  // Chrome
        select.empty();
    } else if (select.removeAllRanges) {  // Firefox
        select.removeAllRanges();
    }

    //console.log(select.focusNode, select.focusOffset);
    //range.setStart(select.focusNode, select.focusOffset);
    //range.collapse(true);
    //select.removeAllRanges();
    //select.addRange(range);
}