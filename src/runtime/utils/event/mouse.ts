import type { Ref } from "vue";
import { _updateCursorData, _imageResizeEventStart, _imageResizeEvent, _imageResizeEventEnd } from "./index";
import { _getCurruntBlock, _updateCurruntBlock, _updateHeadingBlockList } from "../node";

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
export function _openAnchorArea(store: Ref<DragonEditorStore>): void {
    store.value.controlStatus.cursorDataForAnchor = store.value.cursorData;

    // 링크 값 추출
    if (store.value.controlStatus.cursorDataForAnchor !== null) {
        const cursorData = store.value.controlStatus.cursorDataForAnchor;

        if (cursorData.type === "Caret" || (cursorData.type === "Range" && cursorData.startNode === cursorData.endNode)) {
            // 단일 커서이거나 하나의 노드인경우

            const $targetNode = cursorData.startNode;

            if ($targetNode.constructor.name === "HTMLAnchorElement") {
                const $tag = $targetNode as HTMLAnchorElement;

                store.value.controlStatus.anchorHref = $tag.href;
            }
        } else {
            store.value.controlStatus.anchorHref = "";
        }
    }

    _updateHeadingBlockList(store);

    if (store.value.controlStatus.anchorHref !== "" && store.value.controlStatus.anchorHref.charAt(0) === "#") {
        store.value.controlStatus.anchorTabType = "heading";
    } else {
        store.value.controlStatus.anchorTabType = "url";
    }

    store.value.activeStatus.anchorInputArea = !store.value.activeStatus.anchorInputArea;
}

// 에디터 메뉴 호출 이벤트 (오른쪽 클릭)
export function _editorContextMenuEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    // TODO
}
