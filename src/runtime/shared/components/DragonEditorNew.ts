// default
import { h, defineComponent, ref, unref, watch } from "vue";
import { createLeftMenu, createBlock, getClipboardData, convertViewBlock, getCursor } from "../../core/utils";
import type { editorOptions, editorMenu, EditorContentType, userCustomMenu, userStyleMenu, cursorSelection } from "../../../types/index";

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
            readonly option?: editorOptions;
        },
        ctx
    ) => {
        const modelValue = ref<EditorContentType>([]);
        const option = ref<editorOptions>({
            blockMenu: ["text", "ol", "ul"], // TODO : 다른 블럭 만들기 "table", "quotation"
        });

        if (props.modelValue) {
            modelValue.value = props.modelValue;
        }

        if (props.option !== undefined) {
            option.value = Object.assign(option.value, props.option);
        }

        // Local data
        const activeLeftMenu = ref<boolean>(false);
        const leftMenuPosition = ref<number>(0);
        const leftMenuStructure = createLeftMenu(modelValue.value, leftMenuPosition.value, activeLeftMenu.value);
        // const activeLinkBox = ref<boolean>(false);
        // const activeBlockAddMenu = ref<boolean>(false);
        // const activeBlockColtrolMenu = ref<boolean>(false);
        // const styleMenuPosition = ref<number>(0);
        // const linkBoxPosition = ref({
        //     top: 0,
        //     left: 0,
        // });
        // const iconList = ["TextBlock", "ImageBlock", "ulBlock", "olBlock", "quotationBlock", "tableBlock"];
        // const blockMenu = ref<editorMenu[]>([]);
        const customStyleMenu = ref<userStyleMenu[]>([]);
        // const activeIdx = ref<number>(0);
        // const focusIdx = ref<number>(0);
        // const linkValue = ref<string>("");
        // const cursorData = ref<cursorSelection>({
        //     type: "",
        //     startNode: null,
        //     startOffset: null,
        //     endNode: null,
        //     endOffset: null,
        // });
        // const styleButtonList = ref([
        //     [
        //         {
        //             type: "single",
        //             name: "Align Left",
        //             icon: "alignLeft",
        //             active: false,
        //             target: ["text", "image", "table", "ul", "ol"],
        //             action: () => {
        //                 setBlockDecoEvent("alignLeft");
        //             },
        //         },
        //         {
        //             type: "single",
        //             name: "Align Center",
        //             icon: "alignCenter",
        //             target: ["text", "image", "table", "ul", "ol"],
        //             active: false,
        //             action: () => {
        //                 setBlockDecoEvent("alignCenter");
        //             },
        //         },
        //         {
        //             type: "single",
        //             name: "Align right",
        //             icon: "alignRight",
        //             target: ["text", "image", "table", "ul", "ol"],
        //             active: false,
        //             action: () => {
        //                 setBlockDecoEvent("alignRight");
        //             },
        //         },
        //     ],
        //     [
        //         {
        //             type: "single",
        //             name: "Decoration Bold",
        //             icon: "decorationBold",
        //             target: ["text", "table", "ul", "ol"],
        //             active: false,
        //             action: () => {
        //                 setBlockDecoEvent("decorationBold");
        //             },
        //         },
        //         {
        //             type: "single",
        //             name: "Decoration Italic",
        //             icon: "decorationItalic",
        //             target: ["text", "table", "ul", "ol"],
        //             active: false,
        //             action: () => {
        //                 setBlockDecoEvent("decorationItalic");
        //             },
        //         },
        //         {
        //             type: "single",
        //             name: "Decoration Underline",
        //             icon: "decorationUnderline",
        //             target: ["text", "table", "ul", "ol"],
        //             active: false,
        //             action: () => {
        //                 setBlockDecoEvent("decorationUnderline");
        //             },
        //         },
        //         {
        //             type: "single",
        //             name: "Decoration Strikethrough",
        //             icon: "decorationStrikethrough",
        //             target: ["text", "table", "ul", "ol"],
        //             active: false,
        //             action: () => {
        //                 setBlockDecoEvent("decorationStrikethrough");
        //             },
        //         },
        //     ],
        //     [
        //         {
        //             type: "single",
        //             name: "Link",
        //             icon: "link",
        //             active: false,
        //             target: ["text", "table", "ul", "ol"],
        //             action: () => {
        //                 activeLinkBox.value = !activeLinkBox.value;
        //             },
        //         },
        //     ],
        //     [
        //         {
        //             type: "single",
        //             name: "Decoration Code",
        //             icon: "codeBlock",
        //             target: ["text", "table", "ul", "ol"],
        //             active: false,
        //             action: () => {
        //                 setBlockDecoEvent("decorationCode");
        //             },
        //         },
        //     ],
        //     [
        //         {
        //             type: "list",
        //             name: "Font Size",
        //             value: "default",
        //             target: ["text"],
        //             active: false,
        //             action: (count, j) => {
        //                 styleButtonList.value[count][j].active = !styleButtonList.value[count][j].active;
        //             },
        //             childList: [
        //                 {
        //                     name: "default",
        //                     action: (count, j) => {
        //                         setBlockDecoEvent("heading-4");
        //                         styleButtonList.value[count][j].value = "default";
        //                         styleButtonList.value[count][j].active = false;
        //                     },
        //                 },
        //                 {
        //                     name: "h1",
        //                     action: (count, j) => {
        //                         setBlockDecoEvent("heading-1");
        //                         styleButtonList.value[count][j].value = "h1";
        //                         styleButtonList.value[count][j].active = false;
        //                     },
        //                 },
        //                 {
        //                     name: "h2",
        //                     action: (count, j) => {
        //                         setBlockDecoEvent("heading-2");
        //                         styleButtonList.value[count][j].value = "h2";
        //                         styleButtonList.value[count][j].active = false;
        //                     },
        //                 },
        //                 {
        //                     name: "h3",
        //                     action: (count, j) => {
        //                         setBlockDecoEvent("heading-3");
        //                         styleButtonList.value[count][j].value = "h3";
        //                         styleButtonList.value[count][j].active = false;
        //                     },
        //                 },
        //                 {
        //                     name: "h5",
        //                     action: (count, j) => {
        //                         setBlockDecoEvent("heading-5");
        //                         styleButtonList.value[count][j].value = "h5";
        //                         styleButtonList.value[count][j].active = false;
        //                     },
        //                 },
        //                 {
        //                     name: "h6",
        //                     action: (count, j) => {
        //                         setBlockDecoEvent("heading-6");
        //                         styleButtonList.value[count][j].value = "h6";
        //                         styleButtonList.value[count][j].active = false;
        //                     },
        //                 },
        //             ],
        //         },
        //     ],
        // ]);

        // 블럭 추가 메뉴 설정
        // blockMenu.value = setEditorMenu(option.value.blockMenu as string[], unref(option.value.customBlockMenu) as userCustomMenu[]);

        // 유저 커스텀 스타일 메뉴
        if (option.value.customStyleMenu) {
            customStyleMenu.value = unref(option.value.customStyleMenu);
        }

        // 컨텐츠 데이터 설정
        init(modelValue.value);

        function init(targetData: EditorContentType) {
            if (targetData && Array.isArray(targetData)) {
                if (targetData.length == 0) {
                    // addBlockLocal({ name: "text", time: true });
                }
            } else {
                throw new Error("[DragonEditor] : You must set 'v-model' attribute and 'v-mode' type is must be Array(EditorContentType).");
            }
        }

        function addImageBlock({ src, width, height, caption = "" }: { src: string; width: number; height: number; caption?: string }) {
            console.log("addImage");
            // addBlockLocal({
            //     name: "image",
            //     value: {
            //         src: src,
            //         width: width,
            //         height: height,
            //         caption: caption,
            //     },
            // });
        }

        watch(
            () => props.modelValue,
            (newData, oldData) => {
                init(newData);
            }
        );

        ctx.expose({ addImageBlock });

        return () => {
            // const blockList: any[] = convertViewBlock(modelValue.value, option.value.medaiURL, "edit");

            return h(
                "div",
                {
                    class: ["dragon-editor"],
                    onPaste: () => {
                        console.log("paste");
                    },
                    onCopy: () => {
                        console.log("copy");
                    },
                },
                [leftMenuStructure]
            );
        };
    },
});
