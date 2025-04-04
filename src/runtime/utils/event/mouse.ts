import type { Ref } from "vue";

export function _contentMouseupEvent(event: MouseEvent, store: Ref<DragonEditorStore>) {
    console.log("_contentMouseupEvent");
    console.log(event, store);
}

export function _contentMousedownEvnet(event: MouseEvent, store: Ref<DragonEditorStore>) {
    console.log("_contentMousedownEvnet");
}

export function _contentTouchstartEvent(event: TouchEvent, store: Ref<DragonEditorStore>) {
    console.log("_contentTouchstartEvent");
}
