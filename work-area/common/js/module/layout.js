const { typeCheckThrow } = require("./default");

export function makeView() {
    let view = "";

    view += makeContentArea(editorCondition.lang);

    view += `<div class="editor-menu-block">`;
    view += makeBlockMenu(editorCondition.defaultMenu);
    view += `</div>`;

    view += `<div class="editor-menu-bottom">`;
    view += makeBottomMenu();
    if (editorCondition.multiLang == true) {
        view += makeLanguagePop();
    }
    view += makeFolderPop();
    view += `</div>`;

    if (editorCondition.uploadURL !== "") {
        view += makeUploadForm();
    }

    editorCondition.wrap.innerHTML = view;
}

function makeContentArea(lang) {
    return `<div class="editor-content djs-content" data-lang="${lang}"><p class="editor-item djs-item" contenteditable="true" data-type="text"></p></div>`;
}

function makeBlockMenu(data) {
    let html = "";

    for (const [key, value] of Object.entries(data)) {
        if (key === "emoticonBlock") {
            html += `
                <div class="editor-relative">
                    <button class="editor-btn djs-toggle-target" title="${value.text}" data-value="${key}" data-type="${value.type}" data-target=".editor-pop-emoticon">
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
                <button class="editor-btn djs-add-block" title="${value.text}" data-value="${key}" data-type="${value.type}">
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
    let html = ``;

    if (editorCondition.uploadURL !== "") {
        html += `
            <button class="editor-btn djs-toggle-target" data-target=".editor-pop-folder">
                <svg viewbox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-folder" href="#icon-folder"></use>
                </svg>
                Media
            </button>
        `;
    }

    if (editorCondition.multiLang == true) {
        html += `
            <button class="editor-btn djs-toggle-target" data-target=".editor-pop-lang">
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
                <use class="path editor-pc" xlink:href="#icon_pc" href="#icon-pc"></use>
                <use class="path editor-mobile" xlink:href="#icon_mobile" href="#icon-mobile"></use>
            </svg>
            Change view
        </button>
    `;

    return html;
}

function makeLanguagePop() {
    let html = `<div class="editor-pop-lang djs-trigger" data-length="${editorCondition.langCategory.length}">`;

    editorCondition.langCategory.forEach((lang) => {
        if (lang == editorCondition.lang) {
            html += `<button class="editor-btn-lang djs-change-lang --act" data-value="${lang}">${lang.toUpperCase()}</button>`;
        } else {
            html += `<button class="editor-btn-lang djs-change-lang" data-value="${lang}">${lang.toUpperCase()}</button>`;
        }
    });

    html += `</div>`;

    return html;
}

function makeEmoticonPop() {
    return `<div class="editor-list-pop editor-pop-emoticon editor-scroll djs-emoticon-pop djs-trigger djs-scroll">
                <div class="editor-scroll-content djs-scroll-content">
                    <ul class="editor-list-emoticon djs-list-emoticon"></ul>
                </div>
            </div>
    `;
}

function makeFolderPop() {
    return `<div class="editor-list-pop editor-pop-folder editor-scroll djs-folder-pop djs-trigger djs-scroll">
                <div class="editor-scroll-content djs-scroll-content">
                    <ul class="editor-list-media djs-list-media"></ul>
                </div>
            </div>
    `;
}

function makeUploadForm() {
    let html = `<form enctype="multipart/form-data" method="post" class="editor-uploader djs-uploader">`;

    if (editorCondition.multiUpload == true) {
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
        case "":
            break;
        default:
            html = "";
    }

    return html;
}

function getTextBlockHTML(content = "", _0 = typeCheckThrow(content, "string")) {
    return `<p class="editor-item djs-item --djs-selected" contenteditable="true" data-type="text">${content}</p>`;
}

function getImageBlockHTML(attr, _0 = typeCheckThrow(attr, "object")) {
    let html = `<div class="editor-item djs-item --djs-selected" data-type="image">`;

    if (editorCondition.useWebp == true) {
        html += `<picture>`;

        if (attr.hasWebp == true) {
            html += `<source srcset="${attr.src}.webp" type="image/webp">`;
        }

        html += `<img src="${attr.src}.${attr.defaultFormat}" width="${attr.width}" alt="${attr.alt}" class="img">`;
        html += `</picture>`;
    } else {
        html += `<img src="${attr.src}.${attr.defaultFormat}" width="${attr.width}" alt="${attr.alt}" class="img">`;
    }

    html += `<button class="btn-size --left djs-image-size" data-position="left"></button>`;
    html += `<button class="btn-size --right djs-image-size" data-position="right"></button>`;
    html += `</div>`;

    return html;
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

function getQuotaionBlock(){
    return `<blockquote class="editor-item djs-item --djs-selected" data-type="quote"><p class="text" contenteditable="true"></p><p class="author" contenteditable="true"></p></blockquote>`;
}


// this.HTMLsticker = '<div class="item item_sticker lastset" data-type="sticker">[el]</div>';
// this.HTMLQuote = '<blockquote class="item item_quote lastset" data-type="quote"><p class="text" contenteditable="true"></p><p class="author" contenteditable="true"></p></blockquote>';
// this.HTMLTable = '<div class="item item_table_area" data-type="table"><div class="scroll"><table class="item_table"><caption contenteditable="true"></caption><colgroup><col class="size_100"><col class="size_100"><col class="size_100"><col class="size_100"></colgroup><tbody><tr><th contenteditable="true" data-x="0" data-y="0"></th><th contenteditable="true" data-x="1" data-y="0"></th><th contenteditable="true" data-x="2" data-y="0"></th><th contenteditable="true" data-x="3" data-y="0"></th></tr><tr><td contenteditable="true" data-x="0" data-y="1"></td><td contenteditable="true" data-x="1" data-y="1"></td><td contenteditable="true" data-x="2" data-y="1"></td><td contenteditable="true" data-x="3" data-y="1"></td></tr></tbody></table></div><button class="btn btn_col_add">Add col</button><button class="btn btn_col_del">Remove col</button><button class="btn btn_row_add">Add row</button><button class="btn btn_row_del">Remove row</button></div>';
// this.HTMLCodeBlock = '<pre class="item item_codeblock lastset" data-type="codeblock" data-theme="default" data-lang="text"><code class="nohighlight" contenteditable="true"></code></pre>';
// this.HTMLLinkBox = '<div class="item lastset" data-type="link_box"><a href="[url]" target="_blank" rel="nofollow" class="link_box clearfix" draggable="false"><div class="img_area"><img src="[imgSrc]" alt="미리보기 이미지" class="img" draggable="false"></div><div class="text_area"><p class="link_title ellipsis">[title]</p><p class="link_description ellipsis">[description]</p><p class="link_domain">[domain]</p></div></a></div>';
// this.HTMLOption = '<option value="[value]">[text]</option>';
// this.HTMLMediaRow = '<li class="btn_add_media" data-webp="[webp]" data-idx="[idx]"><div class="img_area"><img src="[src]" alt="[alt]" width="[width]" data-height="[height]" class="img"></div><p class="name">[name]</p><button class="btn_remove_media" data-idx="[idx]">삭제</button></li>';

// this.HTMLYoutube = '<div class="item item_video lastset" data-type="youtube"><iframe src="[src]" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="video"></iframe></div>';
// this.HTMLCodepen = '<div class="item item_codepen lastset" data-type="codepen"><iframe height="[height]" title="" src="[src]" allowfullscreen class="iframe"></iframe></div>';
