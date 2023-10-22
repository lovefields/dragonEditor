import { h } from "vue";
import type { EditorContentType, TextBlock, ImageBlock, ListBlock, OtherBlock } from "../../../types/index";

export function createLeftMenu(modelValue: EditorContentType, top: number, isActive: boolean) {
    console.log(modelValue);
    // <div class="d-left-menu" :class="{ '--active': activeMenu }" :style="{ top: `${leftMenuPosition}px` }">
    //         <div class="d-add-block">
    //             <button class="d-btn-menu-pop" @click="toggleBlockAddMenu"></button>

    //             <div class="d-block-list" :class="{ '--active': activeBlockAddMenu }">
    //                 <button v-for="(row, count) in blockMenu" :key="count" class="d-btn-block" @click="row.action">
    //                     <SvgIcon v-if="row.hasIcon" :kind="row.icon" />
    //                     <div v-else class="d-icon" v-html="row.icon"></div>
    //                     <p class="d-name">{{ row.name }}</p>
    //                 </button>
    //             </div>
    //         </div>

    //         <div class="d-control-block">
    //             <button class="d-btn-block-pop" @click="toggleBlockControlMenu"></button>

    //             <div class="d-block-list" :class="{ '--active': activeBlockColtrolMenu }">
    //                 <button class="d-btn-block" @click="moveBlock('up')"> <SvgIcon kind="arrowUp" />Up </button>
    //                 <button class="d-btn-block" @click="moveBlock('down')"> <SvgIcon kind="arrowDown" />Down </button>
    //                 <button class="d-btn-block"> <SvgIcon kind="delete" />Delete </button>
    //             </div>
    //         </div>
    //     </div>

    return h("div", {
        class: ["d-left-menu", { "--active": isActive }],
        onClick: () => {
            test();
        },
    });

    function test() {
        modelValue = [{ type: "text", classList: [], content: "123" }];
    }
}
