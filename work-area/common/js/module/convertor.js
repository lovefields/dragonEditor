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
                html += `<blockquote class="editor-item djs-item" data-type="${item.type}" data-style="${item.style}"><p class="text djs-text" contenteditable="true">${item.text}</p><p class="author djs-author" contenteditable="true">${item.author}</p></blockquote>`;
                break;
            case "table":
                // let rowNum = 0;
                // html += `<div class="${item.class.join(" ")}" data-type="${item.type}"><div class="scroll"><table class="item_table"><caption contenteditable="true">${item.caption}</caption><colgroup>`;
                // item.colgroup.forEach(function (col) {
                //     html += `<col class="${col}">`;
                // });
                // html += "</colgroup><tbody>";
                // item.child.forEach(function (tr) {
                //     let cellNum = 0;
                //     html += "<tr>";
                //     tr.forEach(function (cell) {
                //         if (cell.class.length > 0) {
                //             html += `<${cell.tag} class="${cell.class.join(" ")}" contenteditable="true" data-x="${cellNum}" data-y="${rowNum}">${cell.textContent}</${cell.tag}>`;
                //         } else {
                //             html += `<${cell.tag} contenteditable="true" data-x="${cellNum}" data-y="${rowNum}">${cell.textContent}</${cell.tag}>`;
                //         }
                //         cellNum += 1;
                //     });
                //     html += "</tr>";
                //     rowNum += 1;
                // });
                // html += '</tbody></table></div><button class="btn btn_col_add">Add col</button><button class="btn btn_col_del">Remove col</button><button class="btn btn_row_add">Add row</button><button class="btn btn_row_del">Remove row</button></div>';
                break;

            // case "youtube":
            //     html += `<div class="${item.class.join(" ")}" data-type="${item.type}"><iframe src="${item.src}" allow="${item.allow}" allowfullscreen="" class="video"></iframe></div>`;
            //     break;
            // case "codepen":
            //     html += `<div class="${item.class.join(" ")}" data-type="${item.type}"><iframe height="${item.height}" title="" src="${item.src}" allowfullscreen="" class="iframe"></iframe></div>`;
            //     break;
            // case "codeblock":
            //     html += `<pre class="${item.class.join(" ")}" data-type="${item.type}" data-theme="${item.theme}" data-lang="${item.lang}"><code class="${item.code.class.join(" ")}" contenteditable="true">${item.code.innerHTML}</code></pre>`;
            //     break;
            // case "link_box":
            //     html += `<div class="${item.class.join(" ")}" data-type="${item.type}"><a href="${item.url}" target="_blank" class="link_box clearfix" draggable="false"><div class="img_area"><img src="${item.imgSrc}" alt="미리보기 이미지" class="img" draggable="false"></div><div class="text_area"><p class="link_title ellipsis">${item.title}</p><p class="link_description ellipsis">${item.description}</p><p class="link_domain">${item.domain}</p></div></a></div>`;
            //     break;
            // default:
            //     html += item.other;
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

                $colList.forEach(($col) => {
                    tableCol.push($col.dataset["size"]);
                });

                $trList.forEach(($tr) => {
                    let childArr = [];
                    let $child = getChild($tr, `*[contenteditable="true"]`);

                    $child.forEach(($node) => {
                        childArr.push({
                            tag: $node.tagName.toLowerCase(),
                            optoin: getTextItemOption($node),
                            textContent: $node.innerHTML,
                        });
                    });

                    tableBody.push(childArr);
                });

                arr.push({
                    type: "table",
                    caption: getChild($item, ".djs-caption", false).textContent,
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
                    src: getChild($item, ".djs-iframe", false).getAttribute("src"),
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
                arr.push({
                    type: "codeblock",
                    theme: $item.dataset["theme"],
                    lang: $item.dataset["lang"],
                    code: getChild($item, ".djs-code", false).innerHTML,
                });
                break;
            default:
                arr.push({
                    type: "other",
                    other: $item.innerHTML,
                });
        }
    });

    return arr;
}
