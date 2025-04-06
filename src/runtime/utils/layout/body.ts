import { h } from "vue";
import type { VNode, Ref } from "vue";
import { _createBlockList } from "./index";
import { _contentKeydownEvent, _contentKeyupEvent, _contentPasteEvent, _contentMouseupEvent, _contentMousedownEvnet, _contentTouchstartEvent } from "../event";

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
