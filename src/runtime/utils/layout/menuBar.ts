import { h } from "vue";
import type { VNode, Ref } from "vue";
import { _getIconNode } from "./index";
import { _addBlock } from "../node";
import { _setDecoration, _setTextAlign, _setAnchorTag, _unsetAnchorTag } from "../style";
import { _setIndent, _moveBlock, _openAnchorArea } from "../event";
import type { DragonEditorStore } from "../../type";

export function _getMenuBarVNodeStructure(store: Ref<DragonEditorStore>): VNode {
    const childNode: VNode[] = [];

    childNode.push(__getMenuListStructure(store));
    childNode.push(__getBlockListStructure(store));
    childNode.push(
        h("div", { class: ["de-link-exit-area", "js-de-link-exit-area", { "--active": store.value.activeStatus.anchorInputArea }] }, [
            h("div", { class: ["de-btn-area"] }, [
                h(
                    "button",
                    {
                        class: ["de-btn", { "--active": store.value.controlStatus.anchorTabType === "url" }],
                        onClick: () => {
                            store.value.controlStatus.anchorTabType = "url";
                        },
                    },
                    "Text"
                ),
                h(
                    "button",
                    {
                        class: ["de-btn", { "--active": store.value.controlStatus.anchorTabType === "heading" }],
                        onClick: () => {
                            store.value.controlStatus.anchorTabType = "heading";
                        },
                    },
                    "Heading"
                ),
            ]),
            store.value.controlStatus.anchorTabType === "url"
                ? h("div", { class: ["de-link-text-area"] }, [
                      h("input", {
                          class: ["de-input", { "--error": store.value.controlStatus.anchorValidation === false }],
                          value: store.value.controlStatus.anchorHref,
                          onChange: (event: Event) => {
                              store.value.controlStatus.anchorHref = (event.currentTarget as HTMLInputElement).value;
                          },
                      }),
                      h(
                          "button",
                          {
                              class: ["de-btn"],
                              onClick: () => {
                                  _setAnchorTag(store.value.controlStatus.anchorHref, true, store);
                              },
                          },
                          "Set"
                      ),
                  ])
                : h(
                      "div",
                      { class: ["de-link-heading-area"] },
                      store.value.controlStatus.anchorHeadingList.map((item) => {
                          return h(
                              "button",
                              {
                                  class: ["de-btn", { "--active": store.value.controlStatus.anchorHref === `#${item.id}` }],
                                  onClick: () => {
                                      store.value.activeStatus.anchorInputArea = false;
                                      _setAnchorTag(item.id, false, store);
                                  },
                              },
                              item.name
                          );
                      })
                  ),
        ])
    );

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
                    onClick: () => {
                        store.value.activeStatus.addBlockMenu = !store.value.activeStatus.addBlockMenu;
                    },
                },
                [_getIconNode("plus")]
            ),
        ])
    );

    // 데코레이션 메뉴
    menuGroupNode.push(
        h("div", { class: ["de-col"] }, [
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setDecoration("de-bold", store);
                    },
                },
                [_getIconNode("bold")]
            ),
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setDecoration("de-italic", store);
                    },
                },
                [_getIconNode("italic")]
            ),
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setDecoration("de-underline", store);
                    },
                },
                [_getIconNode("underline")]
            ),
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setDecoration("de-strikethrough", store);
                    },
                },
                [_getIconNode("strikethrough")]
            ),
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setDecoration("de-code", store);
                    },
                },
                [_getIconNode("codeblock")]
            ),
        ])
    );

    // 링크 메뉴
    menuGroupNode.push(
        h("div", { class: ["de-col"] }, [
            h(
                "button",
                {
                    class: ["de-menu", "js-de-link-btn"],
                    onClick: () => {
                        _openAnchorArea(store);
                    },
                },
                [_getIconNode("add-link")]
            ),
            h(
                "button",
                {
                    class: ["de-menu", { "--disabled": store.value.controlStatus.anchorHref === "" }],
                    onClick: () => {
                        _unsetAnchorTag(store);
                    },
                },
                [_getIconNode("remove-link")]
            ),
        ])
    );

    // 이미지 메뉴
    menuGroupNode.push(
        h("div", { class: ["de-col"] }, [
            h("label", { class: ["de-menu"] }, [
                h("input", {
                    type: "file",
                    hidden: true,
                    accept: ".jpg,.jpeg,.png,.webp,.gif",
                    onChange: (event: Event) => {
                        const $target = event.target as HTMLInputElement;

                        if ($target.files !== null) {
                            const file = $target.files[0];

                            store.value.emit("uploadImageEvent", file);
                            $target.value = "";
                        }
                    },
                }),
                _getIconNode("image"),
            ]),
        ])
    );

    // 정렬 메뉴
    menuGroupNode.push(
        h("div", { class: ["de-col"] }, [
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setTextAlign("left", store);
                    },
                },
                [_getIconNode("align-left")]
            ),
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setTextAlign("center", store);
                    },
                },
                [_getIconNode("align-center")]
            ),
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setTextAlign("right", store);
                    },
                },
                [_getIconNode("align-right")]
            ),
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setTextAlign("justify", store);
                    },
                },
                [_getIconNode("align-justify")]
            ),
        ])
    );

    // 인던트 메뉴
    menuGroupNode.push(
        h("div", { class: ["de-col"] }, [
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setIndent(store, "minus");
                    },
                },
                [_getIconNode("indent-decrease")]
            ),
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _setIndent(store, "plus");
                    },
                },
                [_getIconNode("indent-increase")]
            ),
        ])
    );

    // 위치 이동 메뉴
    menuGroupNode.push(
        h("div", { class: ["de-col"] }, [
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _moveBlock("up", store);
                    },
                },
                [_getIconNode("move-up")]
            ),
            h(
                "button",
                {
                    class: ["de-menu"],
                    onClick: () => {
                        _moveBlock("down", store);
                    },
                },
                [_getIconNode("move-down")]
            ),
        ])
    );

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
