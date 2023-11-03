import { ref } from "vue";
import { setCursorData, setCursorToView } from "../utils/cursor";
import type { EditorOptions, editorMenu, EditorContentType, userCustomMenu, userStyleMenu, CursorSelection } from "../../../types/index";

class DragonEditorStore {
    // importent editor value
    editorData = ref<EditorContentType>([]);
    option = ref<EditorOptions>({
        blockMenu: ["text", "ol", "ul"], // TODO : 다른 블럭 만들기 "table", "quotation"
    });
    emit: any;
    windowObject: Window | undefined;
    rowList = ref<any[]>([]);
    editorKey = ref<number>(0);

    // ui value
    editorWrapInfo = ref<DOMRect>({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        toJSON() {},
    });
    leftMenuTop = ref<number>(0);
    leftMenuActive = ref<boolean>(false);

    // ui control value
    activeIndexNumber: number = 0;
    selection: CursorSelection = {
        type: "",
        startNode: null,
        startOffset: null,
        endNode: null,
        endOffset: null,
    };
}

export default new DragonEditorStore();
