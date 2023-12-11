import store from "../../core/store/editorStore";

let textBlockKeyUpFn: NodeJS.Timeout;
export function textBlockKeyUpEvent(e: KeyboardEvent, idx: number) {
    clearTimeout(textBlockKeyUpFn);
    textBlockKeyUpFn = setTimeout(() => {
        const $target = (e.currentTarget as HTMLParagraphElement) ?? (e.target as HTMLParagraphElement);

        store.editorData[idx].textContent = $target.innerHTML;

        store.emit("update:modelValue", store.editorData);
    }, 250);
}
