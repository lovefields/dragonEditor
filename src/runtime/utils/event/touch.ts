import type { Ref } from "vue";
import { _imageResizeEventStart, _imageResizeEvent, _imageResizeEventEnd } from "./index";
import type { DragonEditorStore } from "../../type.d.mts";

export function _contentTouchstartEvent(event: TouchEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEventStart(event, store);
}

export function _editorTouchmoveEvent(event: TouchEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEvent(event, store);
}

export function _editorTouchendEvent(event: TouchEvent, store: Ref<DragonEditorStore>): void {
    _imageResizeEventEnd(event, store);
}
