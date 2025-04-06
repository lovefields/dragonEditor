import type { Ref } from "vue";

export function _updateModelData(store: Ref<DragonEditorStore>): void {
    const $body = store.value.$body;

    if ($body !== null) {
        const newData: DEContentData = [];
        const $blockList = $body.querySelectorAll(".de-block");

        $blockList.forEach(($el) => {
            let classListText: string = $el.classList.value.replaceAll("de-block", "");

            switch (true) {
                case $el.classList.contains("de-text-block"):
                    let classList = classListText.replaceAll("de-text-block", "").trim();

                    newData.push({
                        type: "text",
                        classList: classList === "" ? [] : classList.split(" "),
                        textContent: $el.innerHTML,
                    });
                    break;

                case $el.classList.contains("de-heading-block"):
                    break;

                case $el.classList.contains("de-list-block"):
                    break;

                case $el.classList.contains("de-image-block"):
                    break;

                case $el.classList.contains("de-code-block"):
                    break;

                default:
            }
        });

        store.value.emit("update:modelValue", newData);
    }
}
