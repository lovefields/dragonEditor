import type { Ref } from "vue";
import { _findScrollingElement, _findTransformElement } from "../node";
import type { DragonEditorStore } from "../../type.d.mts";

// 윈도우 마운트 이벤트
export function _eidtorMountEvent(store: Ref<DragonEditorStore>): void {
    const $editor = document.querySelector(".js-dragon-editor") as HTMLDivElement;
    const $body = document.querySelector(".js-de-body") as HTMLDivElement;
    const $controlBar = document.querySelector(".js-de-controlbar") as HTMLDivElement;
    const $parentWrap = _findScrollingElement($editor);
    const $transformWrap = _findTransformElement($editor);

    store.value.$editor = $editor;
    store.value.$body = $body;
    store.value.$controlBar = $controlBar;
    store.value.$parentWrap = $parentWrap;

    if ($transformWrap === null) {
        store.value.controlStatus.hasTransformParent = false;
        store.value.controlStatus.$transformElement = null;
    } else {
        store.value.controlStatus.hasTransformParent = true;
        store.value.controlStatus.$transformElement = $transformWrap;
    }

    __checkAndSetUpMobile(store);
    window.addEventListener("click", store.value.windowClickEvent);
    window.addEventListener("resize", store.value.windowResizeEvent);
    window.addEventListener("mouseup", store.value.windowMouseUpEvent);
    store.value.$parentWrap?.addEventListener("scroll", store.value.parentWrapScollEvent);
}

// 윈도우 언마운트 이벤트
export function _eidtorUnmountEvent(store: Ref<DragonEditorStore>): void {
    window.removeEventListener("click", store.value.windowClickEvent);
    window.removeEventListener("resize", store.value.windowResizeEvent);
    window.removeEventListener("mouseup", store.value.windowMouseUpEvent);
    store.value.$parentWrap?.removeEventListener("scroll", store.value.parentWrapScollEvent);
    store.value.menuBarTop = 0;
}

// 윈도우 리사이즈 이벤트
export function _windowResizeEvent(event: Event, store: Ref<DragonEditorStore>): void {
    __checkAndSetUpMobile(store);
}

// 모바일 체크
function __checkAndSetUpMobile(store: Ref<DragonEditorStore>): void {
    if (window.innerWidth > store.value.screenChangePoint) {
        store.value.controlStatus.isMobile = false;
    } else {
        store.value.controlStatus.isMobile = true;
    }
}
