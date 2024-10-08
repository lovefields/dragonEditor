import { _findContentEditableElement } from "./element";
import { _soltingCursorDataOnElement, _setCursor, _setRangeCursor, _clenupCursor } from "./cursor";
import { _getBlockType } from "./block";
import type { Ref } from "vue";

export function _setNodeStyle(className: string, store: any) {
    if (store.cursorData !== null) {
        const { type } = _getBlockType(store.$currentBlock);
        const typeIgnoreList: string[] = ["image", "code", "other"];

        if (typeIgnoreList.includes(type) === false) {
            const $element = _findContentEditableElement(store.cursorData.startNode as HTMLElement);

            if ($element !== null) {
                // 에디팅이 가능한 상태가 아닐시 실행하지 않음

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
                                targetIdx = findPoverTextNode(childList[targetIdx] as Element, targetIdx);
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
                    const cursorData = _soltingCursorDataOnElement(store.cursorData, $element);
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
                                        structure += (childNode.textContent as string).slice(0, cursorData.startOffset);
                                        isDuble = true;
                                    }

                                    structure += `<span class="${className}">${(childNode.textContent as string).slice(cursorData.startOffset, cursorData.endOffset)}</span>`;

                                    if (cursorData.endOffset !== (childNode.textContent as string).length) {
                                        structure += (childNode.textContent as string).slice(cursorData.endOffset);
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
                            const targetNode = $element.childNodes[childNumber] as Element;
                            _setRangeCursor(targetNode, targetNode, 0, targetNode.textContent?.length ?? 0);
                        } else {
                            // 엘리먼트인 경우

                            const $target = cursorData.startNode as HTMLElement;

                            if ($target.tagName !== "A") {
                                // 일반 태그의 경우만 허용
                                const classList = $target.classList.value.split(" ");
                                const classIdx = classList.indexOf(className);

                                if (classIdx === -1) {
                                    // 클레스 없는 경우

                                    if (cursorData.startOffset !== 0) {
                                        structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(0, cursorData.startOffset)}</span>`;
                                        isDuble = true;
                                    }

                                    structure += `<span class="${classList.join(" ")} ${className}">${($target.textContent as string).slice(cursorData.startOffset, cursorData.endOffset)}</span>`;

                                    if (cursorData.endOffset !== ($target.textContent as string).length) {
                                        structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(cursorData.endOffset)}</span>`;
                                    }
                                } else {
                                    // 클레스 있는 경우

                                    if (cursorData.startOffset !== 0) {
                                        structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(0, cursorData.startOffset)}</span>`;
                                        isDuble = true;
                                    }

                                    if (classList.length === 1) {
                                        // 마지막 클레스인 경우
                                        structure += ($target.textContent as string).slice(cursorData.startOffset, cursorData.endOffset);
                                    } else {
                                        // 다른 클레스도 존재하는 경우
                                        const copyList = [...classList];
                                        copyList.splice(classIdx, 1);
                                        structure += `<span class="${copyList.join(" ")}">${($target.textContent as string).slice(cursorData.startOffset, cursorData.endOffset)}</span>`;
                                    }

                                    if (cursorData.endOffset !== ($target.textContent as string).length) {
                                        structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(cursorData.endOffset)}</span>`;
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
                            const $elementNode = childNode as HTMLElement;
                            let isText = childNode.constructor.name === "Text";

                            if (cursorData.startNodeIdx > i) {
                                // 이전 노드인 경우
                                if (isText === true) {
                                    structureArray.push(childNode.textContent as string);
                                } else {
                                    structureArray.push($elementNode.outerHTML);
                                }
                            }

                            if (cursorData.startNodeIdx === i) {
                                // 첫번째 노드인 경우
                                const preTextContent = (childNode.textContent as string).slice(0, cursorData.startOffset);
                                const textContent = (childNode.textContent as string).slice(cursorData.startOffset);

                                if (isText === true) {
                                    structureArray.push(preTextContent);
                                    structureArray.push(`<span class="${className}">${textContent}</span>`);
                                    isWrap = true;

                                    if (cursorData.startOffset !== 0) {
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

                            if (cursorData.startNodeIdx < i && cursorData.endNodeIdx > i) {
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

                            if (cursorData.endNodeIdx === i) {
                                // 마지막 노드인 경우

                                const textContent = (childNode.textContent as string).slice(0, cursorData.endOffset);
                                const endTextContent = (childNode.textContent as string).slice(cursorData.endOffset);

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

                            if (cursorData.endNodeIdx < i) {
                                // 이후 노드인 경우

                                if (isText === true) {
                                    structureArray.push(childNode.textContent as string);
                                } else {
                                    structureArray.push($elementNode.outerHTML);
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
                                newStartOffset = startOffset + structureArray[startNodeIdx - 1].length;
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

                        _setRangeCursor($element.childNodes[startNodeIdx] as Element, $element.childNodes[endNodeIdx] as Element, startOffset, endOffset);

                        // @ts-ignore : IDE가 인식 못함
                        if (isAnchorElement === true) {
                            alert(store.message.linkTextNoStyle);
                        }
                    }
                }
            }

            _clenupCursor(store);
        }
    }
}

export function _setTextAlign(type: DETextalign, store: any) {
    const { type: blockType } = _getBlockType(store.$currentBlock);
    const typeIgnoreList: string[] = ["code", "other"];

    if (typeIgnoreList.includes(blockType) === false) {
        const alignClassList: string[] = ["de-align-left", "de-align-right", "de-align-center", "de-align-justify"];
        const className: string = `de-align-${type}`;
        let $element: HTMLElement | null = null;

        if (store.$currentBlock.classList.contains("de-image-block") === true) {
            // 이미지 블럭의 경우

            $element = store.$currentBlock;
        } else {
            // 이미지 블럭 외의 경우

            if (store.cursorData !== null) {
                $element = _findContentEditableElement(store.cursorData.startNode as HTMLElement);
            }
        }

        if ($element !== null) {
            if ($element.classList.contains(className) === true) {
                $element.classList.remove(className);
            } else {
                const curruntClassname: string | undefined = alignClassList.filter((text) => $element.classList.contains(text) === true)[0];

                if (curruntClassname !== undefined) {
                    $element.classList.remove(curruntClassname);
                }

                $element.classList.add(className);
            }

            if (store.$currentBlock.classList.contains("de-image-block") !== true) {
                // 이미지 블럭이 아닌 경우

                _setCursor($element, 0);
            }
        }
    }
}

export function _setAnchorTag(url: string, isOutsideLink: boolean, store: any) {
    if (store.cursorData !== null) {
        const { type } = _getBlockType(store.$currentBlock);
        const typeIgnoreList: string[] = ["image", "code", "other"];
        const hrefValue = isOutsideLink === true ? url : `#${url}`;

        if (typeIgnoreList.includes(type) === false) {
            const $element = _findContentEditableElement(store.cursorData.startNode as HTMLElement);

            if ($element !== null) {
                // 에디팅이 가능한 상태가 아닐시 실행하지 않음

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
                                targetIdx = findPoverTextNode(childList[targetIdx] as Element, targetIdx);
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

                    const cursorData = _soltingCursorDataOnElement(store.cursorData, $element);
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
                                        structure += (childNode.textContent as string).slice(0, cursorData.startOffset);
                                        isDuble = true;
                                    }

                                    structure += `<a class="de-link"`;
                                    structure += `href="${hrefValue}"`;

                                    if (isOutsideLink === true) {
                                        structure += `target="_blank"`;
                                    }

                                    structure += `>`;
                                    structure += `${(childNode.textContent as string).slice(cursorData.startOffset, cursorData.endOffset)}</a>`;

                                    if (cursorData.endOffset !== (childNode.textContent as string).length) {
                                        structure += (childNode.textContent as string).slice(cursorData.endOffset);
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
                            const targetNode = $element.childNodes[childNumber] as Element;
                            _setRangeCursor(targetNode, targetNode, 0, targetNode.textContent?.length ?? 0);
                        } else {
                            // 엘리먼트인 경우

                            const $target = cursorData.startNode as HTMLElement;

                            if ($target.tagName !== "A") {
                                // 일반 태그의 경우

                                const classList = $target.classList.value.split(" ");

                                if (cursorData.startOffset !== 0) {
                                    structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(0, cursorData.startOffset)}</span>`;
                                    isDuble = true;
                                }

                                structure += `<a class="de-link"`;
                                structure += `href="${hrefValue}"`;

                                if (isOutsideLink === true) {
                                    structure += `target="_blank"`;
                                }

                                structure += `>`;
                                structure += `${($target.textContent as string).slice(cursorData.startOffset, cursorData.endOffset)}</a>`;

                                if (cursorData.endOffset !== ($target.textContent as string).length) {
                                    structure += `<span class="${classList.join(" ")}">${($target.textContent as string).slice(cursorData.endOffset)}</span>`;
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

                            if (cursorData.startNodeIdx > i) {
                                // 이전 노드인 경우

                                if (isText === true) {
                                    preStructure += childNode.textContent as string;
                                } else {
                                    preStructure += $elementNode.outerHTML;
                                }
                            }

                            if (cursorData.startNodeIdx === i) {
                                // 첫번째 노드인 경우

                                if (isText === true) {
                                    preStructure += (childNode.textContent as string).slice(0, cursorData.startOffset);
                                } else {
                                    preStructure += `<span class="${(childNode as HTMLElement).classList.value}">${(childNode.textContent as string).slice(0, cursorData.startOffset)}</span>`;
                                }

                                anchorTextContent += (childNode.textContent as string).slice(cursorData.startOffset);
                            }

                            if (cursorData.startNodeIdx < i && cursorData.endNodeIdx > i) {
                                // 첫번쨰 노드와 마지막 노드의 사이에 있는 노드인 경우

                                anchorTextContent += childNode.textContent;
                            }

                            if (cursorData.endNodeIdx === i) {
                                // 마지막 노드인 경우

                                anchorTextContent += (childNode.textContent as string).slice(0, cursorData.endOffset);

                                if (isText === true) {
                                    nextStructure += (childNode.textContent as string).slice(cursorData.startOffset);
                                } else {
                                    nextStructure += `<span class="${(childNode as HTMLElement).classList.value}">${(childNode.textContent as string).slice(cursorData.startOffset)}</span>`;
                                }
                            }

                            if (cursorData.endNodeIdx < i) {
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

                        let targetNode = $element.childNodes[cursorData.startNodeIdx];

                        if (cursorData.startOffset !== 0) {
                            targetNode = $element.childNodes[cursorData.startNodeIdx + 1];
                        }

                        _setRangeCursor(targetNode as Element, targetNode as Element, 0, targetNode.textContent?.length ?? 0);
                    }
                }
            }

            _clenupCursor(store);
        }
    }
}

export function _unsetAnchorTag(store: any) {
    if (store.cursorData !== null) {
        const $element = _findContentEditableElement(store.cursorData.startNode as HTMLElement);

        if ($element !== null) {
            const cursorData = _soltingCursorDataOnElement(store.cursorData, $element);

            if (cursorData.startNode.constructor.name === "HTMLAnchorElement") {
                // 앵커 태그인 경우만 동작

                if (store.cursorData.type === "Range") {
                    if (cursorData.startNodeIdx !== cursorData.endNodeIdx) {
                        // 드래그 선택일때 다른 노드 포함이면 동작 안함

                        return false;
                    }
                }

                const $anchorTag = cursorData.startNode as HTMLElement;
                $anchorTag.insertAdjacentText("afterend", cursorData.startNode.textContent ?? "");
                const $targetNode = $anchorTag.nextSibling as Element;
                $anchorTag.remove();
                _setRangeCursor($targetNode, $targetNode, 0, $targetNode.textContent?.length ?? 0);
            }
        }
    }
}

export function _getAnchorTagValue(store: any) {
    let href: string = "";

    if (store.cursorData !== null) {
        const $element = _findContentEditableElement(store.cursorData.startNode as HTMLElement);

        if ($element !== null) {
            const cursorData = _soltingCursorDataOnElement(store.cursorData, $element);

            if (cursorData.startNode.constructor.name === "HTMLAnchorElement") {
                // 앵커 태그인 경우만 동작

                if (store.cursorData.type === "Range") {
                    if (cursorData.startNodeIdx !== cursorData.endNodeIdx) {
                        // 드래그 선택일때 다른 노드 포함이면 동작 안함

                        return href;
                    }
                }

                const $anchorTag = cursorData.startNode as HTMLAnchorElement;

                href = $anchorTag.href;
            }
        }
    }

    return href;
}

function findPoverTextNode(node: Element, idx: number) {
    if (node.previousSibling !== null) {
        if (node.previousSibling.constructor.name === "Text") {
            return findPoverTextNode(node.previousSibling as Element, (idx -= 1));
        } else {
            return idx;
        }
    } else {
        return idx;
    }
}
