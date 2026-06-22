<template>
    <component :is="renderList()" />
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { ref, h, withMemo } from "vue";
import { _listBlockEnterEvent, _listChildTabEvent, _moveListChildEvent, _listBackspaceEvent } from "../../utils/event";
import type { VNode } from "vue";
import type { DEListBlock, DEListItem } from "../../type.d.mts";

// 뎁스기반 트리구조체
interface ListTreeNode {
    liIndex: number;
    depth: number;
    child: DEListItem;
    children: ListTreeNode[];
}

const editorStore = useEditorStore();
const props = defineProps<{ data: DEListBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DEListBlock): void;
}>();
const childIndex = ref<number>(-1);
const childId = ref<string>("");
let memoCache: any[] = [];

function setEdit(liIndex: number, id: string) {
    editorStore.selectedBlockId = props.data.id;
    editorStore.selectedBlockIndex = props.index;
    childIndex.value = liIndex;
    childId.value = id;
}

function abortEdit() {
    editorStore.selectedBlockIndex = -1;
    childIndex.value = -1;
    childId.value = "";
    memoCache = [];
}

function updateData(event: Event, liIndex: number): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DEListBlock;

    if (newData.child[liIndex] !== undefined) {
        newData.child[liIndex].textContent = (event.target as HTMLParagraphElement).innerHTML;
    }

    emit("update", newData);
}

function keydownEvent(event: KeyboardEvent): void {
    switch (event.key) {
        case "Enter":
            // 엔터 이벤트
            if (event.shiftKey === false) {
                if (event.isComposing === false) {
                    _listBlockEnterEvent(event, props.data, props.index, childIndex.value, setEdit, abortEdit);
                } else {
                    event.preventDefault();
                }
            } else {
                // 쉬프트 엔터 이벤트
            }

            break;

        case "Tab":
            _listChildTabEvent(event, props.data, props.index, childIndex.value, setEdit, abortEdit);
            break;

        case "ArrowUp":
            _moveListChildEvent(event, props.data, props.index, childIndex.value, "up");
            break;

        case "ArrowDown":
            _moveListChildEvent(event, props.data, props.index, childIndex.value, "down");
            break;

        case "Backspace":
            _listBackspaceEvent(event, childIndex.value, abortEdit);
            break;

        case "Delete":
            break;

        case "`":
            break;
    }
}

// 기초 트리구조 생성
function createTreeStructure(listData: DEListItem[]): ListTreeNode[] {
    const structure: ListTreeNode[] = [];

    // depth가 structure에 담겨있는 마지막 자식보다 값이 높을 때 재귀적으로 자식 탐색을 수행하는 함수
    function insertNode(parent: ListTreeNode, node: ListTreeNode, currentLevel: number): void {
        if (currentLevel >= 5) {
            parent.children.push(node);
            return;
        }

        const lastChild = parent.children[parent.children.length - 1];

        if (lastChild !== undefined && node.depth > lastChild.depth) {
            insertNode(lastChild, node, currentLevel + 1);
        } else {
            parent.children.push(node);
        }
    }

    listData.forEach((item, index) => {
        let depth = item.depth || 0;

        if (depth > 5) {
            depth = 5;
        }

        const node: ListTreeNode = {
            liIndex: index,
            depth: depth,
            child: item,
            children: [],
        };

        // 1. structure가 비어있는 경우 새로운 데이터를 구성합니다.
        if (structure.length === 0) {
            structure.push(node);
            return;
        }

        const lastNode = structure[structure.length - 1];

        if (lastNode !== undefined) {
            // 2. listData의 item의 depth를 기준으로, structure에 담겨있는 마지막 자식과 값이 같으면 structure에 push 합니다.
            if (node.depth === lastNode.depth) {
                structure.push(node);
            }
            // 3. depth가 structure에 담겨있는 마지막 자식보다 값이 높으면 마지막 자식의 children으로 push 합니다.
            else if (node.depth > lastNode.depth) {
                // 4. 3번의 경우 5뎁스까지의 재귀로 동작해야합니다.
                insertNode(lastNode, node, 1);
            }
            // 5. depth가 structure에 담겨있는 마지막 자식보다 낮으면, 알맞은 깊이의 부모 노드를 찾아 push 합니다.
            else {
                if (node.depth === 0) {
                    structure.push(node);
                } else {
                    let targetParent: ListTreeNode = lastNode;

                    for (let i = 1; i < node.depth; i += 1) {
                        const lastChild = targetParent.children[targetParent.children.length - 1];
                        if (lastChild !== undefined) {
                            targetParent = lastChild;
                        } else {
                            break;
                        }
                    }

                    targetParent.children.push(node);
                }
            }
        }
    });

    return structure;
}

// 자식 렌더링
function renderTreeNodes(nodes: ListTreeNode[]): VNode[] {
    return nodes.map((node) => {
        const isFrozen = props.isEdit === true && childId.value === node.child.id;
        const memoKey = isFrozen ? "frozen" : JSON.stringify(node);
        const subListVNode = node.children.length > 0 ? h(props.data.element, { class: "de-list-sub" }, renderTreeNodes(node.children)) : null;

        return withMemo(
            [memoKey],
            () => {
                const children: VNode[] = [
                    h("p", {
                        class: ["de-item-text"],
                        innerHTML: node.child.textContent,
                        contenteditable: props.isEdit === true,
                        onFocus: () => setEdit(node.liIndex, node.child.id),
                        onKeydown: keydownEvent,
                        onInput: (event: Event) => updateData(event, node.liIndex),
                    }),
                ];

                if (subListVNode !== null) {
                    children.push(subListVNode);
                }

                return h(
                    "li",
                    {
                        key: node.child.id,
                        class: ["de-item"],
                    },
                    children
                );
            },
            memoCache,
            node.liIndex
        );
    });
}

// 블럭 렌더링
function renderList(): VNode {
    const treeStructure = createTreeStructure(props.data.child);

    return h(
        props.data.element,
        {
            class: "de-block de-list-block",
            "data-type": props.data.element === "ul" ? "unordered" : "ordered",
        },
        renderTreeNodes(treeStructure)
    );
}
</script>
