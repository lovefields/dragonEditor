import { getEl, getElList, findParent } from './selector';
import { getLastSetOrFocus, setLastElement, getClassName } from './element';
import { openOptionPop, checkOptionsValue } from './option';

export function contentCheckByMouse(target, eventType){
    if(eventType === 'click'){
        storage.activeElement = target;
    }
    let $target = getLastSetOrFocus(target);
    let base = window.getSelection().baseOffset;
    let extent = window.getSelection().extentOffset;

    if($target !== null){
        let offset = $target.getBoundingClientRect();
        let type = $target.dataset['type'];
        let $children = getElList(storage.contentAreaName + ' > *');
        let isBtn = $target.classList.contains('btn');

        switch(true){
            case $target.tagName === 'CODE' && $target.parentElement.tagName === 'PRE' :
                type = 'codeblock';
            break;
            case $target.constructor.name === 'HTMLElement' && $target.classList.contains('wordblock') :
                type = 'wordblock';
            break;
            case $target.constructor.name === 'HTMLAnchorElement' :
                type = 'link';
            break;
            case isBtn === true && eventType === 'click' :
                if(typeof $target.dataset['value'] !== 'undefined'){
                    let value = $target.dataset['value'];
                    if(value === 'image'){
                        storage.fileInput.dataset['type'] = 'image';
                        storage.fileInput.setAttribute('accept', 'image/*');
                        storage.fileInput.click();
                    }else{
                        type = value;
                    }
                }
            break;
            case window.getSelection().focusNode !== window.getSelection().baseNode :
                type = 'text';
            break;
            case base !== extent :
                if($target.tagName !== 'BLOCKQUOTE'){
                    storage.focusNode = window.getSelection().focusNode;
                    storage.baseNode = window.getSelection().baseNode;
                    storage.startTextCursor = base;
                    storage.endTextCursor = extent;
                    type = 'word';
                }
            break;
            case type === undefined :
                type = 'all';
            break;
            default : 
                type = type;
        }

        if(eventType === 'click'){
            setLastElement($target, $children);
            openOptionPop(offset, type);
        }else if(eventType === 'mouseover' && (type === 'youtube' || type === 'codepen')){
            setLastElement($target, $children);
            openOptionPop(offset, type);
        }
    }
}