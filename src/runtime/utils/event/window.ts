import type { Ref } from "vue";
import { _findScrollingElement } from "../node";

// 윈도우 마운트 이벤트트
export function _eidtorMountEvent(store: Ref<DragonEditorStore>): void {
    const $editor = document.querySelector(".js-dragon-editor") as HTMLDivElement;
    const $body = document.querySelector(".js-de-body") as HTMLDivElement;
    const $controlbar = document.querySelector(".js-de-controlbar") as HTMLDivElement;
    const $parentWrap = _findScrollingElement($editor);

    store.value.$editor = $editor;
    store.value.$body = $body;
    store.value.$controlbar = $controlbar;
    store.value.$parentWrap = $parentWrap;

    __checkAndSetUpMobile(store);
    window.addEventListener("click", store.value.windowClickEvent);
    window.addEventListener("resize", store.value.windowResizeEvent);
    store.value.$parentWrap?.addEventListener("scroll", store.value.parentWrapScollEvent);
}

// 윈도우 언마운트 이벤트트
export function _eidtorUnmountEvent(store: Ref<DragonEditorStore>): void {
    window.removeEventListener("click", store.value.windowClickEvent);
    window.removeEventListener("resize", store.value.windowResizeEvent);
    store.value.$parentWrap?.removeEventListener("scroll", store.value.parentWrapScollEvent);
}

// 윈도우 리사이즈 이벤트
export function _windowResizeEvent(event: Event, store: Ref<DragonEditorStore>): void {
    __checkAndSetUpMobile(store);
}

// 모바일 체크
function __checkAndSetUpMobile(store: Ref<DragonEditorStore>): void {
    if (window.innerWidth > 1200) {
        store.value.controlStatus.isMobile = false;
    } else {
        store.value.controlStatus.isMobile = true;
    }
}
