// default
import { h, defineComponent, ref } from "vue";
import { createBlock, getClipboardData, getCursor } from "../../core/utils";
import type { editorOptions, editorMenu, editorContentType, userCustomMenu, userStyleMenu, cursorSelection } from "../../../types/index";

// style
import "../../core/style/common.css";

// components
import SvgIcon from "../../core/components/SvgIcon";
import textBlock from "../../core/components/editor/TextBlock.vue";
import imageBlock from "../../core/components/editor/ImageBlock.vue";
import olBlock from "../../core/components/editor/OlBlock.vue";
import ulBlock from "../../core/components/editor/UlBlock.vue";

export default defineComponent({
    name: "DragonEditor",
    props: ["modelValue", "option"],
    emits: ["update:modelValue"],
    setup: (
        props: {
            readonly modelValue: editorContentType;
            readonly option?: editorOptions;
        },
        ctx
    ) => {
        const modelValue = ref<editorContentType>([]);
        const option = ref<editorOptions>({
            blockMenu: ["text", "ol", "ul"],
            // blockMenu: ["text", "ol", "ul", "table", "quotation"], // TODO : 다른 블럭 만들기
        });

        if (props.modelValue) {
            modelValue.value = props.modelValue;
        }

        if (props.option !== undefined) {
            option.value = Object.assign(option.value, props.option);
        }

        const testNode = h("div", null, "hellow");
        testNode.type = "p";
        console.log("testNode", testNode);

        function addImageBlock({ src, width, height, webp, caption }: { src: string; width: number; height: number; webp: boolean; caption?: string }) {
            console.log("addImage");
            // addBlockLocal({
            //     name: "image",
            //     value: {
            //         src: src,
            //         width: width,
            //         height: height,
            //         webp: webp,
            //         caption: caption,
            //     },
            // });
        }

        ctx.expose({ addImageBlock });

        return () =>
            h("div", {
                class: ["dragon-editor"],
                onPaste: () => {
                    console.log("test");
                },
            });
    },
});
