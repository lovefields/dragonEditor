import type EditorInit from "./init";
import { findContentEditableElement } from "./element";
import { setCursor, setCursorData, soltingCursorDataOnElement } from "./cursor";

export function setStyle(type: string, store: EditorInit) {
    if (store.cursorData !== null) {
        const $editableElement = findContentEditableElement(store.cursorData.startNode as HTMLElement);

        if ($editableElement !== null) {
            switch (type) {
                case "bold":
                    setNodeStyle("de-bold", store, $editableElement);
                    break;
                case "italic":
                    setNodeStyle("de-italic", store, $editableElement);
                    break;
            }
        }
    }
}

function setNodeStyle(className: string, store: EditorInit, $element: HTMLElement) {
    if (store.cursorData.type === "Caret") {
        // 단일 커서인 경우
        if ($element.hasChildNodes() === true) {
            // 자식노드가 있는 경우
            let $target = store.cursorData.startNode;

            if ($target.constructor.name === "Text") {
                // 텍스트 노드인 경우
                const $parentElement: HTMLElement = $target.parentElement;

                if ($parentElement === $element) {
                    // 부모가 최상위 노드인 경우
                    const childList = $element.childNodes;
                    let targetIdx: number = -1;
                    let structure: string = "";
                    let cursorOffset: number = 0;

                    for (let i = 0; childList.length > i; i += 1) {
                        if ($target === childList[i]) {
                            targetIdx = i;
                            break;
                        }
                    }

                    childList.forEach((node, i) => {
                        if (i === targetIdx) {
                            // 대상 노드인 경우
                            structure += `<span class="${className}">${node.textContent}</span>`;
                            cursorOffset = node.textContent.length;
                        } else {
                            // 대상 노드가 아닌 경우
                            structure += (node as HTMLElement).outerHTML;
                        }
                    });

                    $element.innerHTML = structure;
                    setCursor($element.childNodes[targetIdx] as Element, cursorOffset);
                    setCursorData(store);
                } else {
                    // 부모가 최상위 노드가 아닌 경우
                    const classList: string[] = [...$parentElement.classList];
                    const classIdx: number = classList.indexOf(className);

                    if (classIdx === -1) {
                        // 클레스가 없는 경우
                        $parentElement.classList.add(className);
                        setCursor($parentElement.childNodes[0] as Element, store.cursorData.startOffset);
                    } else {
                        // 클레스가 있는 경우
                        if (classList.length === 1) {
                            // 마지막 클레스인 경우
                            $parentElement.insertAdjacentText("afterend", $parentElement.textContent);
                            setCursor($parentElement.nextSibling as Element, store.cursorData.startOffset);
                            $parentElement.remove();
                        } else {
                            // 다른 클레스가 있는 경우
                            $parentElement.classList.remove(className);
                            setCursor($parentElement.childNodes[0] as Element, store.cursorData.startOffset);
                        }
                    }

                    setCursorData(store);
                }
            }
        }
    } else {
        // 범위 선택인 경우
        const cursorData = soltingCursorDataOnElement(store.cursorData, $element);
        let structure: string = "";

        if (cursorData.startNodeIdx === cursorData.endNodeIdx) {
            // 같은 노드인 경우
            if (cursorData.startNode.constructor.name === "Text") {
                // 텍스트인 경우
            } else {
                // 엘리먼트인 경우
                const $target = cursorData.startNode as HTMLElement;

                if ($target.tagName !== "A") {
                    // 일반 태그의 경우만 허용
                    const classList = [...$target.classList];
                    const classIdx = classList.indexOf(className);
                    let isDuble: boolean = false;

                    if (classIdx === -1) {
                        // 클레스 없는 경우
                        if (cursorData.startOffset !== 0) {
                            structure += `<span class="${classList.join(" ")}">${$target.textContent.slice(0, cursorData.startOffset)}</span>`;
                            isDuble = true;
                        }

                        structure += `<span class="${classList.join(" ")} ${className}">${$target.textContent.slice(cursorData.startOffset, cursorData.endOffset)}</span>`;

                        if (cursorData.endOffset !== $target.textContent.length) {
                            structure += `<span class="${classList.join(" ")}">${$target.textContent.slice(cursorData.endOffset)}</span>`;
                        }
                    } else {
                        // 클레스 있는 경우
                        if (cursorData.startOffset !== 0) {
                            structure += `<span class="${classList.join(" ")}">${$target.textContent.slice(0, cursorData.startOffset)}</span>`;
                            isDuble = true;
                        }

                        if (classList.length === 1) {
                            // 마지막 클레스인 경우
                            structure += $target.textContent.slice(cursorData.startOffset, cursorData.endOffset);
                        } else {
                            // 다른 클레스도 존재하는 경우
                            const copyList = [...classList];

                            copyList.splice(classIdx, 1);
                            structure += `<span class="${copyList.join(" ")}">${$target.textContent.slice(cursorData.startOffset, cursorData.endOffset)}</span>`;
                        }

                        if (cursorData.endOffset !== $target.textContent.length) {
                            structure += `<span class="${classList.join(" ")}">${$target.textContent.slice(cursorData.endOffset)}</span>`;
                        }
                    }

                    $target.insertAdjacentHTML("afterend", structure);

                    let $nextElement = $target.nextSibling;

                    if (isDuble === true) {
                        $nextElement = $nextElement.nextSibling;
                    }

                    $target.remove();
                    setCursor($nextElement as Element, cursorData.endOffset - cursorData.startOffset);
                }
            }
        } else {
            // 다른 노드인 경우
            console.log("wrong");

            // $element.childNodes.forEach((childNode: ChildNode, i: number) => {});
        }
    }

    // console.log("store.cursorData.startNode", store.cursorData.startNode);
    // console.log("$element", $element);
}
