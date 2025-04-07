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

// 난수 아이디 생성
export function _generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 6; i += 1) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}
