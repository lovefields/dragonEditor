import type { DragonEditorStore } from "../../type";
import type { Ref } from "vue";

export function _parentWrapScollEvent(event: Event, store: Ref<DragonEditorStore>) {
    __fixControlBarEvent(event, store);
}

// 부모 요소 스크롤 이벤트 발생시 컨트롤 바 고정
function __fixControlBarEvent(event: Event, store: Ref<DragonEditorStore>): void {
    if (store.value.useMenuBar === true && store.value.$parentWrap !== null && store.value.$editor !== null) {
        const editorRect = store.value.$editor.getBoundingClientRect();
        let scrollY: number = 0;

        if (store.value.$parentWrap.constructor.name === "Window") {
            scrollY = (store.value.$parentWrap as Window).scrollY;
        } else {
            scrollY = (store.value.$parentWrap as HTMLElement).scrollTop;
        }

        let realElementY = editorRect.y + scrollY;

        if (store.value.$parentWrap.constructor.name !== "Window") {
            const parentRect = (store.value.$parentWrap as HTMLElement).getBoundingClientRect();

            realElementY -= parentRect.y;
        }

        let value: number = 0;

        if (scrollY > realElementY) {
            value = scrollY - realElementY - 1;
        } else {
            value = 0;
        }

        if (value > editorRect.height - 34) {
            value = editorRect.height - 34;
        }

        store.value.menuBarTop = Math.floor(value);
    }
}
