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

    // option setting function
    setOption(userValue: EditorOptions) {
        if (userValue.blockMenu !== undefined) {
            this.option.value.blockMenu = userValue.blockMenu;
        }

        if (userValue.customBlockMenu !== undefined) {
            this.option.value.customBlockMenu = userValue.customBlockMenu;
        }

        if (userValue.customStyleMenu !== undefined) {
            this.option.value.customStyleMenu = userValue.customStyleMenu;
        }

        if (userValue.medaiURL !== undefined) {
            this.option.value.medaiURL = userValue.medaiURL;
        }
    }

    updateModelValue() {
        setCursorData();
        const exportData: EditorContentType[] = [];

        this.editorData.value.forEach((item: any) => {
            delete item.key;
            exportData.push(item);
        });

        this.emit("update:modelValue", exportData);
        // 데이터 업데이트에 의한 딜레이 설정
        setTimeout(() => {
            setCursorToView();
        });
    }
}

export default new DragonEditorStore();
