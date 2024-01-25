import type EditorInit from "./init";

// 난수 아이디 생성
export function generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 6; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

export function setEditorOption(store: EditorInit, option: DEditorOption = {}) {
    const defaultBlockList: DEBlockListItem[] = [
        {
            name: "Text",
            value: "text",
        },
        {
            name: "Heading-1",
            value: "heading1",
        },
        {
            name: "Heading-2",
            value: "heading2",
        },
        {
            name: "Heading-3",
            value: "heading3",
        },
    ];

    store.mode = option.mode ?? "edit";
    store.data = option.data ?? [];

    if (option.blockList !== undefined) {
        let listArray: DEBlockListItem[] = [];

        option.blockList.forEach((value: string) => {
            const target = defaultBlockList.find((item) => item.value === value);

            if (target !== undefined) {
                listArray.push(target);
            }
        });

        store.blockList = listArray;
    } else {
        store.blockList = defaultBlockList;
    }
}
