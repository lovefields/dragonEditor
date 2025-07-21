import type { Ref } from "vue";
import { _setRangeCursor, _updateCursorData, _updateModelData, _sortingCursorDataOnElement } from "../event";
import { _findContentEditableElement, _findPoverTextNode } from "../node";
import type { DragonEditorStore, DEBlock } from "../../type";

export function _setAnchorTag(url: string, isOutsideLink: boolean, store: Ref<DragonEditorStore>) {
    if (store.value.controlStatus.previousCorsorData !== null && store.value.controlStatus.$currentBlock !== null) {
        const cursorData = store.value.controlStatus.previousCorsorData;
        const typeIgnoreList: DEBlock[] = ["image", "code", "custom"];
        const hrefValue = isOutsideLink === true ? url : `#${url}`;
        const $element = _findContentEditableElement(cursorData.startNode as HTMLElement);

        if (typeIgnoreList.includes(store.value.controlStatus.currentBlockType) === false && $element !== null) {
            // 허용한 블럭 타입에서만 && 에디팅이 가능한 노드가 있는 경우만

            if (cursorData.type === "Caret") {
                // 단일 커서인 경우

                if ($element.hasChildNodes() === true) {
                    // 자식노드가 있는 경우

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

                                    structure += `<a class="de-link"`;
                                    structure += `href="${hrefValue}"`;

                                    if (isOutsideLink === true) {
                                        structure += `target="_blank"`;
                                    }

                                    structure += `>`;
                                    structure += `${node.textContent}</a>`;
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
                            // 부모가 최상위 노드가 아닌경우

                            if ($parentElement.tagName === "A") {
                                ($parentElement as HTMLAnchorElement).href = hrefValue;

                                if (isOutsideLink === true) {
                                    ($parentElement as HTMLAnchorElement).target = "_blank";
                                } else {
                                    ($parentElement as HTMLAnchorElement).removeAttribute("target");
                                }

                                _setRangeCursor($parentElement, $parentElement, 0, $parentElement.textContent?.length ?? 0);
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

                                structure += `<a class="de-link"`;
                                structure += `href="${hrefValue}"`;

                                if (isOutsideLink === true) {
                                    structure += `target="_blank"`;
                                }

                                structure += `>`;
                                structure += `${(childNode.textContent as string).slice(newCursorData.startOffset, newCursorData.endOffset)}</a>`;

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

                        // @ts-ignore : IDE 인식 못함
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
                            // 일반 태그의 경우

                            const classList = $target.classList.value.split(" ");

                            if (newCursorData.startOffset !== 0) {
                                structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(0, newCursorData.startOffset)}</span>`;
                                isDuble = true;
                            }

                            structure += `<a class="de-link"`;
                            structure += `href="${hrefValue}"`;

                            if (isOutsideLink === true) {
                                structure += `target="_blank"`;
                            }

                            structure += `>`;
                            structure += `${($target.textContent as string).slice(newCursorData.startOffset, newCursorData.endOffset)}</a>`;

                            if (newCursorData.endOffset !== ($target.textContent as string).length) {
                                structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(newCursorData.endOffset)}</span>`;
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
                            // 앵커 태그의 경우

                            ($target as HTMLAnchorElement).href = hrefValue;

                            if (isOutsideLink === true) {
                                ($target as HTMLAnchorElement).target = "_blank";
                            } else {
                                ($target as HTMLAnchorElement).removeAttribute("target");
                            }

                            _setRangeCursor($target, $target, 0, $target.textContent?.length ?? 0);
                        }
                    }
                } else {
                    // 다른 노드인 경우

                    let preStructure: string = "";
                    let anchorTextContent: string = "";
                    let nextStructure: string = "";

                    $element.childNodes.forEach((childNode: ChildNode, i: number) => {
                        const $elementNode = childNode as HTMLElement;
                        let isText = childNode.constructor.name === "Text";

                        if (newCursorData.startNodeIdx > i) {
                            // 이전 노드인 경우

                            if (isText === true) {
                                preStructure += childNode.textContent as string;
                            } else {
                                preStructure += $elementNode.outerHTML;
                            }
                        }

                        if (newCursorData.startNodeIdx === i) {
                            // 첫번째 노드인 경우

                            if (isText === true) {
                                preStructure += (childNode.textContent as string).slice(0, newCursorData.startOffset);
                            } else {
                                preStructure += `<span class="${(childNode as HTMLElement).classList.value}">${(childNode.textContent as string).slice(0, newCursorData.startOffset)}</span>`;
                            }

                            anchorTextContent += (childNode.textContent as string).slice(newCursorData.startOffset);
                        }

                        if (newCursorData.startNodeIdx < i && newCursorData.endNodeIdx > i) {
                            // 첫번쨰 노드와 마지막 노드의 사이에 있는 노드인 경우

                            anchorTextContent += childNode.textContent;
                        }

                        if (newCursorData.endNodeIdx === i) {
                            // 마지막 노드인 경우

                            anchorTextContent += (childNode.textContent as string).slice(0, newCursorData.endOffset);

                            if (isText === true) {
                                nextStructure += (childNode.textContent as string).slice(newCursorData.startOffset);
                            } else {
                                nextStructure += `<span class="${(childNode as HTMLElement).classList.value}">${(childNode.textContent as string).slice(newCursorData.startOffset)}</span>`;
                            }
                        }

                        if (newCursorData.endNodeIdx < i) {
                            // 이후 노드인 경우

                            if (isText === true) {
                                nextStructure += childNode.textContent as string;
                            } else {
                                nextStructure += $elementNode.outerHTML;
                            }
                        }
                    });

                    let anchorTag: string = "";

                    anchorTag += `<a class="de-link"`;
                    anchorTag += `href="${hrefValue}"`;

                    if (isOutsideLink === true) {
                        anchorTag += `target="_blank"`;
                    }

                    anchorTag += `>`;
                    anchorTag += anchorTextContent;
                    anchorTag += `</a>`;
                    $element.innerHTML = preStructure + anchorTag + nextStructure;

                    let targetNode = $element.childNodes[newCursorData.startNodeIdx];

                    if (newCursorData.startOffset !== 0) {
                        targetNode = $element.childNodes[newCursorData.startNodeIdx + 1];
                    }

                    _setRangeCursor(targetNode as Element, targetNode as Element, 0, targetNode.textContent?.length ?? 0);
                }
            }

            _updateCursorData(store);
            _updateModelData(store);
        }
    }
}

// 링크 스타일 해제
export function _unsetAnchorTag(store: Ref<DragonEditorStore>) {
    if (store.value.cursorData !== null) {
        const cursorData = store.value.cursorData;
        const $element = _findContentEditableElement(cursorData.startNode as HTMLElement);

        if ($element !== null) {
            const newCursorData = _sortingCursorDataOnElement(cursorData, $element);

            if (newCursorData.startNode.constructor.name === "HTMLAnchorElement") {
                // 앵커 태그인 경우만 동작

                if (cursorData.type === "Range") {
                    if (newCursorData.startNodeIdx !== newCursorData.endNodeIdx) {
                        // 드래그 선택일때 다른 노드 포함이면 동작 안함

                        return false;
                    }
                }

                const $anchorTag = newCursorData.startNode as HTMLElement;

                $anchorTag.insertAdjacentText("afterend", newCursorData.startNode.textContent ?? "");

                const $targetNode = $anchorTag.nextSibling as Element;

                $anchorTag.remove();

                _setRangeCursor($targetNode, $targetNode, 0, $targetNode.textContent?.length ?? 0);
            }
        }
    }
}

// 링크 값 추출
export function _updateAnchorTagValue(event: MouseEvent, store: Ref<DragonEditorStore>, previous: boolean = false): void {
    const $target = event.target as HTMLElement;

    if ($target !== null) {
        const $linkArea = $target.closest(".js-de-link-exit-area");

        // 링크 수정 영역이 아닌 경우만 갱신
        if ($linkArea === null) {
            if (store.value.controlStatus.previousCorsorData !== null && store.value.cursorData !== null) {
                const cursorData = previous === true ? store.value.controlStatus.previousCorsorData : store.value.cursorData;

                if (cursorData.type === "Caret" || (cursorData.type === "Range" && cursorData.startNode === cursorData.endNode)) {
                    // 단일 커서이거나 하나의 노드인경우

                    const $element = _findContentEditableElement(cursorData.startNode);
                    let $targetNode: HTMLElement | null = cursorData.startNode as HTMLElement;

                    if ($targetNode.constructor.name === "Text") {
                        if ($targetNode.parentElement !== $element) {
                            $targetNode = $targetNode.parentElement;
                        }
                    }

                    if (($targetNode as HTMLElement).constructor.name === "HTMLAnchorElement") {
                        const $tag = $targetNode as HTMLAnchorElement;

                        store.value.controlStatus.anchorHref = $tag.href;
                    } else {
                        store.value.controlStatus.anchorHref = "";
                    }
                } else {
                    store.value.controlStatus.anchorHref = "";
                }
            }
        }
    }
}
