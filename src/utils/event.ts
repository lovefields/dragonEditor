import type EditorInit from "./init";
import { elementKeyEvent } from "./keyboard";
import { findScrollingElement } from "./element";
import { setCursorData } from "./cursor";
import { createTextBlock, createHeadingBlock } from "./block";

export function setEvent(store: EditorInit) {
    setContentEditorbleElementEvent(store);
    setControlbarEvetn(store);

    // 마우스 조작시 커서 데이터 업데이트
    store.wrap.addEventListener("mouseup", function () {
        setCursorData(store);
    });
}

// 에디팅 요소 이벤트
function setContentEditorbleElementEvent(store: EditorInit) {
    // 키보드 이벤트
    store.wrap.addEventListener("keydown", function (e: KeyboardEvent) {
        if ((e.target as HTMLElement).isContentEditable === true) {
            elementKeyEvent(e, store);
        }
    });

    // console.log($targetList);
}

// 컨트롤 바 이벤트
function setControlbarEvetn(store: EditorInit) {
    const $controlBar = store.wrap.querySelector(".de-control-bar");
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

    // 메뉴 추가 리스트 토글 이벤트
    $controlBar.querySelector(".de-menu-add").addEventListener("click", function () {
        $controlBar.querySelector(".de-block-menu-area").classList.toggle("--active");
    });

    document.addEventListener("click", function (e: MouseEvent) {
        if ((e.target as HTMLElement).closest(".de-menu-add") === null && (e.target as HTMLElement).closest(".de-block-menu-area") === null) {
            $controlBar.querySelector(".de-block-menu-area").classList.remove("--active");
        }
    });

    // 메뉴 추가 이벤트
    $controlBar.querySelectorAll(".de-add-block").forEach(($btn) => {
        $btn.addEventListener("click", function () {
            const type = this.dataset["type"];
            let blockStructure: string = "";

            switch (type) {
                case "text":
                    blockStructure = createTextBlock(store);
                    break;
                case "heading1":
                case "heading2":
                case "heading3":
                    blockStructure = createHeadingBlock(store, type);
                    break;
            }

            if (store.cursorData === null) {
                store.wrap.querySelector(".de-block-list").insertAdjacentHTML("beforeend", blockStructure);
            } else {
                let $target = store.cursorData.startNode;

                if ($target.constructor.name === "Text") {
                    $target = $target.parentNode;
                }

                const $block = ($target as HTMLElement).closest(".de-block");

                $block.insertAdjacentHTML("afterend", blockStructure);
            }

            $controlBar.querySelector(".de-block-menu-area").classList.remove("--active");
        });
    });
}
