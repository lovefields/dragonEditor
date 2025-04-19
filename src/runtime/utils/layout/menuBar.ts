import { h } from "vue";
import type { VNode, Ref } from "vue";
import { _getIconNode } from "./index";
import { _addBlock } from "../node";

export function _getMenuBarVNodeStructure(store: Ref<DragonEditorStore>): VNode {
    const childNode: VNode[] = [];

    childNode.push(__getMenuListStructure(store));
    childNode.push(__getBlockListStructure(store));

    return h("div", { class: ["de-menu-bar"], style: { top: `${store.value.menuBarTop}px` } }, childNode);
}

function __getMenuListStructure(store: Ref<DragonEditorStore>): VNode {
    const menuGroupNode: VNode[] = [];

    // 블록 추가 메뉴
    menuGroupNode.push(
        h("div", { class: ["de-col"] }, [
            h(
                "button",
                {
                    class: ["de-menu", "de-menu-add", "js-de-menu-add"],
                    onClick: (evnet: MouseEvent) => {
                        store.value.activeStatus.addBlockMenu = !store.value.activeStatus.addBlockMenu;
                    },
                },
                [_getIconNode("plus")]
            ),
        ])
    );

    // 데코레이션 메뉴
    menuGroupNode.push(h("div", { class: ["de-col"] }, [h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("bold")]), h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("italic")]), h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("underline")]), h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("strikethrough")]), h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("codeblock")])]));

    // 링크 메뉴
    menuGroupNode.push(h("div", { class: ["de-col"] }, [h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("add-link")]), h("button", { class: ["de-menu", { "--disabled": store.value.controlStatus.anchorHref === "" }], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("remove-link")])]));

    // 이미지 메뉴
    menuGroupNode.push(h("div", { class: ["de-col"] }, [h("label", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [h("input", { type: "file", hidden: true, accept: ".jpg,.jpeg,.png,.webp,.gif" }), _getIconNode("image")])]));

    // 정렬 메뉴
    menuGroupNode.push(h("div", { class: ["de-col"] }, [h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("align-left")]), h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("align-center")]), h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("align-right")]), h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("align-justify")])]));

    // 인던트 메뉴
    menuGroupNode.push(h("div", { class: ["de-col"] }, [h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("indent-decrease")]), h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("indent-increase")])]));

    // 위치 이동 메뉴
    menuGroupNode.push(h("div", { class: ["de-col"] }, [h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("move-up")]), h("button", { class: ["de-menu"], onClick: (evnet: MouseEvent) => {} }, [_getIconNode("move-down")])]));

    return h("div", { class: ["de-menu-wrap"] }, menuGroupNode);
}

function __getBlockListStructure(store: Ref<DragonEditorStore>): VNode {
    const menuList: VNode[] = [];

    menuList.push(
        h(
            "button",
            {
                class: ["de-add-block"],
                onClick: () => {
                    _addBlock("text", store);
                },
            },
            "Text"
        )
    );
    menuList.push(
        h(
            "button",
            {
                class: ["de-add-block"],
                onClick: () => {
                    _addBlock("heading1", store);
                },
            },
            "Heading-1"
        )
    );
    menuList.push(
        h(
            "button",
            {
                class: ["de-add-block"],
                onClick: () => {
                    _addBlock("heading2", store);
                },
            },
            "Heading-2"
        )
    );
    menuList.push(
        h(
            "button",
            {
                class: ["de-add-block"],
                onClick: () => {
                    _addBlock("heading3", store);
                },
            },
            "Heading-3"
        )
    );
    menuList.push(
        h(
            "button",
            {
                class: ["de-add-block"],
                onClick: () => {
                    _addBlock("ul", store);
                },
            },
            "Unodered List"
        )
    );
    menuList.push(
        h(
            "button",
            {
                class: ["de-add-block"],
                onClick: () => {
                    _addBlock("ol", store);
                },
            },
            "Odered List"
        )
    );
    menuList.push(
        h(
            "button",
            {
                class: ["de-add-block"],
                onClick: () => {
                    _addBlock("code", store);
                },
            },
            "Code Block"
        )
    );

    // TODO : 테이블 , 유튜브 및 영상 넣기

    return h("div", { class: ["de-block-menu-area", "js-de-block-menu-area", { "--active": store.value.activeStatus.addBlockMenu }] }, h("div", { class: ["de-list"] }, menuList));
}

//             <div class="de-link-exit-area" :class="{ '--active': isActiveLinkArea }">
//                 <div class="de-btn-area">
//                     <button class="de-btn" :class="{ '--active': activeLinkTabType === 'url' }" @click="openLinkArea"> Text </button>
//                     <button class="de-btn" :class="{ '--active': activeLinkTabType === 'heading' }" @click="listUpHeading">Heading</button>
//                 </div>

//                 <div v-if="activeLinkTabType === 'url'" class="de-link-text-area">
//                     <input v-model="anchorTagValue" class="de-input" :class="{ '--red': anchorValueError }" type="url" ref="$linkInput" />
//                     <button class="de-btn" @click="setLink">Add</button>
//                 </div>

//                 <div v-if="activeLinkTabType === 'heading'" class="de-link-heading-area">
//                     <button v-for="item in anchorHeadingList" class="de-btn" @click="setHeadingLink(item.id)">{{ item.name }}</button>
//                 </div>
//             </div>
