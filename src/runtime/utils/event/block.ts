import type { Ref } from "vue";
import { _updateModelData, _getDefaultBlockData } from "./index";
import { _updateCurrentBlock, _createTextBlock } from "../node";
import type { DragonEditorStore } from "../../type";

// 사이즈 조정 이벤트 시작
export function _imageResizeEventStart(event: Event, store: Ref<DragonEditorStore>): void {
    const $target = event.target as HTMLElement;
    if ($target !== null) {
        const $block = $target.closest(".de-block");

        if ($block !== null && $block.classList.contains("de-image-block") === true && $target.classList.contains("de-btn") === true) {
            _updateCurrentBlock(event, store);
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
            store.value.eventStatus.imageResizeCurrentWidth = parseInt($imgArea.dataset["maxwidth"] ?? "25");
        }
    }
}

// 사이즈 조정 이벤트
export function _imageResizeEvent(event: Event, store: Ref<DragonEditorStore>): void {
    if (store.value.activeStatus.imageResizeEvent === true && store.value.controlStatus.$currentBlock !== null && store.value.$body !== null) {
        const $imgArea = store.value.controlStatus.$currentBlock.querySelector(".de-image-area") as HTMLDivElement;
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
        let value = Math.floor(store.value.eventStatus.imageResizeCurrentWidth - percent);

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
export function _imageResizeEventEnd(event: Event, store: Ref<DragonEditorStore>): void {
    if (store.value.activeStatus.imageResizeEvent === true) {
        store.value.activeStatus.imageResizeEvent = false;
        _updateModelData(store);
    }
}

// 블럭 이동 이벤트
export function _moveBlock(type: "up" | "down", store: Ref<DragonEditorStore>): void {
    if (store.value.controlStatus.$currentBlock !== null) {
        const $block = store.value.controlStatus.$currentBlock;
        let $target: Element | null;

        if (type === "up") {
            $target = $block.previousElementSibling;
        } else {
            $target = $block.nextElementSibling;
        }

        if ($target !== null) {
            ($target as HTMLElement).insertAdjacentHTML(type === "up" ? "beforebegin" : "afterend", $block.outerHTML);

            $block.remove();

            if (type === "up") {
                store.value.controlStatus.$currentBlock = ($target as HTMLElement).previousElementSibling as HTMLDivElement | null;
            } else {
                store.value.controlStatus.$currentBlock = ($target as HTMLElement).nextElementSibling as HTMLDivElement | null;
            }
        }

        _updateModelData(store);
    }
}

// 바디 클릭시 새 블럭 필요 여부 검증
export function _checkNeedNewBlock(event: MouseEvent, store: Ref<DragonEditorStore>): void {
    const $target = event.target;

    if ($target !== null) {
        const $element = $target as HTMLElement;

        if ($element.classList.contains("js-de-body") === true) {
            const blockList = $element.querySelectorAll(".de-block");
            const $targetBlock = blockList[blockList.length - 1];

            if ($targetBlock.classList.contains("de-text-block") === true) {
                if ($targetBlock.textContent === "") {
                    ($targetBlock as HTMLParagraphElement).focus();
                } else {
                    const $block = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);

                    $targetBlock.insertAdjacentElement("afterend", $block);
                    $block.focus();
                }
            } else {
                const $block = _createTextBlock(_getDefaultBlockData("text") as DETextBlock);

                $targetBlock.insertAdjacentElement("afterend", $block);
                $block.focus();
            }
        }
    }
}
