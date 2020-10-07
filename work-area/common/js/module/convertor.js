const { typeCheckThrow } = require("./default");
const { getTextItemOption } = require("./option");
const { getChild } = require("./selector");

export function jsonToHtml(json) {
    let html = "";
    let option = "";

    json.forEach(function (item) {
        switch (item.type) {
            case "text":
                for (const [key, value] of Object.entries(item.option)) {
                    if (value != "") {
                        option += ` data-${key}="${value}"`;
                    }
                }

                html += `<p class="editor-item djs-item" ${option} contenteditable="true" data-type="${item.type}">${item.textContent}</p>`;
                option = "";
                break;
            case "image":
                for (const [key, value] of Object.entries(item.option)) {
                    if (value != "") {
                        option += ` data-${key}="${value}"`;
                    }
                }

                html += `<div class="editor-item djs-item" data-type="${item.type}" data-webp="${item.hasWebp}" ${option}>`;
                html += `<div class="editor-size djs-size" data-width="${item.itemWidth}">`;

                option = "";

                if (condition.useWebp == true) {
                    html += `<picture>`;
                    if (item.hasWebp == true) {
                        html += `<source srcset="${item.src}.webp" type="image/webp">`;
                    }
                    html += `<img src="${item.src}.${item.defaultFormat}" width="${item.width}" data-height="${item.height}" alt="${item.alt}" class="editor-img djs-img" draggable="false"></picture>`;
                } else {
                    html += `<img src="${item.src}.${item.defaultFormat}" width="${item.width}" data-height="${item.height}" alt="${item.alt}" class="editor-img djs-img" draggable="false">`;
                }

                for (const [key, value] of Object.entries(item.caption.option)) {
                    if (value != "") {
                        option += ` data-${key}="${value}"`;
                    }
                }

                html += `<button class="editor-btn-resize --left djs-resize" data-value="width" data-position="left">resize</button><button class="editor-btn-resize --right djs-resize" data-value="width" data-position="right">resize</button>`;
                html += `</div>`;
                html += `<p class="editor-caption djs-caption" contenteditable="true"${option}>${item.caption.textContent}</p>`;
                html += `</div>`;
                option = "";
                break;
            case "ul":
                let $ulChild = "";

                item.child.forEach(($child) => {
                    for (const [key, value] of Object.entries($child.option)) {
                        if (value != "") {
                            option += ` data-${key}="${value}"`;
                        }
                    }

                    $ulChild += `<li contenteditable="true"${option}>${$child.textContent}</li>`;
                    option = "";
                });

                html += `<ul class="editor-item djs-item" data-type="${item.type}">${$ulChild}</ul>`;
                break;
            case "ol":
                let $olChild = "";

                item.child.forEach(($child) => {
                    for (const [key, value] of Object.entries($child.option)) {
                        if (value != "") {
                            option += ` data-${key}="${value}"`;
                        }
                    }

                    $olChild += `<li contenteditable="true"${option}>${$child.textContent}</li>`;
                    option = "";
                });

                html += `<ol class="editor-item djs-item" data-style="${item.style}" data-type="${item.type}">${$olChild}</ol>`;
                break;
            case "quote":
                html += `<blockquote class="editor-item djs-item" data-type="${item.type}" data-style="${item.style}"><p class="editor-text djs-text" contenteditable="true">${item.text}</p><p class="editor-author djs-author" contenteditable="true">${item.author}</p></blockquote>`;
                break;
            case "table":
                let rowNum = 0;

                for (const [key, value] of Object.entries(item.caption.option)) {
                    if (value != "") {
                        option += ` data-${key}="${value}"`;
                    }
                }

                html += `
                    <div class="editor-item djs-item" data-type="${item.type}">
                        <div class="editor-scroll">
                            <table class="editor-table">
                                <caption ${option} class="djs-caption" contenteditable="true">${item.caption.textContent}</caption>
                                <colgroup>`;

                option = "";

                item.colgroup.forEach(function (col) {
                    html += `<col data-size="${col}">`;
                });

                html += "</colgroup><tbody>";

                item.body.forEach(function (tr) {
                    let cellNum = 0;

                    html += "<tr>";

                    tr.forEach(function (cell) {
                        for (const [key, value] of Object.entries(cell.option)) {
                            if (value != "") {
                                option += ` data-${key}="${value}"`;
                            }
                        }

                        html += `<${cell.tag} contenteditable="true" data-x="${cellNum}" data-y="${rowNum}"${option}>${cell.textContent}</${cell.tag}>`;
                        cellNum += 1;
                        option = "";
                    });

                    html += "</tr>";
                    rowNum += 1;
                });
                html += "</tbody></table></div></div>";
                break;
            case "linkbox":
                html += `
                    <div class="editor-item djs-item" data-type="${item.type}">
                        <a href="${item.url}" target="_blank" rel="nofollow" class="editor-linkbox editor-clearfix djs-linkbox" draggable="false">
                            <div class="editor-linkbox-img">
                                <img src="${item.imgSrc}" alt="preview image" class="editor-img djs-img" draggable="false">
                            </div>
            
                            <div class="editor-linkbox-text">
                                <p class="editor-title djs-title">${item.title}</p>
                                <p class="editor-description djs-description">${item.description}</p>
                                <p class="editor-domain djs-domain">${item.domain}</p>
                            </div>
                        </a>
                    </div>
                `;
                break;
            case "emoticon":
                html += `<div class="editor-item djs-item" data-type="${item.type}">${item.code}</div>`;
                break;

            case "youtube":
                html += `
                    <div class="editor-item djs-item" data-type="${item.type}" data-code="${item.code}">
                        <iframe src="https://www.youtube.com/embed/${item.code}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="editor-iframe djs-iframe"></iframe>
                        <button class="editor-edit">edit</button>
                    </div>
                `;
                break;
            case "codepen":
                html += `
                    <div class="editor-item djs-item" data-type="${item.type}">
                        <iframe height="${item.height}" title="" src="https://codepen.io/${item.nickname}/embed/${item.code}?height=${item.height}&theme-id=${condition.codepenTheme}&default-tab=result" allowfullscreen class="editor-iframe djs-iframe" data-code="${item.code}" data-nickname="${item.nickname}"></iframe>
                        <button class="editor-btn-resize djs-resize" data-value="height">Resize height</button>
                        <button class="editor-edit">edit</button>
                    </div>
                `;
                break;
            case "codeblock":
                html += `<pre class="editor-item djs-item" data-type="${item.type}" data-theme="${item.theme}" data-lang="${item.lang}"><code class="${item.code.class.join(" ")}" contenteditable="true">${item.code.textContent}</code></pre>`;
                break;
            default:
                html += `<div class="editor-item djs-item" data-type="${item.type}">${item.other}</div>`;
        }
    });

    return html;
}

export function htmlToJson($nodeList, _0 = typeCheckThrow($nodeList, NodeList)) {
    let arr = [];

    $nodeList.forEach(($item) => {
        let type = $item.dataset["type"];

        switch (type) {
            case "text":
                arr.push({
                    type: "text",
                    option: getTextItemOption($item),
                    textContent: $item.innerHTML,
                });
                break;
            case "image":
                let hasWebp = $item.dataset["webp"] == "true" ? true : false;
                let $img = getChild($item, ".djs-img", false);
                let link = $img.getAttribute("src");
                let $imgCaption = getChild($item, ".djs-caption", false);

                arr.push({
                    type: "image",
                    option: getTextItemOption($item),
                    hasWebp: hasWebp,
                    itemWidth: getChild($item, ".djs-size", false).dataset["width"],
                    width: $img.getAttribute("width"),
                    height: $img.dataset["height"],
                    alt: $img.getAttribute("alt"),
                    src: link.replace(condition.regList.srcURL, "$1"),
                    defaultFormat: link.replace(condition.regList.srcURL, "$2"),
                    caption: {
                        option: getTextItemOption($imgCaption),
                        textContent: $imgCaption.textContent,
                    },
                });
                break;
            case "ul":
                let ulChildList = [];
                let $ulChilds = getChild($item, `*[contenteditable="true"]`);

                $ulChilds.forEach(($child) => {
                    ulChildList.push({
                        option: getTextItemOption($child),
                        textContent: $child.innerHTML,
                    });
                });

                arr.push({
                    type: "ul",
                    child: ulChildList,
                });
                break;
            case "ol":
                let olChildList = [];
                let $olChilds = getChild($item, `*[contenteditable="true"]`);

                $olChilds.forEach(($child) => {
                    olChildList.push({
                        option: getTextItemOption($child),
                        textContent: $child.innerHTML,
                    });
                });

                arr.push({
                    type: "ol",
                    style: $item.dataset["style"],
                    child: olChildList,
                });
                break;
            case "quote":
                arr.push({
                    type: "quote",
                    style: $item.dataset["style"],
                    text: getChild($item, ".djs-text", false).textContent,
                    author: getChild($item, ".djs-author", false).textContent,
                });
                break;
            case "table":
                let tableCol = [];
                let tableBody = [];
                let $colList = getChild($item, "col");
                let $trList = getChild($item, "tbody tr");
                let $tableCaption = getChild($item, ".djs-caption", false);

                $colList.forEach(($col) => {
                    tableCol.push($col.dataset["size"]);
                });

                $trList.forEach(($tr) => {
                    let childArr = [];
                    let $child = getChild($tr, `*[contenteditable="true"]`);

                    $child.forEach(($node) => {
                        childArr.push({
                            tag: $node.tagName.toLowerCase(),
                            option: getTextItemOption($node),
                            textContent: $node.innerHTML,
                        });
                    });

                    tableBody.push(childArr);
                });

                arr.push({
                    type: "table",
                    caption: {
                        option: getTextItemOption($tableCaption),
                        textContent: $tableCaption.textContent,
                    },
                    colgroup: tableCol,
                    body: tableBody,
                });
                break;
            case "linkbox":
                arr.push({
                    type: "linkbox",
                    url: getChild($item, ".djs-linkbox", false).getAttribute("href"),
                    imgSrc: getChild($item, ".djs-img", false).getAttribute("src"),
                    title: getChild($item, ".djs-title", false).textContent,
                    description: getChild($item, ".djs-description", false).textContent,
                    domain: getChild($item, ".djs-domain", false).textContent,
                });
                break;
            case "emoticon":
                arr.push({
                    type: "emoticon",
                    code: $item.innerHTML,
                });
                break;
            case "youtube":
                arr.push({
                    type: "youtube",
                    code: $item.dataset["code"],
                });
                break;
            case "codepen":
                arr.push({
                    type: "codepen",
                    nickname: getChild($item, ".djs-iframe", false).dataset["nickname"],
                    code: getChild($item, ".djs-iframe", false).dataset["code"],
                    height: getChild($item, ".djs-iframe", false).getAttribute("height"),
                });
                break;
            case "codeblock":
                let $code = getChild($item, ".djs-code", false);

                arr.push({
                    type: "codeblock",
                    theme: $item.dataset["theme"],
                    lang: $item.dataset["lang"],
                    code: {
                        class: [...$code.classList],
                        textContent: $code.innerHTML,
                    },
                });
                break;
            default:
                arr.push({
                    type: type,
                    other: $item.innerHTML,
                });
        }
    });

    return arr;
}
