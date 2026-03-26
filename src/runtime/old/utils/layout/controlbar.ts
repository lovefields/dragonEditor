import { h } from "vue";
import type { VNode, Ref } from "vue";
import { _setCodeBlockStatus, _setListBlockStyle } from "../node";
import { CODEBLOCKLANG } from "../event";
import type { DragonEditorStore, DECodeblockTheme, DECodeblockLang, DEListStyle } from "../../type.d.mts";

export function _getControlbarVNodeStructure(store: Ref<DragonEditorStore>): VNode {
    const childList: VNode[] = [];

    switch (store.value.controlStatus.currentBlockType) {
        case "code":
            childList.push(
                h("div", { class: ["de-col"] }, [
                    h("p", { class: ["de-name"] }, "Theme : "),
                    h(
                        "select",
                        {
                            class: ["de-selector"],
                            value: store.value.controlStatus.codeBlockTheme,
                            onChange: (event: Event) => {
                                const $target = event.currentTarget as HTMLSelectElement;

                                if ($target !== null) {
                                    _setCodeBlockStatus($target.value as DECodeblockTheme, store.value.controlStatus.codeBlockLang, store);
                                }
                            },
                        },
                        store.value.codeBlockTheme.map((item) => {
                            return h("option", { value: item.code }, item.text);
                        })
                    ),
                ])
            );

            childList.push(
                h("div", { class: ["de-col"] }, [
                    h("p", { class: ["de-name"] }, "Language : "),
                    h(
                        "select",
                        {
                            class: ["de-selector"],
                            value: store.value.controlStatus.codeBlockLang,
                            onChange: (event: Event) => {
                                const $target = event.currentTarget as HTMLSelectElement;

                                if ($target !== null) {
                                    _setCodeBlockStatus(store.value.controlStatus.codeBlockTheme, $target.value as DECodeblockLang, store);
                                }
                            },
                        },
                        CODEBLOCKLANG.map((item) => {
                            return h("option", { value: item.code }, item.text);
                        })
                    ),
                ])
            );
            break;

        case "ol":
            childList.push(
                h("div", { class: ["de-col"] }, [
                    h("p", { class: ["de-name"] }, "List Style : "),
                    h(
                        "select",
                        {
                            class: ["de-selector"],
                            value: store.value.controlStatus.listBlockStyle,
                            onChange: (event: Event) => {
                                const $target = event.currentTarget as HTMLSelectElement;

                                if ($target !== null) {
                                    _setListBlockStyle($target.value as DEListStyle, store);
                                }
                            },
                        },
                        store.value.listOlType.map((item) => {
                            return h("option", { value: item.code }, item.text);
                        })
                    ),
                ])
            );
            break;

        case "ul":
            childList.push(
                h("div", { class: ["de-col"] }, [
                    h("p", { class: ["de-name"] }, "List Style : "),
                    h(
                        "select",
                        {
                            class: ["de-selector"],
                            value: store.value.controlStatus.listBlockStyle,
                            onChange: (event: Event) => {
                                const $target = event.currentTarget as HTMLSelectElement;

                                if ($target !== null) {
                                    _setListBlockStyle($target.value as DEListStyle, store);
                                }
                            },
                        },
                        store.value.listUlType.map((item) => {
                            return h("option", { value: item.code }, item.text);
                        })
                    ),
                ])
            );
            break;
    }

    return h("div", { class: ["de-controlbar", "js-de-controlbar"], style: { top: `${store.value.controlBar.y}px`, left: `${store.value.controlBar.x}px` } }, childList);
}
