export function getEl(name) {
    let $el = document.querySelector(name);
    return $el;
}

export function getElList(name) {
    let $el = document.querySelectorAll(name);

    if($el.length < 1){
        return null;
    }else{
        return $el;
    }
}

export function findParent($el, name){
    if($el.constructor.name !== 'HTMLBodyElement' && $el.constructor.name !== 'HTMLHtmlElement'){
        let check = $el.classList.contains(name);

        if(check === true){
            return $el;
        }else{
            return findParent($el.parentElement, name);
        }
    }else{
        return null;
    }
}

export function checkElement(name, defaultName, type = 'single') {
    let $item;
    if(type ===  'single'){
        $item = typeof name !== 'string' ? getEl(defaultName) : getEl(name);
    }else{
        $item = typeof name !== 'string' ? getElList(defaultName) : getElList(name);
    }

    if($item === null){
        console.error('Can not find Element : ' + name);
    }else{
        return $item;
    }
}