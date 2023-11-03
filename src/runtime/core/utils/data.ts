import type { EditorOptions, editorMenu, EditorContentType, userCustomMenu, userStyleMenu, CursorSelection } from "../../../types/index";
import store from "../../core/store/editorStore";
import { setCursorData, setCursorToView } from "./cursor";

// option setting function
export function setOption(userValue: EditorOptions) {
    if (userValue.blockMenu !== undefined) {
        store.option.value.blockMenu = userValue.blockMenu;
    }

    if (userValue.customBlockMenu !== undefined) {
        store.option.value.customBlockMenu = userValue.customBlockMenu;
    }

    if (userValue.customStyleMenu !== undefined) {
        store.option.value.customStyleMenu = userValue.customStyleMenu;
    }

    if (userValue.medaiURL !== undefined) {
        store.option.value.medaiURL = userValue.medaiURL;
    }
}

export function updateModelValue() {
    setCursorData();
    const exportData: EditorContentType[] = [];

    store.editorData.value.forEach((item: any) => {
        delete item.key;
        exportData.push(item);
    });

    store.emit("update:modelValue", exportData);
    // 데이터 업데이트에 의한 딜레이 설정
    setTimeout(() => {
        setCursorToView();
    });
}
