import type { Ref } from "vue";

export function _updateModelData(store: Ref<DragonEditorStore>): void {
    const $body = store.value.$body;

    if ($body !== null) {
        const newData: DEContentData = [];
        const $blockList = $body.querySelectorAll(".de-block");

        $blockList.forEach(($el) => {
            let classListText: string = $el.classList.value.replaceAll("de-block", "");
            let classList: string = "";

            switch (true) {
                case $el.classList.contains("de-text-block"):
                    classList = classListText.replaceAll("de-text-block", "").trim();

                    const textBlockDepth = ($el as HTMLParagraphElement).dataset["depth"];
                    let textBlockData: DETextBlock = {
                        type: "text",
                        classList: classList === "" ? [] : classList.split(" "),
                        textContent: $el.innerHTML,
                    };

                    if (textBlockDepth !== undefined) {
                        textBlockData.depth = parseInt(textBlockDepth);
                    }

                    newData.push(textBlockData);
                    break;

                case $el.classList.contains("de-heading-block"):
                    classList = classListText.replaceAll("de-heading-block", "").trim();

                    const headingBlockDepth = ($el as HTMLHeadingElement).dataset["depth"];
                    let headingBlockData: DEHeadingBlock = {
                        type: "heading",
                        id: $el.id,
                        level: parseInt(($el as HTMLHeadingElement).dataset["level"] ?? "3"),
                        classList: classList === "" ? [] : classList.split(" "),
                        textContent: $el.innerHTML,
                    };

                    if (headingBlockDepth !== undefined) {
                        headingBlockData.depth = parseInt(headingBlockDepth);
                    }

                    newData.push(headingBlockData);
                    break;

                case $el.classList.contains("de-list-block"):
                    const $li = $el.querySelectorAll(".de-item");
                    const liList: DEListItem[] = [];

                    classList = classListText.replaceAll("de-list-block", "").trim();
                    $li.forEach(($child) => {
                        let childClassName = $child.classList.value.replace("de-item", "");

                        liList.push({
                            classList: childClassName === "" ? [] : childClassName.split(" "),
                            textContent: $child.innerHTML,
                        });
                    });

                    const listBlockDepth = ($el as HTMLElement).dataset["depth"];
                    let listBlockData: DEListBlock = {
                        type: "list",
                        element: $el.tagName.toLowerCase() as DEListElementName,
                        style: ($el as HTMLElement).dataset["style"] as DEListStyle,
                        child: liList,
                    };

                    if (listBlockDepth !== undefined) {
                        listBlockData.depth = parseInt(listBlockDepth);
                    }

                    newData.push(listBlockData);
                    break;

                case $el.classList.contains("de-image-block"):
                    break;

                case $el.classList.contains("de-code-block"):
                    const $language = $el.querySelector(".de-language");
                    const $fileName = $el.querySelector(".de-filename");
                    const $codeBlock = $el.querySelector(".de-code-content");

                    classList = classListText.replaceAll("de-code-block", "").trim();

                    newData.push({
                        type: "code",
                        theme: ($el as HTMLElement).dataset["theme"] as DECodeTheme,
                        filename: $fileName?.textContent || "",
                        language: $language === null ? "text" : ($language.textContent as DECodeblockLang),
                        textContent: $codeBlock === null ? "" : $codeBlock.innerHTML,
                    });
                    break;

                default:
            }
        });

        store.value.emit("update:modelValue", newData);
    }
}

// 기본 블럭 데이터 생성
export function _getDefaultBlockData(type: DEBlockMenutype): DEBlockData {
    let data: DEBlockData = { type: "text", classList: [], textContent: "" };

    switch (type) {
        case "heading1":
        case "heading2":
        case "heading3":
            data = {
                type: "heading",
                level: parseInt(type.replace("heading", "")),
                id: _generateId(),
                classList: [],
                textContent: "",
            };
            break;

        case "ol":
        case "ul":
            data = {
                type: "list",
                element: type,
                style: type === "ol" ? "decimal" : "disc",
                child: [
                    {
                        classList: [],
                        textContent: "",
                    },
                ],
            };
            break;

        case "code":
            data = {
                type: "code",
                language: "text",
                theme: "github",
                filename: "",
                textContent: "",
            };
            break;
    }

    return data;
}

// 난수 아이디 생성
export function _generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 6; i += 1) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}
