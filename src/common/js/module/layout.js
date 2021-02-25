const { typeCheckThrow, upperFirstChar, classControl } = require("./default");
const { getElement, getActiveElement, getChild } = require("./selector");
const { setCursor } = require("./cursor");
const { htmlToJson } = require("./convertor");

export function makeView() {
    let view = "";

    view += makeContentArea();

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

    view += makeLinkboxPop();
    view += makeOptionPop();
    view += makeEmoticonPop();

    condition.wrap.insertAdjacentHTML("beforeend", view);

    if (condition.uploadURL !== "") {
        document.body.insertAdjacentHTML("beforeend", makeUploadForm());
    }
}

function makeContentArea() {
    return `<div class="editor-content djs-content"><p class="editor-item djs-item" contenteditable="true" data-type="text"></p></div>`;
}

function makeBlockMenu(data) {
    let arr = Object.entries(data);
    let html = `<div class="editor-scroll-col editor-clearfix" data-count="${arr.length}">`;

    for (const [key, value] of arr) {
        if (value.type === "block") {
            html += `
                <button type="button" class="editor-btn djs-add-block" title="${value.text}" data-value="${key}" data-type="${value.type}">
                    <svg viewbox="0 0 64 64" class="editor-icon">
                        <use class="path" xlink:href="${value.icon}" href="${value.icon}"></use>
                    </svg>
                    ${value.text}
                </button>
            `;
        } else if (value.type === "pop") {
            html += `
                <button type="button" class="editor-btn djs-add-block djs-btn-ignore" title="${value.text}" data-value="${key}" data-type="${value.type}">
                    <svg viewbox="0 0 64 64" class="editor-icon">
                        <use class="path" xlink:href="${value.icon}" href="${value.icon}"></use>
                    </svg>
                    ${value.text}
                </button>
            `;
        } else if (value.type === "file") {
            html += `
                <button type="button" class="editor-btn djs-add-block" title="${value.text}" data-value="${key}" data-type="${value.type}">
                    <svg viewbox="0 0 64 64" class="editor-icon">
                        <use class="path" xlink:href="${value.icon}" href="${value.icon}"></use>
                    </svg>
                    ${value.text}
                </button>
            `;
        } else {
            html += `
                <button type="button" class="editor-btn djs-add-block" title="${value.text}" data-value="${key}" data-type="custom">
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
            <button type="button" class="editor-btn djs-toggle-target djs-btn-ignore" data-target=".editor-pop-folder">
                <svg viewbox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-folder" href="#icon-folder"></use>
                </svg>
                Media
            </button>
        `;
    }

    if (condition.multiLang == true) {
        html += `
            <button type="button" class="editor-btn djs-toggle-target djs-btn-ignore" data-target=".editor-pop-lang">
                <svg viewbox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-lang" href="#icon-lang"></use>
                </svg>
                Change language
            </button>
        `;
    }

    html += `
        <button type="button" class="editor-btn editor-switch-device djs-switch-device">
            <svg class="editor-icon" viewbox="0 0 64 64">
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
            html += `<button type="button" class="editor-btn-lang djs-change-lang --act" data-value="${lang}">${lang.toUpperCase()}</button>`;
        } else {
            html += `<button type="button" class="editor-btn-lang djs-change-lang" data-value="${lang}">${lang.toUpperCase()}</button>`;
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
            <button type="button" class="editor-btn djs-btn" data-value="">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path --del" xlink:href="#icon-delete-link" href="#icon-delete-link"></use>
                    <use class="path --new" xlink:href="#icon-btn-accept" href="#icon-btn-accept"></use>
                </svg>
            </button>
        </div>
    `;
}

function makeUploadForm() {
    let html = `<form enctype="multipart/form-data" method="post" class="editor-uploader djs-uploader">`;

    if (condition.csrfData.value != "") {
        html += `<input type="hidden" name="${condition.csrfData.name}" value="${condition.csrfData.value}">`;
    }
    if (condition.multiUpload == true) {
        html += `<input type="file" name="file" multiple class="djs-file">`;
    } else {
        html += `<input type="file" name="file" class="djs-file">`;
    }
    html += `</form>`;

    return html;
}

export function scrollButtonHTML() {
    return `<button type="button" class="scroll-bar djs-scroll-bar" style="transform:translateY(0)"></button>`;
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

export function getTextBlockHTML(content = "", _0 = typeCheckThrow(content, "string")) {
    return `<p class="editor-item djs-item --djs-selected" contenteditable="true" data-type="text">${content}</p>`;
}

export function getImageBlockHTML(attr, width = 700, _0 = typeCheckThrow(attr, "object"), _1 = typeCheckThrow(width, "number")) {
    let html = `
        <div class="editor-item djs-item --djs-selected" data-type="image" data-webp="${attr.hasWebp}">
            <div class="editor-size djs-size" data-width="${width}">
    `;

    if (condition.useWebp == true) {
        html += `<picture>`;

        if (attr.hasWebp == true) {
            html += `<source srcset="${attr.src}.webp" type="image/webp">`;
        }

        html += `<img src="${attr.src}.${attr.defaultFormat}" width="${attr.width}" alt="${attr.alt}" data-height="${attr.height}" class="editor-img djs-img" draggable="false">`;
        html += `</picture>`;
    } else {
        html += `<img src="${attr.src}.${attr.defaultFormat}" width="${attr.width}" alt="${attr.alt}" data-height="${attr.height}" class="editor-img djs-img" draggable="false">`;
    }

    html += `<button type="button" class="editor-btn-resize --left djs-resize" data-value="width" data-position="left">resize</button>`;
    html += `<button type="button" class="editor-btn-resize --right djs-resize" data-value="width" data-position="right">resize</button>`;
    html += `</div>`;
    html += `<p class="editor-caption djs-caption" contenteditable="true" data-type="caption">${attr.alt}</p>`;
    html += `</div>`;

    return html;
}

export function getEmoticonBlockHTML(code, _0 = typeCheckThrow(code, "string")) {
    return `<div class="editor-item djs-item --djs-selected" data-type="emoticon">${code}</div>`;
}

function getUlBlockHTML(child = [""], _0 = typeCheckThrow(child, "array")) {
    let html = `<ul class="editor-item djs-item --djs-selected" data-type="ul">`;

    child.forEach((row) => {
        html += `<li contenteditable="true">${row}</li>`;
    });

    html += `</ul>`;

    return html;
}

function getOlBlockHTML(child = [""], _0 = typeCheckThrow(child, "array")) {
    let html = `<ol class="editor-item djs-item --djs-selected" data-style="number" data-type="ol">`;

    child.forEach((row) => {
        html += `<li contenteditable="true">${row}</li>`;
    });

    html += `</ol>`;

    return html;
}

export function getListChildHTML(content = "", _0 = typeCheckThrow(content, "string")) {
    return `<li contenteditable="true">${content}</li>`;
}

function getQuotaionBlock() {
    return `<blockquote class="editor-item djs-item --djs-selected" data-type="quote" data-style="default"><p class="editor-text djs-text" contenteditable="true"></p><p class="editor-author djs-author" contenteditable="true"></p></blockquote>`;
}

function getTableBlock() {
    return `
        <div class="editor-item djs-item --djs-selected" data-type="table">
            <div class="editor-scroll">
                <table class="editor-table">
                    <caption class="djs-caption" contenteditable="true"></caption>
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
        <pre class="editor-item djs-item --djs-selected" data-type="codeblock" data-theme="default" data-lang="text"><code class="nohighlight editor-code djs-code" contenteditable="true"></code></pre>
    `;
}

export function getYoutubeBlock(code, _0 = typeCheckThrow(code, "string")) {
    return `
        <div class="editor-item djs-item --djs-selected" data-type="youtube" data-code="${code}">
            <iframe src="https://www.youtube.com/embed/${code}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="editor-iframe djs-iframe"></iframe>
            <button type="button" class="editor-edit">edit</button>
        </div>
    `;
}

export function getCodepenBlock(nickname, code, height = 300, _0 = typeCheckThrow(nickname, "string"), _1 = typeCheckThrow(code, "string"), _2 = typeCheckThrow(height, "number")) {
    return `
        <div class="editor-item djs-item --djs-selected" data-type="codepen">
            <iframe height="${height}" title="" src="https://codepen.io/${nickname}/embed/${code}?height=${height}&theme-id=${condition.codepenTheme}&default-tab=result" allowfullscreen class="editor-iframe djs-iframe" data-code="${code}" data-nickname="${nickname}"></iframe>
            <button type="button" class="editor-btn-resize djs-resize" data-value="height">Resize height</button>
            <button type="button" class="editor-edit">edit</button>
        </div>
    `;
}

export function getLinkboxBlock(data, _0 = typeCheckThrow(data, "object")) {
    return `
        <div class="editor-item djs-item --djs-selected" data-type="linkbox">
            <a href="${data.url}" target="_blank" rel="nofollow" class="editor-linkbox editor-clearfix djs-linkbox" draggable="false">
                <div class="editor-linkbox-img">
                    <img src="${data.img}" alt="preview image" class="editor-img djs-img" draggable="false">
                </div>

                <div class="editor-linkbox-text">
                    <p class="editor-title djs-title">${data.title}</p>
                    <p class="editor-description djs-description">${data.description}</p>
                    <p class="editor-domain djs-domain">${data.domain}</p>
                </div>
            </a>
        </div>
    `;
}

function makeOptionPop() {
    let html = `
    <div class="editor-pop-option djs-option-pop">
        <div class="editor-scroll-wrap">
            <div class="editor-clearfix djs-scroll-depth">`;

    html += `
            <div class="editor-col" data-group="text,li,table,codeblock,word">
                <button type="button" class="editor-select djs-fontsize djs-toggle-target djs-btn-ignore" data-target=".editor-list-fontsize">
                    <span class="editor-text djs-text">16</span>

                    <svg class="editor-icon" viewbox="0 0 64 64">
                        <use class="path" xlink:href="#icon-arrow-bottom" href="#icon-arrow-bottom"></use>
                    </svg>
                </button>

                <div class="editor-list-fontsize editor-scroll djs-scroll djs-trigger">
                    <div class="editor-scroll-content djs-scroll-content">
    `;

    condition.frontSize.forEach((size) => {
        let text = Math.floor(condition.defaultFontSize * size);

        html += `<button type="button" class="editor-btn djs-change-fontsize" data-value="${size}">${text}</button>`;
    });

    html += `
                    </div>
                </div>
            </div>
    `;

    html += `
        <div class="editor-col" data-group="text,li,table,word">
            <button type="button" class="editor-color djs-color djs-toggle-target djs-btn-ignore" data-target=".editor-list-color" data-value="#333"></button>
            <div class="editor-list-color djs-trigger">
    `;

    condition.colorList.forEach((color) => {
        html += `<button type="button" class="editor-btn djs-change-color" data-value="${color}">${color}</button>`;
    });

    html += `
            </div>
        </div>
    `;

    html += `
        <div class="editor-col editor-btn-area" data-group="text,li,table,image,sticker">
            <button type="button" class="editor-btn djs-change-align" data-value="left">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-align-left" href="#icon-align-left"></use>
                </svg>

                align left
            </button>

            <button type="button" class="editor-btn djs-change-align" data-value="center">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-align-center" href="#icon-align-center"></use>
                </svg>

                align center
            </button>

            <button type="button" class="editor-btn djs-change-align" data-value="right">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-align-right" href="#icon-align-right"></use>
                </svg>

                align right
            </button>
        </div>

        <div class="editor-col editor-btn-area" data-group="text,li,table,word,link">
            <button type="button" class="editor-btn djs-toggle-bold">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-bold" href="#icon-bold"></use>
                </svg>

                bold
            </button>

            <button type="button" class="editor-btn djs-toggle-italic">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-italic" href="#icon-italic"></use>
                </svg>

                italic
            </button>

            <button type="button" class="editor-btn djs-toggle-underline">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-underline" href="#icon-underline"></use>
                </svg>

                underline
            </button>

            <button type="button" class="editor-btn djs-toggle-strikethrough">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-strikethrough" href="#icon-strikethrough"></use>
                </svg>

                strikethrough
            </button>
        </div>

        <div class="editor-col editor-btn-area" data-group="td">
            <button type="button" class="editor-btn djs-table-header">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-table-header" href="#icon-table-header"></use>
                </svg>

                change to table header
            </button>
        </div>

        <div class="editor-col editor-btn-area" data-group="th">
            <button type="button" class="editor-btn djs-table-body">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-table-body" href="#icon-table-body"></use>
                </svg>

                change to table body
            </button>
        </div>

        <div class="editor-col editor-btn-area" data-group="word,link">
            <button type="button" class="editor-btn djs-open-linkbox">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-link" href="#icon-link"></use>
                </svg>

                open linkbox pop
            </button>
        </div>

        <div class="editor-col editor-btn-area" data-group="codeblock">
            <button type="button" class="editor-btn djs-code-theme djs-toggle-target djs-btn-ignore" data-target=".editor-list-theme">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-theme" href="#icon-theme"></use>
                </svg>

                open theme pop
            </button>

            <div class="editor-list-select editor-list-theme djs-trigger">
    `;

    condition.codeTheme.forEach((theme) => {
        html += `<button type="button" class="editor-btn djs-set-theme" data-value="${theme}">${upperFirstChar(theme)}</button>`;
    });

    html += `
            </div>
        </div>
    `;

    html += `
        <div class="editor-col" data-group="codeblock">
            <button type="button" class="editor-select djs-code-lang djs-toggle-target djs-btn-ignore" data-target=".editor-list-lang">
                <span class="editor-text djs-text">Text</span>

                <svg class="editor-icon" viewbox="0 0 64 64">
                    <use class="path" xlink:href="#icon-arrow-bottom" href="#icon-arrow-bottom"></use>
                </svg>
            </button>

            <div class="editor-list-select editor-list-lang djs-trigger">
    `;

    condition.codeLang.forEach((lang) => {
        html += `<button type="button" class="editor-btn djs-set-lang" data-value="${lang}">${upperFirstChar(lang)}</button>`;
    });

    html += `
            </div>
        </div>
    `;

    html += `
        <div class="editor-col" data-group="ol">
            <button type="button" class="editor-select djs-list-style djs-toggle-target djs-btn-ignore" data-target=".editor-list-type">
                <span class="editor-text djs-text">Numbered - 1</span>

                <svg class="editor-icon" viewbox="0 0 64 64">
                    <use class="path" xlink:href="#icon-arrow-bottom" href="#icon-arrow-bottom"></use>
                </svg>
            </button>

            <div class="editor-list-select editor-list-type djs-trigger">
                <button type="button" class="editor-btn djs-set-list-type" data-value="number">Numbered - 1</button>
                <button type="button" class="editor-btn djs-set-list-type" data-value="upper-roman">Upper-roman - I</button>
                <button type="button" class="editor-btn djs-set-list-type" data-value="lower-roman">Lower-roman - i</button>
                <button type="button" class="editor-btn djs-set-list-type" data-value="upper-alpha">Upper-alpha - A</button>
                <button type="button" class="editor-btn djs-set-list-type" data-value="lower-alpha">Lower-alpha - a</button>
            </div>
        </div>
    `;

    html += `
        <div class="editor-col editor-btn-area" data-group="all">
            <button type="button" class="editor-btn djs-move-up">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-arrow-up" href="#icon-arrow-up"></use>
                </svg>

                move up block
            </button>
        </div>
    `;

    html += `
        <div class="editor-col editor-btn-area" data-group="all">
            <button type="button" class="editor-btn djs-move-down">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-arrow-down" href="#icon-arrow-down"></use>
                </svg>

                move down block
            </button>
        </div>
    `;

    html += `
        <div class="editor-col editor-btn-area" data-group="word,wordblock">
            <button type="button" class="editor-btn djs-word-block">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-word-block" href="#icon-word-block"></use>
                </svg>

                make word block
            </button>
        </div>
    `;

    html += `
        <div class="editor-col editor-btn-area --noline" data-group="all">
            <button type="button" class="editor-btn djs-delete-block">
                <svg viewBox="0 0 64 64" class="editor-icon">
                    <use class="path --red" xlink:href="#icon-delete-block" href="#icon-delete-block"></use>
                </svg>

                delete block
            </button>
        </div>
    `;

    html += `</div>`;
    html += `</div>`;
    html += `</div>`;

    return html;
}

export function setEmoticonList(data) {
    let html = "";

    data.forEach((row) => {
        if (row.type == "image") {
            html += `
                <button type="button" class="editor-emoticon djs-add-emoticon">
                    <img src="${row.value}" alt="${row.caption}" class="img">
                </button>
            `;
        } else if (row.type == "svg") {
            html += `
                <button type="button" class="editor-emoticon djs-add-emoticon">
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
                    <button type="button" class="editor-btn-del djs-del-media" data-idx="${row.idx}">
                        <svg viewBox="0 0 64 64" class="editor-icon">
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
    let $newItem;

    $target.insertAdjacentHTML("afterend", block);

    $newItem = $target.nextElementSibling;

    if ($newItem.contentEditable == "true") {
        condition.activeElement = $newItem;
        setCursor($newItem, 0);
    } else {
        let $child = getChild($newItem, "*[contenteditable]", false);

        if ($child != null) {
            condition.activeElement = $child;
            setCursor($child, 0);
        }
    }

    if ($selectedItem.length > 0) {
        classControl($selectedItem, "remove", "--djs-selected");
    }

    condition.activeItem = $newItem;
}

export function getContentData() {
    let $itemList = getChild(condition.areaContent, ".djs-item");

    return htmlToJson($itemList);
}
