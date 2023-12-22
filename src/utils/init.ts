import { setEditorOption } from "./data";
import { setLayout } from "./layout";
import { setEvent } from "./event";

export default class EditorInit {
    wrap: HTMLDivElement;
    mode: DEMode = "edit";
    data: DEditorData = [];
    cursorData: DEditorCursor | null = null;

    constructor($el: HTMLDivElement, option?: DEditorOption) {
        const self = this;

        self.wrap = $el;
        setEditorOption(self, option);
        setLayout(self);
        if (self.mode === "edit") {
            setEvent(self);
        }
    }
}
