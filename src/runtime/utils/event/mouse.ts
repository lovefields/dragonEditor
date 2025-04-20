import type { Ref } from "vue";
import { _updateCursorData } from "./index";
import { _getCurruntBlock, _updateCurruntBlock } from "../node";

export function _contentMouseupEvent(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    _updateCurruntBlock(event, store);
    _updateCursorData(store);
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


// // 사이즈 조정 이벤트 시작
// function resizeEventStart(event: Event) {
//     const $target = event.target as HTMLElement;

//     if ($target !== null) {
//         const $block = $target.closest(".de-block");

//         if ($block?.classList.contains("de-image-block") === true && $target.classList.contains("de-btn") === true) {
//             editorStore.setCurrentBlock($block as HTMLElement);
//             resizeEventActive = true;

//             if (event.type === "touchstart") {
//                 resizeStartX = (event as TouchEvent).touches[0].clientX;
//             } else {
//                 resizeStartX = (event as MouseEvent).clientX;
//             }

//             if ($target.classList.contains("de-btn-left") === true) {
//                 resizeType = "left";
//             } else {
//                 resizeType = "right";
//             }

//             resizeEndX = resizeStartX;

//             const $imgArea = (editorStore.$currentBlock as HTMLElement).querySelector(".de-image-area") as HTMLDivElement;
//             resizeCurruntWidth = parseInt($imgArea.dataset["maxwidth"] ?? "25");
//         }
//     }
// }

// // 사이즈 조정 이벤트
// function resizeEvent(event: Event) {
//     if (resizeEventActive === true) {
//         const $imgArea = (editorStore.$currentBlock as HTMLElement).querySelector(".de-image-area") as HTMLDivElement;
//         const contentWidth = (editorStore.$content?.offsetWidth ?? 0) / 2;
//         let gap: number = 0;

//         if (event.type === "touchmove") {
//             resizeEndX = (event as TouchEvent).touches[0].clientX;
//         } else {
//             resizeEndX = (event as MouseEvent).clientX;
//         }

//         if (resizeType === "right") {
//             gap = Math.floor(resizeStartX - resizeEndX);
//         } else {
//             gap = Math.floor(resizeEndX - resizeStartX);
//         }

//         const percent = (100 / contentWidth) * gap;
//         let value = Math.floor(resizeCurruntWidth - percent);

//         if (value < 25) {
//             value = 25;
//         }

//         if (value > 100) {
//             value = 100;
//         }

//         $imgArea.dataset["maxwidth"] = String(value);
//     }
// }

// // 사이즈 조정 이벤트 종료
// function resizeEventEnd() {
//     if (resizeEventActive === true) {
//         resizeEventActive = false;
//     }
// }
