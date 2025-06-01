import { h } from "vue";
import type { VNode, Ref } from "vue";
import { _createBlockList } from "./index";
import { _contentKeydownEvent, _contentKeyupEvent, _contentPasteEvent, _contentMouseupEvent, _contentMousedownEvnet, _contentTouchstartEvent, _getDefaultBlockData, _updateModelData } from "../event";
import { _createTextBlock, _createHeadingBlock, _createListBlock, _createListItemBlock, _createImageBlock, _createCodeBlock, _createCustomBlock } from "../node";
import type { DragonEditorStore } from "../../type";

// 바디 구조체 생성
export function _getBodyVNodeStructure(store: Ref<DragonEditorStore>): VNode {
    return h(
        "div",
        {
            class: ["de-body", "js-de-body"],
            onKeydown: (event: KeyboardEvent) => _contentKeydownEvent(event, store),
            onKeyup: (event: KeyboardEvent) => _contentKeyupEvent(event, store),
            onMouseup: (event: MouseEvent) => _contentMouseupEvent(event, store),
            onMousedown: (event: MouseEvent) => _contentMousedownEvnet(event, store),
            onTouchstart: (event: TouchEvent) => _contentTouchstartEvent(event, store),
            onPaste: (event: ClipboardEvent) => _contentPasteEvent(event, store),
        },
        _createBlockList({
            blockList: store.value.firstData,
            isEditable: true,
            imageHostURL: store.value.imageHostURL,
        })
    );
}

export function _updateBodyStructure(bodyData: DEContentData, store: Ref<DragonEditorStore>): void {
    if (store.value.$body !== null) {
        let htmlSturcutre: string = "";

        if (bodyData.length === 0) {
            htmlSturcutre += _createTextBlock(_getDefaultBlockData("text") as DETextBlock).outerHTML;
        } else {
            bodyData.forEach((data) => {
                switch (data.type) {
                    case "text":
                        htmlSturcutre += _createTextBlock(data).outerHTML;
                        break;

                    case "heading":
                        htmlSturcutre += _createHeadingBlock(data).outerHTML;
                        break;

                    case "image":
                        htmlSturcutre += _createImageBlock(data, store.value.imageHostURL).outerHTML;
                        break;

                    case "list":
                        htmlSturcutre += _createListBlock(data).outerHTML;
                        break;

                    case "code":
                        htmlSturcutre += _createCodeBlock(data, store).outerHTML;
                        break;

                    default:
                        htmlSturcutre += _createCustomBlock(data).outerHTML;
                }
            });
        }

        store.value.$body.innerHTML = htmlSturcutre;

        setTimeout(() => {
            _updateModelData(store);
        }, 250);
    }
}
