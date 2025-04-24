export * from "./keyboard";
export * from "./mouse";
export * from "./touch";
export * from "./data";
export * from "./window";
export * from "./scroll";
export * from "./cursor";
export * from "./block";


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

// function setDecoration(type: DEDecoration) {
//     _setNodeStyle(`de-${type}`, editorStore);
// }

// function setTextAlign(type: DETextalign) {
//     _setTextAlign(type, editorStore);
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
