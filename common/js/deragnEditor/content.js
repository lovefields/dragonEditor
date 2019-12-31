import { getEl, getElList, findParent } from './selector';
import { jsonToHtml, htmlToJson } from './convertor';
import { actionPrev, actionNext } from './log';
import { contentCheckByMouse } from './mouse';
//import { keyboard } from './keyboard';
import { getLastSetOrFocus, setLastElement, getClassName } from './element';
import { openOptionPop, checkOptionsValue } from './option';
import { addTextBlock, addQuote } from './phrase';
import { addBtn } from './button';
import { addList } from './list';
import { tableConstrol, addTable } from './table';
import { addCodeBlock } from './codeBlock';

export function bindingEvent(){
    let resizeFn;
    window.addEventListener('resize', function(){
        clearTimeout(resizeFn);
        resizeFn = setTimeout(() => {
            storage.windowWidth = window.innerWidth;
            storage.windowHeight = window.innerHeight;

            if(storage.windowWidth > storage.changePint){
                storage.contentAddList.classList.add('act');
            }else if(storage.windowWidth < storage.changePint){
                storage.contentAddList.classList.remove('act');
            }
        }, 250);
    });

    // right click block
    document.addEventListener('contextmenu', function(e){
        e.preventDefault();
    });

    document.addEventListener('mouseup', function(e){
        if(typeof e === 'object'){
            let target = e.target;
            if(e.button === 0){
                let $pop = findParent(target, 'pop');
                let $btnPop = findParent(target, 'btn_pop');
                let $popEl = getElList('.pop');

                $popEl.forEach(function(item){
                    if($btnPop === null){
                        item.classList.remove('act');
                    }
                    if(storage.windowWidth > storage.changePint){
                        storage.contentAddList.classList.add('act');
                    }
                });

                if($pop !== null){
                    $pop.classList.add('act');
                }
            }
        }
    });

    // pop btns work
    storage.popBtns.forEach(function($btn){
        $btn.addEventListener('click', function(){
            let target = this.dataset['target'];
            let type = this.dataset['type'];
            let $el = getEl(target);
            let btnOffset = this.getBoundingClientRect();
            let optionsOffset = storage.popOptions.getBoundingClientRect();

            $el.removeAttribute('style');
            $el.classList.toggle('act');
            if(type === 'position' && storage.windowWidth > storage.changePint){
                let x = Math.floor(btnOffset.left - optionsOffset.left);
                $el.style.cssText = `transform:translate(${x}px, 30px)`;
            }else{
                this.classList.toggle('act');
            }
        });
    });

    document.addEventListener('keydown', function(e){
        let activeElName = document.activeElement.constructor.name;

        if(activeElName === 'HTMLBodyElement'){
            let ctrl;

            if(e.ctrlKey === true || e.metaKey === true){
                ctrl = true;
            }

            if(e.key === 'z'){
                if(ctrl === true){
                    e.preventDefault();
                    actionPrev();
                }else if(ctrl === true && e.shiftKey === true){
                    e.preventDefault();
                    actionNext();
                }
            }
        }
    });

//    document.addEventListener('paste', function(e){
//        console.log('paste', e);
//    });
//
//    document.addEventListener('copy', function(e){
//        console.log('copy', e);
//    });

    window.addEventListener('scroll', function(e){
        document.activeElement.blur();
        storage.popOptions.classList.remove('act');
    });

//    let setDrag;
//    const dragStartFn = function(e){
//        let el = this;
//        $.dragStartEvent(e, el);
//    };
//    const dragOverFn = function(e){
//        clearTimeout(setDrag);
//        let el = this;
//        setDrag = setTimeout(() => {
//            $.dragOverEvent(e, el);
//        }, 10);
//    };
//    const dragEndFn = function(e){
//        let el = this;
//        $.dragEndEvent(e, el);
//    };

    let clickFn;
    storage.contentArea.addEventListener('click', function(e){
        clearTimeout(clickFn);
        clickFn = setTimeout(() => {
            if(e.button === 0 || e.isTrusted === false){
                contentCheckByMouse(e.target, 'click');
                checkOptionsValue(e.target);
                tableConstrol(e.target);
            }
        }, 150);
    });

    let overFn;
    storage.contentArea.addEventListener('mouseover', function(e){
        clearTimeout(overFn);
        overFn = setTimeout(() => {
            if(storage.windowWidth > storage.changePint){
                contentCheckByMouse(e.target, 'mouseover');
                checkOptionsValue(e.target);
            }
        }, 250);
    });

    // key event control
    storage.contentArea.addEventListener('keydown', function(e){
        keybroadControl(e);
    });

    // content add event
    storage.contentAddBtn.forEach(function($btn){
        $btn.addEventListener('click', function(){
            let type = this.dataset['value'];
            let childCount = storage.contentArea.childElementCount;
            let $lastEl = getEl('.lastset');
            let $target = $lastEl === null ? storage.contentArea.children[childCount - 1] : $lastEl

            switch(type){
                case 'text':
                    addTextBlock($target);
                break;
                case 'image':
                    addBtn($target, storage.imageIconId, 'image', 'Add on image');
                    storage.fileInput.dataset['type'] = 'image';
                    storage.fileInput.setAttribute('accept', 'image/*');
                    storage.fileInput.click();
                break;
                case 'sticker':
                    $.addSticker($target, this);
                break;
                case 'youtube':
                    addBtn($target, storage.youtubeIconId, 'youtube', 'Add Youtube');
                break;
                case 'codepen':
                    addBtn($target, storage.codepenIconId, 'codepen', 'Add Codepen');
                break;
                case 'bulletedlist':
                    addList($target, 'ul');
                break;
                case 'numberedlist':
                    addList($target, 'ol', '1');
                break;
                case 'quote':
                    addQuote($target);
                break;
                case 'table':
                    addTable($target);
                break;
                case 'codeblock':
                    addCodeBlock($target);
                break;
                case 'link':
                    addLinkBox($target, storage.linkBoxData);
                    storage.popLink.classList.remove('act');
                    storage.popLink.querySelector('.url').value = '';
                    storage.popLink.querySelector('.view').innerHTML = '';
                    storage.popLink.querySelector('.btn_submit').setAttribute('disabled', 'true');
                break;
            }
        });
    });

    // change view size
    storage.viewBtn.addEventListener('click', function(){
        storage.editorSection.classList.toggle('mobile');
        this.classList.toggle('act');
    });

    storage.popCloseBtns.forEach(function($btn){
        $btn.addEventListener('click', function(){
            let target = this.dataset['target'];
            let $el = getEl(target);

            $el.removeAttribute('style');
            $el.classList.toggle('act');
        });
    });

    let $linkCheckBtn = getEl(storage.popLinkName + ' .btn_check');
    if($linkCheckBtn !== null){
        $linkCheckBtn.addEventListener('click', function(){
            let json = {};
            let $viewEl = $.getEl($.popLinkName + ' .view');
            let $submitBtn = $.getEl($.popLinkName + ' .btn_submit');
            let url = $.getEl($.popLinkName + ' .url').value;

            if($.urlReg.test(url) === true){
                json.url = url;
                fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error('Network response was not ok.')
                })
                .then((data) => {
                    let contents = data.contents;
                    
                    if(contents !== null){
                        let regTitleCheck = new RegExp('property=\\"og:title\\"', 'g');
                        let regTitle01 = new RegExp('([^])*\\<title>([^"]*)<\\/title>([^]*)', 'g');
                        let regTitle02 = new RegExp('([^])*\\<meta property=\\"og:title\\" content=\\"([^"]*)"\\>([^]*)', 'g');
                        let regImgCheck = new RegExp('property=\\"og:image\\"', 'g');
                        let regImg01 = new RegExp('([^])*\\<meta name=\\"image\\" content=\\"([^"]*)"\\>([^]*)', 'g');
                        let regImg02 = new RegExp('([^])*\\<meta property=\\"og:image\\" content=\\"([^"]*)"\\>([^]*)', 'g');
                        let regDecripCheck = new RegExp('property=\\"og:description\\"', 'g');
                        let regDecrip01 = new RegExp('([^])*\\<meta name=\\"description\\" content=\\"([^"]*)"\\>([^]*)', 'g');
                        let regDecrip02 = new RegExp('([^])*\\<meta property=\\"og:description\\" content=\\"([^"]*)"\\>([^]*)', 'g');

                        if(regTitleCheck.test(contents)){
                            json.title = contents.replace(regTitle02, '$2');
                        }else{
                            json.title = contents.replace(regTitle01, '$2');
                        }

                        if(regImgCheck.test(contents)){
                            json.img = contents.replace(regImg02, '$2');
                        }else{
                            let img = contents.replace(regImg01, '$2');

                            if(img.length > 500){
                                json.img = '';
                            }else{
                                json.img = img;
                            }
                        }

                        if(regDecripCheck.test(contents)){
                            json.description = contents.replace(regDecrip02, '$2');
                        }else{
                            let description = contents.replace(regDecrip01, '$2');

                            if(description.length > 500){
                                json.description = '';
                            }else{
                                json.description = description;
                            }
                        }

                        if(url.indexOf("://") > -1){
                            json.domain = url.split('/')[2];
                        }else{
                            json.domain = url.split('/')[0];
                        }
                    
                        json.domain = json.domain.split(':')[0];

                        $.linkBoxData = json;
                        $submitBtn.removeAttribute('disabled');
                        $.addLinkBox($viewEl, json, 'afterbegin');
                    }else{
                        $submitBtn.setAttribute('disabled', 'true');
                        $viewEl.innerHTML = $.messageNoData;
                    }
                });
            }else{
                alert($.messageWrongURL);
            }
        });
    }else{
        console.warn('We need link check button from ' + $.popLinkName);
    }

//    // delete content
//    $.contentDelBtn.addEventListener('click', function(){
//        let $target = $.getEl('.lastset');
//
//        if($target !== null){
//            $target.remove();
//            $.popOptions.classList.remove('act');
//            let count = $.contentArea.childElementCount;
//
//            if(count === 1){
//                $.addTextBlock($.contentArea, '', 'beforeend');
//            }
//        }else{
//            alert($.messageNotSelect);
//        }
//    });
//
//    // font size
//    $.fontSizeSelect.addEventListener('change', function(){
//        let value = this.value;
//        let $target = $.activeElement;
//        let $el = $.findContenteditable($target);
//        let className = $.getClassName($el.classList.value, 'size');
//
//        if(value === 'default'){
//            if(className !== ''){
//                $el.classList.remove(className);
//            }
//        }else{
//            if(className !== ''){
//                $el.classList.remove(className);
//            }
//            $el.classList.add(value);
//        }
//    });
//
//    // color
//    $.btnColor.forEach(function($btn){
//        $btn.addEventListener('click', function(){
//            let value = this.dataset['class'];
//            let list = ['I', 'B', 'S', 'U', 'A', 'SPAN'];
//            let $activeEl = $.activeElement;
//            let tagName = $activeEl.tagName;
//            let $target = $.findContenteditable($activeEl);
//
//            if(window.getSelection().focusNode === window.getSelection().baseNode){
//                if(list.indexOf(tagName) > 0){
//                    let className = $.getClassName($activeEl.classList.value, 'color');
//
//                    if(className !== ''){
//                        $activeEl.classList.remove(className);
//                    }
//                    if(value !== 'default'){
//                        $activeEl.classList.add(value);
//                    }else{
//                        if(tagName === 'SPAN'){
//                            let text = $activeEl.textContent;
//
//                            $activeEl.insertAdjacentText('afterend', text);
//                            $activeEl.remove();
//                            $target.innerHTML = $target.innerHTML;
//                            $.activeElement = $.wrap;
//                        }
//                    }
//                    $.btnColorSelect.dataset['class'] = value;
//                }else{
//                    let className = $.getClassName($target.classList.value, 'color');
//
//                    if($.startTextCursor === $.endTextCursor){
//                        if(className !== ''){
//                            $target.classList.remove(className);
//                        }
//                        if(value !== 'default'){
//                            $target.classList.add(value);
//                        }
//                        $.btnColorSelect.dataset['class'] = value;
//                    }else{
//                        $.wrapElement('color', null, value);
//                    }
//                }
//            }else{
//                alert($.messageWrongNode);
//            }
//        });
//    });
//
//    // 텍스트 링크 추가
//    $.addLinkBtn.addEventListener('click', function(){
//        let url = $.urlInput.value;
//
//        if($.urlReg.test(url) === true){
//            let isSameNode = $.checkSameNode();
//
//            if(isSameNode === true){
//                $.wrapElement('link', url);
//            }else{
//                alert($.messageWrongNode);
//            }
//        }else{
//            alert($.messageWrongURL);
//        }
//    });
//
//    // remove link
//    $.unlinkBtn.addEventListener('click', function(){
//        let $target = $.activeElement;
//        let $el = $.findContenteditable($target);
//        if($target.constructor.name === 'HTMLAnchorElement'){
//            let text = $target.textContent;
//
//            $target.insertAdjacentText('afterend', text);
//            $target.remove();
//            $el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
//        }else{
//            alrt($.messageNotAnchorTag);
//        }
//    });
//
//    // bold
//    $.boldBtn.addEventListener('click', function(){
//        $.makeTextDecoration('b', 'B', 'bold');
//    });
//
//    $.italicBtn.addEventListener('click', function(){
//        $.makeTextDecoration('i', 'I', 'italic');
//    });
//
//    $.underlineBtn.addEventListener('click', function(){
//        $.makeTextDecoration('u', 'U', 'underline');
//    });
//
//    $.strikeBtn.addEventListener('click', function(){
//        $.makeTextDecoration('s', 'S', 'strike');
//    });
//
//    $.wordblockBtn.addEventListener('click', function(){
//        if(window.getSelection().focusNode === window.getSelection().baseNode){
//            let $target = $.activeElement;
//            let elName = $target.tagName;
//            let $el = $.findContenteditable($target);
//            let text = $target.textContent;
//
//            if(elName === 'CODE'){
//                $target.insertAdjacentText('afterend', text);
//                $target.remove();
//                $el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
//                $.activeElement = $.wrap;
//            }else{
//                $.wrapElement('wordblock');
//            }
//        }else{
//            alert($.messageWrongNode);
//        }
//    });
//
//
//    // image width
//    $.widthInput.addEventListener('keyup', function(e){
//        if(e.key === 'Enter'){
//            let value = this.value;
//            let $el = $.getEl('.lastset .img');
//            let massage = $.messageExceedSize.replace('[size]', $.maxImageWidth);
//
//            if($el !== false){
//                if($.numberReg.test(value)){
//                    if(value <= $.maxImageWidth){
//                        $el.setAttribute('width', value);
//                    }else{
//                        alert(massage);
//                        this.value = $.maxImageWidth;
//                        $el.setAttribute('width', $.maxImageWidth);
//                    }
//                    let offset = $.getEl('.lastset').getBoundingClientRect();
//                    $.openOptionPop(offset, 'img');
//                }else{
//                    alert($.messageWrongValue);
//                }
//            }else{
//                alert($.messageNotSelecImage);
//            }
//        }
//    });
//
//    // codepen height
//    $.heightInput.addEventListener('keyup', function(e){
//        if(e.key === 'Enter'){
//            let value = this.value;
//            let $el = $.getEl('.lastset .iframe');
//            let massage = $.messageExceedSize.replace('[size]', $.maxCodepenHeight);
//            
//            if($el !== false){
//                if($.numberReg.test(value)){
//                    if(value <= $.maxCodepenHeight){
//                        $el.setAttribute('height', value);
//                    }else{
//                        alert(massage);
//                        this.value = $.maxCodepenHeight;
//                        $el.setAttribute('height', $.maxCodepenHeight);
//                    }
//                    let offset = $.getEl('.lastset').getBoundingClientRect();
//                    $.openOptionPop(offset, 'codepen');
//                }else{
//                    alert($.messageWrongValue);
//                }
//            }else{
//                alert($.messageNotSelecCodepen);
//            }
//        }
//    });
//
//    // list type
//    $.listTypeSelect.addEventListener('change', function(){
//        let value = this.value;
//        let $el = $.getEl('.lastset');
//
//        if($el !== false){
//            $el.setAttribute('type', value);
//        }
//    });
//
//    // col size
//    $.colSizeSelect.addEventListener('change', function(){
//        let value = this.value;
//        let elName = $.activeElement.constructor.name
//        let $el = $.getEl('.lastset');
//
//        if((elName === 'HTMLTableCellElement' || elName === 'HTMLTableCaptionElement') && $el !== false){
//            let x = parseInt($.activeElement.dataset['x']) +1
//            let col = $el.querySelector(`col:nth-child(${x})`);
//            let className = $.getClassName(col.classList.value, 'size');
//
//            col.classList.remove(className);
//            col.classList.add(value);
//        }
//    });
//
//    // codeblock theme
//    $.themeSelect.addEventListener('change', function(){
//        let value = this.value;
//        let $el = $.getEl('.lastset');
//
//        if($el !== false){
//            $el.dataset['theme'] = value;
//        }
//    });
//
//    // codeblock language
//    $.languageSelect.addEventListener('change', function(){
//        let value = this.value;
//        let $el = $.getEl('.lastset');
//
//        if($el !== false){
//            let code = $el.childNodes[0];
//
//            $el.dataset['lang'] = value;
//            code.classList.value = '';
//            code.classList.add(value);
//            hljs.highlightBlock(code);
//        }
//    });
//
//    // ctable td / th change
//    $.changeThBtn.addEventListener('click', function(){
//        $.changeCell('th');
//    });
//
//    $.changeTdBtn.addEventListener('click', function(){
//        $.changeCell('td');
//    });
//
//    // text align
//    $.textAlgin.forEach(function(item){
//        item.addEventListener('click', function(){
//            let type = this.dataset['value'];
//            let $target = $.findContenteditable($.activeElement) === false ? $.findParent($.activeElement, 'item') : $.findContenteditable($.activeElement);
//            let className = $.getClassName($target.classList.value, 'align');
//
//            if(className !== ''){
//                $target.classList.remove(className);
//            }
//            $target.classList.add(type);
//        });
//    });
//
//    // url change
//    $.changeUrlBtn.addEventListener('click', function(){
//        let url = $.urlInput.value;
//        let $el = $.getEl('.lastset');
//        let type = $el.dataset['type'];
//
//        switch(true){ // not default
//            case $.urlReg.test(url) === false :
//                alert($.messageWrongURL);
//            break;
//            case $el === undefined :
//                alert($.messageNotSelect);
//            break;
//            case type === 'youtube' :
//                if($.youtubeReg.test(url)){
//                    let video = $el.querySelector('.video');
//                    video.setAttribute('src', url);
//                }else{
//                    alert($.messageWrongUrlType);
//                }
//            break;
//            case type === 'codepen' :
//                if($.codepenReg.test(url)){
//                    let iframe = $el.querySelector('.iframe');
//                    iframe.setAttribute('src', url);
//                }else{
//                    alert($.messageWrongUrlType);
//                }
//            break;
//            case type === 'btn' :
//                let btnValue = $el.dataset['value'];
//
//                if(btnValue === 'youtube'){
//                    $.addYoutube($el, url);
//                    $el.remove();
//                    $.activeElement = $.contentArea;
//                }else if(btnValue === 'codepen'){
//                    $.addCodepen($el, url);
//                    $el.remove();
//                    $.activeElement = $.contentArea;
//                }
//            break;
//        }
//    });
//
//    // 파일 업로드
//    $.fileInput.addEventListener('change', function(){
//        let contentArea = $.contentArea;
//        let file = this.files;
//        let form = new FormData();
//        let type = this.dataset['type'];
//        let article_idx = contentArea.dataset['idx'];
//        let temp_idx = contentArea.dataset['tempIdx'];
//
//        form.append('request_ype', 'upload');
//        form.append('file_type', type);
//        for(let item of file){
//            form.append('file[]', item);
//        }
//        form.append('article_idx', article_idx);
//        form.append('temp_idx', temp_idx);
//
//        // ajax
//        $.ajax('post', $.mediaUploadURL, form, 'form', (result) => {
//            if(result['result'] === true){
//                let $el = $.getEl('.lastset') === false ? $.getEl(`${$.contentAreaName} > *:nth-last-child(1)`) : $.getEl('.lastset');
//                let imgList = result['list'];
//                let html = '';
//
//                for(let item of imgList){
//                    let webp = item['webp'] === 'y' ? true : false;
//                    html += $.HTMLMediaRow.replace(/\[idx\]/g, item['idx'])
//                        .replace('[webp]', webp)
//                        .replace('[height]', item['height'])
//                        .replace('[width]', item['width'])
//                        .replace('[src]', `${item['src']}${item['name']}.${item['format']}`)
//                        .replace('[alt]', item['alt'])
//                        .replace('[name]', item['alt']);
//
//                    $.addImage($el, {
//                        'idx' : item['idx'],
//                        'src' : `${item['src']}${item['name']}`,
//                        'webp' : webp,
//                        'format' : item['format'],
//                        'alt' : item['alt'],
//                        'width' : item['width'],
//                        'height' : item['height']
//                    });
//                }
//
//                if($el.classList.contains('btn')){
//                    $el.remove();
//                }
//                $.mediaList.insertAdjacentHTML('beforeend', html);
//                $.popMedia.classList.add('act');
//                this.value = '';
//            }else{
//                alert(result['message']);
//            }
//        });
//    });
//
//    // add media
//    $.addMediaListBtn.addEventListener('click', function(){
//        $.fileInput.dataset['type'] = 'image';
//        $.fileInput.setAttribute('accept', 'image/*');
//        $.fileInput.click();
//    });
//
//    // media content
//    $.popMedia.addEventListener('click', function(e){
//        let $target = e.target;
//        let row = $.findParent($target, 'btn_add_media');
//        let $p = this.querySelector('*[contenteditable]');
//        let data;
//        
//        switch($target.tagName){
//            case 'IMG' : 
//                let src = $target.getAttribute('src');
//                let $el = $.getEl('.lastset') === false ? $.getEl(`${$.contentAreaName} > *:nth-last-child(1)`) : $.getEl('.lastset');
//
//                data = {
//                    'width' : $target.getAttribute('width'),
//                    'height' : $target.dataset['height'],
//                    'webp' : row.dataset['webp'],
//                    'alt' : row.querySelector('.name').textContent,
//                    'src' : src.replace($.srcReg, '$1'),
//                    'format' : src.replace($.srcReg, '$2')
//                }
//
//                $.addImage($el, data);
//            break;
//            case 'P' : 
//                if($p !== null){
//                    row = $.findParent($p, 'btn_add_media');
//                    $p.removeAttribute('contenteditable');
//                    data = {
//                        'idx' : row.dataset['idx'],
//                        'textContent' : $p.textContent
//                    };
//
//                    //ajax
//                    $.ajax('post', $.mediaUpdateURL, data, 'json', function(result){
//                        if(result['result'] === true){
//                            let src = row.querySelector('.img').getAttribute('src');
//                            $.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
//                                item.setAttribute('alt', $p.textContent);
//                            });
//                        }else{
//                            alert(result['message']);
//                        }
//                    });
//                }
//
//                $target.setAttribute('contenteditable', true);
//                $target.focus();
//            break;
//            case 'BUTTON' : 
//                if($target.classList.contains($.addMediaListBtnName.substring(1)) === false){
//                    let idx = row.dataset['idx'];
//                    let message = confirm($.messageDelImage);
//                    //'작성중인 내용 안의 이미지도 전부 삭제됩니다.\n정말로 삭제하시겠습니까?'
//
//                    if(message === true){
//                        //ajax
//                        $.ajax('delete', `${$.mediaDelURL}/${idx}`, [], 'form', function(result){
//                            if(result['result'] === true){
//                                let src = row.querySelector('.img').getAttribute('src');
//                                $.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
//                                    item.remove();
//                                    row.remove();
//                                });
//                            }else{
//                                alert(result['message']);
//                            }
//                        });
//                    }
//                }
//            break;
//            default :
//                if($p !== null){
//                    row = $.findParent($p, 'btn_add_media');
//                    data = {
//                        'idx' : row.dataset['idx'],
//                        'textContent' : $p.textContent
//                    };
//                    $p.removeAttribute('contenteditable');
//
//                    //ajax
//                    $.ajax('post', $.mediaUpdateURL, data, 'json', function(result){
//                        if(result['result'] === true){
//                            let src = row.querySelector('.img').getAttribute('src');
//                            $.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
//                                item.setAttribute('alt', $p.textContent);
//                            });
//                        }else{
//                            alert(result['message']);
//                        }
//                    });
//                }
//        }
//    });
//
//    $.popMedia.addEventListener('keydown', function(e){
//        if(e.key === 'Enter'){
//            e.preventDefault();
//            let row = $.findParent(e.target, 'btn_add_media');
//            let textContent = e.target.textContent;
//            let data = {
//                'idx' : row.dataset['idx'],
//                'textContent' : textContent
//            };
//
//            //ajax
//            $.ajax('post', $.mediaUpdateURL, data, 'json', function(result){
//                if(result['result'] === true){
//                    let src = row.querySelector('.img').getAttribute('src');
//                    $.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
//                        item.setAttribute('alt', $p.textContent);
//                    });
//                }else{
//                    alert(result['message']);
//                }
//            });
//            e.target.removeAttribute('contenteditable');
//        }
//    });
//
//    $.languageChangeBtn.forEach(function(btn){
//        btn.addEventListener('click', function(){
//            let prevLang = $.langStatus;
//            let contentData = $.getJsonData();
//            let lang = this.dataset['value'];
//            let jsonData = $.contentData[lang];
//            $.langStatus = lang;
//
//            $.languageChangeBtn.forEach(function(btn){
//                btn.classList.remove('act');
//            });
//            this.classList.add('act');
//
//            if(jsonData.length > 0){
//                $.setContent(jsonData);
//            }else{
//                let message = confirm($.messageDuplicateContent);
//
//                if(message === true){
//                    $.setContent(contentData[prevLang]);
//                }else{
//                    $.setContent([
//                        {
//                            "type" : "title",
//                            "class" : ["title"],
//                            "textContent" : ""
//                        },
//                        {
//                            "type" : "text",
//                            "class" : ["item"],
//                            "textContent" : ""
//                        }
//                    ]);
//                }
//            }
//        });
//    });
}

export function getContentJSON(){
    let childNodes = getElList(`${storage.contentAreaName} > *`);
    return htmlToJson(childNodes, storage.srcReg);
}