const { typeCheckThrow } = require("./default");
const { getTextItemOption } = require("./option");
const { getChild } = require("./selector");

export function jsonToHtml(json) {
    let html = "";

    json.forEach(function (item) {
        switch (item.type) {
            case "title":
                html += `<h1 class="${item.class.join(" ")}" contenteditable="true" data-type="${item.type}">${item.textContent}</h1>`;
                break;
            case "text":
                html += `<p class="${item.class.join(" ")}" contenteditable="true" data-type="${item.type}">${item.textContent}</p>`;
                break;
            case "image":
                if (storage.useWebp === true) {
                    html += `<picture class="${item.class.join(" ")}" data-type="${item.type}">`;
                    if (item.hasWebp === true) {
                        html += `<source srcset="${item.src}.webp" type="image/webp">`;
                    }
                    html += `<img src="${item.src}.${item.defaultFormat}" width="${item.size}" alt="${item.alt}" class="img"></picture>`;
                } else {
                    html += `<div class="${item.class.join(" ")}" data-type="image"><img src="${item.src}.${item.defaultFormat}" width="${item.size}" alt="${item.alt}" class="img"></div>`;
                }
                break;
            case "btn":
                if (item.value === "image") {
                    html += `<div class="btn" data-type="${item.type}" data-value="${item.value}">`;
                    if (item.icon.type === "svg") {
                        html += `<svg viewBox="${item.icon.viewBox}" class="${item.icon.class.join(" ")}"><use class="path" xlink:href="${item.icon.url}" href="${item.icon.url}"></use></svg>`;
                    } else {
                        html += `<img src="${item.icon.url}" alt="image icon" class="">`;
                    }
                    html += `${item.textContent.replace(/\n/i, "").replace(/^\s*/i, "").replace(/\s*$/i, "")}</div>`;
                } else if (item.value === "youtube") {
                    html += `<div class="btn" data-type="${item.type}" data-value="${item.value}">`;
                    if (item.icon.type === "svg") {
                        html += `<svg viewBox="${item.icon.viewBox}" class="${item.icon.class.join(" ")}"><use class="path" xlink:href="${item.icon.url}" href="${item.icon.url}"></use></svg>`;
                    } else {
                        html += `<img src="${item.icon.url}" alt="youtube icon" class="">`;
                    }
                    html += `${item.textContent.replace(/\n/i, "").replace(/^\s*/i, "").replace(/\s*$/i, "")}</div>`;
                } else if (item.value === "codepen") {
                    html += `<div class="btn" data-type="${item.type}" data-value="${item.value}">`;
                    if (item.icon.type === "svg") {
                        html += `<svg viewBox="${item.icon.viewBox}" class="${item.icon.class.join(" ")}"><use class="path" xlink:href="${item.icon.url}" href="${item.icon.url}"></use></svg>`;
                    } else {
                        html += `<img src="${item.icon.url}" alt="codepen icon" class="">`;
                    }
                    html += `${item.textContent.replace(/\n/i, "").replace(/^\s*/i, "").replace(/\s*$/i, "")}</div>`;
                }
                break;
            case "youtube":
                html += `<div class="${item.class.join(" ")}" data-type="${item.type}"><iframe src="${item.src}" allow="${item.allow}" allowfullscreen="" class="video"></iframe></div>`;
                break;
            case "codepen":
                html += `<div class="${item.class.join(" ")}" data-type="${item.type}"><iframe height="${item.height}" title="" src="${item.src}" allowfullscreen="" class="iframe"></iframe></div>`;
                break;
            case "list":
                let listType = "";
                if (item.tag === "ol") {
                    listType = "list_o";
                } else if (item.tag === "ul") {
                    listType = "list_u";
                }

                if (item.listType === null) {
                    html += `<${item.tag} class="${item.class.join(" ")}" data-type="${listType}">`;
                } else {
                    html += `<${item.tag} type="${item.listType}" class="${item.class.join(" ")}" data-type="${listType}">`;
                }
                item.child.forEach(function (row) {
                    if (row.class.length > 0) {
                        html += `<li class="${row.class.join(" ")}" contenteditable="true">${row.textContent}</li>`;
                    } else {
                        html += `<li contenteditable="true">${row.textContent}</li>`;
                    }
                });
                html += `</${item.tag}>`;
                break;
            case "quote":
                html += `<blockquote class="${item.class.join(" ")}" data-type="${item.type}"><p class="text" contenteditable="true">${item.text}</p><p class="author" contenteditable="true">${item.author}</p></blockquote>`;
                break;
            case "table":
                let rowNum = 0;
                html += `<div class="${item.class.join(" ")}" data-type="${item.type}"><div class="scroll"><table class="item_table"><caption contenteditable="true">${item.caption}</caption><colgroup>`;
                item.colgroup.forEach(function (col) {
                    html += `<col class="${col}">`;
                });
                html += "</colgroup><tbody>";
                item.child.forEach(function (tr) {
                    let cellNum = 0;
                    html += "<tr>";
                    tr.forEach(function (cell) {
                        if (cell.class.length > 0) {
                            html += `<${cell.tag} class="${cell.class.join(" ")}" contenteditable="true" data-x="${cellNum}" data-y="${rowNum}">${cell.textContent}</${cell.tag}>`;
                        } else {
                            html += `<${cell.tag} contenteditable="true" data-x="${cellNum}" data-y="${rowNum}">${cell.textContent}</${cell.tag}>`;
                        }
                        cellNum += 1;
                    });
                    html += "</tr>";
                    rowNum += 1;
                });
                html += '</tbody></table></div><button class="btn btn_col_add">Add col</button><button class="btn btn_col_del">Remove col</button><button class="btn btn_row_add">Add row</button><button class="btn btn_row_del">Remove row</button></div>';
                break;
            case "codeblock":
                html += `<pre class="${item.class.join(" ")}" data-type="${item.type}" data-theme="${item.theme}" data-lang="${item.lang}"><code class="${item.code.class.join(" ")}" contenteditable="true">${item.code.innerHTML}</code></pre>`;
                break;
            case "link_box":
                html += `<div class="${item.class.join(" ")}" data-type="${item.type}"><a href="${item.url}" target="_blank" class="link_box clearfix" draggable="false"><div class="img_area"><img src="${item.imgSrc}" alt="미리보기 이미지" class="img" draggable="false"></div><div class="text_area"><p class="link_title ellipsis">${item.title}</p><p class="link_description ellipsis">${item.description}</p><p class="link_domain">${item.domain}</p></div></a></div>`;
                break;
            default:
                html += item.other;
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

                arr.push({
                    type: "image",
                    hasWebp: hasWebp,
                    width: $img.getAttribute("width"),
                    height: $img.dataset["height"],
                    alt: $img.getAttribute("alt"),
                    src: link.replace(condition.regList.srcURL, "$1"),
                    defaultFormat: link.replace(condition.regList.srcURL, "$2"),
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
