import type { Ref } from "vue";

export function _contentMouseupEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log("_contentMouseupEvent");
}

export function _contentMousedownEvnet(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log("_contentMousedownEvnet");
}

export function _editorMousemoveEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log("_editorMousemoveEvent");
}

export function _editorMouseupEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log("_editorMouseupEvent");
}

export function _editorMouseleaveEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    console.log("_editorMouseleaveEvent");
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

        if ($menuBtn === null && $menuArea === null) {
            store.value.activeStatus.addBlockMenu = false;
        }
    }
}

export function _editorContextMenuEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {}
