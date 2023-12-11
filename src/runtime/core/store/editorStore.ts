import { ref } from "vue";
import "../../types/global.d.ts";

class DragonEditorStore {
    // 필수 요소
    editorData: DEditorDataType[] = [];
    emit!: Emit;
    rowList = ref<any[]>([]);
    editorKey: number = 0;

    // importent editor value
    // editorData = ref<EditorContentType>([]);
    // option = ref<EditorOptions>({
    //     blockMenu: ["text", "ol", "ul"], // TODO : 다른 블럭 만들기 "table", "quotation"
    // });
    // windowObject: Window | undefined;

    // // ui value
    // editorWrapInfo = ref<DOMRect>({
    //     x: 0,
    //     y: 0,
    //     width: 0,
    //     height: 0,
    //     top: 0,
    //     left: 0,
    //     bottom: 0,
    //     right: 0,
    //     toJSON() {},
    // });
    // leftMenuTop = ref<number>(0);
    // leftMenuActive = ref<boolean>(false);

    // // ui control value
    // activeIndexNumber: number = 0;
    // selection: CursorSelection = {
    //     type: "",
    //     startNode: null,
    //     startOffset: null,
    //     endNode: null,
    //     endOffset: null,
    // };
}

export default new DragonEditorStore();
