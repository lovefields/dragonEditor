import { getEl, getElList, findParent } from './selector';
import { jsonToHtml, htmlToJson } from './convertor';
import { actionPrev, actionNext } from './log';
import { contentCheckByMouse, mouseUpEvent } from './mouse';
import { keybroadControl } from './keyboard';
import { getClassName } from './element';
import { openOptionPop, checkOptionsValue } from './option';
import { addTextBlock, addQuote, setTextAlgin } from './phrase';
import { addBtn } from './button';
import { addList } from './list';
import { tableConstrol, addTable, changeCell } from './table';
import { addCodeBlock } from './codeBlock';
import { addLinkBox } from './linkBox';
import { addYoutube, addCodepen } from './embed';
import { addImage } from './image';
import { addSticker } from './sticker';
import { changeImageWidth, addImage } from './image';
import { addSticker } from './sticker';
import { changeFontSize, changeColor, makeLink, unLink, makeTextDecoration, makeWordBlock } from './word';
import { setCursor } from './cursor';
import { fetchURL } from './api';

export function bindingEvent(){
    window.onbeforeunload = function(e){
        if(storage.edited === true){
            return e.returnValue;
        }
    };

    let resizeFn;
    window.addEventListener('resize', function(){
        clearTimeout(resizeFn);
        resizeFn = setTimeout(() => {
            storage.windowWidth = window.innerWidth;
            storage.windowHeight = window.innerHeight;
            storage.popOptions.removeAttribute('style');
            storage.popOptions.classList.remove('act');
        }, 250);
    });

    // right click block
    document.addEventListener('contextmenu', function(e){
        e.preventDefault();
    });

    document.addEventListener('mouseup', function(e){
        mouseUpEvent(e);
    });

    // pop btns work
    bindinEventFunction(storage.popBtns, 'click', function(){
        let target = this.dataset['target'];
        let type = this.dataset['type'];
        let $el = getEl(target);
        let btnOffset = this.getBoundingClientRect();
        let optionsOffset = storage.popOptions.getBoundingClientRect();

        $el.removeAttribute('style');
        $el.classList.toggle('act');
        if(type === 'position' && storage.windowWidth > storage.changePint){
            let x = Math.floor(btnOffset.left - optionsOffset.left);
            let y = storage.popOptions.getBoundingClientRect().height;
            $el.style.cssText = `transform:translate(${x}px, ${y}px)`;
        }else{
            this.classList.toggle('act');
        }
    });

    bindinEventFunction(storage.popCloseBtns, 'click', function(){
        let target = this.dataset['target'];
        let $el = getEl(target);

        $el.removeAttribute('style');
        $el.classList.toggle('act');
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

    document.addEventListener('paste', function(e){
        e.preventDefault();
        let data = e.clipboardData.getData('text');
        let dataArr = data.trim().split('\n');
        let count = dataArr.length;
        let olListReg = new RegExp(' ?\\d\\.', 'i');
        let ulListReg = new RegExp(' ?\\- ?', 'i');
        let type = 'text';
        let textOrHtml = '';
        let $target = storage.activeElement;

        if(count > 1){
            if(olListReg.test(data) || ulListReg.test(data)){
                type = 'html';
            }

            if(type === 'html'){
                let start = false;
                let listType;
                dataArr.forEach(function(row){
                    if(olListReg.test(row)){
                        if(start === false){
                            start = true;
                            listType = 'ol';
                            textOrHtml += '<ol type="1" class="item item_list lastset" data-type="list_o">';
                            textOrHtml += storage.HTMLChildList.replace('[content]', row.replace(olListReg, '').trim());
                        }else{
                            textOrHtml += storage.HTMLChildList.replace('[content]', row.replace(olListReg, '').trim());
                        }
                    }else if(ulListReg.test(row)){
                        if(start === false){
                            start = true;
                            listType = 'ul';
                            textOrHtml += '<ul class="item item_list lastset" data-type="list_u">';
                            textOrHtml += storage.HTMLChildList.replace('[content]', row.replace(ulListReg, '').trim());
                        }else{
                            textOrHtml += storage.HTMLChildList.replace('[content]', row.replace(ulListReg, '').trim());
                        }
                    }else{
                        if(start === true){
                            start = false;
                            if(listType === 'ol'){
                                textOrHtml += '</ol>';
                            }else{
                                textOrHtml += '</ul>';
                            }
                            textOrHtml += storage.HTMLTextBlock.replace('[content]', row);
                        }else{
                            textOrHtml += storage.HTMLTextBlock.replace('[content]', row);
                        }
                    }
                });
            }else{
                textOrHtml = dataArr.join('');
            }
        }else{
            textOrHtml = dataArr[0];
        }

        if(type === 'html'){
            $target.insertAdjacentHTML('afterend', textOrHtml);
            window.scrollTo(0, window.scrollY + 1);
        }else{
            let textContent = $target.textContent;

            if(textContent === ''){
                let position = textOrHtml.length;
                $target.textContent = textOrHtml;
                setCursor($target.childNodes[0], position);
            }else{
                alert('Sorry we are not ready for this.');
            }
        }
    });

//    document.addEventListener('copy', function(e){
//        console.log('copy', e);
//    });

    window.addEventListener('scroll', function(e){
        if(storage.windowWidth > storage.changePint){
            document.activeElement.blur();
            storage.popOptions.classList.remove('act');
        }
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
    bindinEventFunction(storage.contentArea, 'click', function(e){
        clearTimeout(clickFn);
        clickFn = setTimeout(() => {
            if(e.button === 0 || e.isTrusted === false){
                storage.edited = true;
                contentCheckByMouse(e.target, 'click');
                checkOptionsValue(e.target);
                tableConstrol(e.target);
            }
        }, 150);
    });

    let overFn;
    bindinEventFunction(storage.contentArea, 'mouseover', function(e){
        clearTimeout(overFn);
        overFn = setTimeout(() => {
            if(storage.windowWidth > storage.changePint){
                contentCheckByMouse(e.target, 'mouseover');
                checkOptionsValue(e.target);
            }
        }, 250);
    });

    // key event control
    bindinEventFunction(storage.contentArea, 'keydown', function(e){
        storage.edited = true;
        keybroadControl(e);
        setTimeout(() => {
            storage.enterCount = 0;
        }, 150);
    });

    // content add event
    bindinEventFunction(storage.contentAddBtn, 'click', function(){
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
                addSticker($target, this);
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

    // change view size
    bindinEventFunction(storage.viewBtn, 'click', function(e){
        storage.contentArea.classList.toggle('mobile');
        this.classList.toggle('act');
    });

    bindinEventFunction(getEl(storage.popLinkName + ' .btn_check'), 'click', async function(){
        let json = {};
        let $viewEl = getEl(storage.popLinkName + ' .view');
        let $submitBtn = getEl(storage.popLinkName + ' .btn_submit');
        let url = getEl(storage.popLinkName + ' .url').value;

        if(storage.urlReg.test(url) === true){
            json.url = url;

            if(storage.linkBoxApi === ''){
                let data = await fetchURL(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
                let contents = data.contents;

                if(contents !== null){
                    let regTitleCheck = new RegExp('property=\\"og:title\\"', 'g');
                    let regTitle01 = new RegExp('([^])*\\<title>([^"]*)<\\/title>([^]*)', 'g');
                    let regTitle02 = new RegExp('([^]*)\\<meta property=\\"og:title\\" content=\\"([^"]*)(?=\\")"([^]*)', 'g');
                    let regImgCheck = new RegExp('property=\\"og:image\\"', 'g');
                    let regImg01 = new RegExp('([^])*\\<meta name=\\"image\\" content=\\"([^"]*)"\\>([^]*)', 'g');
                    let regImg02 = new RegExp('([^])*\\<meta property=\\"og:image\\" content=\\"([^"]*)(?=\\")([^]*)', 'g');
                    let regDecripCheck = new RegExp('property=\\"og:description\\"', 'g');
                    let regDecrip01 = new RegExp('([^])*\\<meta name=\\"description\\" content=\\"([^"]*)(?=\\")([^]*)', 'g');
                    let regDecrip02 = new RegExp('([^])*\\<meta property=\\"og:description\\" content=\\"([^"]*)(?=\\")([^]*)', 'g')

                    if(regTitleCheck.test(contents)){
                        json.title = contents.replace(regTitle02, '$2');
                    }else{
                        json.title = contents.replace(regTitle01, '$2');
                    }

                    if(regImgCheck.test(contents)){
                        json.img = contents.replace(regImg02, '$2');
                    }else{
                        let img = contents.replace(regImg01, '$2')
                        if(img.length > 500){
                            json.img = '';
                        }else{
                            json.img = img;
                        }
                    }

                    if(regDecripCheck.test(contents)){
                        json.description = contents.replace(regDecrip02, '$2');
                    }else{
                        let description = contents.replace(regDecrip01, '$2')
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
                    storage.linkBoxData = json;
                    $submitBtn.removeAttribute('disabled');
                    addLinkBox($viewEl, json, 'innerHTML');
                }else{
                    $submitBtn.setAttribute('disabled', 'true');
                    $viewEl.innerHTML = storage.messageNoData;
                }
            }else{
                let formData = new FormData();
                formData.append('url', url);
                let data = await fetchURL(storage.linkBoxApi, {
                    method : 'POST',
                    body : formData
                });

                if(data['result'] === true){
                    storage.linkBoxData = data;
                    $submitBtn.removeAttribute('disabled');
                    addLinkBox($viewEl, data, 'innerHTML');
                }else{
                    $submitBtn.setAttribute('disabled', 'true');
                    $viewEl.innerHTML = data['message'];
                }
            }
        }else{
            alert(storage.messageWrongURL);
        }
    });

    // delete content
    bindinEventFunction(storage.contentDelBtn, 'click', function(){
        let $target = getEl('.lastset');

        if($target !== null){
            $target.remove();
            storage.popOptions.classList.remove('act');
            let count = storage.contentArea.childElementCount;

            if(count === 1){
                addTextBlock(storage.contentArea, '', 'beforeend');
            }
        }else{
            alert(storage.messageNotSelect);
        }
    });

    // font size
    bindinEventFunction(storage.fontSizeSelect, 'change', function(){
        let value = this.value;
        changeFontSize(value);
    });

    // color
    bindinEventFunction(storage.btnColor, 'click', function(){
        let value = this.dataset['class'];
        changeColor(value);
    });

    // 텍스트 링크 추가
    bindinEventFunction(storage.addLinkBtn, 'click', function(){
        makeLink();
    });

    // remove link
    bindinEventFunction(storage.unlinkBtn, 'click', function(){
        unLink();
    });

    // bold
    bindinEventFunction(storage.boldBtn, 'click', function(){
        makeTextDecoration('b', 'B', 'bold');
    });

    bindinEventFunction(storage.italicBtn, 'click', function(){
        makeTextDecoration('i', 'I', 'italic');
    });

    bindinEventFunction(storage.underlineBtn, 'click', function(){
        makeTextDecoration('u', 'U', 'underline');
    });

    bindinEventFunction(storage.strikeBtn, 'click', function(){
        makeTextDecoration('s', 'S', 'strike');
    });

    bindinEventFunction(storage.wordblockBtn, 'click', function(){
        makeWordBlock();
    });

    // image width
    bindinEventFunction(storage.widthInput, 'keyup', function(e){
        if(e.key === 'Enter'){
            let value = this.value;
            changeImageWidth(this, value);
<<<<<<< HEAD
>>>>>>> 68f8acc (module)
=======
>>>>>>> 266123b (module)
        }
    });

    // codepen height
    bindinEventFunction(storage.heightInput, 'keyup', function(e){
        if(e.key === 'Enter'){
            let value = this.value;
            let $el = getEl('.lastset .iframe');
            let massage = storage.messageExceedSize.replace('[size]', storage.maxCodepenHeight);
            
            if($el !== null){
                if(storage.numberReg.test(value)){
                    if(value <= storage.maxCodepenHeight){
                        $el.setAttribute('height', value);
                    }else{
                        alert(massage);
                        this.value = storage.maxCodepenHeight;
                        $el.setAttribute('height', storage.maxCodepenHeight);
                    }
                    let offset = getEl('.lastset').getBoundingClientRect();
                    openOptionPop(offset, 'codepen');
                }else{
                    alert(storage.messageWrongValue);
                }
            }else{
                alert(storage.messageNotSelecCodepen);
            }
        }
    });

    // list type
    bindinEventFunction(storage.listTypeSelect, 'change', function(){
        let value = this.value;
        let $el = getEl('.lastset');

        if($el !== false){
            $el.setAttribute('type', value);
        }
    });

    // col size
    bindinEventFunction(storage.colSizeSelect, 'change', function(){
        let value = this.value;
        let elName = storage.activeElement.constructor.name
        let $el = getEl('.lastset');

        if((elName === 'HTMLTableCellElement' || elName === 'HTMLTableCaptionElement') && $el !== null){
            let x = parseInt(storage.activeElement.dataset['x']) +1
            let col = $el.querySelector(`col:nth-child(${x})`);
            let className = getClassName(col.classList.value, 'size');

            col.classList.remove(className);
            col.classList.add(value);
        }
    });

    // codeblock theme
    bindinEventFunction(storage.themeSelect, 'change', function(){
        let value = this.value;
        let $el = getEl('.lastset');

        if($el !== null){
            $el.dataset['theme'] = value;
        }
    });

    // codeblock language
    bindinEventFunction(storage.languageSelect, 'change', function(){
        let value = this.value;
        let $el = getEl('.lastset');

        if($el !== null){
            let code = $el.childNodes[0];

            $el.dataset['lang'] = value;
            code.classList.value = '';
            code.classList.add(value);
            hljs.highlightBlock(code);
        }
    });

    // ctable td / th change
    bindinEventFunction(storage.changeThBtn, 'click', function(){
        changeCell('th');
    });

    bindinEventFunction(storage.changeTdBtn, 'click', function(){
        changeCell('td');
    });

    // text align
    bindinEventFunction(storage.textAlgin, 'click', function(){
        let type = this.dataset['value'];
        setTextAlgin(type);
    });

    // url change
    bindinEventFunction(storage.changeUrlBtn, 'click', function(){
        let url = storage.urlInput.value;
        let $el = getEl('.lastset');
        let type = $el.dataset['type'];

        switch(true){ // not default
            case storage.urlReg.test(url) === false :
                alert(storage.messageWrongURL);
            break;
            case $el === undefined :
                alert(storage.messageNotSelect);
            break;
            case type === 'youtube' :
                if(storage.youtubeReg.test(url)){
                    let code = url.replace(storage.youtubeCodeReg, '$7');
                    let video = $el.querySelector('.video');
                    video.setAttribute('src', `https://www.youtube.com/embed/${code}`);
                }else{
                    alert(storage.messageWrongUrlType);
                }
            break;
            case type === 'codepen' :
                if(storage.codepenReg.test(url)){
                    let iframe = $el.querySelector('.iframe');
                    let height = iframe.getAttribute('height');
                    let nickname = url.replace(storage.codepenCodeReg, '$2');
                    let code = url.replace(storage.codepenCodeReg, '$4');
                    iframe.setAttribute('src', `https://codepen.io/${nickname}/embed/${code}?height=${height}&theme-id=${storage.codepenTheme}&default-tab=result`);
                }else{
                    alert(storage.messageWrongUrlType);
                }
            break;
            case type === 'btn' :
                let btnValue = $el.dataset['value'];

                if(btnValue === 'youtube'){
                    addYoutube($el, url);
                    $el.remove();
                    storage.activeElement = storage.contentArea;
                }else if(btnValue === 'codepen'){
                    addCodepen($el, url);
                    $el.remove();
                    storage.activeElement = storage.contentArea;
                }
            break;
        }
    });

    // 파일 업로드
    bindinEventFunction(storage.fileInput, 'change', async function(){
        let contentArea = storage.contentArea;
        let file = this.files;
        let form = new FormData();
        let type = this.dataset['type'];
        let article_idx = contentArea.dataset['idx'];
        let temp_idx = contentArea.dataset['tempIdx'];

        form.append('request_type', 'upload');
        form.append('file_type', type);
        for(let item of file){
            form.append('file[]', item);
        }
        form.append('article_idx', article_idx);
        form.append('temp_idx', temp_idx);

        // ajax
       // let result = await ajax('post', storage.mediaUploadURL, form, 'form');
        let result = await fetchURL(storage.mediaUploadURL, {
            method : 'POST',
            body : form
        });
        if(result['result'] === true){
            let $el = getEl('.lastset') === null ? getEl(`${storage.contentAreaName} > *:nth-last-child(1)`) : getEl('.lastset');
            let imgList = result['list'];
            let html = '';

            for(let item of imgList){
                let webp = item['webp'] === 'y' ? true : false;
                html += storage.HTMLMediaRow.replace(/\[idx\]/g, item['idx'])
                    .replace('[webp]', webp)
                    .replace('[height]', item['height'])
                    .replace('[width]', item['width'])
                    .replace('[src]', `${item['src']}${item['name']}.${item['format']}`)
                    .replace('[alt]', item['alt'])
                    .replace('[name]', item['alt']);

                addImage($el, {
                    'idx' : item['idx'],
                    'src' : `${item['src']}${item['name']}`,
                    'webp' : webp,
                    'format' : item['format'],
                    'alt' : item['alt'],
                    'width' : item['width'],
                    'height' : item['height']
                });
            }

            if($el.classList.contains('btn')){
                $el.remove();
            }
            storage.mediaList.insertAdjacentHTML('beforeend', html);
            storage.popMedia.classList.add('act');
            this.value = '';
        }else{
            alert(result['message']);
        }
    });

    // add media
    bindinEventFunction(storage.addMediaListBtn, 'click', function(){
        storage.fileInput.dataset['type'] = 'image';
        storage.fileInput.setAttribute('accept', 'image/*');
        storage.fileInput.click();
    });

    // media content
    bindinEventFunction(storage.popMedia, 'click', async function(e){
        let $target = e.target;
        let row = findParent($target, 'btn_add_media');
        let $p = this.querySelector('*[contenteditable]');
        let data, img;
        
        switch($target.tagName){
            case 'IMG' : 
                let src = $target.getAttribute('src');
                let $el = getEl('.lastset') === null ? getEl(`${storage.contentAreaName} > *:nth-last-child(1)`) : getEl('.lastset');

                data = {
                    'width' : $target.getAttribute('width'),
                    'height' : $target.dataset['height'],
                    'webp' : row.dataset['webp'],
                    'alt' : row.querySelector('.name').textContent,
                    'src' : src.replace(storage.srcReg, '$1'),
                    'format' : src.replace(storage.srcReg, '$2')
                }

                addImage($el, data);
            break;
            case 'P' : 
                if($p !== null){
                    row = findParent($p, 'btn_add_media');
                    img = row.querySelector('.img');
                    $p.removeAttribute('contenteditable');
                    data = {
                        'request_type' : 'update',
                        'idx' : row.dataset['idx'],
                        'width' : img.getAttribute('width'),
                        'height' : img.dataset['height'],
                        'webp' : row.dataset['webp'],
                        'alt' : row.querySelector('.name').textContent,
                        'src' : img.getAttribute('src').replace(storage.srcReg, '$1'),
                        'format' : img.getAttribute('src').replace(storage.srcReg, '$2')
                    };

                    //ajax
                    let updateResult = await fetchURL(storage.mediaUpdateURL, {
                        method : 'POST',
                        body : data
                    }, 'json');
                    if(updateResult['result'] === true){
                        let src = img.getAttribute('src');
                        storage.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
                            item.setAttribute('alt', $p.textContent);
                        });
                    }else{
                        alert(updateResult['message']);
                    }
                }

                $target.setAttribute('contenteditable', true);
                $target.focus();
            break;
            case 'BUTTON' : 
                if($target.classList.contains(storage.addMediaListBtnName.substring(1)) === false){
                    let idx = row.dataset['idx'];
                    let message = confirm(storage.messageDelImage);
                    //'작성중인 내용 안의 이미지도 전부 삭제됩니다.\n정말로 삭제하시겠습니까?'

                    if(message === true){
                        //ajax
                        let delateResult = await fetchURL(`${storage.mediaDelURL}/${idx}`, {
                            method : 'delete'
                        });
                        if(delateResult['result'] === true){
                            let src = row.querySelector('.img').getAttribute('src');
                            storage.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
                                item.remove();
                                row.remove();
                            });
                        }else{
                            alert(delateResult['message']);
                        }
                    }
                }
            break;
            default :
                if($p !== null){
                    row = findParent($p, 'btn_add_media');
                    img = row.querySelector('.img');
                    $p.removeAttribute('contenteditable');
                    data = {
                        'request_type' : 'update',
                        'idx' : row.dataset['idx'],
                        'width' : img.getAttribute('width'),
                        'height' : img.dataset['height'],
                        'webp' : row.dataset['webp'],
                        'alt' : row.querySelector('.name').textContent,
                        'src' : img.getAttribute('src').replace(storage.srcReg, '$1'),
                        'format' : img.getAttribute('src').replace(storage.srcReg, '$2')
                    };

                    //ajax
                    let updateResult2 = await fetchURL(storage.mediaUpdateURL, {
                        method : 'POST',
                        body : data
                    }, 'json');
                    if(updateResult2['result'] === true){
                        let src = img.getAttribute('src');
                        storage.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
                            item.setAttribute('alt', $p.textContent);
                        });
                    }else{
                        alert(updateResult2['message']);
                    }
                }
        }
    });

    bindinEventFunction(storage.popMedia, 'keydown', async function(e){
        if(e.key === 'Enter'){
            e.preventDefault();
            let row = findParent(e.target, 'btn_add_media');
            let img = row.querySelector('.img');
            let textContent = e.target.textContent;
            let data = {
                'request_type' : 'update',
                'idx' : row.dataset['idx'],
                'width' : img.getAttribute('width'),
                'height' : img.dataset['height'],
                'webp' : row.dataset['webp'],
                'alt' : textContent,
                'src' : img.getAttribute('src').replace(storage.srcReg, '$1'),
                'format' : img.getAttribute('src').replace(storage.srcReg, '$2')
            };

            //ajax
            let result = await fetchURL(storage.mediaUpdateURL, {
                method : 'POST',
                body : data
            }, 'json');
            if(result['result'] === true){
                let src = row.querySelector('.img').getAttribute('src');
                storage.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
                    item.setAttribute('alt', textContent);
                });
            }else{
                alert(result['message']);
            }
            e.target.removeAttribute('contenteditable');
        }
    });

    bindinEventFunction(storage.languageChangeBtn, 'click', function(){
        let prevLang = storage.langStatus;
        let contentData = getContentJSON();
        let lang = this.dataset['value'];
        let jsonData = storage.contentData[lang];
        storage.contentData[prevLang] = contentData;
        storage.langStatus = lang;

        storage.languageChangeBtn.forEach(function(btn){
            btn.classList.remove('act');
        });
        this.classList.add('act');

        if(jsonData.length > 0){
            setContent(jsonData);
        }else{
            let message = confirm(storage.messageDuplicateContent);

            if(message === true){
                setContent(contentData);
            }else{
                setContent([
                    {
                        "type" : "title",
                        "class" : ["title"],
                        "textContent" : ""
                    },
                    {
                        "type" : "text",
                        "class" : ["item"],
                        "textContent" : ""
                    }
                ]);
            }
        }
    });
}

function bindinEventFunction($target, event, fn){
    if($target !== null){
        let type = typeof $target === 'object' && $target.constructor.name === 'NodeList' ? 'NodeList' : 'element';

        if(type === 'NodeList'){
            $target.forEach(function($item){
                $item.addEventListener(event, fn);
            });
        }else{
            $target.addEventListener(event, fn);
        }
    }
}

export function setContent(jsonArr){
    let html = jsonToHtml(jsonArr);
    storage.contentArea.innerHTML = html;
}

export function getContentJSON(){
    let childNodes = getElList(`${storage.contentAreaName} > *`);
    return htmlToJson(childNodes, storage.srcReg);
}