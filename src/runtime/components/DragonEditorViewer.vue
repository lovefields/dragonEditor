<template>
    <component :is="structure()"></component>
</template>

<script setup lang="ts">
import { h } from "vue";
import type { VNode } from "vue";

const props = defineProps<{
    content: DEContentData;
    imageHostURL?: string;
}>();

function structure(): VNode {
    const childList: VNode[] = [];

    props.content.forEach((item) => {
        switch (item.type) {
            case "text":
                childList.push(h("p", { class: ["de-block", "de-text-block", ...item.classList], innerHTML: item.textContent }));
                break;

            case "heading":
                childList.push(h(`h${item.level}`, { class: ["de-block", "de-heading-block", ...item.classList], innerHTML: item.textContent, "data-level": item.level }));
                break;

            case "list":
                const liList: VNode[] = [];

                item.child.forEach((child) => {
                    liList.push(h("li", { class: ["de-item", ...child.classList], innerHTML: child.textContent }));
                });

                childList.push(h(item.element, { class: ["de-block", "de-list-block"], "data-style": item.style }, liList));
                break;

            case "image":
                const imageChild: VNode[] = [];

                imageChild.push(
                    h(
                        "div",
                        { class: ["de-image-area"], "data-maxwidth": item.maxWidth },
                        h("img", {
                            class: ["de-img"],
                            src: props.imageHostURL === undefined ? item.src : props.imageHostURL + item.src,
                            alt: "",
                            width: item.width,
                            height: item.height,
                            loading: "lazy",
                        })
                    )
                );

                if (item.caption) {
                    imageChild.push(h("p", { class: ["de-caption"], innerHTML: item.caption }));
                }

                childList.push(h("div", { class: ["de-block", "de-image-block", ...item.classList] }, imageChild));
                break;

            case "code":
                childList.push(
                    h(
                        "div",
                        {
                            class: ["de-block", "de-code-block"],
                            "data-theme": item.theme,
                        },
                        [
                            h(
                                "p",
                                {
                                    class: ["de-filename"],
                                },
                                item.filename
                            ),
                            h(
                                "p",
                                {
                                    class: ["de-language"],
                                },
                                item.language
                            ),
                            h(
                                "pre",
                                {
                                    class: ["de-pre"],
                                },
                                [
                                    h("code", {
                                        class: ["de-code-content"],
                                        innerHTML: item.textContent,
                                    }),
                                ]
                            ),
                        ]
                    )
                );
                break;

            case "custom":
                childList.push(h("div", { class: ["de-block", "de-custom-block", ...item.classList], innerHTML: item.textContent }));
                break;
        }
    });

    return h(
        "div",
        {
            class: ["dragon-editor-viewer"],
        },
        childList
    );
}
</script>

<style lang="scss">
@use "../scss/viewer.scss";
</style>
