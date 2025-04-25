

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
            const convert = hljs.highlight($code!.textContent ?? "", { language: lang });

            $langText!.textContent = (convert._top as any).name ?? "";
            $code!.innerHTML = convert.value;
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
