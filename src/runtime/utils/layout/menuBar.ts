import { h } from "vue";
import type { VNode, Ref } from "vue";
import { _getIconNode } from "./index";

export function _getMenuBarVNodeStructure(store: Ref<DragonEditorStore>): VNode {
    return h("div", { class: ["de-menu-bar"], style: { top: `${store.value.menuBarTop}px` } });
}

//         <div v-if="props.useMenuBar === true" class="de-menu-bar" :style="{ top: `${menuBarTop}px` }">
//             <div class="de-menu-wrap">
//                 <button class="de-menu de-menu-add" @click="isActiveAddBlockMenu = !isActiveAddBlockMenu">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M50.6667 34.6668H34.6667V50.6668H29.3334V34.6668H13.3334V29.3335H29.3334V13.3335H34.6667V29.3335H50.6667V34.6668Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="setDecoration('bold')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M40.6 31.4402C43.1866 29.6535 45 26.7202 45 24.0002C45 17.9735 40.3333 13.3335 34.3333 13.3335H17.6666V50.6668H36.44C42.0133 50.6668 46.3333 46.1335 46.3333 40.5602C46.3333 36.5068 44.04 33.0402 40.6 31.4402ZM25.6666 20.0002H33.6666C35.88 20.0002 37.6666 21.7868 37.6666 24.0002C37.6666 26.2135 35.88 28.0002 33.6666 28.0002H25.6666V20.0002ZM35 44.0002H25.6666V36.0002H35C37.2133 36.0002 39 37.7868 39 40.0002C39 42.2135 37.2133 44.0002 35 44.0002Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="setDecoration('italic')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M26.6667 13.3335V21.3335H32.56L23.44 42.6668H16V50.6668H37.3333V42.6668H31.44L40.56 21.3335H48V13.3335H26.6667Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="setDecoration('underline')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M32 45.3333C40.8267 45.3333 48 38.16 48 29.3333V8H41.3334V29.3333C41.3334 34.48 37.1467 38.6667 32 38.6667C26.8534 38.6667 22.6667 34.48 22.6667 29.3333V8H16V29.3333C16 38.16 23.1734 45.3333 32 45.3333ZM13.3334 50.6667V56H50.6667V50.6667H13.3334Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="setDecoration('strikethrough')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M26.6667 52H37.3333V44H26.6667V52ZM13.3333 12V20H26.6667V28H37.3333V20H50.6667V12H13.3333ZM8 38.6667H56V33.3333H8V38.6667Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="setDecoration('code')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M25.0667 44.2667L12.8 32L25.0667 19.7333L21.3334 16L5.33337 32L21.3334 48L25.0667 44.2667ZM38.9334 44.2667L51.2 32L38.9334 19.7333L42.6667 16L58.6667 32L42.6667 48L38.9334 44.2667Z"></path>
//                     </svg>
//                 </button>

//                 <button
//                     class="de-menu de-link-add"
//                     @click="
//                         () => {
//                             isActiveLinkArea = !isActiveLinkArea;
//                             openLinkArea();
//                         }
//                     "
//                 >
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M45.3334 18.6665H34.6667V23.9998H45.3334C49.7334 23.9998 53.3334 27.5998 53.3334 31.9998C53.3334 36.3998 49.7334 39.9998 45.3334 39.9998H34.6667V45.3332H45.3334C52.6934 45.3332 58.6667 39.3598 58.6667 31.9998C58.6667 24.6398 52.6934 18.6665 45.3334 18.6665ZM29.3334 39.9998H18.6667C14.2667 39.9998 10.6667 36.3998 10.6667 31.9998C10.6667 27.5998 14.2667 23.9998 18.6667 23.9998H29.3334V18.6665H18.6667C11.3067 18.6665 5.33337 24.6398 5.33337 31.9998C5.33337 39.3598 11.3067 45.3332 18.6667 45.3332H29.3334V39.9998ZM21.3334 29.3332H42.6667V34.6665H21.3334V29.3332Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="removeLink">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M38.3734 29.5065L42.6667 33.7998V29.5065H38.3734ZM45.3334 18.8398H34.6667V23.9065H45.3334C49.8934 23.9065 53.6 27.6131 53.6 32.1731C53.6 35.5598 51.5467 38.4931 48.6134 39.7465L52.3467 43.4798C56.1334 41.1331 58.6667 36.9465 58.6667 32.1731C58.6667 24.8131 52.6934 18.8398 45.3334 18.8398ZM5.33337 11.5598L13.6267 19.8531C8.77337 21.8265 5.33337 26.5998 5.33337 32.1731C5.33337 39.5331 11.3067 45.5065 18.6667 45.5065H29.3334V40.4398H18.6667C14.1067 40.4398 10.4 36.7331 10.4 32.1731C10.4 27.9331 13.6267 24.4398 17.76 23.9865L23.28 29.5065H21.3334V34.8398H28.6134L34.6667 40.8931V45.5065H39.28L49.9734 56.1998L53.7334 52.4398L9.09337 7.7998L5.33337 11.5598Z"></path>
//                     </svg>
//                 </button>

//                 <label class="de-menu">
//                     <input type="file" hidden accept=".jpg,.jpeg,.png,.webp,.gif" @change="chooseMediaEvent" />
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path d="M50.6667 13.3333V50.6667H13.3333V13.3333H50.6667ZM50.6667 8H13.3333C10.4 8 8 10.4 8 13.3333V50.6667C8 53.6 10.4 56 13.3333 56H50.6667C53.6 56 56 53.6 56 50.6667V13.3333C56 10.4 53.6 8 50.6667 8ZM37.7067 31.6267L29.7067 41.9467L24 35.04L16 45.3333H48L37.7067 31.6267Z"></path>
//                     </svg>
//                 </label>

//                 <button class="de-menu" @click="setTextAlign('left')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M40 40H8V45.3333H40V40ZM40 18.6667H8V24H40V18.6667ZM8 34.6667H56V29.3333H8V34.6667ZM8 56H56V50.6667H8V56ZM8 8V13.3333H56V8H8Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="setTextAlign('center')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M18.6667 40V45.3333H45.3333V40H18.6667ZM8 56H56V50.6667H8V56ZM8 34.6667H56V29.3333H8V34.6667ZM18.6667 18.6667V24H45.3333V18.6667H18.6667ZM8 8V13.3333H56V8H8Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="setTextAlign('right')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M8 56H56V50.6667H8V56ZM24 45.3333H56V40H24V45.3333ZM8 34.6667H56V29.3333H8V34.6667ZM24 24H56V18.6667H24V24ZM8 8V13.3333H56V8H8Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="setTextAlign('justify')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path" d="M8 56H56V50.6667H8V56ZM8 45.3333H56V40H8V45.3333ZM8 34.6667H56V29.3333H8V34.6667ZM8 24H56V18.6667H8V24ZM8 8V13.3333H56V8H8Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="moveBlock('up')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path d="M9.33333 35.9999C9.33333 29.4666 14.0267 24.0799 20.2133 22.9066L16.24 26.9066L20 30.6666L30.6667 19.9733L20 9.33325L16.24 13.0933L20.4533 17.3066V17.4666C11.2 18.5599 4 26.4533 4 35.9999C4 46.3199 12.3467 54.6666 22.6667 54.6666H30.6667V49.3333H22.6667C15.3067 49.3333 9.33333 43.3599 9.33333 35.9999Z M36 35.9999V54.6666H60V35.9999H36ZM54.6667 49.3333H41.3333V41.3333H54.6667V49.3333Z M60 11.9999H36V30.6666H60V11.9999Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="moveBlock('down')">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path d="M9.33333 27.9999C9.33333 34.5333 14.0267 39.9199 20.2133 41.0933L16.24 37.1199L20 33.3333L30.6667 44.0266L20 54.6666L16.24 50.9066L20.4533 46.6933V46.5333C11.2 45.4399 4 37.5466 4 27.9999C4 17.6799 12.3467 9.33325 22.6667 9.33325H30.6667V14.6666H22.6667C15.3067 14.6666 9.33333 20.6399 9.33333 27.9999Z M60 27.9999V9.33325H36V27.9999H60ZM54.6667 22.6666H41.3333V14.6666H54.6667V22.6666Z M60 33.3333H36V51.9999H60V33.3333Z"></path>
//                     </svg>
//                 </button>

//                 <button class="de-menu" @click="deleteBlock">
//                     <svg class="de-icon" viewBox="0 0 64 64">
//                         <path class="de-path --red" fill-rule="evenodd" clip-rule="evenodd" d="M42.6667 24V50.6667H21.3334V24H42.6667ZM38.6667 8H25.3334L22.6667 10.6667H13.3334V16H50.6667V10.6667H41.3334L38.6667 8ZM48 18.6667H16V50.6667C16 53.6 18.4 56 21.3334 56H42.6667C45.6 56 48 53.6 48 50.6667V18.6667Z"></path>
//                     </svg>
//                 </button>
//             </div>

//             <div class="de-block-menu-area" :class="{ '--active': isActiveAddBlockMenu }">
//                 <div class="de-list">
//                     <button class="de-add-block" @click="addBlock('text')">Text</button>
//                     <button class="de-add-block" @click="addBlock('heading1')">Heading-1</button>
//                     <button class="de-add-block" @click="addBlock('heading2')">Heading-2</button>
//                     <button class="de-add-block" @click="addBlock('heading3')">Heading-3</button>
//                     <button class="de-add-block" @click="addBlock('ul')">Unodered List</button>
//                     <button class="de-add-block" @click="addBlock('ol')">Odered List</button>
//                     <button class="de-add-block" @click="addBlock('code')">Code Block</button>
//                     <button class="de-add-block" @click="addBlock('table')">Table Block</button>
//                     <button class="de-add-block" @click="addBlock('video')">Video</button> youtube | vimeo
//                 </div>
//             </div>

//             <div class="de-link-exit-area" :class="{ '--active': isActiveLinkArea }">
//                 <div class="de-btn-area">
//                     <button class="de-btn" :class="{ '--active': activeLinkTabType === 'url' }" @click="openLinkArea"> Text </button>
//                     <button class="de-btn" :class="{ '--active': activeLinkTabType === 'heading' }" @click="listUpHeading">Heading</button>
//                 </div>

//                 <div v-if="activeLinkTabType === 'url'" class="de-link-text-area">
//                     <input v-model="anchorTagValue" class="de-input" :class="{ '--red': anchorValueError }" type="url" ref="$linkInput" />
//                     <button class="de-btn" @click="setLink">Add</button>
//                 </div>

//                 <div v-if="activeLinkTabType === 'heading'" class="de-link-heading-area">
//                     <button v-for="item in anchorHeadingList" class="de-btn" @click="setHeadingLink(item.id)">{{ item.name }}</button>
//                 </div>
//             </div>
//         </div>

