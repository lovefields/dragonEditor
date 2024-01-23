import type EditorInit from "./init";
import { findContentEditableElement } from "./element";
import { setCursor, setCursorData } from "./cursor";

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
                    const tagName: string = $parentElement.tagName.toLocaleLowerCase();
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
            } else {
                // 엘리먼트인 경우
                console.log("i'm element");
            }
        }
    } else {
        // 범위 선택인 경우

        console.log(store.cursorData);
    }

    // console.log("store.cursorData.startNode", store.cursorData.startNode);
    // console.log("$element", $element);
}
