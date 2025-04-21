import type { Ref } from "vue";
import { _updateCurruntBlock } from "../node";

// 사이즈 조정 이벤트 시작
export function _imageResizeEventStart(event: Event, store: Ref<DragonEditorStore>) {
    const $target = event.target as HTMLElement;
    if ($target !== null) {
        const $block = $target.closest(".de-block");

        if ($block !== null && $block.classList.contains("de-image-block") === true && $target.classList.contains("de-btn") === true) {
            _updateCurruntBlock(event, store);
            store.value.activeStatus.imageResizeEvent = true;

            if (event.type === "touchstart") {
                store.value.eventStatus.imageResizeEventStartX = (event as TouchEvent).touches[0].clientX;
            } else {
                store.value.eventStatus.imageResizeEventStartX = (event as MouseEvent).clientX;
            }

            if ($target.classList.contains("de-btn-left") === true) {
                store.value.eventStatus.imageResizeEventType = "left";
            } else {
                store.value.eventStatus.imageResizeEventType = "right";
            }

            const $imgArea = $block.querySelector(".de-image-area") as HTMLDivElement;

            store.value.eventStatus.imageResizeEventEndX = store.value.eventStatus.imageResizeEventStartX;
            store.value.eventStatus.imageResizeCurruntWidth = parseInt($imgArea.dataset["maxwidth"] ?? "25");
        }
    }
}

// 사이즈 조정 이벤트
export function _imageResizeEvent(event: Event, store: Ref<DragonEditorStore>) {
    if (store.value.activeStatus.imageResizeEvent === true && store.value.controlStatus.$curruntblock !== null && store.value.$body !== null) {
        const $imgArea = store.value.controlStatus.$curruntblock.querySelector(".de-image-area") as HTMLDivElement;
        const contentWidth = store.value.$body.offsetWidth / 2;
        let gap: number = 0;

        if (event.type === "touchmove") {
            store.value.eventStatus.imageResizeEventEndX = (event as TouchEvent).touches[0].clientX;
        } else {
            store.value.eventStatus.imageResizeEventEndX = (event as MouseEvent).clientX;
        }

        if (store.value.eventStatus.imageResizeEventType === "right") {
            gap = Math.floor(store.value.eventStatus.imageResizeEventStartX - store.value.eventStatus.imageResizeEventEndX);
        } else {
            gap = Math.floor(store.value.eventStatus.imageResizeEventEndX - store.value.eventStatus.imageResizeEventStartX);
        }

        const percent = (100 / contentWidth) * gap;
        let value = Math.floor(store.value.eventStatus.imageResizeCurruntWidth - percent);

        if (value < 25) {
            value = 25;
        }

        if (value > 100) {
            value = 100;
        }

        $imgArea.dataset["maxwidth"] = String(value);
    }
}

// 사이즈 조정 이벤트 종료
export function _imageResizeEventEnd(event: Event, store: Ref<DragonEditorStore>) {
    if (store.value.activeStatus.imageResizeEvent === true) {
        store.value.activeStatus.imageResizeEvent = false;
    }
}
