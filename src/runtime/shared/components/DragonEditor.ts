// 기본 요소
import store from "../../core/store/editorStore";
import { h, defineComponent, ref, onMounted, watch } from "vue";

// 유틸리티
import { createTextBlock, renderingEditorRow } from "../../core/utils";

// 타입 선언
import "../../types/global.d.ts";

// 스타일
import "../../core/style/common.css";

export default defineComponent({
    name: "DragonEditor",
    props: ["modelValue", "option"],
    emits: ["update:modelValue"],
    setup: (
        props: {
            readonly modelValue: DEditorDataType[];
            // readonly option?: EditorOptions;
        },
        ctx
    ) => {
        store.emit = ctx.emit as Emit;

        if (props.modelValue && Array.isArray(props.modelValue)) {
            if (props.modelValue.length == 0) {
                store.editorData = [createTextBlock()];
                store.emit("update:modelValue", store.editorData);
            } else {
                store.editorData = props.modelValue;
            }

            //     store.editorKey.value += 1;
        } else {
            throw new Error("[DragonEditor] : You must set 'v-model' attribute and 'v-model' type is must be Array(DEditorModelValue).");
        }

        watch(
            () => props.modelValue,
            () => {
                store.editorKey += 1;
                console.log(store.editorKey);
            },
            {
                deep: true,
            }
        );

        return () => {
            return h(
                "div",
                {
                    class: ["dragon-editor"],
                },
                [
                    h(
                        "div",
                        {
                            class: ["d-block-list"],
                            key: store.editorKey,
                        },
                        renderingEditorRow(props.modelValue)
                    ),
                ]
            );
        };
    },
});
