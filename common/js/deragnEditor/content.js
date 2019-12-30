import { getEl, getElList } from './selector';
import { jsonToHtml, htmlToJson } from './convertor';

let storage;

export function setStorage(data){
    storage = data;
};

export function getContentJSON(){
    let childNodes = getElList(`${storage.contentAreaName} > *`);
    return htmlToJson(childNodes, storage.srcReg);
}

//    let $this = this;
//    if($this.mediaUploadURL === '' || $this.mediaUpdateURL === '' || $this.mediaDelURL === ''){
//        console.warn($this.messageNotSetAjax);
//        return;
//    }
//    $this.activeElement = $this.wrap;
//
//    if($this.windowWidth > $this.changePint){
//        $this.contentAddList.classList.add('act');
//    }else if($this.windowWidth < $this.changePint){
//        $this.contentAddList.classList.remove('act');
//    }
//
//    if($this.multiUpload === true){
//        $this.fileInput.setAttribute('multiple', true);
//    }
//
//    let resizeFn;
//    window.addEventListener('resize', function(){
//        clearTimeout(resizeFn);
//        resizeFn = setTimeout(() => {
//            $this.windowWidth = window.innerWidth;
//            $this.windowHeight = window.innerHeight;
//
//            if($this.windowWidth > $this.changePint){
//                $this.contentAddList.classList.add('act');
//            }else if($this.windowWidth < $this.changePint){
//                $this.contentAddList.classList.remove('act');
//            }
//            return;
//        }, 250);
//    });
//
//    // right click block and content menu open
//    document.addEventListener('contextmenu', function(e){
//        e.preventDefault();
//    });
//
//    document.addEventListener('mouseup', function(e){
//        if(typeof e === 'object'){
//            let target = e.target;
//            if(e.button === 0){
//                let $pop = $this.findParent(target, 'pop');
//                let $btnPop = $this.findParent(target, 'btn_pop');
//                let $popEl = $this.getElList('.pop');
//
//                $popEl.forEach(function(item){
//                    if($btnPop === false){
//                        item.classList.remove('act');
//                    }else{
//                        let name = $btnPop.dataset['target'];
//
//                        if(item !== $this.getEl(name)){
//                            item.classList.remove('act');
//                        }
//                    }
//
//                    if($this.windowWidth > $this.changePint){
//                        $this.contentAddList.classList.add('act');
//                    }
//                });
//
//                $this.popBtns.forEach(function(btn){
//                    if($btnPop !== btn && !btn.classList.contains('select_color')){
//                        btn.classList.remove('act');
//                    }
//                });
//
//                if($pop !== false){
//                    $pop.classList.add('act');
//                }
//            }
//        }
//    });
//
//    document.addEventListener('keydown', function(e){
//        let activeElName = document.activeElement.constructor.name;
//
//        if(activeElName === 'HTMLBodyElement'){
//            let ctrl;
//
//            if(e.ctrlKey === true || e.metaKey === true){
//                ctrl = true;
//            }
//
//            if(e.key === 'z'){
//                if(ctrl === true){
//                    e.preventDefault();
//                    $this.actionPrev();
//                }else if(ctrl === true && e.shiftKey === true){
//                    e.preventDefault();
//                    $this.actionNext();
//                }
//            }
//        }
//    });
//
//    document.addEventListener('paste', function(e){
//        console.log('paste', e);
//    });
//
//    document.addEventListener('copy', function(e){
//        console.log('copy', e);
//    });
//
//    window.addEventListener('scroll', function(e){
//        //if($this.windowWidth > $this.changePint){
//        //	document.activeElement.blur();
//        //	$this.popOptions.classList.remove('act');
//        //}
//    });
//
//    let setDrag;
//    const dragStartFn = function(e){
//        let el = this;
//        $this.dragStartEvent(e, el);
//    };
//    const dragOverFn = function(e){
//        clearTimeout(setDrag);
//        let el = this;
//        setDrag = setTimeout(() => {
//            $this.dragOverEvent(e, el);
//        }, 10);
//    };
//    const dragEndFn = function(e){
//        let el = this;
//        $this.dragEndEvent(e, el);
//    };
//
//    let clickFn;
//    $this.contentArea.addEventListener('click', function(e){
//        clearTimeout(clickFn);
//        clickFn = setTimeout(() => {
//            if(e.button === 0 || e.isTrusted === false){
//                $this.contentCheckByMouse(e.target, 'click');
//                $this.checkOptionsValue(e.target);
//                $this.tableConstrol(e.target);
//            }
//        }, 150);
//    });
//
//    let overFn;
//    $this.contentArea.addEventListener('mouseover', function(e){
//        clearTimeout(overFn);
//        overFn = setTimeout(() => {
//            if($this.windowWidth > $this.changePint){
//                $this.contentCheckByMouse(e.target, 'mouseover');
//                $this.checkOptionsValue(e.target);
//            }
//        }, 250);
//    });
//
//    // key event control
//    $this.contentArea.addEventListener('keydown', function(e){
//        $this.keybroadControl(e);
//    });
//
//    // content add event
//    $this.contentAddBtn.forEach(function($btn){
//        $btn.addEventListener('click', function(){
//            let type = this.dataset['value'];
//            let childCount = $this.contentArea.childElementCount;
//            let $lastEl = $this.getEl('.lastset');
//            let $target = $lastEl === false ? $this.contentArea.children[childCount - 1] : $lastEl
//
//            switch(type){
//                case 'text':
//                    $this.addTextBlock($target);
//                break;
//                case 'image':
//                    $this.addBtn($target, $this.imageIconId, 'image', 'Add on image');
//                    $this.fileInput.dataset['type'] = 'image';
//                    $this.fileInput.setAttribute('accept', 'image/*');
//                    $this.fileInput.click();
//                break;
//                case 'sticker':
//                    $this.addSticker($target, this);
//                break;
//                case 'youtube':
//                    $this.addBtn($target, $this.youtubeIconId, 'youtube', 'Add Youtube');
//                break;
//                case 'codepen':
//                    $this.addBtn($target, $this.codepenIconId, 'codepen', 'Add Codepen');
//                break;
//                case 'bulletedlist':
//                    $this.addList($target, 'ul');
//                break;
//                case 'numberedlist':
//                    $this.addList($target, 'ol', '1');
//                break;
//                case 'quote':
//                    $this.addQuote($target);
//                break;
//                case 'table':
//                    $this.addTable($target);
//                break;
//                case 'codeblock':
//                    $this.addCodeBlock($target);
//                break;
//                case 'link':
//                    $this.addLinkBox($target, $this.linkBoxData);
//                    $this.popLink.classList.remove('act');
//                    $this.popLink.querySelector('.url').value = '';
//                    $this.popLink.querySelector('.view').innerHTML = '';
//                    $this.popLink.querySelector('.btn_submit').setAttribute('disabled', 'true');
//                break;
//            }
//        });
//    });
//
//    // change view size
//    $this.viewBtn.addEventListener('click', function(){
//        $this.editorSection.classList.toggle('mobile');
//        this.classList.toggle('act');
//    });
//
//    // pop btns work
//    $this.popBtns.forEach(function($btn){
//        $btn.addEventListener('click', function(){
//            let target = this.dataset['target'];
//            let type = this.dataset['type'];
//            let $el = $this.getEl(target);
//            let btnOffset = this.getBoundingClientRect();
//            let optionsOffset = $this.popOptions.getBoundingClientRect();
//
//            $el.removeAttribute('style');
//            $el.classList.toggle('act');
//            if(type === 'position' && $this.windowWidth > $this.changePint){
//                let x = Math.floor(btnOffset.left - optionsOffset.left);
//                $el.style.cssText = `transform:translate(${x}px, 30px)`;
//            }else{
//                this.classList.toggle('act');
//            }
//        });
//    });
//
//    $this.popCloseBtns.forEach(function($btn){
//        $btn.addEventListener('click', function(){
//            let target = this.dataset['target'];
//            let $el = $this.getEl(target);
//
//            $el.removeAttribute('style');
//            $el.classList.toggle('act');
//        });
//    });
//
//    let $linkCheckBtn = $this.getEl($this.popLinkName + ' .btn_check');
//    if($linkCheckBtn !== false){
//        $linkCheckBtn.addEventListener('click', function(){
//            let json = {};
//            let $viewEl = $this.getEl($this.popLinkName + ' .view');
//            let $submitBtn = $this.getEl($this.popLinkName + ' .btn_submit');
//            let url = $this.getEl($this.popLinkName + ' .url').value;
//
//            if($this.urlReg.test(url) === true){
//                json.url = url;
//                fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
//                .then(response => {
//                    if (response.ok) return response.json();
//                    throw new Error('Network response was not ok.')
//                })
//                .then((data) => {
//                    let contents = data.contents;
//                    
//                    if(contents !== null){
//                        let regTitleCheck = new RegExp('property=\\"og:title\\"', 'g');
//                        let regTitle01 = new RegExp('([^])*\\<title>([^"]*)<\\/title>([^]*)', 'g');
//                        let regTitle02 = new RegExp('([^])*\\<meta property=\\"og:title\\" content=\\"([^"]*)"\\>([^]*)', 'g');
//                        let regImgCheck = new RegExp('property=\\"og:image\\"', 'g');
//                        let regImg01 = new RegExp('([^])*\\<meta name=\\"image\\" content=\\"([^"]*)"\\>([^]*)', 'g');
//                        let regImg02 = new RegExp('([^])*\\<meta property=\\"og:image\\" content=\\"([^"]*)"\\>([^]*)', 'g');
//                        let regDecripCheck = new RegExp('property=\\"og:description\\"', 'g');
//                        let regDecrip01 = new RegExp('([^])*\\<meta name=\\"description\\" content=\\"([^"]*)"\\>([^]*)', 'g');
//                        let regDecrip02 = new RegExp('([^])*\\<meta property=\\"og:description\\" content=\\"([^"]*)"\\>([^]*)', 'g');
//
//                        if(regTitleCheck.test(contents)){
//                            json.title = contents.replace(regTitle02, '$2');
//                        }else{
//                            json.title = contents.replace(regTitle01, '$2');
//                        }
//
//                        if(regImgCheck.test(contents)){
//                            json.img = contents.replace(regImg02, '$2');
//                        }else{
//                            let img = contents.replace(regImg01, '$2');
//
//                            if(img.length > 500){
//                                json.img = '';
//                            }else{
//                                json.img = img;
//                            }
//                        }
//
//                        if(regDecripCheck.test(contents)){
//                            json.description = contents.replace(regDecrip02, '$2');
//                        }else{
//                            let description = contents.replace(regDecrip01, '$2');
//
//                            if(description.length > 500){
//                                json.description = '';
//                            }else{
//                                json.description = description;
//                            }
//                        }
//
//                        if(url.indexOf("://") > -1){
//                            json.domain = url.split('/')[2];
//                        }else{
//                            json.domain = url.split('/')[0];
//                        }
//                    
//                        json.domain = json.domain.split(':')[0];
//
//                        $this.linkBoxData = json;
//                        $submitBtn.removeAttribute('disabled');
//                        $this.addLinkBox($viewEl, json, 'afterbegin');
//                    }else{
//                        $submitBtn.setAttribute('disabled', 'true');
//                        $viewEl.innerHTML = $this.messageNoData;
//                    }
//                });
//            }else{
//                alert($this.messageWrongURL);
//            }
//        });
//    }else{
//        console.warn('We need link check button from ' + $this.popLinkName);
//    }
//
//    // delete content
//    $this.contentDelBtn.addEventListener('click', function(){
//        let $target = $this.getEl('.lastset');
//
//        if($target !== null){
//            $target.remove();
//            $this.popOptions.classList.remove('act');
//            let count = $this.contentArea.childElementCount;
//
//            if(count === 1){
//                $this.addTextBlock($this.contentArea, '', 'beforeend');
//            }
//        }else{
//            alert($this.messageNotSelect);
//        }
//    });
//
//    // font size
//    $this.fontSizeSelect.addEventListener('change', function(){
//        let value = this.value;
//        let $target = $this.activeElement;
//        let $el = $this.findContenteditable($target);
//        let className = $this.getClassName($el.classList.value, 'size');
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
//    $this.btnColor.forEach(function($btn){
//        $btn.addEventListener('click', function(){
//            let value = this.dataset['class'];
//            let list = ['I', 'B', 'S', 'U', 'A', 'SPAN'];
//            let $activeEl = $this.activeElement;
//            let tagName = $activeEl.tagName;
//            let $target = $this.findContenteditable($activeEl);
//
//            if(window.getSelection().focusNode === window.getSelection().baseNode){
//                if(list.indexOf(tagName) > 0){
//                    let className = $this.getClassName($activeEl.classList.value, 'color');
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
//                            $this.activeElement = $this.wrap;
//                        }
//                    }
//                    $this.btnColorSelect.dataset['class'] = value;
//                }else{
//                    let className = $this.getClassName($target.classList.value, 'color');
//
//                    if($this.startTextCursor === $this.endTextCursor){
//                        if(className !== ''){
//                            $target.classList.remove(className);
//                        }
//                        if(value !== 'default'){
//                            $target.classList.add(value);
//                        }
//                        $this.btnColorSelect.dataset['class'] = value;
//                    }else{
//                        $this.wrapElement('color', null, value);
//                    }
//                }
//            }else{
//                alert($this.messageWrongNode);
//            }
//        });
//    });
//
//    // 텍스트 링크 추가
//    $this.addLinkBtn.addEventListener('click', function(){
//        let url = $this.urlInput.value;
//
//        if($this.urlReg.test(url) === true){
//            let isSameNode = $this.checkSameNode();
//
//            if(isSameNode === true){
//                $this.wrapElement('link', url);
//            }else{
//                alert($this.messageWrongNode);
//            }
//        }else{
//            alert($this.messageWrongURL);
//        }
//    });
//
//    // remove link
//    $this.unlinkBtn.addEventListener('click', function(){
//        let $target = $this.activeElement;
//        let $el = $this.findContenteditable($target);
//        if($target.constructor.name === 'HTMLAnchorElement'){
//            let text = $target.textContent;
//
//            $target.insertAdjacentText('afterend', text);
//            $target.remove();
//            $el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
//        }else{
//            alrt($this.messageNotAnchorTag);
//        }
//    });
//
//    // bold
//    $this.boldBtn.addEventListener('click', function(){
//        $this.makeTextDecoration('b', 'B', 'bold');
//    });
//
//    $this.italicBtn.addEventListener('click', function(){
//        $this.makeTextDecoration('i', 'I', 'italic');
//    });
//
//    $this.underlineBtn.addEventListener('click', function(){
//        $this.makeTextDecoration('u', 'U', 'underline');
//    });
//
//    $this.strikeBtn.addEventListener('click', function(){
//        $this.makeTextDecoration('s', 'S', 'strike');
//    });
//
//    $this.wordblockBtn.addEventListener('click', function(){
//        if(window.getSelection().focusNode === window.getSelection().baseNode){
//            let $target = $this.activeElement;
//            let elName = $target.tagName;
//            let $el = $this.findContenteditable($target);
//            let text = $target.textContent;
//
//            if(elName === 'CODE'){
//                $target.insertAdjacentText('afterend', text);
//                $target.remove();
//                $el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
//                $this.activeElement = $this.wrap;
//            }else{
//                $this.wrapElement('wordblock');
//            }
//        }else{
//            alert($this.messageWrongNode);
//        }
//    });
//
//
//    // image width
//    $this.widthInput.addEventListener('keyup', function(e){
//        if(e.key === 'Enter'){
//            let value = this.value;
//            let $el = $this.getEl('.lastset .img');
//            let massage = $this.messageExceedSize.replace('[size]', $this.maxImageWidth);
//
//            if($el !== false){
//                if($this.numberReg.test(value)){
//                    if(value <= $this.maxImageWidth){
//                        $el.setAttribute('width', value);
//                    }else{
//                        alert(massage);
//                        this.value = $this.maxImageWidth;
//                        $el.setAttribute('width', $this.maxImageWidth);
//                    }
//                    let offset = $this.getEl('.lastset').getBoundingClientRect();
//                    $this.openOptionPop(offset, 'img');
//                }else{
//                    alert($this.messageWrongValue);
//                }
//            }else{
//                alert($this.messageNotSelecImage);
//            }
//        }
//    });
//
//    // codepen height
//    $this.heightInput.addEventListener('keyup', function(e){
//        if(e.key === 'Enter'){
//            let value = this.value;
//            let $el = $this.getEl('.lastset .iframe');
//            let massage = $this.messageExceedSize.replace('[size]', $this.maxCodepenHeight);
//            
//            if($el !== false){
//                if($this.numberReg.test(value)){
//                    if(value <= $this.maxCodepenHeight){
//                        $el.setAttribute('height', value);
//                    }else{
//                        alert(massage);
//                        this.value = $this.maxCodepenHeight;
//                        $el.setAttribute('height', $this.maxCodepenHeight);
//                    }
//                    let offset = $this.getEl('.lastset').getBoundingClientRect();
//                    $this.openOptionPop(offset, 'codepen');
//                }else{
//                    alert($this.messageWrongValue);
//                }
//            }else{
//                alert($this.messageNotSelecCodepen);
//            }
//        }
//    });
//
//    // list type
//    $this.listTypeSelect.addEventListener('change', function(){
//        let value = this.value;
//        let $el = $this.getEl('.lastset');
//
//        if($el !== false){
//            $el.setAttribute('type', value);
//        }
//    });
//
//    // col size
//    $this.colSizeSelect.addEventListener('change', function(){
//        let value = this.value;
//        let elName = $this.activeElement.constructor.name
//        let $el = $this.getEl('.lastset');
//
//        if((elName === 'HTMLTableCellElement' || elName === 'HTMLTableCaptionElement') && $el !== false){
//            let x = parseInt($this.activeElement.dataset['x']) +1
//            let col = $el.querySelector(`col:nth-child(${x})`);
//            let className = $this.getClassName(col.classList.value, 'size');
//
//            col.classList.remove(className);
//            col.classList.add(value);
//        }
//    });
//
//    // codeblock theme
//    $this.themeSelect.addEventListener('change', function(){
//        let value = this.value;
//        let $el = $this.getEl('.lastset');
//
//        if($el !== false){
//            $el.dataset['theme'] = value;
//        }
//    });
//
//    // codeblock language
//    $this.languageSelect.addEventListener('change', function(){
//        let value = this.value;
//        let $el = $this.getEl('.lastset');
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
//    $this.changeThBtn.addEventListener('click', function(){
//        $this.changeCell('th');
//    });
//
//    $this.changeTdBtn.addEventListener('click', function(){
//        $this.changeCell('td');
//    });
//
//    // text align
//    $this.textAlgin.forEach(function(item){
//        item.addEventListener('click', function(){
//            let type = this.dataset['value'];
//            let $target = $this.findContenteditable($this.activeElement) === false ? $this.findParent($this.activeElement, 'item') : $this.findContenteditable($this.activeElement);
//            let className = $this.getClassName($target.classList.value, 'align');
//
//            if(className !== ''){
//                $target.classList.remove(className);
//            }
//            $target.classList.add(type);
//        });
//    });
//
//    // url change
//    $this.changeUrlBtn.addEventListener('click', function(){
//        let url = $this.urlInput.value;
//        let $el = $this.getEl('.lastset');
//        let type = $el.dataset['type'];
//
//        switch(true){ // not default
//            case $this.urlReg.test(url) === false :
//                alert($this.messageWrongURL);
//            break;
//            case $el === undefined :
//                alert($this.messageNotSelect);
//            break;
//            case type === 'youtube' :
//                if($this.youtubeReg.test(url)){
//                    let video = $el.querySelector('.video');
//                    video.setAttribute('src', url);
//                }else{
//                    alert($this.messageWrongUrlType);
//                }
//            break;
//            case type === 'codepen' :
//                if($this.codepenReg.test(url)){
//                    let iframe = $el.querySelector('.iframe');
//                    iframe.setAttribute('src', url);
//                }else{
//                    alert($this.messageWrongUrlType);
//                }
//            break;
//            case type === 'btn' :
//                let btnValue = $el.dataset['value'];
//
//                if(btnValue === 'youtube'){
//                    $this.addYoutube($el, url);
//                    $el.remove();
//                    $this.activeElement = $this.contentArea;
//                }else if(btnValue === 'codepen'){
//                    $this.addCodepen($el, url);
//                    $el.remove();
//                    $this.activeElement = $this.contentArea;
//                }
//            break;
//        }
//    });
//
//    // 파일 업로드
//    $this.fileInput.addEventListener('change', function(){
//        let contentArea = $this.contentArea;
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
//        $this.ajax('post', $this.mediaUploadURL, form, 'form', (result) => {
//            if(result['result'] === true){
//                let $el = $this.getEl('.lastset') === false ? $this.getEl(`${$this.contentAreaName} > *:nth-last-child(1)`) : $this.getEl('.lastset');
//                let imgList = result['list'];
//                let html = '';
//
//                for(let item of imgList){
//                    let webp = item['webp'] === 'y' ? true : false;
//                    html += $this.HTMLMediaRow.replace(/\[idx\]/g, item['idx'])
//                        .replace('[webp]', webp)
//                        .replace('[height]', item['height'])
//                        .replace('[width]', item['width'])
//                        .replace('[src]', `${item['src']}${item['name']}.${item['format']}`)
//                        .replace('[alt]', item['alt'])
//                        .replace('[name]', item['alt']);
//
//                    $this.addImage($el, {
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
//                $this.mediaList.insertAdjacentHTML('beforeend', html);
//                $this.popMedia.classList.add('act');
//                this.value = '';
//            }else{
//                alert(result['message']);
//            }
//        });
//    });
//
//    // add media
//    $this.addMediaListBtn.addEventListener('click', function(){
//        $this.fileInput.dataset['type'] = 'image';
//        $this.fileInput.setAttribute('accept', 'image/*');
//        $this.fileInput.click();
//    });
//
//    // media content
//    $this.popMedia.addEventListener('click', function(e){
//        let $target = e.target;
//        let row = $this.findParent($target, 'btn_add_media');
//        let $p = this.querySelector('*[contenteditable]');
//        let data;
//        
//        switch($target.tagName){
//            case 'IMG' : 
//                let src = $target.getAttribute('src');
//                let $el = $this.getEl('.lastset') === false ? $this.getEl(`${$this.contentAreaName} > *:nth-last-child(1)`) : $this.getEl('.lastset');
//
//                data = {
//                    'width' : $target.getAttribute('width'),
//                    'height' : $target.dataset['height'],
//                    'webp' : row.dataset['webp'],
//                    'alt' : row.querySelector('.name').textContent,
//                    'src' : src.replace($this.srcReg, '$1'),
//                    'format' : src.replace($this.srcReg, '$2')
//                }
//
//                $this.addImage($el, data);
//            break;
//            case 'P' : 
//                if($p !== null){
//                    row = $this.findParent($p, 'btn_add_media');
//                    $p.removeAttribute('contenteditable');
//                    data = {
//                        'idx' : row.dataset['idx'],
//                        'textContent' : $p.textContent
//                    };
//
//                    //ajax
//                    $this.ajax('post', $this.mediaUpdateURL, data, 'json', function(result){
//                        if(result['result'] === true){
//                            let src = row.querySelector('.img').getAttribute('src');
//                            $this.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
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
//                if($target.classList.contains($this.addMediaListBtnName.substring(1)) === false){
//                    let idx = row.dataset['idx'];
//                    let message = confirm($this.messageDelImage);
//                    //'작성중인 내용 안의 이미지도 전부 삭제됩니다.\n정말로 삭제하시겠습니까?'
//
//                    if(message === true){
//                        //ajax
//                        $this.ajax('delete', `${$this.mediaDelURL}/${idx}`, [], 'form', function(result){
//                            if(result['result'] === true){
//                                let src = row.querySelector('.img').getAttribute('src');
//                                $this.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
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
//                    row = $this.findParent($p, 'btn_add_media');
//                    data = {
//                        'idx' : row.dataset['idx'],
//                        'textContent' : $p.textContent
//                    };
//                    $p.removeAttribute('contenteditable');
//
//                    //ajax
//                    $this.ajax('post', $this.mediaUpdateURL, data, 'json', function(result){
//                        if(result['result'] === true){
//                            let src = row.querySelector('.img').getAttribute('src');
//                            $this.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
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
//    $this.popMedia.addEventListener('keydown', function(e){
//        if(e.key === 'Enter'){
//            e.preventDefault();
//            let row = $this.findParent(e.target, 'btn_add_media');
//            let textContent = e.target.textContent;
//            let data = {
//                'idx' : row.dataset['idx'],
//                'textContent' : textContent
//            };
//
//            //ajax
//            $this.ajax('post', $this.mediaUpdateURL, data, 'json', function(result){
//                if(result['result'] === true){
//                    let src = row.querySelector('.img').getAttribute('src');
//                    $this.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
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
//    $this.languageChangeBtn.forEach(function(btn){
//        btn.addEventListener('click', function(){
//            let prevLang = $this.langStatus;
//            let contentData = $this.getJsonData();
//            let lang = this.dataset['value'];
//            let jsonData = $this.contentData[lang];
//            $this.langStatus = lang;
//
//            $this.languageChangeBtn.forEach(function(btn){
//                btn.classList.remove('act');
//            });
//            this.classList.add('act');
//
//            if(jsonData.length > 0){
//                $this.setContent(jsonData);
//            }else{
//                let message = confirm($this.messageDuplicateContent);
//
//                if(message === true){
//                    $this.setContent(contentData[prevLang]);
//                }else{
//                    $this.setContent([
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