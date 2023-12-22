import "./style/index.scss";
import "./types.d.ts";
import EditorInit from "./utils/init";

// 첫 실행시 환경 확인
export default function (selector: string, option?: DEditorOption): EditorInit | null {
    if (window === undefined) {
        console.error("[Dragon Editor] This environment is not client. Please using client environment.");
        return null;
    }

    const $element = document.querySelector(selector);

    if ($element === null) {
        console.error("[Dragon Editor] Didn't find element.");
        return null;
    }

    if ($element.tagName !== "DIV") {
        console.error("[Dragon Editor] Please use div element.");
        return null;
    }

    return new EditorInit($element as HTMLDivElement, option);
}
