import { h } from "vue";
import store from "../../core/store/editorStore";
import { keyboardEvent } from "./keyboard";
import type { EditorContentType, TextBlock, ImageBlock, ListBlock, OtherBlock, AllBlock } from "../../../types/index";
import { generateId } from "./key";

export function convertViewBlock(data: EditorContentType, mediaUrl?: string) {
    const childList: any[] = [];

    data.forEach((row) => {
        let hObject: any;

        switch (row.type) {
            case "text":
                const textBlockData = row as TextBlock;

                hObject = h("p", {
                    class: ["d-text-block", ...textBlockData.classList],
                    innerHTML: textBlockData.content,
                });
                break;
            case "image":
                const imageBlockData = row as ImageBlock;
                const imageChildList: any[] = [];
                const imageUrl = mediaUrl ? mediaUrl + imageBlockData.src : imageBlockData.src;

                imageChildList.push(
                    h(
                        "div",
                        { class: ["d-image-area"] },
                        h("img", {
                            class: ["d-img"],
                            src: imageUrl,
                            width: imageBlockData.width,
                            height: imageBlockData.height,
                            alt: imageBlockData.caption,
                            loading: "lazy",
                        })
                    )
                );

                if (imageBlockData.caption !== "") {
                    imageChildList.push(
                        h("p", {
                            class: ["d-caption"],
                            innerHTML: imageBlockData.caption,
                        })
                    );
                }

                hObject = h("div", { class: ["d-image-block", ...imageBlockData.classList] }, imageChildList);
                break;
            case "ol":
                const olBlockData = row as ListBlock;
                const olChildList: any[] = [];

                olBlockData.childList.forEach((child) => {
                    olChildList.push(
                        h("li", {
                            class: ["d-li-item", ...child.classList],
                            innerHTML: child.content,
                        })
                    );
                });

                hObject = h(
                    "ol",
                    {
                        class: ["d-ol-block", ...olBlockData.classList],
                    },
                    olChildList
                );
                break;
            case "ul":
                const ulBlockData = row as ListBlock;
                const ulChildList: any[] = [];

                ulBlockData.childList.forEach((child) => {
                    ulChildList.push(
                        h("li", {
                            class: ["d-li-item", ...child.classList],
                            innerHTML: child.content,
                        })
                    );
                });

                hObject = h(
                    "ul",
                    {
                        class: ["d-ul-block", ...ulBlockData.classList],
                    },
                    ulChildList
                );
                break;
            default:
                const defaultData = row as OtherBlock;

                hObject = h("div", {
                    class: ["d-other-block"],
                    innerHTML: defaultData.innerHTML,
                });
        }

        childList.push(hObject);
    });

    return childList;
}

export function convertWriteBlock() {
    const childList: any[] = [];

    store.editorData.value.forEach((row, idx) => {
        let hObject: any;

        switch (row.type) {
            case "text":
                const textBlockData = row as TextBlock;

                hObject = h("p", {
                    class: ["d-text-block", ...textBlockData.classList],
                    innerHTML: textBlockData.content,
                    contenteditable: true,
                    onKeydown: (e: KeyboardEvent) => keyboardEvent(e, "text", idx),
                });
                break;
            case "image":
                const imageBlockData = row as ImageBlock;
                const imageChildList: any[] = [];
                const imageUrl = store.option.value.medaiURL ? store.option.value.medaiURL + imageBlockData.src : imageBlockData.src;

                imageChildList.push(
                    h(
                        "div",
                        { class: ["d-image-area"] },
                        h("img", {
                            class: ["d-img"],
                            src: imageUrl,
                            width: imageBlockData.width,
                            height: imageBlockData.height,
                            alt: imageBlockData.caption,
                            loading: "lazy",
                        })
                    )
                );

                if (imageBlockData.caption !== "") {
                    imageChildList.push(
                        h("p", {
                            class: ["d-caption"],
                            innerHTML: imageBlockData.caption,
                            contenteditable: true,
                        })
                    );
                }

                hObject = h("div", { class: ["d-image-block", ...imageBlockData.classList] }, imageChildList);
                break;
            case "ol":
                const olBlockData = row as ListBlock;
                const olChildList: any[] = [];

                olBlockData.childList.forEach((child) => {
                    olChildList.push(
                        h("li", {
                            class: ["d-li-item", ...child.classList],
                            innerHTML: child.content,
                            contenteditable: true,
                        })
                    );
                });

                hObject = h(
                    "ol",
                    {
                        class: ["d-ol-block", ...olBlockData.classList],
                    },
                    olChildList
                );
                break;
            case "ul":
                const ulBlockData = row as ListBlock;
                const ulChildList: any[] = [];

                ulBlockData.childList.forEach((child) => {
                    ulChildList.push(
                        h("li", {
                            class: ["d-li-item", ...child.classList],
                            innerHTML: child.content,
                            contenteditable: true,
                        })
                    );
                });

                hObject = h(
                    "ul",
                    {
                        class: ["d-ul-block", ...ulBlockData.classList],
                    },
                    ulChildList
                );
                break;
            default:
                const defaultData = row as OtherBlock;

                hObject = h("div", {
                    class: ["d-other-block"],
                    innerHTML: defaultData.innerHTML,
                });
        }

        childList.push(
            h(
                "div",
                {
                    class: ["d-row-block"],
                    key: row.key,
                    ref: store.rowList,
                    // active left menu & set left menu top value
                    onMouseenter(e: Event) {
                        const $target = e.currentTarget as HTMLDivElement;
                        const info = $target.getBoundingClientRect();

                        store.leftMenuTop.value = info.top - store.editorWrapInfo.value.top;
                        store.leftMenuActive.value = true;
                    },
                    // dactive left menu
                    onMouseleave() {
                        store.leftMenuActive.value = false;
                    },
                    // change index number
                    onMouseUp() {
                        store.activeIndexNumber = idx;
                    },
                },
                hObject
            )
        );
    });

    return childList;
}

export function convertLocalData(data: EditorContentType) {
    const dataCopy = JSON.parse(JSON.stringify(data));

    dataCopy.forEach((item: AllBlock) => {
        item.key = generateId();
    });

    return dataCopy;
}
