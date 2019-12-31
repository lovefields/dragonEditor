export function jsonToHtml(json){
    let html = '';

    json.forEach(function(item){
        switch(item.type){
            case 'title' :
                html += `<h1 class="${item.class.join(' ')}" contenteditable="true" data-type="${item.type}">${item.textContent}</h1>`;
            break;
            case 'text' :
                html += `<p class="${item.class.join(' ')}" contenteditable="true" data-type="${item.type}">${item.textContent}</p>`;
            break;
            case 'image' :
                if(storage.useWebp === true){
                    html += `<picture class="${item.class.join(' ')}" data-type="${item.type}">`;
                    if(item.hasWebp === true){
                        html += `<source srcset="${item.src}.webp" type="image/webp">`;
                    }
                    html += `<img src="${item.src}.${item.defaultFormat}" width="${item.size}" alt="${item.alt}" class="img"></picture>`;
                }else{
                    html += `<div class="${item.class.join(' ')}" data-type="image"><img src="${item.src}.${item.defaultFormat}" width="${item.size}" alt="${item.alt}" class="img"></div>`;
                }
            break;
            case 'btn' :
                if(item.value === 'image'){
                    html += `<div class="btn" data-type="${item.type}" data-value="${item.value}">`;
                    if(item.icon.type === 'svg'){
                        html += `<svg viewBox="${item.icon.viewBox}" class="${item.icon.class.join(' ')}"><use class="path" xlink:href="${item.icon.url}" href="${item.icon.url}"></use></svg>`;
                    }else{
                        html += `<img src="${item.icon.url}" alt="image icon" class="">`;
                    }
                    html += `${item.textContent.replace(/\n/i, '').replace(/^\s*/i, '').replace(/\s*$/i, '')}</div>`;
                }else if(item.value === 'youtube'){
                    html += `<div class="btn" data-type="${item.type}" data-value="${item.value}">`;
                    if(item.icon.type === 'svg'){
                        html += `<svg viewBox="${item.icon.viewBox}" class="${item.icon.class.join(' ')}"><use class="path" xlink:href="${item.icon.url}" href="${item.icon.url}"></use></svg>`;
                    }else{
                        html += `<img src="${item.icon.url}" alt="youtube icon" class="">`;
                    }
                    html += `${item.textContent.replace(/\n/i, '').replace(/^\s*/i, '').replace(/\s*$/i, '')}</div>`;
                }else if(item.value === 'codepen'){
                    html += `<div class="btn" data-type="${item.type}" data-value="${item.value}">`;
                    if(item.icon.type === 'svg'){
                        html += `<svg viewBox="${item.icon.viewBox}" class="${item.icon.class.join(' ')}"><use class="path" xlink:href="${item.icon.url}" href="${item.icon.url}"></use></svg>`;
                    }else{
                        html += `<img src="${item.icon.url}" alt="codepen icon" class="">`;
                    }
                    html += `${item.textContent.replace(/\n/i, '').replace(/^\s*/i, '').replace(/\s*$/i, '')}</div>`;
                }
            break;
            case 'youtube' :
                html += `<div class="${item.class.join(' ')}" data-type="${item.type}"><iframe src="${item.src}" allow="${item.allow}" allowfullscreen="" class="video"></iframe></div>`;
            break;
            case 'codepen' :
                html += `<div class="${item.class.join(' ')}" data-type="${item.type}"><iframe height="${item.height}" title="" src="${item.src}" allowfullscreen="" class="iframe"></iframe></div>`;
            break;
            case 'list' :
                if(item.listType === null){
                    html += `<${item.tag} class="${item.class.join(' ')}" data-type="${item.type}">`;
                }else{
                    html += `<${item.tag} type="${item.listType}" class="${item.class.join(' ')}" data-type="${item.type}">`;
                }
                item.child.forEach(function(row){
                    if(row.class.length > 0){
                        html += `<li class="${row.class.join(' ')}" contenteditable="true">${row.textContent}</li>`;
                    }else{
                        html += `<li contenteditable="true">${row.textContent}</li>`;
                    }
                });
                html += `</${item.tag}>`;
            break;
            case 'quote' :
                html += `<blockquote class="${item.class.join(' ')}" data-type="${item.type}"><p class="text" contenteditable="true">${item.text}</p><p class="author" contenteditable="true">${item.author}</p></blockquote>`;
            break;
            case 'table' :
                let rowNum = 0;
                html += `<div class="${item.class.join(' ')}" data-type="${item.type}"><div class="scroll"><table class="item_table"><caption contenteditable="true">${item.caption}</caption><colgroup>`;
                item.colgroup.forEach(function(col){
                    html += `<col class="${col}">`;
                });
                html += '</colgroup><tbody>';
                item.child.forEach(function(tr){
                    let cellNum = 0;
                    html += '<tr>';
                    tr.forEach(function(cell){
                        if(cell.class.length > 0){
                            html += `<${cell.tag} class="${cell.class.join(' ')}" contenteditable="true" data-x="${cellNum}" data-y="${rowNum}">${cell.textContent}</${cell.tag}>`;
                        }else{
                            html += `<${cell.tag} contenteditable="true" data-x="${cellNum}" data-y="${rowNum}">${cell.textContent}</${cell.tag}>`;
                        }
                        cellNum += 1;
                    });
                    html += '</tr>';
                    rowNum += 1;
                });
                html += '</tbody></table></div><button class="btn btn_col_add">Add col</button><button class="btn btn_col_del">Remove col</button><button class="btn btn_row_add">Add row</button><button class="btn btn_row_del">Remove row</button></div>';
            break;
            case 'codeblock' :
                html += `<pre class="${item.class.join(' ')}" data-type="${item.type}" data-theme="${item.theme}" data-lang="${item.lang}"><code class="${item.code.class.join(' ')}" contenteditable="true">${item.code.innerHTML}</code></pre>`;
            break;
            case 'link_box' :
                html += `<div class="${item.class.join(' ')}" data-type="${item.type}"><a href="${item.url}" target="_blank" class="link_box clearfix" draggable="false"><div class="img_area"><img src="${item.imgSrc}" alt="미리보기 이미지" class="img" draggable="false"></div><div class="text_area"><p class="link_title ellipsis">${item.title}</p><p class="link_description ellipsis">${item.description}</p><p class="link_domain">${item.domain}</p></div></a></div>`;
            break;
            default :
                html += item.other;
        }
    });

    return html;
};

export function htmlToJson(nodeList){
    let arr = [];

    nodeList.forEach((item) => {
        let type = item.dataset['type'];

        switch(true){
            case type === 'title' :
                arr.push({
                    'type' : 'title',
                    'class' : [...item.classList],
                    'textContent' : item.textContent
                });
            break;
            case type === 'text' :
                arr.push({
                    'type' : 'text',
                    'class' : [...item.classList],
                    'textContent' : item.innerHTML
                });
            break;
            case type === 'image' :
                let hasWebp = item.tagName === 'PICTURE' ? true : false;
                let img = item.querySelector('.img');
                let link = img.getAttribute('src');

                arr.push({
                    'type' : 'image',
                    'class' : [...item.classList],
                    'hasWebp' : hasWebp,
                    'size' : img.getAttribute('width'),
                    'alt' : img.getAttribute('alt'),
                    'src' : link.replace(storage.srcReg, '$1'),
                    'defaultFormat' : link.replace(storage.srcReg, '$2')
                });
            break;
            case type === 'youtube' :
                let video = item.querySelector('.video');

                arr.push({
                    'type' : 'youtube',
                    'class' : [...item.classList],
                    'src' : video.getAttribute('src'),
                    'allow' : video.getAttribute('allow')
                });
            break;
            case type === 'codepen' :
                let iframe = item.querySelector('.iframe');

                arr.push({
                    'type' : 'codepen',
                    'class' : [...item.classList],
                    'src' : iframe.getAttribute('src'),
                    'height' : iframe.getAttribute('height'),
                    'title' : iframe.getAttribute('title')
                });
            break;
            case type === 'list_u' || type ===  'list_o' :
                let childEl = item.querySelectorAll('li');
                let child = [];

                childEl.forEach(function(el){
                    child.push({
                        'class' : [...el.classList],
                        'textContent' : el.textContent
                    });
                });

                arr.push({
                    'type' : 'list',
                    'class' : [...item.classList],
                    'tag' : item.tagName.toLowerCase(),
                    'listType' : item.getAttribute('type'),
                    'child' : child
                });
            break;
            case type === 'quote' :
                let text = item.querySelector('.text').textContent;
                let author = item.querySelector('.author').textContent;

                arr.push({
                    'type' : 'quote',
                    'class' : [...item.classList],
                    'text' : text,
                    'author' : author
                });
            break;
            case type === 'table' :
                let colgroup = [];
                let tbody = [];
                let caption = item.querySelector('caption').textContent;
                let colList = item.querySelectorAll('col');
                let trList = item.querySelectorAll('tr');

                colList.forEach(function(col){
                    colgroup.push(col.classList.value);
                });

                trList.forEach(function(tr){
                    let cellList = [];
                    let count = tr.childElementCount;
                    let children = tr.children;

                    for(let i = 0;i < count;i += 1){
                        cellList.push({
                            'tag' : children[i].tagName.toLowerCase(),
                            'class' : [...children[i].classList],
                            'textContent' : children[i].textContent
                        });
                    }

                    tbody.push(cellList);
                });

                arr.push({
                    'type' : 'table',
                    'class' : [...item.classList],
                    'caption' : caption,
                    'colgroup' : colgroup,
                    'child' : tbody
                });
            break;
            case type === 'codeblock' :
                let theme = item.dataset['theme'];
                let lang = item.dataset['lang'];
                let code = item.querySelector('code');

                arr.push({
                    'type' : 'codeblock',
                    'class' : [...item.classList],
                    'theme' : theme,
                    'lang' : lang,
                    'code' : {
                        'class' : [...code.classList],
                        'innerHTML' : code.innerHTML
                    }
                });
            break;
            case type === 'link_box' :
                let url = item.querySelector('.link_box').getAttribute('href');
                let imgSrc = item.querySelector('.img').getAttribute('src');
                let title = item.querySelector('.link_title').textContent;
                let description = item.querySelector('.link_description').textContent;
                let domain = item.querySelector('.link_domain').textContent;

                arr.push({
                    'type' : 'link_box',
                    'class' : [...item.classList],
                    'url' : url,
                    'imgSrc' : imgSrc,
                    "title" : title,
                    "description" : description,
                    "domain" : domain,
                });
            break;
            case type === 'btn' :
                let icon = item.querySelector('.icon');
                let iconTagName = icon.tagName.toLowerCase();
                let iconUrl;

                if(iconTagName === 'svg'){
                    iconUrl = icon.querySelector('use').getAttribute('href');
                }else{
                    iconUrl = icon.getAttribute('src');
                }

                arr.push({
                    'type' : 'btn',
                    'value' : item.dataset['value'],
                    'textContent' : item.textContent,
                    'icon' : {
                        "type" : iconTagName,
                        "viewBox" : icon.getAttribute('viewBox'),
                        "class" : [...icon.classList],
                        "url" : iconUrl
                    }
                });
            break;
            default : 
                arr.push({
                    'other' : item.outerHTML
                });
        }
    });

    return arr;
};