// default
import { h, defineComponent } from "vue";
import { convertViewBlock } from "../../core/utils";
import type { EditorContentType } from "../../../types";

// style
import "../../core/style/viewer.css";

export default defineComponent({
    name: "DragonEditorViewer",
    props: ["content", "mediaUrl"],
    setup: (props: { readonly content: EditorContentType; readonly mediaUrl?: string }, ctx) => {
        if (props.content === undefined || Array.isArray(props.content) === false) {
            throw new Error("[DragonEditor] Type error : 'content' props is must be Array.");
        }

        return () => {
            return h("div", { class: ["dragon-editor-viewer"] }, convertViewBlock(props.content, props.mediaUrl));
        };
    },
});
