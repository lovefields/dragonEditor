import { _getBlockType } from "./block";
import type { Ref } from "vue";
// import hljs from "highlight.js";
import "../type.d.ts";

// 코드블럭 테마 리스트
export function _getCodeBlockTheme(): DECodeItem[] {
    return [
        {
            text: "GitHub",
            code: "github",
        },
        {
            text: "GitHub Dark Dimmed",
            code: "github-dark-dimmed",
        },
    ];
}

// 코드 블럭 언어 리스트
export function _getCodeBlockLanguage(): DECodeItem[] {
    return [
        {
            text: "Plain Text",
            code: "text",
        },
        {
            text: "Bash",
            code: "bash",
        },
        {
            text: "C#",
            code: "csharp",
        },
        {
            text: "C",
            code: "c",
        },
        {
            text: "C++",
            code: "cpp",
        },
        {
            text: "CSS",
            code: "css",
        },
        {
            text: "Django",
            code: "django",
        },
        {
            text: "Dockerfile",
            code: "dockerfile",
        },
        {
            text: "Go",
            code: "go",
        },
        {
            text: "HTML, XML",
            code: "html",
        },
        {
            text: "JSON",
            code: "json",
        },
        {
            text: "Java",
            code: "java",
        },
        {
            text: "JavaScript",
            code: "js",
        },
        {
            text: "TypeScript",
            code: "ts",
        },
        {
            text: "Kotlin",
            code: "kotlin",
        },
        {
            text: "Lua",
            code: "lua",
        },
        {
            text: "Markdown",
            code: "md",
        },
        {
            text: "Nginx",
            code: "nginx",
        },
        {
            text: "PHP",
            code: "php",
        },
        {
            text: "Python",
            code: "python",
        },
        {
            text: "Ruby",
            code: "ruby",
        },
        {
            text: "SCSS",
            code: "scss",
        },
        {
            text: "SQL",
            code: "sql",
        },
        {
            text: "Shell",
            code: "shell",
        },
        {
            text: "Swift",
            code: "swift",
        },
        {
            text: "YAML",
            code: "yml",
        },
    ];
}

// 코드블럭 테마 변경
export function _setCodeBlockTheme(store: any, theme: string): void {
    if (store.$currentBlock !== null) {
        const { $element, type } = _getBlockType(store.$currentBlock);

        if (type === "code") {
            ($element as HTMLElement).dataset["theme"] = theme;
        }
    }
}

// 코드블럭 언어 적용
export function _setCodeBlockLanguage(store: any, lang: string): void {
    if (store.$currentBlock !== null) {
        const { $element, type } = _getBlockType(store.$currentBlock);

        if (type === "code") {
            const $langText = $element.querySelector(".de-language");
            const $code = $element.querySelector(".de-code-content");
            // const convert = hljs.highlight($code!.textContent ?? "", { language: lang });

            // $langText!.textContent = (convert._top as any).name ?? "";
            // $code!.innerHTML = convert.value;
        }
    }
}

// 코드블럭 스타일 컨트롤 바에 적용
export function _updateCodeBlockStyle(store: any, themeRef: Ref<string>, langRef: Ref<string>) {
    if (store.$currentBlock !== null) {
        const { $element, type } = _getBlockType(store.$currentBlock);

        if (type === "code") {
            const theme = ($element as HTMLElement).dataset["theme"] ?? "github";
            const $langText = ($element as HTMLElement).querySelector(".de-language")!.textContent;
            const langItem = _getCodeBlockLanguage().find((item) => item.text === $langText);

            themeRef.value = theme;
            langRef.value = langItem?.code ?? "Plain Text";
        }
    }
}

// 리스트 스타일 적용
export function _setListBlockStyle(store: any, style: DEListStyle) {
    if (store.$currentBlock !== null) {
        const { $element, type } = _getBlockType(store.$currentBlock);

        if (type === "list") {
            ($element as HTMLElement).dataset["style"] = style;
        }
    }
}

// 리스트 스타일 컨트롤 바에 적용
export function _updateListBlockStyle(store: any, styleRef: Ref<DEListStyle>) {
    if (store.$currentBlock !== null) {
        const { $element, type } = _getBlockType(store.$currentBlock);

        if (type === "list") {
            const style = ($element as HTMLElement).dataset["style"] as DEListStyle;

            styleRef.value = style;
        }
    }
}
