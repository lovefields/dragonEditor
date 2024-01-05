import type EditorInit from "./init";
import { elementKeyEvent } from "./keyboard";
import { findScrollingElement } from "./element";

export function setEvent(store: EditorInit) {
    setContentEditorbleElementEvent(store);
    setControlbarEvetn(store);
}

// 에디팅 요소 이벤트
function setContentEditorbleElementEvent(store: EditorInit) {
    store.wrap.addEventListener("keydown", function (e: KeyboardEvent) {
        if ((e.target as HTMLElement).isContentEditable === true) {
            elementKeyEvent(e, store);
        }
    });

    // console.log($targetList);
}

// 컨트롤 바 이벤트
function setControlbarEvetn(store: EditorInit) {
    const $scrollElement = findScrollingElement(store.wrap.parentElement);

    // 상단 고정 이벤트
    $scrollElement.addEventListener("scroll", function () {
        const wrapRect: DOMRect = store.wrap.getBoundingClientRect();
        const $target = store.wrap.querySelector(".de-control-bar") as HTMLElement;
        let wrapRealTop: number = 0;
        let scrollY: number = 0;
        let constrolBarTop: number = 0;

        if (this === window) {
            scrollY = window.scrollY;
            wrapRealTop = wrapRect.top + window.scrollY;
        } else {
            const thisRect: DOMRect = this.getBoundingClientRect();
            const thisRealTop: number = thisRect.top + window.scrollY;
            const thisWrapRealTop: number = wrapRect.top + window.scrollY + this.scrollTop;

            wrapRealTop = thisWrapRealTop - thisRealTop;
            scrollY = this.scrollTop;
        }

        constrolBarTop = scrollY - wrapRealTop;

        if (constrolBarTop < 10) {
            constrolBarTop = 0;
        }

        $target.style.top = `${constrolBarTop}px`;
    });

    // 
}
