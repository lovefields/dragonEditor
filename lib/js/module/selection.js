export function setSelection() {
    let selection = window.getSelection();

    condition.focusNode = selection.focusNode;
    condition.focusOffset = selection.focusOffset;
    condition.baseNode = selection.baseNode == undefined ? selection.anchorNode : selection.baseNode;
    condition.baseOffset = selection.baseOffset == undefined ? selection.anchorOffset : selection.baseOffset;
}

export function hasBaseNode() {
    let selection = window.getSelection();

    return selection.baseNode != null || selection.anchorNode != null;
}
