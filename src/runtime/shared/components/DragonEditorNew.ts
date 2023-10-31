// default
import { h, defineComponent, ref, onMounted, watch } from "vue";
import store from "../../core/store/editorStore";
import { convertWriteBlock, createLeftMenu, createTextBlock, createImageBlock, convertLocalData } from "../../core/utils";
import type { EditorOptions, ImageCreateData, EditorContentType, AllBlock, CursorSelection } from "../../../types/index";

// style
import "../../core/style/common.css";

// components
import SvgIcon from "../../core/components/SvgIcon";

import TextBlock from "../../core/components/editor/TextBlock.vue";
import ImageBlock from "../../core/components/editor/ImageBlock.vue";
import olBlock from "../../core/components/editor/OlBlock.vue";
import ulBlock from "../../core/components/editor/UlBlock.vue";

export default defineComponent({
    name: "DragonEditor",
    props: ["modelValue", "option"],
    emits: ["update:modelValue"],
    setup: (
        props: {
            readonly modelValue: EditorContentType;
            readonly option?: EditorOptions;
        },
        ctx
    ) => {
        const $editorWrap = ref<any>();

        if (props.option !== undefined) {
            store.setOption(props.option);
        }

        store.emit = ctx.emit;

        // 컨텐츠 데이터 설정
        init(props.modelValue);

        function init(targetData: EditorContentType) {
            if (targetData && Array.isArray(targetData)) {
                if (targetData.length == 0) {
                    store.editorData.value = [createTextBlock()];
                    store.updateModelValue();
                } else {
                    store.editorData.value = convertLocalData(targetData);
                }
            } else {
                throw new Error("[DragonEditor] : You must set 'v-model' attribute and 'v-mode' type is must be Array(EditorContentType).");
            }
        }

        function addImageBlock(data: ImageCreateData) {
            const blockData = createImageBlock(data);
            store.editorData.value.splice(store.activeIndexNumber + 1, 0, blockData);
        }

        onMounted(() => {
            // set wraping element info
            store.editorWrapInfo.value = $editorWrap.value.getBoundingClientRect();
            store.windowObject = window;
        });

        // check changed 'props.modelValue'
        watch(
            () => props.modelValue,
            (newData, oldData) => {
                init(newData);
            }
        );

        /**
         * export list
         * addImageBlock : This function add image block to store.modelValue
         */
        ctx.expose({ addImageBlock });

        return () => {
            return h(
                "div",
                {
                    class: ["dragon-editor"],
                    ref: $editorWrap,
                    onPaste: () => {
                        console.log("paste");
                    },
                    onCopy: () => {
                        console.log("copy");
                    },
                },
                [createLeftMenu(), convertWriteBlock()]
            );
        };
    },
});
