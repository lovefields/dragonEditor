import type { Ref } from "vue";
import { _setRangeCursor, _sortingCursorDataOnElement, _updateModelData, _updateCursorData, _setCursor } from "../event";
import { _findContentEditableElement, _findPoverTextNode } from "../node";
import type { DragonEditorStore, DEBlock, DETextalign } from "../../type.d.mts";

// 텍스트 스타일 적용
export function _setDecoration(className: string, store: Ref<DragonEditorStore>): void {
    if (store.value.cursorData !== null && store.value.controlStatus.$currentBlock !== null) {
        const cursorData = store.value.cursorData;
        const typeIgnoreList: DEBlock[] = ["image", "code", "custom"];

        if (typeIgnoreList.includes(store.value.controlStatus.currentBlockType) === false) {
            // 제외 타입에 해당하지 않는 경우만 적용

            const $element = _findContentEditableElement(cursorData.startNode);

            if ($element !== null) {
                // 에디팅이 가능한 상태인 경우만 적용

                if (cursorData.type === "Caret") {
                    // 단일 커서인 경우

                    if ($element.hasChildNodes() === true) {
                        // 자식노드가 있는 경우만 적용

                        let $target = cursorData.startNode;

                        if ($target.constructor.name === "Text") {
                            // 텍스트 노드인 경우

                            const $parentElement = $target.parentElement as HTMLElement;

                            if ($parentElement === $element) {
                                // 부모가 최상위 노드인 경우

                                let childList = $element.childNodes;
                                let targetIdx: number = -1;
                                let structure: string = "";
                                for (let i = 0; childList.length > i; i += 1) {
                                    if ($target === childList[i]) {
                                        targetIdx = i;
                                        break;
                                    }
                                }

                                // 분리된 텍스트 노드 합치기
                                targetIdx = _findPoverTextNode(childList[targetIdx] as Element, targetIdx);
                                $element.innerHTML = $element.innerHTML;
                                childList = $element.childNodes;
                                childList.forEach((node, i) => {
                                    if (i === targetIdx) {
                                        // 대상 노드인 경우
                                        structure += `<span class="${className}">${node.textContent}</span>`;
                                    } else {
                                        // 대상 노드가 아닌 경우
                                        if (node.constructor.name === "Text") {
                                            structure += node.textContent;
                                        } else {
                                            structure += (node as HTMLElement).outerHTML;
                                        }
                                    }
                                });

                                $element.innerHTML = structure;

                                const targetElement: Element = $element.childNodes[targetIdx] as Element;

                                _setRangeCursor(targetElement, targetElement, 0, targetElement.textContent?.length ?? 0);
                            } else {
                                // 부모가 최상위 노드가 아닌 경우

                                if ($parentElement.tagName === "SPAN") {
                                    // 일반 태그인 경우만 허용

                                    const classList: string[] = $parentElement.classList.value.split(" ");
                                    const classIdx: number = classList.indexOf(className);

                                    if (classIdx === -1) {
                                        // 클레스가 없는 경우

                                        $parentElement.classList.add(className);
                                        const targetNode = $parentElement.childNodes[0] as Element;
                                        _setRangeCursor(targetNode, targetNode, 0, targetNode.textContent?.length ?? 0);
                                    } else {
                                        // 클레스가 있는 경우

                                        if (classList.length === 1) {
                                            // 마지막 클레스인 경우

                                            $parentElement.insertAdjacentText("afterend", $parentElement.textContent as string);
                                            const targetNode = $parentElement.nextSibling as Element;
                                            $parentElement.remove();
                                            _setRangeCursor(targetNode, targetNode, 0, targetNode.textContent?.length ?? 0);
                                        } else {
                                            // 다른 클레스가 있는 경우

                                            $parentElement.classList.remove(className);
                                            const targetNode = $parentElement.childNodes[0] as Element;
                                            _setRangeCursor(targetNode, targetNode, 0, targetNode.textContent?.length ?? 0);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // 범위 선택인 경우

                    const newCursorData = _sortingCursorDataOnElement(cursorData, $element);
                    let structure: string = "";
                    let isDuble: boolean = false;

                    if (newCursorData.startNodeIdx === newCursorData.endNodeIdx) {
                        // 같은 노드인 경우

                        if (newCursorData.startNode.constructor.name === "Text") {
                            // 텍스트인 경우

                            $element.childNodes.forEach((childNode: ChildNode, i: number) => {
                                if (newCursorData.startNodeIdx === i) {
                                    // 해당 노드인 경우

                                    if (newCursorData.startOffset !== 0) {
                                        structure += (childNode.textContent as string).slice(0, newCursorData.startOffset);
                                        isDuble = true;
                                    }

                                    structure += `<span class="${className}">${(childNode.textContent as string).slice(newCursorData.startOffset, newCursorData.endOffset)}</span>`;

                                    if (newCursorData.endOffset !== (childNode.textContent as string).length) {
                                        structure += (childNode.textContent as string).slice(newCursorData.endOffset);
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

                            let childNumber: number = newCursorData.startNodeIdx;

                            // @ts-ignore : 반복문 이슈
                            if (isDuble === true) {
                                childNumber += 1;
                            }

                            $element.innerHTML = structure;

                            const targetNode = $element.childNodes[childNumber] as Element;

                            _setRangeCursor(targetNode, targetNode, 0, targetNode.textContent?.length ?? 0);
                        } else {
                            // 엘리먼트인 경우

                            const $target = newCursorData.startNode as HTMLElement;

                            if ($target.tagName !== "A") {
                                // 일반 태그의 경우만 허용

                                const classList = $target.classList.value.split(" ");
                                const classIdx = classList.indexOf(className);

                                if (classIdx === -1) {
                                    // 클레스 없는 경우

                                    if (newCursorData.startOffset !== 0) {
                                        structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(0, newCursorData.startOffset)}</span>`;
                                        isDuble = true;
                                    }

                                    structure += `<span class="${classList.join(" ")} ${className}">${($target.textContent as string).slice(newCursorData.startOffset, newCursorData.endOffset)}</span>`;

                                    if (newCursorData.endOffset !== ($target.textContent as string).length) {
                                        structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(newCursorData.endOffset)}</span>`;
                                    }
                                } else {
                                    // 클레스 있는 경우

                                    if (newCursorData.startOffset !== 0) {
                                        structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(0, newCursorData.startOffset)}</span>`;
                                        isDuble = true;
                                    }

                                    if (classList.length === 1) {
                                        // 마지막 클레스인 경우

                                        structure += ($target.textContent as string).slice(newCursorData.startOffset, newCursorData.endOffset);
                                    } else {
                                        // 다른 클레스도 존재하는 경우

                                        const copyList = [...classList];

                                        copyList.splice(classIdx, 1);
                                        structure += `<span class="${copyList.join(" ")}">${($target.textContent as string).slice(newCursorData.startOffset, newCursorData.endOffset)}</span>`;
                                    }

                                    if (newCursorData.endOffset !== ($target.textContent as string).length) {
                                        structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(newCursorData.endOffset)}</span>`;
                                    }
                                }

                                $target.insertAdjacentHTML("afterend", structure);

                                let $nextElement = $target.nextSibling as HTMLElement;

                                if (isDuble === true) {
                                    $nextElement = $nextElement.nextSibling as HTMLElement;
                                }

                                $target.remove();

                                const targetNode = $nextElement as Element;

                                _setRangeCursor(targetNode, targetNode, 0, targetNode.textContent?.length ?? 0);
                            } else {
                                alert(store.value.message.linkTextNoStyle);
                            }
                        }
                    } else {
                        // 다른 노드인 경우

                        let isAnchorElement: boolean = false;
                        let isWrap: boolean = false;
                        let startNodeIdx: number = newCursorData.startNodeIdx;
                        let startOffset: number = newCursorData.startOffset;
                        let endNodeIdx: number = newCursorData.endNodeIdx;
                        let endOffset: number = newCursorData.endOffset;
                        let structureArray: string[] = [];

                        $element.childNodes.forEach((childNode: ChildNode, i: number) => {
                            const $elementNode = childNode as HTMLElement;
                            let isText = childNode.constructor.name === "Text";

                            if (newCursorData.startNodeIdx > i) {
                                // 이전 노드인 경우

                                if (isText === true) {
                                    structureArray.push(childNode.textContent as string);
                                } else {
                                    structureArray.push($elementNode.outerHTML);
                                }
                            }

                            if (newCursorData.startNodeIdx === i) {
                                // 첫번째 노드인 경우

                                const preTextContent = (childNode.textContent as string).slice(0, newCursorData.startOffset);
                                const textContent = (childNode.textContent as string).slice(newCursorData.startOffset);

                                if (isText === true) {
                                    structureArray.push(preTextContent);
                                    structureArray.push(`<span class="${className}">${textContent}</span>`);
                                    isWrap = true;

                                    if (newCursorData.startOffset !== 0) {
                                        isDuble = true;
                                    }
                                } else {
                                    const classList = $elementNode.classList.value.split(" ");
                                    const classIdx = classList.indexOf(className);

                                    if ($elementNode.tagName === "SPAN") {
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
                                    } else if ($elementNode.tagName === "BR") {
                                        structureArray.push("<br>");
                                    } else {
                                        isAnchorElement = true;
                                    }
                                }
                            }

                            if (newCursorData.startNodeIdx < i && newCursorData.endNodeIdx > i) {
                                // 첫번쨰 노드와 마지막 노드의 사이에 있는 노드인 경우

                                if (isText === true) {
                                    if (isWrap === true) {
                                        structureArray.push(`<span class="${className}">${childNode.textContent}</span>`);
                                    } else {
                                        structureArray.push(childNode.textContent as string);
                                    }
                                } else {
                                    const classList = $elementNode.classList.value.split(" ");
                                    const classIdx = classList.indexOf(className);

                                    if ($elementNode.tagName === "SPAN") {
                                        if (isWrap === true) {
                                            // 첫 시작점이 부여인 경우

                                            if (classIdx === -1) {
                                                // 클레스가 없는 경우

                                                structureArray.push(`<span class="${classList.join(" ")} ${className}">${childNode.textContent}</span>`);
                                            } else {
                                                // 클레스가 있는 경우

                                                structureArray.push($elementNode.outerHTML);
                                            }
                                        } else {
                                            // 첫 시작점이 부여가 아닌 경우

                                            if (classIdx === -1) {
                                                // 클레스가 없는 경우

                                                structureArray.push($elementNode.outerHTML);
                                            } else {
                                                // 클레스가 있는 경우

                                                if (classList.length === 1) {
                                                    // 마지막 클레스인 경우

                                                    structureArray.push(childNode.textContent as string);
                                                } else {
                                                    // 다른 클레스가 있는 경우

                                                    const newClassList = [...classList];

                                                    newClassList.splice(classIdx, 1);
                                                    structureArray.push(`<span class="${newClassList.join(" ")}">${childNode.textContent}</span>`);
                                                }
                                            }
                                        }
                                    } else if ($elementNode.tagName === "BR") {
                                        structureArray.push("<br>");
                                    } else {
                                        isAnchorElement = true;
                                    }
                                }
                            }

                            if (newCursorData.endNodeIdx === i) {
                                // 마지막 노드인 경우

                                const textContent = (childNode.textContent as string).slice(0, newCursorData.endOffset);
                                const endTextContent = (childNode.textContent as string).slice(newCursorData.endOffset);

                                if (isText === true) {
                                    if (isWrap === true) {
                                        structureArray.push(`<span class="${className}">${textContent}</span>`);
                                        structureArray.push(endTextContent);
                                    } else {
                                        structureArray.push(childNode.textContent as string);
                                    }
                                } else {
                                    const classList = $elementNode.classList.value.split(" ");
                                    const classIdx = classList.indexOf(className);

                                    if ($elementNode.tagName === "SPAN") {
                                        if (isWrap === true) {
                                            if (classIdx === -1) {
                                                // 클레스가 없는 경우

                                                structureArray.push(`<span class="${classList.join(" ")} ${className}">${textContent}</span>`);

                                                if (endTextContent !== "") {
                                                    structureArray.push(`<span class="${classList.join(" ")}">${endTextContent}</span>`);
                                                }
                                            } else {
                                                // 클레스가 있는 경우

                                                structureArray.push($elementNode.outerHTML);
                                            }
                                        } else {
                                            if (classIdx === -1) {
                                                // 클레스가 없는 경우

                                                structureArray.push($elementNode.outerHTML);
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
                                        }
                                    } else if ($elementNode.tagName === "BR") {
                                        structureArray.push("<br>");
                                    } else {
                                        isAnchorElement = true;
                                    }
                                }
                            }

                            if (newCursorData.endNodeIdx < i) {
                                // 이후 노드인 경우

                                if (isText === true) {
                                    structureArray.push(childNode.textContent as string);
                                } else {
                                    structureArray.push($elementNode.outerHTML);
                                }
                            }
                        });

                        if (isAnchorElement === false) {
                            $element.innerHTML = structureArray.join("");

                            // @ts-ignore : 반복문이슈
                            if (isWrap === true) {
                                // @ts-ignore : 반복문이슈
                                if (isDuble === true) {
                                    startNodeIdx += 1;
                                    endNodeIdx += 1;
                                    startOffset = 0;
                                }
                            } else {
                                const tagReg = new RegExp("(<([^>]+)>)", "i");
                                const isTagList: (boolean | null)[] = [];
                                let newStartNodeIdx: number = 0;
                                let newStartOffset: number = startOffset * 1;
                                let newEndOffset: number = 0;
                                let endMinusCount: number = 0;

                                structureArray.forEach((string: string, i: number) => {
                                    const isTag: boolean = tagReg.test(string);
                                    isTagList.push(isTag);
                                    if (startNodeIdx <= i && i <= endNodeIdx) {
                                        if (isTag === true) {
                                            newEndOffset = 0;
                                        } else {
                                            endMinusCount += 1;
                                            newEndOffset += string.length;
                                        }
                                    }
                                });

                                // 시작 노드의 전 노드가 텍스트라면
                                if (isTagList[startNodeIdx - 1] === false) {
                                    newStartNodeIdx = startNodeIdx - 1;
                                    newStartOffset = startOffset + structureArray[startNodeIdx - 1]!.length;
                                }

                                if (isTagList.slice(startNodeIdx, endNodeIdx).includes(true) === true) {
                                    // 중간에 태그가 있는경우

                                    endNodeIdx -= endMinusCount - 1;
                                    endOffset = newEndOffset;
                                } else {
                                    // 중간에 태그가 없는 경우

                                    endNodeIdx = newStartNodeIdx;
                                    endOffset = newStartOffset + newEndOffset;
                                }

                                startNodeIdx = newStartNodeIdx;
                                startOffset = newStartOffset;
                            }

                            // FIXME : 계산오류 있음
                            _setRangeCursor($element.childNodes[startNodeIdx] as Element, $element.childNodes[endNodeIdx] as Element, startOffset, endOffset);
                        } else {
                            alert(store.value.message.linkTextNoStyle);
                        }
                    }
                }

                _updateCursorData(store);
                _updateModelData(store);
            }
        }
    }
}

// 텍스트 정렬 적용
export function _setTextAlign(type: DETextalign, store: Ref<DragonEditorStore>) {
    // TODO : 커서 기존위치로 지정해주기

    if (store.value.cursorData !== null && store.value.controlStatus.$currentBlock !== null) {
        const cursorData = store.value.cursorData;
        const typeIgnoreList: DEBlock[] = ["code", "custom"];

        if (typeIgnoreList.includes(store.value.controlStatus.currentBlockType) === false) {
            // 제외 타입에 해당하지 않는 경우만 적용

            const alignClassList: string[] = ["de-align-left", "de-align-right", "de-align-center", "de-align-justify"];
            const className: string = `de-align-${type}`;
            let $element: HTMLElement | null = null;

            if (store.value.controlStatus.$currentBlock.classList.contains("de-image-block") === true) {
                // 이미지 블럭의 경우

                $element = store.value.controlStatus.$currentBlock;
            } else {
                // 이미지 블럭 외의 경우

                if (cursorData !== null) {
                    $element = _findContentEditableElement(cursorData.startNode as HTMLElement);
                }
            }

            if ($element !== null) {
                if ($element.classList.contains(className) === true) {
                    $element.classList.remove(className);
                } else {
                    const currentClassname: string | undefined = alignClassList.filter((text) => $element.classList.contains(text) === true)[0];

                    if (currentClassname !== undefined) {
                        $element.classList.remove(currentClassname);
                    }

                    $element.classList.add(className);
                }

                if (store.value.controlStatus.$currentBlock.classList.contains("de-image-block") !== true) {
                    // 이미지 블럭이 아닌 경우
                    // _setCursor($element, 0);
                }

                _updateCursorData(store);
                _updateModelData(store);
            }
        }
    }
}
