import type { Ref } from "vue";

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

                            if ($img !== null) {
                                $img.onload = () => {
                                    done({
                                        type: "image",
                                        src: $img?.src.replace(store.value.imageHostURL, ""),
                                        maxWidth: parseInt($imageArea?.dataset["maxwidth"] ?? "25"),
                                        width: $img?.width,
                                        height: $img?.height,
                                        caption: $caption?.textContent ?? "",
                                        classList: classList === "" ? [] : classList.split(" "),
                                    });
                                };
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

                            classList = classListText.replaceAll("de-code-block", "").trim();

                            done({
                                type: "code",
                                theme: ($el as HTMLElement).dataset["theme"] as DECodeTheme,
                                filename: $fileName?.textContent || "",
                                language: $language === null ? "text" : ($language.textContent as DECodeblockLang),
                                textContent: $codeBlock === null ? "" : $codeBlock.innerHTML,
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
