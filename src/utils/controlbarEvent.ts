import type EditorInit from "./init";
import { findScrollingElement } from "./element";
import { createTextBlock, createHeadingBlock, createListBlock } from "./block";
import { setStyle } from "./style";

// 컨트롤 바 이벤트
export function setControlbarEvetn(store: EditorInit) {
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
                case "ul":
                case "ol":
                    blockStructure = createListBlock(store, type);
                    break;
            }

            if (store.cursorData === null) {
                store.wrap.querySelector(".de-block-list").insertAdjacentHTML("beforeend", blockStructure);
                // TODO : 커서 셋 하기
            } else {
                let $target = store.cursorData.startNode;

                if ($target.constructor.name === "Text") {
                    $target = $target.parentNode;
                }

                const $block = ($target as HTMLElement).closest(".de-block");

                $block.insertAdjacentHTML("afterend", blockStructure);
                // TODO : 커서 셋 하기
            }

            $controlBar.querySelector(".de-block-menu-area").classList.remove("--active");
        });
    });

    // 스타일 이벤트
    $controlBar.querySelectorAll(".de-add-decoration").forEach(($btn) => {
        $btn.addEventListener("click", function () {
            const style = this.dataset["style"];

            setStyle(style, store);
        });
    });
}
