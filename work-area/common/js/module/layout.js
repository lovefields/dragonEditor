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

    view += makeLinkboxPop();
    view += makeOptionPop();

    editorCondition.wrap.innerHTML = view;
}

function makeContentArea(lang) {
    return `<div class="editor-content djs-content" data-lang="${lang}"><p class="editor-item djs-item" contenteditable="true" data-type="text"></p></div>`;
}

function makeBlockMenu(data) {
    let html = "";

    for (const [key, value] of Object.entries(data)) {
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
            if (key === "emoticonBlock") {
                html += `
                    <div class="editor-relative">
                        <button class="editor-btn djs-add-block djs-btn-ignore" title="${value.text}" data-value="${key}" data-type="${value.type}">
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
                    <button class="editor-btn djs-add-block djs-btn-ignore" title="${value.text}" data-value="${key}" data-type="${value.type}">
                        <svg viewbox="0 0 64 64" class="editor-icon">
                            <use class="path" xlink:href="${value.icon}" href="${value.icon}"></use>
                        </svg>
                        ${value.text}
                    </button>
                `;
            }
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

        // if (key === "emoticonBlock") {

        // } else {

        // }
    }

    return html;
}

function makeBottomMenu() {
    let html = ``;

    if (editorCondition.uploadURL !== "") {
        html += `
            <button class="editor-btn djs-toggle-target djs-btn-ignore" data-target=".editor-pop-folder">
                <svg viewbox="0 0 64 64" class="editor-icon">
                    <use class="path" xlink:href="#icon-folder" href="#icon-folder"></use>
                </svg>
                Media
            </button>
        `;
    }

    if (editorCondition.multiLang == true) {
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
    return `
        <div class="editor-list-pop editor-pop-folder editor-scroll djs-folder-pop djs-trigger djs-scroll">
            <div class="editor-scroll-content djs-scroll-content">
                <ul class="editor-list-media djs-list-media"></ul>
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

function getQuotaionBlock() {
    return `<blockquote class="editor-item djs-item --djs-selected" data-type="quote"><p class="text" contenteditable="true"></p><p class="author" contenteditable="true"></p></blockquote>`;
}

function getTableBlock() {
    return `
        <div class="editor-item djs-item --djs-selected" data-type="table">
            <div class="scroll">
                <table class="table">
                    <caption contenteditable="true"></caption>
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
            <iframe height="${height}" title="" src="https://codepen.io/${nickname}/embed/${code}?height=${height}&theme-id=${editorCondition.codepenTheme}&default-tab=result" allowfullscreen class="editor-iframe"></iframe>
            <button class="editor-btn-resize djs-resize-height">Resize height</button>
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
        <div class="editor-scroll-wrap">
            <div class="editor-col" data-group="text,li,table,codeblock,word">
                <button class="editor-fontsize djs-fontisze editor-toggle-target" data-target=".editor-list-fontsize">
                    16
                    <svg class="icon" viewbox="0 0 64 64">
                        <use class="path" xlink:href="#icon-arrow-bottom" href="#icon-arrow-bottom"></use>
                    </svg>
                </button>

                <div class="editor-list-fontsize editor-scroll djs-scroll">
                    <div class="editor-scroll-content djs-scroll-content">
    `;

    editorCondition.frontSize.forEach((size) => {
        html += `<button class="editor-btn djs-change-fontsize" data-value="${size}">${size}</button>`;
    });

    html += `
                    </div>
                </div>
            </div>
    `;

    html += `
        <div class="editor-col" data-group="text,li,table,codeblock,word">
            <button class="editor-color djs-color editor-toggle-target" data-target=".editor-list-color" data-value="#333"></button>
            <div class="editor-list-color">
    `;

    editorCondition.colorList.forEach((color) => {
        html += `<button class="editor-btn djs-change-color" data-value="${color}">${color}</button>`;
    });

    html += `
            </div>
        </div>
    `;

    html += ``;
    html += ``;
    html += ``;
    html += ``;
    html += ``;
    html += `</div>`;

    return html;

    /*
<div class="pop pop_options">
    <div class="scroll">
        



        <button class="col select_color btn_pop" data-target=".pop_color" data-type="position" data-class="default" data-group="text,list_u,list_o,table,word,link"></button>
        <div class="pop pop_color clearfix">
            <button class="btn btn_set_color" data-class="color_white" title="흰색"></button>
            <button class="btn btn_set_color" data-class="color_light_gray" title="밝은 회색"></button>
            <button class="btn btn_set_color" data-class="color_gray" title="회색"></button>
            <button class="btn btn_set_color" data-class="color_dark_gray_1" title="어두운 회색 1"></button>
            <button class="btn btn_set_color" data-class="color_dark_gray_2" title="어두운 회색 2"></button>
            <button class="btn btn_set_color" data-class="default" title="기본색"></button>
            <button class="btn btn_set_color" data-class="color_black" title="검은색"></button>
            <button class="btn btn_set_color" data-class="color_light_red_berry_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_red_berry_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_red_berry_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_red_berry" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_red_berry_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_red_berry_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_red_berry_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_red_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_red_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_red_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_red" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_red_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_red_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_red_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_orange_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_orange_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_orange_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_orange" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_orange_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_orange_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_orange_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_yellow_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_yellow_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_yellow_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_yellow" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_yellow_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_yellow_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_yellow_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_green_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_green_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_green_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_green" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_green_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_green_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_green_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_cyan_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_cyan_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_cyan_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_cyan" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_cyan_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_cyan_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_cyan_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_cornflower_blue_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_cornflower_blue_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_cornflower_blue_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_cornflower_blue" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_cornflower_blue_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_cornflower_blue_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_cornflower_blue_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_blue_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_blue_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_blue_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_blue" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_blue_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_blue_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_blue_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_purple_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_purple_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_purple_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_purple" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_purple_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_purple_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_purple_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_magenta_3" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_magenta_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_light_magenta_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_magenta" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_magenta_1" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_magenta_2" title=""></button>
            <button class="btn btn_set_color" data-class="color_dark_magenta_3" title=""></button>
        </div>
        <button class="col btn_text_algin blind" data-group="text,list_u,list_o,table,image,sticker" data-value="align_left">
            <svg class="icon" viewbox="0 0 50 50">
                <use class="path" xlink:href="#icon_align_left" href="#icon_align_left" />
            </svg>
            Align left
        </button>
        <button class="col btn_text_algin blind" data-group="text,list_u,list_o,table,image,sticker" data-value="align_center">
            <svg class="icon" viewbox="0 0 50 50">
                <use class="path" xlink:href="#icon_align_center" href="#icon_align_center" />
            </svg>
            Align center
        </button>
        <button class="col btn_text_algin blind" data-group="text,list_u,list_o,table,image,sticker" data-value="align_right">
            <svg class="icon" viewbox="0 0 50 50">
                <use class="path" xlink:href="#icon_align_right" href="#icon_align_right" />
            </svg>
            Align right
        </button>
        <label class="col select_area" data-group="list_o">
            <select class="select select_list_type">
                <option value="1">1 - Numbered</option>
                <option value="I">I - Upper-roman</option>
                <option value="i">i - Lower-roman</option>
                <option value="A">A - Upper-alpha</option>
                <option value="a">a - Lower-alpha</option>
            </select>
        </label>
        <label class="col select_area" data-group="table">
            <select class="select select_col">
                <option value="size_100">100px</option>
                <option value="size_150">150px</option>
                <option value="size_200">200px</option>
                <option value="size_250">250px</option>
                <option value="size_300">300px</option>
                <option value="size_350">350px</option>
                <option value="size_400">400px</option>
                <option value="size_450">450px</option>
                <option value="size_500">500px</option>
                <option value="size_550">550px</option>
                <option value="size_600">600px</option>
                <option value="size_650">650px</option>
                <option value="size_700">700px</option>
                <option value="size_750">750px</option>
                <option value="size_800">800px</option>
            </select>
        </label>
        <label class="col select_area" data-group="codeblock">
            <select class="select select_theme">
                <option value="default">Default theme</option>
                <option value="vs2015">VS2015 theme</option>
                <option value="androidstudio">Androidstudio theme</option>
                <option value="monokai">Monokai theme</option>
            </select>
        </label>
        <label class="col select_area" data-group="codeblock">
            <select class="select select_language">
                <option value="text">Text</option>
                <option value="css">css</option>
                <option value="html">html</option>
                <option value="xml">xml</option>
                <option value="json">json</option>
                <option value="java">java</option>
                <option value="javascript">javascript</option>
                <option value="markdown">markdown</option>
                <option value="objective-c">objective-c</option>
                <option value="php">php</option>
                <option value="python">python</option>
                <option value="sql">sql</option>
                <option value="shell">Shell Session</option>
                <option value="kotlin">kotlin</option>
                <option value="swift">swift</option>
            </select>
        </label>
        <button class="col btn_change_th" data-group="table">th</button>
        <button class="col btn_change_td" data-group="table">td</button>
        <label class="col options_width" data-group="image">
            <span class="text">Width : </span>
            <input type="text" maxlength="3" class="value">
        </label>
        <label class="col options_height" data-group="codepen">
            <span class="text">Height : </span>
            <input type="text" maxlength="4" class="value">
        </label>
        <label class="col options_url" data-group="youtube,codepen,word,link">
            <span class="text">URL : </span>
            <input type="text" class="value">
        </label>
        <button class="col btn_url_change" data-group="youtube,codepen">Change</button>
        <button class="col btn_url_link" data-group="word,link">Link</button>
        <button class="col btn_url_unlink" data-group="word,link">Unlink</button>
        <button class="col btn_bold blind" data-group="text,list_u,list_o,table,word,link">
            <svg class="icon" viewbox="0 0 50 50">
                <use class="path" xlink:href="#icon_bold" href="#icon_bold" />
            </svg>
            굵게
        </button>
        <button class="col btn_italic blind" data-group="text,list_u,list_o,table,word,link">
            <svg class="icon" viewbox="0 0 50 50">
                <use class="path" xlink:href="#icon_italic" href="#icon_italic" />
            </svg>
            기울게
        </button>
        <button class="col btn_underline blind" data-group="text,list_u,list_o,table,word,link">
            <svg class="icon" viewbox="0 0 50 50">
                <use class="path" xlink:href="#icon_underline" href="#icon_underline" />
            </svg>
            밑줄
        </button>
        <button class="col btn_strike blind" data-group="text,list_u,list_o,table,word,link">
            <svg class="icon" viewbox="0 0 50 50">
                <use class="path" xlink:href="#icon_strike" href="#icon_strike" />
            </svg>
            취소선
        </button>
        <button class="col btn_wordblock blind" data-group="word,wordblock">
            <svg class="icon" viewbox="0 0 50 50">
                <use class="path" xlink:href="#icon_workblock" href="#icon_workblock" />
            </svg>
            단어블럭
        </button>
    
        <button class="col btn_del_content blind" data-group="all">
            <svg viewbox="0 0 50 50" class="icon">
                <use class="path" xlink:href="#icon_delete" href="#icon_delete" />
            </svg>
            컨텐츠 삭제
        </button>
    </div>
</div>


</label>
*/
}

// this.HTMLsticker = '<div class="item item_sticker lastset" data-type="sticker">[el]</div>';
// this.HTMLOption = '<option value="[value]">[text]</option>';
// this.HTMLMediaRow = '<li class="btn_add_media" data-webp="[webp]" data-idx="[idx]"><div class="img_area"><img src="[src]" alt="[alt]" width="[width]" data-height="[height]" class="img"></div><p class="name">[name]</p><button class="btn_remove_media" data-idx="[idx]">삭제</button></li>';
