export function findScrollingElement($target: HTMLElement): HTMLElement | Window {
    if ($target.scrollHeight > $target.clientHeight) {
        return $target;
    } else {
        if ($target.parentElement.tagName === "BODY") {
            return window;
        } else {
            return findScrollingElement($target.parentElement);
        }
    }
}

export function findContentEditableElement($target: Node): HTMLElement {
    if ($target.constructor.name === "Text") {
        $target = $target.parentNode;
    }

    const $baseElement = $target as HTMLElement;

    if ($baseElement.isContentEditable === false) {
        return findContentEditableElement($baseElement.parentNode);
    } else {
        return $baseElement;
    }
}

function addBrEvent() {
    // const cursorData = getCursor();
    // if (cursorData.startNode) {
    //   let $target = cursorData.startNode;
    //   const preEditableElement = findEditableElement($target);
    //   if ($target.constructor.name === "Text") {
    //     $target = $target.parentNode;
    //   }
    //   if (preEditableElement !== $target && $target.constructor.name !== "HTMLBRElement") {
    //     let startNode = cursorData.startNode;
    //     let endNode = cursorData.endNode;
    //     let startChild = startNode;
    //     let endChild = endNode;
    //     if (startNode.parentNode !== preEditableElement) {
    //       startChild = startNode.parentNode;
    //     }
    //     if (endNode.parentNode !== preEditableElement) {
    //       endChild = endNode.parentNode;
    //     }
    //     const startChildIdx = findChildNumber(preEditableElement, startChild);
    //     const endChildIdx = findChildNumber(preEditableElement, endChild);
    //     let startIdx = 0;
    //     let endIdx = 0;
    //     let startOffset = 0;
    //     let endOffset = 0;
    //     let htmlStructure = "";
    //     if (startChildIdx > endChildIdx) {
    //       startIdx = endChildIdx;
    //       endIdx = startChildIdx;
    //       startOffset = cursorData.endOffset;
    //       endOffset = cursorData.startOffset;
    //     } else {
    //       startIdx = startChildIdx;
    //       endIdx = endChildIdx;
    //       startOffset = cursorData.startOffset;
    //       endOffset = cursorData.endOffset;
    //     }
    //     if (enterCount === 1) {
    //       const text = startChild.textContent;
    //       startChild.textContent = text.substring(1, text.length);
    //       setCursor(startChild, 0);
    //     } else {
    //       if (startNode === endNode) {
    //         const text = startChild.textContent;
    //         const childClassList = [...startChild.classList];
    //         const tagData = getTagName(startChild);
    //         htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${tagData.name}>`;
    //         htmlStructure += `<br>`;
    //         htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${tagData.name}>`;
    //         startChild.insertAdjacentHTML("beforebegin", htmlStructure);
    //         setCursor(preEditableElement.childNodes[startChildIdx + 2], 0);
    //         startChild.remove();
    //       } else {
    //         preEditableElement.childNodes.forEach((child, count) => {
    //           const type = child.constructor.name;
    //           const text = child.textContent;
    //           if (count > startIdx && count < endIdx) {
    //           } else if (count === startIdx) {
    //             if (type === "Text") {
    //               htmlStructure += text.substring(0, startOffset);
    //             } else {
    //               const childClassList = [...child.classList];
    //               const tagData = getTagName(child);
    //               htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${tagData.name}><br>`;
    //             }
    //           } else if (count === endIdx) {
    //             if (type === "Text") {
    //               htmlStructure += text.substring(endOffset, text.length);
    //             } else {
    //               const childClassList = [...child.classList];
    //               const tagData = getTagName(child);
    //               htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${tagData.name}><br>`;
    //             }
    //           } else {
    //             if (type === "Text") {
    //               htmlStructure += child.textContent;
    //             } else {
    //               htmlStructure += child.outerHTML;
    //             }
    //           }
    //         });
    //         preEditableElement.innerHTML = htmlStructure;
    //       }
    //     }
    //   } else {
    //     const brTag = document.createElement("br");
    //     const selection = window.getSelection();
    //     const range = document.createRange();
    //     if (enterCount === 1) {
    //       const nextCursorData = getCursor();
    //       const editableElement = findEditableElement(nextCursorData.startNode);
    //       const childList = editableElement.childNodes;
    //       const childIdx = findChildNumber(editableElement, nextCursorData.startNode);
    //       setCursor(childList[childIdx + 2], 0);
    //     } else {
    //       selection.deleteFromDocument();
    //       selection.getRangeAt(0).insertNode(brTag);
    //       range.setStart(brTag, 0);
    //       range.collapse(true);
    //       selection.removeAllRanges();
    //       selection.addRange(range);
    //       const nextCursorData = getCursor();
    //       const editableElement = findEditableElement(nextCursorData.startNode);
    //       const childList = editableElement.childNodes;
    //       const childIdx = findChildNumber(editableElement, nextCursorData.startNode);
    //       let hasText = false;
    //       childList.forEach((row) => {
    //         if (row.constructor.name === "Text") {
    //           hasText = true;
    //         }
    //       });
    //       if (hasText) {
    //         if (childList[childIdx + 1].textContent?.length === 0) {
    //           if (childList[childIdx + 2]) {
    //             if (childList[childIdx + 2].constructor.name == "HTMLBRElement") {
    //               setCursor(childList[childIdx + 1], 0);
    //             } else {
    //               childList[childIdx].insertAdjacentHTML("beforebegin", "<br>");
    //             }
    //           } else {
    //             childList[childIdx].insertAdjacentHTML("beforebegin", "<br>");
    //           }
    //         } else {
    //           setCursor(childList[childIdx + 1], 0);
    //         }
    //       } else {
    //         childList[childIdx].insertAdjacentHTML("beforebegin", "<br>");
    //       }
    //     }
    //   }
    // }
}
