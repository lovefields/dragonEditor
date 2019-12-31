import { getEl, getElList, findParent } from './selector';

export function getLastSetOrFocus($target){
    let $activeEl = document.activeElement;
    let $item, $btn = null;

    if($activeEl.constructor.name !== 'HTMLBodyElement'){
        switch(storage.activeElement.constructor.name){
            case 'HTMLSpanElement' :
                $item = storage.activeElement;
            break;
            case 'HTMLElement' :
                $item = storage.activeElement;
            break;
            case 'HTMLAnchorElement' :
                $item = storage.activeElement;
            break;
            case 'Text' :
                $item = findParent(storage.activeElement.parentElement, 'item');
            break;
            default :
                $item = findParent(storage.activeElement, 'item');
        }
    }else{
        $item = findParent($target, 'item');
        $btn = $item === null ? findParent($target, 'btn') : $item;
    }
    let $el = $item === null ? $btn : $item;
    return $el;
}

export function setLastElement($target, children){
    let $item = findParent($target, 'item') === null ? findParent($target, 'btn') : findParent($target, 'item');
    children.forEach(function($child){
        $child.classList.remove('lastset');
    });
    $item.classList.add('lastset');
}

export function getClassName(text, type){
    if(storage.classList.indexOf(type) >= 0){
        let value = text.match(storage.classReg[type]);

        if(text !== '' && value !== null){
            return value[0];
        }else{
            return '';
        }
    }else{
        console.warn(`You send wrong type name : [${type}]`);
    }
}

export function removeLastsetClass($target){
    if($target.classList.contains('lastset') === true){
        $target.classList.remove('lastset');
    }
}