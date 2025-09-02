import type { Ref } from "vue";
import { _getCurrentBlock } from "../node";
import type { DECodeItem, DECodeblockLang, DragonEditorStore, DEBlockData, DETextBlock, DEHeadingBlock, DEListItem, DEListBlock, DEListElementName, DEListStyle, DECodeblockTheme, DEBlockMenutype } from "../../type";

export const CODEBLOCKLANG: DECodeItem<DECodeblockLang>[] = [
    {
        text: "Plain Text",
        code: "text",
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
        code: "javascript",
    },
    {
        text: "TypeScript",
        code: "typescript",
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
        code: "markdown",
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
        code: "shellscript",
    },
    {
        text: "Swift",
        code: "swift",
    },
    {
        text: "YAML",
        code: "yaml",
    },
];

export function _updateModelData(store: Ref<DragonEditorStore>): void {
    const $body = store.value.$body;

    if ($body !== null) {
        const $blockList = $body.querySelectorAll(".de-block");
        const workList: Promise<DEBlockData>[] = [];

        $blockList.forEach(($el) => {
            let classListText: string = $el.classList.value.replaceAll("de-block", "");
            let classList: string = "";

            switch (true) {
                case $el.classList.contains("de-text-block"):
                    workList.push(
                        new Promise((done) => {
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

                            done(textBlockData);
                        })
                    );
                    break;

                case $el.classList.contains("de-heading-block"):
                    workList.push(
                        new Promise((done) => {
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

                            done(headingBlockData);
                        })
                    );
                    break;

                case $el.classList.contains("de-list-block"):
                    workList.push(
                        new Promise((done) => {
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

                            done(listBlockData);
                        })
                    );
                    break;

                case $el.classList.contains("de-image-block"):
                    workList.push(
                        new Promise((done) => {
                            const $imageArea = $el.querySelector(".de-image-area") as HTMLDivElement;
                            const $img = $el.querySelector(".de-img") as HTMLImageElement;
                            const $caption = $el.querySelector(".de-caption");

                            classList = classListText.replaceAll("de-image-block", "").trim();

                            if ($img.complete === false) {
                                $img.onload = () => {
                                    done({
                                        type: "image",
                                        src: $img.src.replace(store.value.imageHostURL, ""),
                                        maxWidth: parseInt($imageArea.dataset["maxwidth"] ?? "25"),
                                        width: $img.width,
                                        height: $img.height,
                                        caption: $caption?.textContent ?? "",
                                        classList: classList === "" ? [] : classList.split(" "),
                                    });
                                };
                            } else {
                                done({
                                    type: "image",
                                    src: $img.src.replace(store.value.imageHostURL, ""),
                                    maxWidth: parseInt($imageArea.dataset["maxwidth"] ?? "25"),
                                    width: $img.width,
                                    height: $img.height,
                                    caption: $caption?.textContent ?? "",
                                    classList: classList === "" ? [] : classList.split(" "),
                                });
                            }
                        })
                    );
                    break;

                case $el.classList.contains("de-code-block"):
                    workList.push(
                        new Promise((done) => {
                            const $language = $el.querySelector(".de-language");
                            const $fileName = $el.querySelector(".de-filename");
                            const $codeBlock = $el.querySelector(".de-code-content");
                            let language: DECodeblockLang = "text";

                            classList = classListText.replaceAll("de-code-block", "").trim();

                            if ($language !== null) {
                                const value = $language.textContent ?? "";
                                const targetValue = CODEBLOCKLANG.find((item) => item.text === value);

                                if (targetValue !== undefined) {
                                    language = targetValue.code;
                                }
                            }

                            done({
                                type: "code",
                                theme: ($el as HTMLElement).dataset["theme"] as DECodeblockTheme,
                                filename: $fileName?.textContent || "",
                                language: language,
                                textContent: $codeBlock === null ? "" : $codeBlock.innerHTML,
                            });
                        })
                    );
                    break;

                case $el.classList.contains("de-divider-block"):
                    workList.push(
                        new Promise((done) => {
                            done({
                                type: "divider",
                            });
                        })
                    );
                    break;

                default:
                    workList.push(
                        new Promise((done) => {
                            classList = classListText.replaceAll("de-custom-block", "").trim();

                            done({
                                type: "custom",
                                classList: classList === "" ? [] : classList.split(" "),
                                textContent: $el.innerHTML,
                            });
                        })
                    );
            }
        });

        Promise.all(workList).then((data) => {
            store.value.emit("update:modelValue", data);
        });
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
                theme: "github-light",
                filename: "",
                textContent: "",
            };
            break;

        case "divider":
            data = {
                type: "divider",
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

// 컨트롤 바 상태 업데이트
export function _updateControlBarStatus(store: Ref<DragonEditorStore>): void {
    if (store.value.controlStatus.$currentBlock !== null) {
        const { type } = _getCurrentBlock(store.value.controlStatus.$currentBlock);
        const allowTypeList = ["code", "ol", "ul"];

        if (allowTypeList.includes(type) === true) {
            switch (type) {
                case "code":
                    __updateCodeBlockStyle(store);
                    break;

                case "ol":
                case "ul":
                    __updateListBlockStyle(store);
                    break;
            }
        }
    }
}

// 코드블럭 스타일 추출
function __updateCodeBlockStyle(store: Ref<DragonEditorStore>): void {
    if (store.value.controlStatus.$currentBlock !== null) {
        const $block = store.value.controlStatus.$currentBlock;
        const $language = $block.querySelector(".de-language");
        let language: DECodeblockLang = "text";

        if ($language !== null) {
            const value = $language.textContent ?? "";
            const targetValue = CODEBLOCKLANG.find((item) => item.text === value);

            if (targetValue !== undefined) {
                language = targetValue.code;
            }
        }

        store.value.controlStatus.codeBlockTheme = ($block.dataset["theme"] as DECodeblockTheme) ?? "github-light";
        store.value.controlStatus.codeBlockLang = language;
    }
}

// 리스트 스타일 추출
function __updateListBlockStyle(store: Ref<DragonEditorStore>): void {
    if (store.value.controlStatus.$currentBlock !== null) {
        const $block = store.value.controlStatus.$currentBlock;

        store.value.controlStatus.listBlockStyle = ($block.dataset["style"] as DEListStyle) ?? "disc";
    }
}

// 빈 데이터 체크
export function _checkDataEmpty(data: DEContentData): boolean {
    let suitable: boolean = true;

    data.forEach((item) => {
        switch (item.type) {
            case "heading":
            case "text":
                if (item.textContent !== "") {
                    suitable = false;
                }
                break;

            case "list":
                item.child.forEach((listChild) => {
                    if (listChild.textContent !== "") {
                        suitable = false;
                    }
                });
                break;

            case "code":
                if (item.filename !== "" || item.textContent !== "") {
                    suitable = false;
                }

                break;

            case "image":
            case "divider":
            case "custom":
                suitable = false;
                break;
        }
    });

    return suitable;
}
