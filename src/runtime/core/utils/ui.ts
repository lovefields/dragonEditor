import store from "../../core/store/editorStore";
import { h, defineComponent, ref, onMounted, watch } from "vue";
import "../../types/global.d.ts";

import { textBlockKeyUpEvent } from "./keyboard";
// import { createNodeStructure } from "./node";

export function renderingEditorRow(data: DEditorDataType[]) {
    const objectArray: any[] = [];

    data.forEach((row, idx) => {
        switch (row.type) {
            case "text":
                // const textBlockInnerHTML = createNodeStructure(row.nodeList);
                // console.log("textBlockInnerHTML", textBlockInnerHTML);

                objectArray.push(
                    h("p", {
                        class: ["d-text-block"],
                        contenteditable: true,
                        ref: store.rowList,
                        onKeyup: (e: KeyboardEvent) => {
                            textBlockKeyUpEvent(e, idx);
                        },
                        innerHTML: row.textContent,
                    })
                );
                break;
        }
    });

    return objectArray;

    // const localData = convertModelToLocal(data);
}
