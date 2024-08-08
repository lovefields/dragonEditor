import "./style/index.scss";
import "./types.d.ts";
import EditorInit from "./utils/init";

// 기본 에디터 함수
export function DragonEditor(selector: string, option?: DEditorOption): any | null {
    // 첫 실행시 환경 확인
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

    const editor = new EditorInit($element as HTMLDivElement, option);

    return {
        addImageBlock: (data: DEImageData) => {

        },
    };
}

// 데이터 컨버트용 함수
export function ConvertDataToView(data: any[]) {}
