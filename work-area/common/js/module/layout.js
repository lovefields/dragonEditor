const { typeCheckThrow, upperFirstChar, classControl } = require("./default");
const { getElement, getActiveElement } = require("./selector");
const { setCursor } = require("./cursor");

export function makeView() {
    let view = "";

    view += makeContentArea(condition.lang);

    view += `<div class="editor-menu-block">`;
    view += makeBlockMenu(condition.defaultMenu);
    view += `</div>`;

    view += `<div class="editor-menu-bottom">`;
    view += makeBottomMenu();
    if (condition.multiLang == true) {
        view += makeLanguagePop();
    }
    view += makeFolderPop();
    view += `</div>`;

    if (condition.uploadURL !== "") {
        view += makeUploadForm();
    }

    view += makeLinkboxPop();
    view += makeOptionPop();
    view += makeEmoticonPop();

    condition.wrap.insertAdjacentHTML("beforeend", view);
}

function makeContentArea(lang) {
    return `<div class="editor-content djs-content" data-lang="${lang}"><p class="editor-item djs-item" contenteditable="true" data-type="text"></p></div>`;
}

function makeBlockMenu(data) {
    let arr = Object.entries(data);
    let html = `<div class="editor-scroll-col editor-clearfix" data-count="${arr.length}">`;

    for (const [key, value] of arr) {
        if (value.type === "block") {
            html += `
                <button class="editor-btn djs-add-block" title="${value.text}" data-value="${key}" data-type="${value.type}">
                    <svg viewbox="0 0 64 64" class="editor-icon">
                        <use class="path" xlink:href="${value.icon}" href="${value.icon}"></use>
                    </svg>
                    ${value.text}
                </button>
            `;
        } else if (value.type === "pop") {
            html += `
                <button class="editor-btn djs-add-block djs-btn-ignore" title="${value.text}" data-value="${key}" data-type="${value.type}">
                    <svg viewbox="0 0 64 64" class="editor-icon">
                        <use class="path" xlink:href="${value.icon}" href="${value.icon}"></use>
                    </svg>
                    ${value.text}
                </button>
            `;
        } else if (value.type === "file") {
            html += `
                <button class="editor-btn djs-add-block" title="${value.text}" data-value="${key}" data-type="${value.type}">
                    <svg viewbox="0 0 64 64" class="editor-icon">
                        <use class="path" xlink:href="${value.icon}" href="${value.icon}"></use>
                    </svg>
                    ${value.text}
                </button>
            `;
        }
    }

    html += `</div>`;

    return html;
}

function makeBottomMenu() {
    let html = ``;

    if (condition.uploadURL !== "") {
        html += `
            <button class="editor-btn djs-toggle-target djs-btn-ignore" data-target=".editor-pop-folder">
                <svg viewbox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-folder" href="#icon-folder"></use>
                </svg>
                Media
            </button>
        `;
    }

    if (condition.multiLang == true) {
        html += `
            <button class="editor-btn djs-toggle-target djs-btn-ignore" data-target=".editor-pop-lang">
                <svg viewbox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-lang" href="#icon-lang"></use>
                </svg>
                Change language
            </button>
        `;
    }

    html += `
        <button class="editor-btn editor-switch-device djs-switch-device">
            <svg class="icon" viewbox="0 0 64 64">
                <use class="path editor-pc" xlink:href="#icon-pc" href="#icon-pc"></use>
                <use class="path editor-mobile" xlink:href="#icon_mobile" href="#icon-mobile"></use>
            </svg>
            Change view
        </button>
    `;

    return html;
}

function makeLanguagePop() {
    let html = `<div class="editor-pop-lang djs-trigger" data-length="${condition.langCategory.length}">`;

    condition.langCategory.forEach((lang) => {
        if (lang == condition.lang) {
            html += `<button class="editor-btn-lang djs-change-lang --act" data-value="${lang}">${lang.toUpperCase()}</button>`;
        } else {
            html += `<button class="editor-btn-lang djs-change-lang" data-value="${lang}">${lang.toUpperCase()}</button>`;
        }
    });

    html += `</div>`;

    return html;
}

function makeEmoticonPop() {
    return `
        <div class="editor-list-pop editor-pop-emoticon editor-scroll djs-emoticon-pop djs-trigger djs-scroll">
            <div class="editor-scroll-content djs-scroll-content">
                <div class="editor-list-emoticon djs-list-emoticon editor-clearfix"></div>
            </div>
        </div>
    `;
}

function makeFolderPop() {
    return `
        <div class="editor-list-pop editor-pop-folder editor-scroll djs-folder-pop djs-trigger djs-scroll">
            <div class="editor-scroll-content djs-scroll-content">
                <ul class="editor-list-media djs-list-media editor-clearfix"></ul>
            </div>
        </div>
    `;
}

function makeLinkboxPop() {
    return `
        <div class="editor-pop-linkbox djs-linkbox-pop editor-clearfix djs-trigger" data-type="new">
            <input type="url" class="editor-input djs-input --new" placeholder="https://dico.me">
            <a href="" class="editor-link --del djs-link"></a>
            <button class="editor-btn djs-btn" data-value="">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path --del" xlink:href="#icon-delete-link" href="#icon-delete-link"></use>
                    <use class="path --new" xlink:href="#icon-btn-accept" href="#icon-btn-accept"></use>
                </svg>
            </button>
        </div>
    `;
}

function makeUploadForm() {
    let html = `<form enctype="multipart/form-data" method="post" class="editor-uploader djs-uploader">`;

    if (condition.multiUpload == true) {
        html += `<input type="file" multiple class="djs-file">`;
    } else {
        html += `<input type="file" class="djs-file">`;
    }
    html += `</form>`;

    return html;
}

export function scrollButtonHTML() {
    return `<button class="scroll-bar djs-scroll-bar" style="transform:translateY(0)"></button>`;
}

export function getDefaultBlockHTML(type, _0 = typeCheckThrow(type, "string")) {
    let html;

    switch (type) {
        case "textBlock":
            html = getTextBlockHTML();
            break;
        case "ulBlock":
            html = getUlBlockHTML();
            break;
        case "olBlock":
            html = getOlBlockHTML();
            break;
        case "quotaionBlock":
            html = getQuotaionBlock();
            break;
        case "tableBlock":
            html = getTableBlock();
            break;
        case "codeBlock":
            html = getCodeBlock();
            break;
        default:
            html = "";
    }

    return html;
}

function getTextBlockHTML(content = "", _0 = typeCheckThrow(content, "string")) {
    return `<p class="editor-item djs-item --djs-selected" contenteditable="true" data-type="text">${content}</p>`;
}

export function getImageBlockHTML(attr, width = 700, _0 = typeCheckThrow(attr, "object"), _1 = typeCheckThrow(width, "number")) {
    let html = `
        <div class="editor-item djs-item --djs-selected" data-type="image">
            <div class="editor-size djs-size" data-width="${width}">
    `;

    if (condition.useWebp == true) {
        html += `<picture>`;

        if (attr.hasWebp == true) {
            html += `<source srcset="${attr.src}.webp" type="image/webp">`;
        }

        html += `<img src="${attr.src}.${attr.defaultFormat}" width="${attr.width}" alt="${attr.alt}" class="img" draggable="false">`;
        html += `</picture>`;
    } else {
        html += `<img src="${attr.src}.${attr.defaultFormat}" width="${attr.width}" alt="${attr.alt}" class="img" draggable="false">`;
    }

    html += `<button class="editor-btn-resize --left djs-resize" data-value="width" data-position="left">resize</button>`;
    html += `<button class="editor-btn-resize --right djs-resize" data-value="width" data-position="right">resize</button>`;
    html += `</div>`;
    html += `<p class="editor-caption" contenteditable="true" data-type="caption">${attr.alt}</p>`;
    html += `</div>`;

    return html;
}

export function getEmoticonBlockHTML(code, _0 = typeCheckThrow(code, "string")) {
    return `<div class="editor-item djs-item --djs-selected" data-type="emoticon">${code}</div>`;
}

function getUlBlockHTML(child = [""], _0 = typeCheckThrow(child, Array)) {
    let html = `<ul class="editor-item djs-item --djs-selected" data-type="ul">`;

    child.forEach((row) => {
        html += `<li contenteditable="true">${row}</li>`;
    });

    html += `</ul>`;

    return html;
}

function getOlBlockHTML(child = [""], _0 = typeCheckThrow(child, Array)) {
    let html = `<ol type="1" class="editor-item djs-item --djs-selected" data-type="ol">`;

    child.forEach((row) => {
        html += `<li contenteditable="true">${row}</li>`;
    });

    html += `</ol>`;

    return html;
}

function getQuotaionBlock() {
    return `<blockquote class="editor-item djs-item --djs-selected" data-type="quote"><p class="text" contenteditable="true"></p><p class="author" contenteditable="true"></p></blockquote>`;
}

function getTableBlock() {
    return `
        <div class="editor-item djs-item --djs-selected" data-type="table">
            <div class="scroll">
                <table class="table">
                    <caption contenteditable="true" data-type="caption"></caption>
                    <colgroup>
                        <col data-size="100">
                        <col data-size="100">
                        <col data-size="100">
                        <col data-size="100">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th contenteditable="true" data-x="0" data-y="0"></th>
                            <th contenteditable="true" data-x="1" data-y="0"></th>
                            <th contenteditable="true" data-x="2" data-y="0"></th>
                            <th contenteditable="true" data-x="3" data-y="0"></th>
                        </tr>
                        <tr>
                            <td contenteditable="true" data-x="0" data-y="1"></td>
                            <td contenteditable="true" data-x="1" data-y="1"></td>
                            <td contenteditable="true" data-x="2" data-y="1"></td>
                            <td contenteditable="true" data-x="3" data-y="1"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getCodeBlock() {
    return `
        <pre class="editor-item djs-item --djs-selected" data-type="codeblock" data-theme="default" data-lang="text"><code class="nohighlight editor-code" contenteditable="true"></code></pre>
    `;
}

export function getYoutubeBlock(code, _0 = typeCheckThrow(code, "string")) {
    return `
        <div class="editor-item djs-item --djs-selected" data-type="youtube">
            <iframe src="https://www.youtube.com/embed/${code}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="editor-iframe"></iframe>
        </div>
    `;
}

export function getCodepenBlock(nickname, code, height = 300, _0 = typeCheckThrow(nickname, "string"), _1 = typeCheckThrow(code, "string"), _2 = typeCheckThrow(height, "number")) {
    return `
        <div class="editor-item djs-item --djs-selected" data-type="codepen">
            <iframe height="${height}" title="" src="https://codepen.io/${nickname}/embed/${code}?height=${height}&theme-id=${condition.codepenTheme}&default-tab=result" allowfullscreen class="editor-iframe djs-iframe" data-code="${code}" data-nickname="${nickname}"></iframe>
            <button class="editor-btn-resize djs-resize" data-value="height">Resize height</button>
        </div>
    `;
}

export function getLinkboxBlock(data, _0 = typeCheckThrow(data, "object")) {
    return `
        <div class="editor-item djs-item --djs-selected" data-type="linkbox">
            <a href="${data.url}" target="_blank" rel="nofollow" class="editor-linkbox editor-clearfix" draggable="false">
                <div class="editor-linkbox-img">
                    <img src="${data.img}" alt="미리보기 이미지" class="editor-img" draggable="false">
                </div>

                <div class="editor-linkbox-text">
                    <p class="editor-title">${data.title}</p>
                    <p class="editor-description">${data.description}</p>
                    <p class="editor-domain">${data.domain}</p>
                </div>
            </a>
        </div>
    `;
}

function makeOptionPop() {
    let html = `<div class="editor-pop-option djs-option-pop">`;

    html += `
        <div class="editor-scroll-wrap editor-clearfix">
            <div class="editor-col" data-group="text,li,table,codeblock,word">
                <button class="editor-select djs-fontisze djs-toggle-target djs-btn-ignore" data-target=".editor-list-fontsize">
                    <span class="editor-text djs-text">16</span>

                    <svg class="icon" viewbox="0 0 64 64">
                        <use class="path" xlink:href="#icon-arrow-bottom" href="#icon-arrow-bottom"></use>
                    </svg>
                </button>

                <div class="editor-list-fontsize editor-scroll djs-scroll djs-trigger">
                    <div class="editor-scroll-content djs-scroll-content">
    `;

    condition.frontSize.forEach((size) => {
        html += `<button class="editor-btn djs-change-fontsize" data-value="${size}">${size}</button>`;
    });

    html += `
                    </div>
                </div>
            </div>
    `;

    html += `
        <div class="editor-col" data-group="text,li,table,codeblock,word">
            <button class="editor-color djs-color djs-toggle-target djs-btn-ignore" data-target=".editor-list-color" data-value="#333"></button>
            <div class="editor-list-color djs-trigger">
    `;

    condition.colorList.forEach((color) => {
        html += `<button class="editor-btn djs-change-color" data-value="${color}">${color}</button>`;
    });

    html += `
            </div>
        </div>
    `;

    html += `
        <div class="editor-col editor-btn-area" data-group="text,li,table,image,sticker">
            <button class="editor-btn djs-change-align" data-value="left">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-align-left" href="#icon-align-left"></use>
                </svg>

                align left
            </button>

            <button class="editor-btn djs-change-align" data-value="center">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-align-center" href="#icon-align-center"></use>
                </svg>

                align center
            </button>

            <button class="editor-btn djs-change-align" data-value="right">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-align-right" href="#icon-align-right"></use>
                </svg>

                align right
            </button>
        </div>

        <div class="editor-col editor-btn-area" data-group="text,li,table,word,link">
            <button class="editor-btn djs-toggle-bold">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-bold" href="#icon-bold"></use>
                </svg>

                bold
            </button>

            <button class="editor-btn djs-toggle-italic">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-italic" href="#icon-italic"></use>
                </svg>

                italic
            </button>

            <button class="editor-btn djs-toggle-underline">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-underline" href="#icon-underline"></use>
                </svg>

                underline
            </button>

            <button class="editor-btn djs-toggle-strikethrough">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-strikethrough" href="#icon-strikethrough"></use>
                </svg>

                strikethrough
            </button>
        </div>

        <div class="editor-col editor-btn-area" data-group="td">
            <button class="editor-btn djs-table-header">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-table-header" href="#icon-table-header"></use>
                </svg>

                change to table header
            </button>
        </div>

        <div class="editor-col editor-btn-area" data-group="td">
            <button class="editor-btn djs-table-body">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-table-body" href="#icon-table-body"></use>
                </svg>

                change to table body
            </button>
        </div>

        <div class="editor-col editor-btn-area" data-group="word,link">
            <button class="editor-btn djs-open-linkbox">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-link" href="#icon-link"></use>
                </svg>

                open linkbox pop
            </button>
        </div>

        <div class="editor-col editor-btn-area" data-group="codeblock">
            <button class="editor-btn djs-toggle-target djs-btn-ignore" data-target=".editor-list-theme">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-theme" href="#icon-theme"></use>
                </svg>

                open theme pop
            </button>

            <div class="editor-list-select editor-list-theme djs-trigger">
    `;

    condition.codeTheme.forEach((theme) => {
        html += `<button class="editor-btn djs-set-theme" data-value="${theme}">${upperFirstChar(theme)}</button>`;
    });

    html += `
            </div>
        </div>
    `;

    html += `
        <div class="editor-col" data-group="codeblock">
            <button class="editor-select djs-toggle-target djs-btn-ignore" data-target=".editor-list-lang">
                <span class="editor-text djs-text">Text</span>

                <svg class="icon" viewbox="0 0 64 64">
                    <use class="path" xlink:href="#icon-arrow-bottom" href="#icon-arrow-bottom"></use>
                </svg>
            </button>

            <div class="editor-list-select editor-list-lang djs-trigger">
    `;

    condition.codeLang.forEach((lang) => {
        html += `<button class="editor-btn djs-set-lang" data-value="${lang}">${upperFirstChar(lang)}</button>`;
    });

    html += `
            </div>
        </div>
    `;

    html += `
        <div class="editor-col" data-group="ol">
            <button class="editor-select djs-toggle-target djs-btn-ignore" data-target=".editor-list-type">
                <span class="editor-text djs-text">1 - Numbered</span>

                <svg class="icon" viewbox="0 0 64 64">
                    <use class="path" xlink:href="#icon-arrow-bottom" href="#icon-arrow-bottom"></use>
                </svg>
            </button>

            <div class="editor-list-select editor-list-type djs-trigger">
                <button class="editor-btn djs-set-type" data-value="1">1 - Numbered</button>
                <button class="editor-btn djs-set-type" data-value="I">I - Upper-roman</button>
                <button class="editor-btn djs-set-type" data-value="i">i - Lower-roman</button>
                <button class="editor-btn djs-set-type" data-value="A">A - Upper-alpha</button>
                <button class="editor-btn djs-set-type" data-value="a">a - Lower-alpha</button>
            </div>
        </div>
    `;

    html += `
        <div class="editor-col editor-btn-area" data-group="all">
            <button class="editor-btn">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-arrow-up" href="#icon-arrow-up"></use>
                </svg>

                move up block
            </button>
        </div>
    `;

    html += `
        <div class="editor-col editor-btn-area" data-group="all">
            <button class="editor-btn">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-arrow-down" href="#icon-arrow-down"></use>
                </svg>

                move down block
            </button>
        </div>
    `;

    html += `
        <div class="editor-col editor-btn-area" data-group="word">
            <button class="editor-btn">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path" xlink:href="#icon-word-block" href="#icon-word-block"></use>
                </svg>

                make word block
            </button>
        </div>
    `;

    html += `
        <div class="editor-col editor-btn-area --noline" data-group="all">
            <button class="editor-btn djs-delete-block">
                <svg viewBox="0 0 64 64" class="icon">
                    <use class="path --red" xlink:href="#icon-delete-block" href="#icon-delete-block"></use>
                </svg>

                delete block
            </button>
        </div>
    `;

    html += `</div>`;
    html += `</div>`;

    return html;
}

export function setEmoticonList(data) {
    let html = "";

    data.forEach((row) => {
        if (row.type == "image") {
            html += `
                <button class="editor-emoticon djs-add-emoticon">
                    <img src="${row.value}" alt="${row.caption}" class="img">
                </button>
            `;
        } else if (row.type == "svg") {
            html += `
                <button class="editor-emoticon djs-add-emoticon">
                    ${row.value}
                </button>
            `;
        }
    });

    condition.listEmoticon.insertAdjacentHTML("beforeend", html);
}

export function setMediaList(data) {
    let html = "";

    data.forEach((row) => {
        if (row.type == "image") {
            html += `
                <li class="editor-media djs-media" data-type="image" data-idx="${row.idx}">
                    <div class="eidtor-img-area djs-add-media" data-src="${row.src}" data-alt="${row.alt}" data-default-format="${row.defaultFormat}" data-webp="${row.webp}" data-width="${row.width}" data-height="${row.height}">
                        <img src="${`${row.src}.${row.defaultFormat}`}" class="editor-img">
                    </div>

                    <p class="editor-name djs-name">${row.alt}</p>
                    <button class="editor-btn-del djs-del-media" data-idx="${row.idx}">
                        <svg viewBox="0 0 64 64" class="icon">
                            <use class="path" xlink:href="#icon-delete-block" href="#icon-delete-block"></use>
                        </svg>

                        delete media
                    </button>
                </li>
            `;
        }
    });

    condition.listMedia.insertAdjacentHTML("beforeend", html);
}

export function addBlockToContent(block, _0 = typeCheckThrow(block, "string")) {
    let $target = getActiveElement();
    let $selectedItem = getElement(".--djs-selected");

    $target.insertAdjacentHTML("afterend", block);
    setCursor($target.nextElementSibling, 0);

    if ($selectedItem.length > 0) {
        classControl($selectedItem, "remove", "--djs-selected");
    }

    condition.activeItem = $target.nextElementSibling;
}

// this.HTMLsticker = '<div class="item item_sticker lastset" data-type="sticker">[el]</div>';
// this.HTMLOption = '<option value="[value]">[text]</option>';
// this.HTMLMediaRow = '<li class="btn_add_media" data-webp="[webp]" data-idx="[idx]"><div class="img_area"><img src="[src]" alt="[alt]" width="[width]" data-height="[height]" class="img"></div><p class="name">[name]</p><button class="btn_remove_media" data-idx="[idx]">삭제</button></li>';
