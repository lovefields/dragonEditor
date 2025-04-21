import type { Ref } from "vue";
import { _updateCursorData, _imageResizeEventStart, _imageResizeEvent, _imageResizeEventEnd } from "./index";
import { _getCurruntBlock, _updateCurruntBlock } from "../node";

export function _contentMouseupEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _updateCurruntBlock(event, store);
    _updateCursorData(store);
}

export function _contentMousedownEvnet(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEventStart(event, store);
}

export function _editorMousemoveEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEvent(event, store);
}

export function _editorMouseupEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEventEnd(event, store);
}

export function _editorMouseleaveEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEventEnd(event, store);
}

// 에디터 영역 이외 클릭시 처리 이벤트
export function _checkOthersideClick(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    __blockAddOthersideEvent(event, store);
}

// 메뉴 추가 이외 영역 클릭 이벤트
function __blockAddOthersideEvent(event: MouseEvent, store: Ref<DragonEditorStore>) {
    const $target = event.target as HTMLElement;

    if ($target !== null) {
        const $menuBtn = $target.closest(".js-de-menu-add");
        const $menuArea = $target.closest(".js-de-block-menu-area");
        const $linkAreaBtn = $target.closest(".js-de-link-btn");
        const $linkInputArea = $target.closest(".js-de-link-exit-area");

        if ($menuBtn === null && $menuArea === null) {
            store.value.activeStatus.addBlockMenu = false;
        }

        if ($linkAreaBtn === null && $linkInputArea === null) {
            store.value.activeStatus.anchorInputArea = false;
        }
    }
}

// 에디터 메뉴 호출 이벤트 (오른쪽 클릭)
export function _editorContextMenuEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {}
