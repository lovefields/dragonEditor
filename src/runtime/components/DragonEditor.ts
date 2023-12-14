import { h, defineComponent, ref, onMounted, watch } from "vue";
import { editor } from "../script";

export default defineComponent({
    name: "DragonEditor",
    props: ["option"],
    setup: (
        props: {
            // readonly option?: EditorOptions;
        },
        ctx
    ) => {
        return () => {
            return h("div", {
                class: ["dragon-editor"],
            });
        };
    },
});
