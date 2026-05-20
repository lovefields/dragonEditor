import { h } from "vue";
import TextBlock from "../../components/Block/Text.vue";
import HeadingBlock from "../../components/Block/Heading.vue";
import ListBlock from "../../components/Block/List.vue";
import ImageBlock from "../../components/Block/Image.vue";
import CodeBlock from "../../components/Block/Code.vue";
import DividerBlock from "../../components/Block/Divider.vue";
import CustomBlock from "../../components/Block/Custom.vue";
import type { VNode } from "vue";

// 데이터 바디 구조체 | HTML 구조의 깔끔함을 위해 컴포넌트 보다 h 함수를 사용
export function _getBody(data: DEContentData, isEdit: boolean = false, updateFunction: (data: DEContentData) => void): VNode {
    const blockList: VNode[] = [];

    data.forEach((block, index) => {
        let component: any;

        switch (block.type) {
            case "text":
                component = TextBlock;
                break;

            case "heading":
                component = HeadingBlock;
                break;

            case "list":
                component = ListBlock;
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

                        newData[index] = newBlockData;

                        updateFunction(newData);
                    },
                })
            );
        }
    });

    return h("div", { class: ["de-body"] }, blockList);
}
