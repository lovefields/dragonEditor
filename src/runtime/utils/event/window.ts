import type { Ref } from "vue";
import { _findScrollingElement } from "../node";

export function _eidtorMountEvent(store: Ref<DragonEditorStore>): void {
    const $editor = document.querySelector(".js-dragon-editor") as HTMLDivElement;
    const $body = document.querySelector(".js-de-body") as HTMLDivElement;
    const $controlbar = document.querySelector(".js-de-controlbar") as HTMLDivElement;
    const $parentWrap = _findScrollingElement($editor);

    store.value.$editor = $editor;
    store.value.$body = $body;
    store.value.$controlbar = $controlbar;
    store.value.$parentWrap = $parentWrap;

    window.addEventListener("click", store.value.windowClickEvent, true);
    store.value.$parentWrap?.addEventListener("scroll", store.value.parentWrapScollEvent, true);
}

export function _eidtorUnmountEvent(store: Ref<DragonEditorStore>): void {
    window.removeEventListener("click", store.value.windowClickEvent, true);
    store.value.$parentWrap?.removeEventListener("scroll", store.value.parentWrapScollEvent, true);
}
