export function makeView() {
    let view = "";

    view += makeContentArea(editorCondition.lang);

    view += `<div class="editor-menu-block">`;
    view += makeBlockMenu(editorCondition.defaultMenu);
    view += `</div>`;

    view += `<div class="editor-menu-bottom">`;
    view += makeBottomMenu();
    view += `</div>`;

    editorCondition.wrap.innerHTML = view;
}

function makeContentArea(lang) {
    return `<div class="editor-content" data-lang="${lang}"><p class="editor-item" contenteditable="true" data-type="text"></p></div>`;
}

function makeBlockMenu(data) {
    let html = "";

    for (const [key, value] of Object.entries(data)) {
        html += `
            <button class="editor-btn js-add-block" title="${value.text}" data-value="${key}">
                <svg viewbox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="${value.icon}" href="${value.icon}"></use>
                </svg>
                ${value.text}
            </button>
        `;
    }

    return html;
}

function makeBottomMenu(){
    return `
        <button class="editor-btn">
            <svg viewbox="0 0 64 64" class="editor-icon">
                <use class="path" xlink:href="#icon-folder" href="#icon-folder"></use>
            </svg>
            Media
        </button>
        <button class="editor-btn">
            <svg viewbox="0 0 64 64" class="editor-icon">
                <use class="path" xlink:href="#icon-lang" href="#icon-lang"></use>
            </svg>
            Change language
        </button>
        <button class="editor-btn editor-switch-device">
            <svg class="icon" viewbox="0 0 64 64">
                <use class="path editor-pc" xlink:href="#icon_pc" href="#icon-pc"></use>
                <use class="path editor-mobile" xlink:href="#icon_mobile" href="#icon-mobile"></use>
            </svg>
            Change view
        </button>
    `;
}
