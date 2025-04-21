export * from "./keyboard";
export * from "./mouse";
export * from "./touch";
export * from "./data";
export * from "./window";
export * from "./scroll";
export * from "./cursor";
export * from "./block";

// /**
//  * 이벤트 관련 영역 시작
//  */

// // 컨트롤 바 상태 업데이트
// function controlBarStatusUpdate() {
//     if (editorStore.$currentBlock !== null) {
//         const { type } = _getBlockType(editorStore.$currentBlock);
//         const activeList = ["code", "list"];

//         curruntType.value = type;

//         if (activeList.includes(curruntType.value) === true) {
//             editorStore.controlBarActive();

//             switch (type) {
//                 case "code":
//                     _updateCodeBlockStyle(editorStore, codeBlockTheme, codeblockLanguage);
//                     break;
//                 case "list":
//                     _updateListBlockStyle(editorStore, listBlockStyle);
//                     break;
//             }
//         } else {
//             editorStore.controlBarDeactive();
//         }
//     }
// }


// // 메뉴 외부 클릭시 닫기
// function checkOthersideClick(event: MouseEvent) {
//     if (event.target !== null) {
//         const $controlBar = (event.target as HTMLElement).closest(".de-menu-bar");
//         const $btnMenu = (event.target as HTMLElement).closest(".de-menu-add");
//         const $menuArea = (event.target as HTMLElement).closest(".de-block-menu-area");
//         const $btnLink = (event.target as HTMLElement).closest(".de-link-add");
//         const $linkArea = (event.target as HTMLElement).closest(".de-link-exit-area");
//         let closeMenu: boolean = false;
//         let closeLink: boolean = false;

//         if ($controlBar === null) {
//             closeMenu = true;
//             closeLink = true;
//         } else {
//             if ($btnMenu === null && $menuArea === null) {
//                 closeMenu = true;
//             }

//             if ($btnLink === null && $linkArea === null) {
//                 closeLink = true;
//             }
//         }

//         if (closeMenu === true) {
//             isActiveAddBlockMenu.value = false;
//         }

//         if (closeLink === true) {
//             isActiveLinkArea.value = false;
//             anchorTagValue.value = "";
//         }
//     }
// }

// // 블럭 삭제
// function deleteBlock() {
//     if (editorStore.$currentBlock !== null) {
//         const childCount: number = editorStore.$content?.childElementCount ?? 1;
//         const preElement = editorStore.$currentBlock.previousElementSibling;

//         editorStore.$currentBlock.remove();

//         if (preElement === null) {
//             editorStore.setCurrentBlock(null);
//         } else {
//             const { type } = _getBlockType(editorStore.$currentBlock);
//             const activeList = ["text", "heading"];

//             if (activeList.includes(type) === true) {
//                 editorStore.setCurrentBlock(preElement as HTMLElement);
//                 _setCursor(preElement, 0);
//             } else {
//                 editorStore.setCurrentBlock(null);
//             }
//         }

//         if (childCount < 2) {
//             // 모든 엘리먼트를 지우려는 경우
//             const $block = _createTextBlock();

//             editorStore.$content?.insertAdjacentElement("beforeend", $block);
//             _setCursor($block, 0);
//         }
//     }
// }

// // 부모 요소 스크롤 이벤트 발생시 컨트롤 바 고정
// function parentWrapScollEvent() {
//     if (props.useMenuBar === true && editorStore.$parentWrap !== null && editorStore.$editor !== null) {
//         // 메뉴바를 사용하는 경우만

//         const editorReac = editorStore.$editor.getBoundingClientRect();
//         let scrollY: number = 0;

//         if (editorStore.$parentWrap.constructor.name === "Window") {
//             scrollY = (editorStore.$parentWrap as Window).scrollY;
//         } else {
//             scrollY = (editorStore.$parentWrap as HTMLElement).scrollTop;
//         }

//         let realElementY = editorReac.y + scrollY;

//         if (editorStore.$parentWrap.constructor.name !== "Window") {
//             const parentRect = (editorStore.$parentWrap as HTMLElement).getBoundingClientRect();

//             realElementY -= parentRect.y;
//         }

//         let value: number = 0;

//         if (scrollY > realElementY) {
//             value = scrollY - realElementY - 1;
//         } else {
//             value = 0;
//         }

//         if (value > editorReac.height - 39) {
//             value = editorReac.height - 39;
//         }

//         menuBarTop.value = Math.floor(value);
//     }
// }

// // 붙여넣기 이벤트
// function contentPasteEvent(event: ClipboardEvent) {
//     _pasteEvent(event, editorStore, emit);
// }

// function anchorTagValueUpdate() {
//     // 다른 이벤트 순서에 의한 딜레이
//     setTimeout(() => {
//         anchorTagValue.value = _getAnchorTagValue(editorStore);
//     }, 500);
// }

// /**
//  * 이벤트 관련 영역 종료
//  */

// /**
//  * 컨트롤 바 이벤트 관련 영역 시작
//  */

// // 코드 블럭 테마 적용
// function codeBlockThemeChangeEvent() {
//     _setCodeBlockTheme(editorStore, codeBlockTheme.value);
// }

// // 코드 블럭 언어 적용
// function codeblockLanguageChangeEvent() {
//     _setCodeBlockLanguage(editorStore, codeblockLanguage.value);
// }

// // 리스트 스타일 적용
// function listBlockStyleChangeEvent() {
//     _setListBlockStyle(editorStore, listBlockStyle.value);
// }

// /**
//  * 컨트롤 바 이벤트 관련 영역 종료
//  */

// /**
//  * 메뉴 이벤트 관련 영역
//  */
// function addBlock(type: string) {
//     isActiveAddBlockMenu.value = false;

//     let blockStructure: HTMLElement | null = null;

//     switch (type) {
//         case "text":
//             blockStructure = _createTextBlock();
//             break;
//         case "heading1":
//         case "heading2":
//         case "heading3":
//             const level: number = parseInt(type.replace("heading", ""));

//             blockStructure = _createHeadingBlock({
//                 type: "heading",
//                 classList: [],
//                 id: "",
//                 level: level,
//                 textContent: "",
//             });
//             break;
//         case "ul":
//         case "ol":
//             blockStructure = _createListBlock({
//                 type: "list",
//                 element: type,
//                 style: type === "ul" ? "disc" : "decimal",
//                 child: [
//                     {
//                         classList: [],
//                         textContent: "",
//                     },
//                 ],
//             });
//             break;
//         case "table":
//             // TODO : table block
//             break;
//         case "code":
//             blockStructure = _createCodeBlock({
//                 type: "code",
//                 theme: "github",
//                 filename: "",
//                 language: "Plain Text",
//                 textContent: "",
//             });
//             break;
//     }

//     if (blockStructure !== null) {
//         _addBlockToContent(blockStructure, editorStore);

//         switch (type) {
//             case "ul":
//             case "ol":
//                 (blockStructure.childNodes[0] as HTMLElement).focus();
//                 break;
//             case "codeblock":
//                 blockStructure.querySelector("code")?.focus();
//                 break;
//             default:
//                 blockStructure.focus();
//         }

//         editorStore.setCurrentBlock(blockStructure as HTMLElement);
//         controlBarStatusUpdate();
//     }
// }

// function addCustomBlock(HTML: string, classList: string[] = []) {
//     const blockStructure = _createCustomBlock({
//         type: "custom",
//         classList: classList,
//         textContent: HTML,
//     });

//     _addBlockToContent(blockStructure, editorStore);
// }

// function addImageBlock(data: DEImage) {
//     if (props.imageHostURL !== "") {
//         data.src = props.imageHostURL + data.src;
//     }

//     const blockStructure = _createImageBlock({
//         ...data,
//         type: "image",
//         maxWidth: 100,
//         classList: [],
//     } as DEImageBlock);

//     _addBlockToContent(blockStructure, editorStore);
// }

// function setDecoration(type: DEDecoration) {
//     _setNodeStyle(`de-${type}`, editorStore);
// }

// function setTextAlign(type: DETextalign) {
//     _setTextAlign(type, editorStore);
// }

// function getContentData(): DEContentData {
//     if (editorStore.$content !== null) {
//         return _getContentData(editorStore.$content, props.imageHostURL);
//     } else {
//         console.error("[DragonEditor] Con't find content Element.");
//         return [];
//     }
// }

// function setContentData(data: DEContentData) {
//     _setContentData(data, editorStore, props.imageHostURL);
// }

// function moveBlock(type: "up" | "down") {
//     if (editorStore.$currentBlock !== null) {
//         let $target: Element | null;

//         if (type === "up") {
//             $target = editorStore.$currentBlock.previousElementSibling;
//         } else {
//             $target = editorStore.$currentBlock.nextElementSibling;
//         }

//         if ($target !== null) {
//             ($target as HTMLElement).insertAdjacentHTML(type === "up" ? "beforebegin" : "afterend", editorStore.$currentBlock.outerHTML);
//             editorStore.$currentBlock.remove();

//             if (type === "up") {
//                 editorStore.setCurrentBlock(($target as HTMLElement).previousElementSibling as HTMLElement | null);
//             } else {
//                 editorStore.setCurrentBlock(($target as HTMLElement).nextElementSibling as HTMLElement | null);
//             }
//         }
//     }
// }

// function openLinkArea() {
//     activeLinkTabType.value = "url";
//     anchorValueError.value = false;
// }

// function chooseMediaEvent(event: Event) {
//     const $target = event.target as HTMLInputElement;
//     const file = $target.files![0];

//     emit("uploadImageEvent", file);
//     $target.value = "";
// }

// // 링크 삽입
// function setLink() {
//     if ($linkInput.value !== null && $linkInput.value?.checkValidity() === true && anchorTagValue.value !== "") {
//         _setAnchorTag(anchorTagValue.value, true, editorStore);
//         isActiveLinkArea.value = false;
//         anchorValueError.value = false;
//         anchorTagValue.value = "";
//     } else {
//         anchorValueError.value = true;
//     }
// }

// function setHeadingLink(id: string) {
//     _setAnchorTag(id, false, editorStore);
//     isActiveLinkArea.value = false;
//     anchorValueError.value = false;
//     anchorTagValue.value = "";
// }

// // 헤딩 리스트 업데이트
// function listUpHeading() {
//     activeLinkTabType.value = "heading";

//     if (editorStore.$content !== null) {
//         const $blockList = editorStore.$content.querySelectorAll(".de-heading-block");
//         let headingList: DEHeadingItem[] = [];

//         $blockList.forEach(($headingTag) => {
//             if ($headingTag.textContent !== null) {
//                 headingList.push({
//                     name: $headingTag.textContent,
//                     id: $headingTag.id,
//                 });
//             }
//         });

//         anchorHeadingList.value = headingList;
//     }
// }

// function removeLink() {
//     _unsetAnchorTag(editorStore);
// }

// /**
//  * 메뉴 이벤트 관련 영역 종료
//  */
