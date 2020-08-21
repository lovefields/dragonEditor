export function makeView(){
    let view = "";

    view += makecontentArea();
    console.log(editorCondition.wrap);
    console.log(editorCondition.blockMenu);
/*
    `
<button class="btn btn_add_content" data-value="text" data-text="Text">
<svg viewbox="0 0 50 50" class="icon">
    <use class="path" xlink:href="#icon_text" href="#icon_text" />
</svg>
</button>
`
*/

    
    editorCondition.wrap.innerHTML = view;
}

function makecontentArea(){
    return `<section class="editor-content" data-lang="${editorCondition.lang}"><p class="editor-item" contenteditable="true" data-type="text"></p></section>`;
}

function makeBlockMenu(data){

}