import type EditorInit from "./init";

// // 난수 아이디 생성
// export function generateId() {
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//     let str = "";

//     for (let i = 0; i < 5; i++) {
//         str += chars.charAt(Math.floor(Math.random() * chars.length));
//     }

//     return str;
// }

export function setEditorOption(store: EditorInit, option: DEditorOption = {}) {
    store.mode = option.mode ?? "edit";
    store.data = option.data ?? [];
}
