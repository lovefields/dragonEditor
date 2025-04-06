import { h } from "vue";
import type { VNode, Ref } from "vue";

export function _getControlbarVNodeStructure(store: Ref<DragonEditorStore>): VNode {
    return h("div", { class: ["de-controlbar", "js-de-controlbar"] });
}

//         <div v-if="editorStore.$currentBlock !== null" class="de-controlbar js-de-controlbar" :class="{ '--active': editorStore.controlBar.active === true }" :style="{ top: `${editorStore.controlBar.y}px`, left: `${editorStore.controlBar.x}px` }" ref="$controlBar">
//             <div v-if="['code'].includes(curruntType) === true" class="de-col">
//                 <p class="de-name">Theme :</p>
//                 <select class="de-selector" v-model="codeBlockTheme" @change="codeBlockThemeChangeEvent">
//                     <option v-for="(item, i) in _getCodeBlockTheme()" :value="item.code" :key="`codeBlockTheme-${i}`">{{ item.text }}</option>
//                 </select>
//             </div>

//             <div v-if="['code'].includes(curruntType) === true" class="de-col">
//                 <p class="de-name">Language :</p>
//                 <select class="de-selector" v-model="codeblockLanguage" @change="codeblockLanguageChangeEvent">
//                     <option v-for="(item, i) in _getCodeBlockLanguage()" :value="item.code" :key="`codeBlockLanuage-${i}`">{{ item.text }}</option>
//                 </select>
//             </div>

//             <div v-if="['list'].includes(curruntType) === true" class="de-col">
//                 <p class="de-name">List Style :</p>
//                 <select class="de-selector" v-model="listBlockStyle" @change="listBlockStyleChangeEvent">
//                     <template v-if="editorStore.$currentBlock.tagName === 'UL'">
//                         <option value="disc">Disc</option>
//                         <option value="square">Square</option>
//                     </template>

//                     <template v-else>
//                         <option value="decimal">Decimal</option>
//                         <option value="lower-alpha">Lower-Alpha</option>
//                         <option value="upper-alpha">Upper-Alpha</option>
//                         <option value="lower-roman">Lower-Roman</option>
//                         <option value="upper-roman">Upper-Roman</option>
//                     </template>
//                 </select>
//             </div>
//         </div>
