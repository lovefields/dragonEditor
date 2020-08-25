export function makeView() {
    let view = "";

    view += makeContentArea(editorCondition.lang);

    view += `<div class="editor-menu-block">`;
    view += makeBlockMenu(editorCondition.defaultMenu);
    //view += makeBlockMenu();
    view += `</div>`;

    view += `<div class="editor-menu-bottom">`;
    view += makeBottomMenu();
    view += makeLanguagePop();
    view += `</div>`;

    editorCondition.wrap.innerHTML = view;
}

function makeContentArea(lang) {
    return `<div class="editor-content js-content" data-lang="${lang}"><p class="editor-item js-item" contenteditable="true" data-type="text"></p></div>`;
}

function makeBlockMenu(data) {
    let html = "";

    for (const [key, value] of Object.entries(data)) {
        if (key === "emoticonBlock") {
            html += `
                <div class="editor-relative">
                    <button class="editor-btn js-toggle-target" title="${value.text}" data-value="${key}" data-target=".editor-pop-emoticon">
                        <svg viewbox="0 0 64 64" class="editor-icon">
                            <use class="path" xlink:href="${value.icon}" href="${value.icon}"></use>
                        </svg>
                        ${value.text}
                    </button>
            `;
            html += makeEmoticonPop();
            html += `</div>`;
        } else {
            html += `
                <button class="editor-btn js-add-block" title="${value.text}" data-value="${key}">
                    <svg viewbox="0 0 64 64" class="editor-icon">
                        <use class="path" xlink:href="${value.icon}" href="${value.icon}"></use>
                    </svg>
                    ${value.text}
                </button>
            `;
        }
    }

    return html;
}

function makeBottomMenu() {
    return `
        <button class="editor-btn js-toggle-target" data-target=".editor-pop-folder">
            <svg viewbox="0 0 64 64" class="editor-icon">
                <use class="path" xlink:href="#icon-folder" href="#icon-folder"></use>
            </svg>
            Media
        </button>
        <button class="editor-btn js-toggle-target" data-target=".editor-pop-lang">
            <svg viewbox="0 0 64 64" class="editor-icon">
                <use class="path" xlink:href="#icon-lang" href="#icon-lang"></use>
            </svg>
            Change language
        </button>
        <button class="editor-btn editor-switch-device js-switch-device">
            <svg class="icon" viewbox="0 0 64 64">
                <use class="path editor-pc" xlink:href="#icon_pc" href="#icon-pc"></use>
                <use class="path editor-mobile" xlink:href="#icon_mobile" href="#icon-mobile"></use>
            </svg>
            Change view
        </button>
    `;
}

function makeLanguagePop() {
    let html = `<div class="editor-pop-lang" data-length="${editorCondition.langCategory.length}">`;

    editorCondition.langCategory.forEach((lang) => {
        if(lang == editorCondition.lang){
            html += `<button class="editor-btn-lang js-change-lang --act" data-value="${lang}">${lang.toUpperCase()}</button>`;
        }else{
            html += `<button class="editor-btn-lang js-change-lang" data-value="${lang}">${lang.toUpperCase()}</button>`;
        }
    });

    html += `</div>`;

    return html;
}

function makeEmoticonPop() {
    let html = `<div class="editor-pop-emoticon">`;


    html += `</div>`;

    return html;
}