import type EditorInit from "./init";
import { findContentEditableElement } from "./element";
import { setCursor, setCursorData, soltingCursorDataOnElement, setRangeCursor } from "./cursor";
import message from "./message";

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

        setCursorData(store);
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
                } else {
                    // 부모가 최상위 노드가 아닌 경우
                    if ($parentElement.tagName === "A") {
                        alert(message.linkTextNoStyle);
                    }

                    if ($parentElement.tagName === "SPAN") {
                        // 일반 태그인 경우만 허용
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
                    }
                }
            }
        }
    } else {
        // 범위 선택인 경우
        const cursorData = soltingCursorDataOnElement(store.cursorData, $element);
        let structure: string = "";
        let isDuble: boolean = false;

        if (cursorData.startNodeIdx === cursorData.endNodeIdx) {
            // 같은 노드인 경우
            if (cursorData.startNode.constructor.name === "Text") {
                // 텍스트인 경우

                $element.childNodes.forEach((childNode: ChildNode, i: number) => {
                    if (cursorData.startNodeIdx === i) {
                        // 해당 노드인 경우
                        if (cursorData.startOffset !== 0) {
                            structure += childNode.textContent.slice(0, cursorData.startOffset);
                            isDuble = true;
                        }

                        structure += `<span class="${className}">${childNode.textContent.slice(cursorData.startOffset, cursorData.endOffset)}</span>`;

                        if (cursorData.endOffset !== childNode.textContent.length) {
                            structure += childNode.textContent.slice(cursorData.endOffset);
                        }
                    } else {
                        // 해당 노드가 아닌 경우
                        if (childNode.constructor.name === "Text") {
                            structure += childNode.textContent;
                        } else {
                            structure += (childNode as HTMLElement).outerHTML;
                        }
                    }
                });

                let childNumber: number = cursorData.startNodeIdx;

                // @ts-ignore : IDE 인식 못함
                if (isDuble === true) {
                    childNumber += 1;
                }

                $element.innerHTML = structure;
                setCursor($element.childNodes[childNumber] as Element, cursorData.endOffset - cursorData.startOffset);
            } else {
                // 엘리먼트인 경우
                const $target = cursorData.startNode as HTMLElement;

                if ($target.tagName !== "A") {
                    // 일반 태그의 경우만 허용
                    const classList = [...$target.classList];
                    const classIdx = classList.indexOf(className);

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
            let isAnchorElement: boolean = false;
            let isWrap: boolean = false;
            let startNodeIdx: number = cursorData.startNodeIdx;
            let startOffset: number = cursorData.startOffset;
            let endNodeIdx: number = cursorData.endNodeIdx;
            let endOffset: number = cursorData.endOffset;
            let structureArray: string[] = [];

            $element.childNodes.forEach((childNode: ChildNode, i: number) => {
                if (cursorData.startNodeIdx > i) {
                    // 이전 노드인 경우
                    if (childNode.constructor.name === "Text") {
                        structureArray.push(childNode.textContent);
                    } else {
                        structureArray.push((childNode as HTMLElement).outerHTML);
                    }
                }

                if (cursorData.startNodeIdx === i) {
                    // 첫번째 노드인 경우
                    const preTextContent = childNode.textContent.slice(0, cursorData.startOffset);
                    const textContent = childNode.textContent.slice(cursorData.startOffset);

                    if (childNode.constructor.name === "Text") {
                        structureArray.push(preTextContent);
                        structureArray.push(`<span class="${className}">${textContent}</span>`);
                        isWrap = true;

                        if (cursorData.startOffset !== 0) {
                            isDuble = true;
                        }
                    } else {
                        const $targetNode = childNode as HTMLElement;
                        const classList = [...$targetNode.classList];
                        const classIdx = classList.indexOf(className);

                        if ($targetNode.tagName === "SPAN") {
                            if (classIdx === -1) {
                                // 클레스가 없는 경우
                                if (preTextContent !== "") {
                                    structureArray.push(`<span class="${classList.join(" ")}">${preTextContent}</span>`);
                                }
                                structureArray.push(`<span class="${classList.join(" ")} ${className}">${textContent}</span>`);
                                isWrap = true;
                            } else {
                                // 클레스가 있는 경우
                                if (classList.length === 1) {
                                    // 마지막 클레스인 경우
                                    if (preTextContent !== "") {
                                        structureArray.push(`<span class="${classList.join(" ")}">${preTextContent}</span>`);
                                    }
                                    structureArray.push(textContent);
                                } else {
                                    // 마지막 클레스가 아닌 경우
                                    const newClassList = [...classList];
                                    newClassList.splice(classIdx, 1);

                                    if (preTextContent !== "") {
                                        structureArray.push(`<span class="${classList.join(" ")}">${preTextContent}</span>`);
                                    }
                                    structureArray.push(`<span class="${newClassList.join(" ")}">${textContent}</span>`);
                                }
                            }
                        } else {
                            isAnchorElement = true;
                        }
                    }
                }

                if (cursorData.startNodeIdx < i && cursorData.endNodeIdx > i) {
                    // 첫번쨰 노드와 마지막 노드의 사이에 있는 노드인 경우
                    if (childNode.constructor.name === "Text") {
                        if (isWrap === true) {
                            structureArray.push(`<span class="${className}">${childNode.textContent}</span>`);
                        } else {
                            structureArray.push(childNode.textContent);
                        }
                    } else {
                        const $targetNode = childNode as HTMLElement;
                        const classList = [...$targetNode.classList];
                        const classIdx = classList.indexOf(className);
                        if ($targetNode.tagName === "SPAN") {
                            if (isWrap === true) {
                                // 첫 시작점이 부여인 경우
                                if (classIdx === -1) {
                                    // 클레스가 없는 경우
                                    structureArray.push(`<span class="${classList.join(" ")} ${className}">${childNode.textContent}</span>`);
                                } else {
                                    // 클레스가 있는 경우
                                    structureArray.push((childNode as HTMLElement).outerHTML);
                                }
                            } else {
                                // 첫 시작점이 부여가 아닌 경우
                                if (classIdx === -1) {
                                    // 클레스가 없는 경우
                                    structureArray.push((childNode as HTMLElement).outerHTML);
                                } else {
                                    // 클레스가 있는 경우
                                    if (classList.length === 1) {
                                        // 마지막 클레스인 경우
                                        structureArray.push(childNode.textContent);
                                    } else {
                                        // 다른 클레스가 있는 경우
                                        const newClassList = [...classList];
                                        newClassList.splice(classIdx, 1);
                                        structureArray.push(`<span class="${newClassList.join(" ")}">${childNode.textContent}</span>`);
                                    }
                                }
                            }
                        } else {
                            isAnchorElement = true;
                        }
                    }
                }

                if (cursorData.endNodeIdx === i) {
                    // 마지막 노드인 경우
                    const textContent = childNode.textContent.slice(0, cursorData.endOffset);
                    const endTextContent = childNode.textContent.slice(cursorData.endOffset);

                    if (childNode.constructor.name === "Text") {
                        structureArray.push(`<span class="${className}">${textContent}</span>`);
                        structureArray.push(endTextContent);
                    } else {
                        const $targetNode = childNode as HTMLElement;
                        const classList = [...$targetNode.classList];
                        const classIdx = classList.indexOf(className);

                        if ($targetNode.tagName === "SPAN") {
                            if (classIdx === -1) {
                                // 클레스가 없는 경우
                                structureArray.push(`<span class="${classList.join(" ")} ${className}">${textContent}</span>`);
                                if (endTextContent !== "") {
                                    structureArray.push(`<span class="${classList.join(" ")}">${endTextContent}</span>`);
                                }
                            } else {
                                // 클레스가 있는 경우
                                if (classList.length === 1) {
                                    // 마지막 클레스인 경우
                                    structureArray.push(textContent);
                                    if (endTextContent !== "") {
                                        structureArray.push(`<span class="${classList.join(" ")}">${endTextContent}</span>`);
                                    }
                                } else {
                                    // 마지막 클레스가 아닌 경우
                                    const newClassList = [...classList];
                                    newClassList.splice(classIdx, 1);

                                    structureArray.push(`<span class="${newClassList.join(" ")}">${textContent}</span>`);
                                    if (endTextContent !== "") {
                                        structureArray.push(`<span class="${classList.join(" ")}">${endTextContent}</span>`);
                                    }
                                }
                            }
                        } else {
                            isAnchorElement = true;
                        }
                    }
                }

                if (cursorData.endNodeIdx < i) {
                    // 이후 노드인 경우
                    if (childNode.constructor.name === "Text") {
                        structureArray.push(childNode.textContent);
                    } else {
                        structureArray.push((childNode as HTMLElement).outerHTML);
                    }
                }
            });

            $element.innerHTML = structureArray.join("");

            // @ts-ignore : IDE가 인식 못함
            if (isWrap === true) {
                // @ts-ignore : IDE가 인식 못함
                if (isDuble === true) {
                    startNodeIdx += 1;
                    endNodeIdx += 1;
                    startOffset = 0;
                }
            } else {
                let startMinusCount: number = 0;
                let endMinusCount: number = 0;
                let startOffsetCount: number = 0;
                let tagReg = new RegExp("(<([^>]+)>)", "i");

                structureArray.forEach((string: string, i: number) => {
                    if (startNodeIdx === i) {
                        startNodeIdx -= startMinusCount;
                        startOffset = startOffsetCount;
                    }

                    if (endNodeIdx === i) {
                        endNodeIdx -= endMinusCount - 1;
                    }

                    if (tagReg.test(string) === true) {
                        startMinusCount = 0;
                        startOffsetCount = 0;
                    } else {
                        startMinusCount += 1;
                        endMinusCount += 1;
                        startOffsetCount += string.length;
                    }
                });
            }

            setRangeCursor($element.childNodes[startNodeIdx] as Element, $element.childNodes[endNodeIdx] as Element, startOffset, endOffset);

            // @ts-ignore : IDE가 인식 못함
            if (isAnchorElement === true) {
                alert(message.linkTextNoStyle);
            }
        }
    }
}
