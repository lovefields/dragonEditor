import store from "../sotre";

export function setEditorOption(option: DEditorOption = {}) {
    store.mode = option.mode ?? "edit";
    
}
