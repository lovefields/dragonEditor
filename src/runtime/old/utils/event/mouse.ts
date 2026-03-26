import type { Ref } from "vue";
import { _updateCursorData, _imageResizeEventStart, _imageResizeEvent, _imageResizeEventEnd, _checkNeedNewBlock } from "./index";
import { _getCurrentBlock, _updateCurrentBlock, _updateHeadingBlockList } from "../node";
import { _updateAnchorTagValue } from "../style";
import type { DragonEditorStore, DEBlock } from "../../type.d.mts";

export function _contentMouseupEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _updateCurrentBlock(event, store);
    _updateCursorData(store);
    _checkNeedNewBlock(event, store);
}

export function _contentMousedownEvnet(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEventStart(event, store);
}

export function _editorMousemoveEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEvent(event, store);
}

export function _editorMouseupEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEventEnd(event, store);
    _updateAnchorTagValue(event, store);
}

export function _editorMouseleaveEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEventEnd(event, store);
}

// 에디터 영역 이외 클릭시 처리 이벤트
export function _checkOthersideClick(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _updateCurrentBlock(event, store);
    __blockAddOthersideEvent(event, store);
    _decideWhetherOpenControlBar(store);
}

// 메뉴 추가 이외 영역 클릭 이벤트
function __blockAddOthersideEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
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

// 앵커 컨트롤 영역 토글 이벤트
export function _openAnchorArea(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    store.value.controlStatus.previousCorsorData = store.value.cursorData;

    _updateAnchorTagValue(event, store, true);
    _updateHeadingBlockList(store);

    if (store.value.controlStatus.anchorHref !== "" && store.value.controlStatus.anchorHref.charAt(0) === "#") {
        store.value.controlStatus.anchorTabType = "heading";
    } else {
        store.value.controlStatus.anchorTabType = "url";
    }

    store.value.activeStatus.anchorInputArea = !store.value.activeStatus.anchorInputArea;
}

export function _decideWhetherOpenControlBar(store: Ref<DragonEditorStore>): void {
    if (store.value.controlStatus.$currentBlock !== null) {
        const { type, $element } = _getCurrentBlock(store.value.controlStatus.$currentBlock);
        const allowTypeList: DEBlock[] = ["code", "ol", "ul"];

        if (allowTypeList.includes(type) === true && $element !== null) {
            const targetRect = $element.getBoundingClientRect();
            let x: number = Math.floor(targetRect.left + targetRect.width / 2);
            let y: number = Math.floor(targetRect.top - 8 - 32);

            if (y < 0) {
                y = 44;

                if (store.value.$parentWrap !== null && store.value.$editor !== null) {
                    const editorRect = store.value.$editor.getBoundingClientRect();

                    y += editorRect.top;
                }
            }

            if (store.value.controlStatus.hasTransformParent === true && store.value.controlStatus.$transformElement !== null) {
                const transformRect = store.value.controlStatus.$transformElement.getBoundingClientRect();

                x -= transformRect.left;
                y -= transformRect.top;
            }

            store.value.controlBar.x = x;
            store.value.controlBar.y = y;
            store.value.controlBar.$element = $element;
            store.value.controlBar.active = true;
        } else {
            store.value.controlBar.active = false;
        }
    } else {
        store.value.controlBar.active = false;
    }
}

// 에디터 메뉴 호출 이벤트 (오른쪽 클릭)
export function _editorContextMenuEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    // TODO
}
