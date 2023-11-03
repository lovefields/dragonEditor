import store from "../../core/store/editorStore";
import { setCursorData, setCursorToView } from "./cursor";
import { findEditableElement, findChildNumber, findLiElement } from "./element";
import { createTextBlock } from "./block";
// import { getTagName } from "./style";
import type { EditorContentType, TextBlock, ImageBlock, ListBlock, OtherBlock, AllBlock } from "../../../types/index";

// // 엔터 이벤트
// let enterCount = 0;
// function enterEvent(type: string, event: KeyboardEvent, action: Function, update: Function) {
//     if (event.code === "Enter") {
//         event.preventDefault();
//         const useShift = event.shiftKey;

//         switch (type) {
//             case "list":
//                 if (useShift === false) {
//                     if (enterCount == 0) {
//                         listEnterEvent(action, update);
//                     }
//                 } else {
//                     addBrEvent();
//                 }
//                 break;
//             case "image":
//                 action("addBlock", {
//                     name: "text",
//                 });
//                 break;
//             case "comment":
//                 addBrEvent();
//                 break;
//             default:
//                 if (useShift === false) {
//                     if (enterCount == 0) {
//                         textEnterEvent(action);
//                     }
//                 } else {
//                     addBrEvent();
//                 }
//         }

//         enterCount += 1;
//         setTimeout(() => {
//             enterCount = 0;
//         }, 150);
//     }
// }

// // list 엔터 이벤트
// function listEnterEvent(action: Function, update: Function) {
//     const cursorData = getCursor();

//     if (cursorData.startNode) {
//         const editableElement = findEditableElement(cursorData.startNode as Node) as HTMLElement;
//         const editableElementClassList = [...editableElement.classList].slice(0, 1);
//         const startNode: Node = cursorData.startNode as Node;
//         const endNode: Node = cursorData.endNode as Node;
//         let startChild = startNode;
//         let endChild = endNode;

//         if (startNode.parentNode !== editableElement) {
//             startChild = startNode.parentNode as HTMLElement;
//         }

//         if (endNode.parentNode !== editableElement) {
//             endChild = endNode.parentNode as HTMLElement;
//         }

//         const startChildIdx: number = findChildNumber(editableElement, startChild);
//         const endChildIdx: number = findChildNumber(editableElement, endChild);

//         let startIdx: number = 0;
//         let endIdx: number = 0;
//         let startOffset: number = 0;
//         let endOffset: number = 0;
//         let preHTMLStructor: string = "";
//         let nextHTMLStructor: string = "";

//         if (startChildIdx > endChildIdx) {
//             startIdx = endChildIdx;
//             endIdx = startChildIdx;
//             startOffset = cursorData.endOffset as number;
//             endOffset = cursorData.startOffset as number;
//         } else {
//             startIdx = startChildIdx;
//             endIdx = endChildIdx;
//             startOffset = cursorData.startOffset as number;
//             endOffset = cursorData.endOffset as number;
//         }

//         if (editableElement.childNodes.length === 0 || (endChildIdx === editableElement.childNodes.length - 1 && (editableElement.childNodes[endChildIdx].textContent as string).length === endOffset)) {
//             // 맨뒤 엔터인 경우
//             if (editableElement.childNodes.length === 0) {
//                 editableElement.remove();
//                 action("addBlock", {
//                     name: "text",
//                 });
//             } else {
//                 editableElement.insertAdjacentHTML("afterend", `<li class="d-li-item"  contenteditable></li>`);
//                 setCursor(editableElement.nextSibling as Node, 0);
//                 update();
//             }
//         } else {
//             editableElement.childNodes.forEach((child: ChildNode, count: number) => {
//                 const text: string = child.textContent as string;

//                 if (count < startChildIdx) {
//                     // 첫부분 ~ 선택 시작 노드 직전
//                     if (child.constructor.name === "Text") {
//                         preHTMLStructor += child.textContent;
//                     } else {
//                         preHTMLStructor += (child as HTMLElement).outerHTML;
//                     }
//                 } else if (count > endChildIdx) {
//                     // 선택 끝 노드 ~ 마지막 노드
//                     if (child.constructor.name === "Text") {
//                         nextHTMLStructor += child.textContent;
//                     } else {
//                         nextHTMLStructor += (child as HTMLElement).outerHTML;
//                     }
//                 } else {
//                     if (startChildIdx === endChildIdx) {
//                         // 같은 노드일경우
//                         if (child.constructor.name === "Text") {
//                             preHTMLStructor += text.substring(0, startOffset);
//                             nextHTMLStructor += text.substring(endOffset, text.length);
//                         } else {
//                             const childClassList: string[] = [...(child as HTMLElement).classList];
//                             const originTag = getTagName(child as HTMLElement);

//                             preHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${originTag.name}>`;
//                             nextHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
//                         }
//                     } else {
//                         if (count === startChildIdx) {
//                             // 선택 시작 노드
//                             if (child.constructor.name === "Text") {
//                                 preHTMLStructor += text.substring(0, startOffset);
//                             } else {
//                                 const childClassList: string[] = [...(child as HTMLElement).classList];
//                                 const originTag = getTagName(child as HTMLElement);

//                                 preHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${originTag.name}>`;
//                             }
//                         } else if (count === endChildIdx) {
//                             // 선택 끝 노드
//                             if (child.constructor.name === "Text") {
//                                 nextHTMLStructor += text.substring(endOffset, text.length);
//                             } else {
//                                 const childClassList: string[] = [...(child as HTMLElement).classList];
//                                 const originTag = getTagName(child as HTMLElement);

//                                 nextHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
//                             }
//                         }
//                     }
//                 }
//             });

//             editableElement.innerHTML = preHTMLStructor;
//             editableElement.insertAdjacentHTML("afterend", `<li class="d-li-item ${editableElementClassList.join(" ")}">${nextHTMLStructor}</li>`);
//             setTimeout(() => {
//                 setCursor((editableElement.nextSibling as HTMLElement).childNodes[0], 0);
//                 update();
//             }, 100);
//         }
//     }
// }

// // 텍스트 엔터 이벤트
// function textEnterEvent(action: Function) {
//     const cursorData = getCursor();

//     if (cursorData.startNode) {
//         const editableElement = findEditableElement(cursorData.startNode as Node) as HTMLElement;
//         const editableElementClassList = [...editableElement.classList].slice(0, 1);
//         const startNode: Node = cursorData.startNode as Node;
//         const endNode: Node = cursorData.endNode as Node;
//         let startChild = startNode;
//         let endChild = endNode;

//         if (startNode.parentNode !== editableElement) {
//             startChild = startNode.parentNode as HTMLElement;
//         }

//         if (endNode.parentNode !== editableElement) {
//             endChild = endNode.parentNode as HTMLElement;
//         }

//         const startChildIdx: number = findChildNumber(editableElement, startChild);
//         const endChildIdx: number = findChildNumber(editableElement, endChild);

//         let startIdx: number = 0;
//         let endIdx: number = 0;
//         let startOffset: number = 0;
//         let endOffset: number = 0;
//         let preHTMLStructor: string = "";
//         let nextHTMLStructor: string = "";

//         if (startChildIdx > endChildIdx) {
//             startIdx = endChildIdx;
//             endIdx = startChildIdx;
//             startOffset = cursorData.endOffset as number;
//             endOffset = cursorData.startOffset as number;
//         } else {
//             startIdx = startChildIdx;
//             endIdx = endChildIdx;
//             startOffset = cursorData.startOffset as number;
//             endOffset = cursorData.endOffset as number;
//         }

//         if (editableElement.childNodes.length === 0 || (endChildIdx === editableElement.childNodes.length - 1 && (editableElement.childNodes[endChildIdx].textContent as string).length === endOffset)) {
//             // 텍스트 뒷부분 엔터
//             action("addBlock", {
//                 name: "text",
//             });
//         } else {
//             editableElement.childNodes.forEach((child: ChildNode, count: number) => {
//                 const text: string = child.textContent as string;

//                 if (count < startChildIdx) {
//                     // 첫부분 ~ 선택 시작 노드 직전
//                     if (child.constructor.name === "Text") {
//                         preHTMLStructor += child.textContent;
//                     } else {
//                         preHTMLStructor += (child as HTMLElement).outerHTML;
//                     }
//                 } else if (count > endChildIdx) {
//                     // 선택 끝 노드 ~ 마지막 노드
//                     if (child.constructor.name === "Text") {
//                         nextHTMLStructor += child.textContent;
//                     } else {
//                         nextHTMLStructor += (child as HTMLElement).outerHTML;
//                     }
//                 } else {
//                     if (startChildIdx === endChildIdx) {
//                         // 같은 노드일경우
//                         if (child.constructor.name === "Text") {
//                             preHTMLStructor += text.substring(0, startOffset);
//                             nextHTMLStructor += text.substring(endOffset, text.length);
//                         } else {
//                             const childClassList: string[] = [...(child as HTMLElement).classList];
//                             const originTag = getTagName(child as HTMLElement);

//                             preHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${originTag.name}>`;
//                             nextHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
//                         }
//                     } else {
//                         if (count === startChildIdx) {
//                             // 선택 시작 노드
//                             if (child.constructor.name === "Text") {
//                                 preHTMLStructor += text.substring(0, startOffset);
//                             } else {
//                                 const childClassList: string[] = [...(child as HTMLElement).classList];
//                                 const originTag = getTagName(child as HTMLElement);

//                                 preHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${originTag.name}>`;
//                             }
//                         } else if (count === endChildIdx) {
//                             // 선택 끝 노드
//                             if (child.constructor.name === "Text") {
//                                 nextHTMLStructor += text.substring(endOffset, text.length);
//                             } else {
//                                 const childClassList: string[] = [...(child as HTMLElement).classList];
//                                 const originTag = getTagName(child as HTMLElement);

//                                 nextHTMLStructor += `<${originTag.name} ${originTag.href ? `href="${originTag.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${originTag.name}>`;
//                             }
//                         }
//                     }
//                 }
//             });

//             editableElement.innerHTML = preHTMLStructor;
//             action("addBlock", {
//                 name: "text",
//                 value: { classList: editableElementClassList, content: nextHTMLStructor },
//             });
//         }
//     }
// }

// // 백스페이스 이벤트
// function backspaceEvent(type: string, event: KeyboardEvent, action: Function, update: Function) {
//     if (event.code === "Backspace") {
//         if (type === "text") {
//             const cursorData = getCursor();

//             if (cursorData.type === "Caret" && cursorData.startOffset === 0) {
//                 const editableElement = findEditableElement(cursorData.startNode as Node);
//                 let $target = cursorData.startNode as HTMLElement;

//                 if ($target.constructor.name === "Text") {
//                     $target = $target.parentNode as HTMLElement;
//                 }

//                 if ($target === editableElement) {
//                     update();
//                     event.preventDefault();
//                     action("deleteBlockLocal");
//                 }
//             }
//         }
//     }
// }

// // 키보드 이벤트 총괄
// export function keyboardEvent(type: string, event: KeyboardEvent, action: Function, update: Function) {
//     enterEvent(type, event, action, update);
//     backspaceEvent(type, event, action, update);
// }

// export function getClipboardData(data: DataTransfer) {
//     let type, clipboardData;

//     if (!data) {
//         type = null;
//     }

//     const items = data.items;

//     if (items === undefined) {
//         type = null;
//     }

//     const count = items.length;
//     for (let i = 0; i < count; i += 1) {
//         if (items[i].type.indexOf("image") === 0) {
//             type = "image";
//             clipboardData = items[i].getAsFile();
//             break;
//         }

//         type = "text";
//     }

//     if (type === "text") {
//         clipboardData = data.getData("text");
//     }

//     return {
//         type: type,
//         value: clipboardData,
//     };
// }

// export function pasteText(type: string, value: string) {
//     const selection = window.getSelection() as Selection;
//     const range = document.createRange();
//     let textNode: Text;

//     if (type !== "codeBlock") {
//         textNode = document.createTextNode(value.replace("\n", "").replace(/  +/g, " "));
//     } else {
//         textNode = document.createTextNode(value);
//     }

//     selection.deleteFromDocument();
//     selection.getRangeAt(0).insertNode(textNode);
//     range.setStart(textNode, textNode.length);
//     range.collapse(true);
//     selection.removeAllRanges();
//     selection.addRange(range);
// }

// function addBrEvent() {
//     const cursorData = getCursor();

//     if (cursorData.startNode) {
//         let $target = cursorData.startNode;
//         const preEditableElement: HTMLElement = findEditableElement($target) as HTMLElement;

//         if ($target.constructor.name === "Text") {
//             $target = $target.parentNode as HTMLElement;
//         }

//         if (preEditableElement !== $target && $target.constructor.name !== "HTMLBRElement") {
//             // 스타일 있는경우의 내려쓰기
//             let startNode = cursorData.startNode as Node;
//             let endNode = cursorData.endNode as Node;
//             let startChild = startNode as HTMLElement;
//             let endChild = endNode as HTMLElement;

//             if (startNode.parentNode !== preEditableElement) {
//                 startChild = startNode.parentNode as HTMLElement;
//             }

//             if (endNode.parentNode !== preEditableElement) {
//                 endChild = endNode.parentNode as HTMLElement;
//             }

//             const startChildIdx: number = findChildNumber(preEditableElement, startChild);
//             const endChildIdx: number = findChildNumber(preEditableElement, endChild);

//             let startIdx: number = 0;
//             let endIdx: number = 0;
//             let startOffset: number = 0;
//             let endOffset: number = 0;
//             let htmlStructure: string = "";

//             if (startChildIdx > endChildIdx) {
//                 startIdx = endChildIdx;
//                 endIdx = startChildIdx;
//                 startOffset = cursorData.endOffset as number;
//                 endOffset = cursorData.startOffset as number;
//             } else {
//                 startIdx = startChildIdx;
//                 endIdx = endChildIdx;
//                 startOffset = cursorData.startOffset as number;
//                 endOffset = cursorData.endOffset as number;
//             }

//             if (enterCount === 1) {
//                 // 문자 결합시 예외처리
//                 const text = startChild.textContent as string;
//                 startChild.textContent = text.substring(1, text.length);

//                 setCursor(startChild, 0);
//             } else {
//                 if (startNode === endNode) {
//                     // 동일 노드상 처리
//                     const text = startChild.textContent as string;
//                     const childClassList = [...startChild.classList];
//                     const tagData = getTagName(startChild);

//                     htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${tagData.name}>`;
//                     htmlStructure += `<br>`;
//                     htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${tagData.name}>`;

//                     startChild.insertAdjacentHTML("beforebegin", htmlStructure);
//                     setCursor(preEditableElement.childNodes[startChildIdx + 2], 0);
//                     startChild.remove();
//                 } else {
//                     // 다른 노드상 처리
//                     preEditableElement.childNodes.forEach((child: ChildNode, count: number) => {
//                         const type: string = child.constructor.name;
//                         const text: string = child.textContent as string;

//                         if (count > startIdx && count < endIdx) {
//                             // 동장 방어용 분기점
//                         } else if (count === startIdx) {
//                             if (type === "Text") {
//                                 htmlStructure += text.substring(0, startOffset);
//                             } else {
//                                 const childClassList: string[] = [...(child as HTMLElement).classList];
//                                 const tagData = getTagName(child as HTMLElement);

//                                 htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${tagData.name}><br>`;
//                             }
//                         } else if (count === endIdx) {
//                             if (type === "Text") {
//                                 htmlStructure += text.substring(endOffset, text.length);
//                             } else {
//                                 const childClassList: string[] = [...(child as HTMLElement).classList];
//                                 const tagData = getTagName(child as HTMLElement);

//                                 htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${tagData.name}><br>`;
//                             }
//                         } else {
//                             if (type === "Text") {
//                                 htmlStructure += child.textContent;
//                             } else {
//                                 htmlStructure += (child as HTMLElement).outerHTML;
//                             }
//                         }
//                     });

//                     preEditableElement.innerHTML = htmlStructure;
//                 }
//             }
//         } else {
//             // 스타일 없는 경우의 내려쓰기
//             const brTag = document.createElement("br");
//             const selection = window.getSelection() as Selection;
//             const range = document.createRange();

//             if (enterCount === 1) {
//                 // 문자 결합시 예외처리
//                 const nextCursorData = getCursor();
//                 const editableElement = findEditableElement(nextCursorData.startNode as HTMLElement) as HTMLElement;
//                 const childList = editableElement.childNodes;
//                 const childIdx = findChildNumber(editableElement, nextCursorData.startNode as HTMLElement);

//                 setCursor(childList[childIdx + 2], 0);
//             } else {
//                 // 영문 등 일반문자 엔터 처리
//                 selection.deleteFromDocument();
//                 selection.getRangeAt(0).insertNode(brTag);
//                 range.setStart(brTag, 0);
//                 range.collapse(true);
//                 selection.removeAllRanges();
//                 selection.addRange(range);

//                 const nextCursorData = getCursor();
//                 const editableElement = findEditableElement(nextCursorData.startNode as HTMLElement) as HTMLElement;
//                 const childList = editableElement.childNodes;
//                 const childIdx = findChildNumber(editableElement, nextCursorData.startNode as HTMLElement);
//                 let hasText = false;

//                 childList.forEach((row) => {
//                     if (row.constructor.name === "Text") {
//                         hasText = true;
//                     }
//                 });

//                 if (hasText) {
//                     if (childList[childIdx + 1].textContent?.length === 0) {
//                         if (childList[childIdx + 2]) {
//                             if (childList[childIdx + 2].constructor.name == "HTMLBRElement") {
//                                 setCursor(childList[childIdx + 1], 0);
//                             } else {
//                                 (childList[childIdx] as HTMLElement).insertAdjacentHTML("beforebegin", "<br>");
//                             }
//                         } else {
//                             (childList[childIdx] as HTMLElement).insertAdjacentHTML("beforebegin", "<br>");
//                         }
//                     } else {
//                         setCursor(childList[childIdx + 1], 0);
//                     }
//                 } else {
//                     (childList[childIdx] as HTMLElement).insertAdjacentHTML("beforebegin", "<br>");
//                 }
//             }
//         }
//     }
// }

// // 리스트용 BR 이벤트
// function addBrEventWithList() {
//     const cursorData = getCursor();

//     if (cursorData.startNode) {
//         let $target = cursorData.startNode;
//         const preEditableElement: HTMLElement = findLiElement($target) as HTMLElement;

//         if ($target.constructor.name === "Text") {
//             $target = $target.parentNode as HTMLElement;
//         }

//         if (preEditableElement !== $target && $target.constructor.name !== "HTMLBRElement") {
//             // 스타일 있는경우의 내려쓰기
//             let startNode = cursorData.startNode as Node;
//             let endNode = cursorData.endNode as Node;
//             let startChild = startNode as HTMLElement;
//             let endChild = endNode as HTMLElement;

//             if (startNode.parentNode !== preEditableElement) {
//                 startChild = startNode.parentNode as HTMLElement;
//             }

//             if (endNode.parentNode !== preEditableElement) {
//                 endChild = endNode.parentNode as HTMLElement;
//             }

//             const startChildIdx: number = findChildNumber(preEditableElement, startChild);
//             const endChildIdx: number = findChildNumber(preEditableElement, endChild);

//             let startIdx: number = 0;
//             let endIdx: number = 0;
//             let startOffset: number = 0;
//             let endOffset: number = 0;
//             let htmlStructure: string = "";

//             if (startChildIdx > endChildIdx) {
//                 startIdx = endChildIdx;
//                 endIdx = startChildIdx;
//                 startOffset = cursorData.endOffset as number;
//                 endOffset = cursorData.startOffset as number;
//             } else {
//                 startIdx = startChildIdx;
//                 endIdx = endChildIdx;
//                 startOffset = cursorData.startOffset as number;
//                 endOffset = cursorData.endOffset as number;
//             }

//             if (enterCount === 1) {
//                 // 문자 결합시 예외처리
//                 const text = startChild.textContent as string;
//                 startChild.textContent = text.substring(1, text.length);

//                 setCursor(startChild, 0);
//             } else {
//                 if (startNode === endNode) {
//                     // 동일 노드상 처리
//                     const text = startChild.textContent as string;
//                     const childClassList = [...startChild.classList];
//                     const tagData = getTagName(startChild);

//                     htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${tagData.name}>`;
//                     htmlStructure += `<br>`;
//                     htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${tagData.name}>`;

//                     startChild.insertAdjacentHTML("beforebegin", htmlStructure);
//                     setCursor(preEditableElement.childNodes[startChildIdx + 2], 0);
//                     startChild.remove();
//                 } else {
//                     // 다른 노드상 처리
//                     preEditableElement.childNodes.forEach((child: ChildNode, count: number) => {
//                         const type: string = child.constructor.name;
//                         const text: string = child.textContent as string;

//                         if (count > startIdx && count < endIdx) {
//                             // 동장 방어용 분기점
//                         } else if (count === startIdx) {
//                             if (type === "Text") {
//                                 htmlStructure += text.substring(0, startOffset);
//                             } else {
//                                 const childClassList: string[] = [...(child as HTMLElement).classList];
//                                 const tagData = getTagName(child as HTMLElement);

//                                 htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(0, startOffset)}</${tagData.name}><br>`;
//                             }
//                         } else if (count === endIdx) {
//                             if (type === "Text") {
//                                 htmlStructure += text.substring(endOffset, text.length);
//                             } else {
//                                 const childClassList: string[] = [...(child as HTMLElement).classList];
//                                 const tagData = getTagName(child as HTMLElement);

//                                 htmlStructure += `<${tagData.name} ${tagData.href ? `href="${tagData.href}" rel="nofollow"` : ""} class="${childClassList.join(" ")}">${text.substring(endOffset, text.length)}</${tagData.name}><br>`;
//                             }
//                         } else {
//                             if (type === "Text") {
//                                 htmlStructure += child.textContent;
//                             } else {
//                                 htmlStructure += (child as HTMLElement).outerHTML;
//                             }
//                         }
//                     });

//                     preEditableElement.innerHTML = htmlStructure;
//                 }
//             }
//         } else {
//             // 스타일 없는 경우의 내려쓰기
//             const brTag = document.createElement("br");
//             const selection = window.getSelection() as Selection;
//             const range = document.createRange();

//             console.log("br");

//             if (enterCount === 1) {
//                 // 문자 결합시 예외처리
//                 const nextCursorData = getCursor();
//                 const editableElement = findEditableElement(nextCursorData.startNode as HTMLElement) as HTMLElement;
//                 const childList = editableElement.childNodes;
//                 const childIdx = findChildNumber(editableElement, nextCursorData.startNode as HTMLElement);

//                 setCursor(childList[childIdx + 2], 0);
//             } else {
//                 // 영문 등 일반문자 엔터 처리
//                 selection.deleteFromDocument();
//                 selection.getRangeAt(0).insertNode(brTag);
//                 range.setStart(brTag, 0);
//                 range.collapse(true);
//                 selection.removeAllRanges();
//                 selection.addRange(range);

//                 const nextCursorData = getCursor();
//                 const editableElement = findEditableElement(nextCursorData.startNode as HTMLElement) as HTMLElement;
//                 const childList = editableElement.childNodes;
//                 const childIdx = findChildNumber(editableElement, nextCursorData.startNode as HTMLElement);
//                 let hasText = false;

//                 childList.forEach((row) => {
//                     if (row.constructor.name === "Text") {
//                         hasText = true;
//                     }
//                 });

//                 if (hasText) {
//                     if (childList[childIdx + 1].textContent?.length === 0) {
//                         if (childList[childIdx + 2]) {
//                             if (childList[childIdx + 2].constructor.name == "HTMLBRElement") {
//                                 setCursor(childList[childIdx + 1], 0);
//                             } else {
//                                 (childList[childIdx] as HTMLElement).insertAdjacentHTML("beforebegin", "<br>");
//                             }
//                         } else {
//                             (childList[childIdx] as HTMLElement).insertAdjacentHTML("beforebegin", "<br>");
//                         }
//                     } else {
//                         setCursor(childList[childIdx + 1], 0);
//                     }
//                 } else {
//                     (childList[childIdx] as HTMLElement).insertAdjacentHTML("beforebegin", "<br>");
//                 }
//             }
//         }
//     }
// }

// 모든 키보드 이벤트 시작점
let enterCount: number = 0;
export function keyboardEvent(e: KeyboardEvent, type: string, idx: number) {
    switch (e.code) {
        case "Enter":
            if (enterCount === 0) {
                if (type === "codeblock") {
                    // TODO : 코드블럭 엔터처리
                } else {
                    e.preventDefault();
                    enterEvent(type, idx);
                }
            } else {
                e.preventDefault();
            }

            enterCount += 1;
            setTimeout(() => {
                enterCount = 0;
            }, 150);
            break;
        case "ArrowUp":
            e.preventDefault();
            console.log("ArrowUp");
            break;
        case "ArrowDown":
            e.preventDefault();
            console.log("ArrowDown");
            break;
        case "Space":
            // e.preventDefault();
            console.log("Space");
            break;
        case "Backspace":
            // e.preventDefault();
            console.log("Backspace");
            break;
        default:
            defaultEvent(e, type, idx);
    }
}

// 엔터 이벤트
function enterEvent(type: string, idx: number) {
    store.editorData.value.splice(idx + 1, 0, createTextBlock());
    console.log("type", type);
    console.log(store.rowList);
    console.log("Enter event");
    store.editorKey.value += 1;
}

// 기본 이벤트
let defaultEventFn: NodeJS.Timeout;
function defaultEvent(e: KeyboardEvent, type: string, idx: number) {
    clearTimeout(defaultEventFn);
    defaultEventFn = setTimeout(() => {
        const $target = e.target;

        switch (type) {
            case "text":
                const pTag = $target as HTMLParagraphElement;

                (store.editorData.value[idx] as TextBlock).content = pTag.innerHTML;
                (store.editorData.value[idx] as TextBlock).classList = [...pTag.classList].splice(1);
                // store.updateModelValue();
                break;
        }
    }, 1000);
}
