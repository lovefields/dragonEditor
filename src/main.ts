import "./style/index.scss";
import "./types.d.ts";
import store from "./sotre";
import { setEditorOption } from "./utils/data";
import { setLayout } from "./utils/layout";

// 에디터 구성 및 컨트롤러 내보내기
function editorInit($el: HTMLDivElement, option?: DEditorOption) {
    store.wrap = $el;
    setEditorOption(option);
    setLayout();

    return {};
}

// 첫 실행시 환경 확인
export default function (selector: string, option?: DEditorOption) {
    if (window) {
        const $element = document.querySelector(selector);

        if ($element.tagName === "DIV") {
            return editorInit($element as HTMLDivElement, option);
        } else {
            console.error("[Dragon Editor] Please use div element.");
        }
    } else {
        console.error("[Dragon Editor] This environment is not client. Please using client environment.");
    }
}
