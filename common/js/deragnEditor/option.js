import { findParent } from './selector';
import { getClassName } from './element';

export function openOptionPop(offset, type){
    let $child = storage.popOptions.querySelectorAll('.col');
    let typeReg = new RegExp(type, 'i');
    let width = 0;

    storage.popOptions.classList.add('act');
    storage.popOptions.querySelector('.pop').classList.remove('act');

    if($child !== null){
        $child.forEach(function($col){
            let type = $col.dataset['group'];

            switch(true){
                case type === 'all' :
                    $col.classList.add('act');
                    width += $col.getBoundingClientRect().width;
                break;
                case typeReg.test(type) === true :
                    $col.classList.add('act');
                    width += $col.getBoundingClientRect().width;
                break;
                case typeReg.test(type) === false :
                    $col.classList.remove('act');
                break;
            }
        })
    }

    let optionsOffset = storage.popOptions.getBoundingClientRect();
    let y = Math.floor(offset.top - optionsOffset.height);
    let x =  Math.floor((storage.windowWidth - storage.popOptions.getBoundingClientRect().width) / 2);
    if(storage.windowWidth > storage.changePint){
        storage.popOptions.style.cssText = 'transform:translate('+ x +'px, '+ y +'px)';
    }else{
        storage.popOptions.removeAttribute('style');
        storage.popOptions.querySelector('.scroll').style.width = `${width}px`;
    }
}

export function checkOptionsValue($el){
    let $target = findParent($el, 'item');
        $target = $target === null ? findParent($el, 'btn') : $target;
    let $activeEl = storage.activeElement;

    if($target !== null){
        let type = $target.dataset['type'];
        let activeElName = $activeEl.constructor.name;
        let targetClassList = $target.classList.value;
        let activeClassList = $activeEl.classList.value;

        storage.urlInput.value = '';
        switch(type){ // not default
            case 'text' :
                let colorClass = getClassName(targetClassList, 'color');
                let sizeClass = getClassName(targetClassList, 'size');

                if(colorClass !== ''){
                    storage.btnColorSelect.dataset['class'] = colorClass;
                }else{
                    storage.btnColorSelect.dataset['class'] = 'default';
                }

                if(sizeClass !== ''){
                    storage.fontSizeSelect.value = sizeClass;
                }else{
                    storage.fontSizeSelect.value = 'default';
                }
            break;
            case 'image' :
                let size = $target.querySelector('.img').getAttribute('width');
                storage.widthInput.value = size;
            break;
            case 'youtube' :
                if($target.classList.contains('btn') === false){
                    let src = $target.querySelector('.video').getAttribute('src');
                    storage.urlInput.value = src;
                }else{
                    storage.urlInput.value = '';
                }
            break;
            case 'codepen' :
                if($target.classList.contains('btn') === false){
                    let $el = $target.querySelector('.iframe');
                    let src = $el.getAttribute('src');
                    let height = $el.getAttribute('height');
                    storage.urlInput.value = src;
                    storage.heightInput.value = height;
                }else{
                    storage.urlInput.value = '';
                    storage.heightInput.value = '';
                }
            break;
            case 'list_o' :
                let listType = $target.getAttribute('type');
                storage.listTypeSelect.value = listType;
            break;
            case 'codeblock' :
                let theme = $target.dataset['theme'];
                let lang = $target.dataset['lang'];
                let codeSizeClass = getClassName(targetClassList, 'size');

                if(codeSizeClass !== ''){
                    storage.fontSizeSelect.value = codeSizeClass;
                }else{
                    storage.fontSizeSelect.value = 'default';
                }

                storage.themeSelect.value = theme;
                storage.languageSelect.value = lang;
            break;
        }

        switch(true){
            case activeElName === 'HTMLAnchorElement' :
                let url = $activeEl.getAttribute('href');
                storage.urlInput.value = url;
            break;
            case (activeElName === 'HTMLTableCellElement' || activeElName === 'HTMLTableCaptionElement') && $target.dataset['type'] === 'table':
                if(activeElName === 'HTMLTableCellElement'){
                    let colNumber = parseInt($activeEl.dataset['x']) + 1;
                    let tableClass = $target.querySelector('col:nth-child('+ colNumber +')').classList.value;
                    storage.colSizeSelect.value = getClassName(tableClass, 'size');
                }

                let cellColor = getClassName(activeClassList, 'color');
                let cellFront = getClassName(activeClassList, 'size');

                if(cellColor !== ''){
                    storage.btnColorSelect.dataset['class'] = cellColor;
                }else{
                    storage.btnColorSelect.dataset['class'] = 'default';
                }

                if(cellFront !== ''){
                    storage.fontSizeSelect.value = cellFront;
                }else{
                    storage.fontSizeSelect.value = 'default';
                }
            break;
            case activeElName === 'HTMLSpanElement' || activeElName === 'HTMLElement':
                let className = getClassName(activeClassList, 'color');

                if(className !== ''){
                    storage.btnColorSelect.dataset['class'] = className;
                }else{
                    storage.btnColorSelect.dataset['class'] = 'default';
                }
            break;
            case activeElName === 'HTMLLIElement' :
                let colorClass = getClassName(activeClassList, 'color');
                let sizeClass = getClassName(activeClassList, 'size');

                if(colorClass !== ''){
                    storage.btnColorSelect.dataset['class'] = colorClass;
                }else{
                    storage.btnColorSelect.dataset['class'] = 'default';
                }

                if(sizeClass !== ''){
                    storage.fontSizeSelect.value = sizeClass;
                }else{
                    storage.fontSizeSelect.value = 'default';
                }
            break;
        }
    }
}