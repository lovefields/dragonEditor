// default
import { h, defineComponent, ref } from "vue";
import type { EditorContentType, OtherBlock, TextBlock, ImageBlock, ListBlock } from "../../../types";

// style
import "../../core/style/viewer.css";

export default defineComponent({
    name: "DragonEditorViewer",
    props: ["content", "mediaUrl"],
    setup: (props: { readonly content: EditorContentType; readonly mediaUrl?: string }, ctx) => {
        const childList: any[] = [];

        if (props.content === undefined || Array.isArray(props.content) === false) {
            throw new Error("[DragonEditor] Type error : 'content' props is must be Array.");
        }

        props.content.forEach((row) => {
            let hObject: any;

            switch (row.type) {
                case "text":
                    const textBlockData = row as TextBlock;

                    hObject = h("p", { class: ["d-text-block", ...textBlockData.classList], innerHTML: textBlockData.content });
                    break;
                case "image":
                    const imageBlockData = row as ImageBlock;
                    const imageChildList: any[] = [];

                    imageChildList.push(
                        h(
                            "div",
                            { class: ["d-image-area"] },
                            h("img", {
                                class: ["d-img"],
                                src: imageBlockData.src,
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

                    hObject = h("div", { class: ["d-other-block"], innerHTML: defaultData.innerHTML });
            }

            childList.push(hObject);
        });

        return () => h("div", { class: ["dragon-editor-viewer"] }, childList);
    },
});
