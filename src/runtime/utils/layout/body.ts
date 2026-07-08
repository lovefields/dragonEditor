import { h } from "vue";
import TextBlock from "../../components/Block/Text.vue";
import HeadingBlock from "../../components/Block/Heading.vue";
import ListBlock from "../../components/Block/List.vue";
import ImageBlock from "../../components/Block/Image.vue";
import CodeBlock from "../../components/Block/Code.vue";
import DividerBlock from "../../components/Block/Divider.vue";
import CustomBlock from "../../components/Block/Custom.vue";
import { useEditorStore } from "../../store/editor";
import { _generateId } from "../data";
import { _updateCursorData } from "../event";
import type { VNode } from "vue";
import type { DEContentData, DEBlockData } from "../../type.mjs";

// 데이터 바디 구조체 | HTML 구조의 깔끔함을 위해 컴포넌트 보다 h 함수를 사용
export function _getBody(data: DEContentData, isEdit: boolean = false): VNode {
    const editorStore = useEditorStore();
    const blockList: VNode[] = [];

    data.forEach((block, index) => {
        let component: any;

        if (block.id === "" || block.id === null || block.id === undefined) {
            block.id = _generateId();
        }

        switch (block.type) {
            case "text":
                component = TextBlock;
                break;

            case "heading":
                component = HeadingBlock;
                break;

            case "list":
                component = ListBlock;

                block.child.forEach((child) => {
                    if (child.id === "" || child.id === null || child.id === undefined) {
                        child.id = _generateId();
                    }
                });
                break;

            case "image":
                component = ImageBlock;
                break;

            case "code":
                component = CodeBlock;
                break;

            case "divider":
                component = DividerBlock;
                break;

            case "custom":
                component = CustomBlock;
                break;
        }

        if (component !== undefined) {
            blockList.push(
                h(component, {
                    data: block,
                    isEdit: isEdit,
                    index: index,
                    onUpdate: (newBlockData: DEBlockData) => {
                        const newData = JSON.parse(JSON.stringify(data)) as DEContentData;

                        if (newData[index] !== undefined) {
                            newData[index] = newBlockData;
                        }

                        if (editorStore.fn.updateEditorData !== null) {
                            editorStore.fn.updateEditorData(newData);
                        } else {
                            console.error("[Dragon Editor]: Editor initialize fail.");
                        }
                    },
                    key: `block-${block.id}`,
                })
            );
        }
    });

    return h("div", { class: ["de-body"], onMouseup: _updateCursorData, onKeyup: _updateCursorData }, blockList);
}
