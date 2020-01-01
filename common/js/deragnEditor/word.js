import { getLastSetOrFocus, setLastElement, getClassName, findContenteditable } from './element';
import { getEl, getElList, findParent } from './selector';

export function changeFontSize(size){
    let $target = storage.activeElement;
    let $el = findContenteditable($target);
    let className = getClassName($el.classList.value, 'size');

    if(size === 'default'){
        if(className !== ''){
            $el.classList.remove(className);
        }
    }else{
        if(className !== ''){
            $el.classList.remove(className);
        }
        $el.classList.add(size);
    }
}

export function changeColor(color){
    let list = ['I', 'B', 'S', 'U', 'A', 'SPAN'];
    let $activeEl = storage.activeElement;
    let tagName = $activeEl.tagName;
    let $target = findContenteditable($activeEl);

    if(window.getSelection().focusNode === window.getSelection().baseNode){
        if(list.indexOf(tagName) > 0){
            let className = getClassName($activeEl.classList.value, 'color');

            if(className !== ''){
                $activeEl.classList.remove(className);
            }
            if(color !== 'default'){
                $activeEl.classList.add(color);
            }else{
                if(tagName === 'SPAN'){
                    let text = $activeEl.textContent;

                    $activeEl.insertAdjacentText('afterend', text);
                    $activeEl.remove();
                    $target.innerHTML = $target.innerHTML;
                    storage.activeElement = storage.wrap;
                }
            }
            storage.btnColorSelect.dataset['class'] = color;
        }else{
            let className = getClassName($target.classList.value, 'color');

            if(storage.startTextCursor === storage.endTextCursor){
                if(className !== ''){
                    $target.classList.remove(className);
                }
                if(color !== 'default'){
                    $target.classList.add(color);
                }
                storage.btnColorSelect.dataset['class'] = color;
            }else{
                wrapElement('color', null, color);
            }
        }
    }else{
        alert(storage.messageWrongNode);
    }
}

export function makeLink(){
    let url = storage.urlInput.value;

    if(storage.urlReg.test(url) === true){
        let isSameNode = checkSameNode();

        if(isSameNode === true){
            wrapElement('link', url);
        }else{
            alert(storage.messageWrongNode);
        }
    }else{
        alert(storage.messageWrongURL);
    }
}

export function unLink(){
    let $target = storage.activeElement;
    let $el = findContenteditable($target);
    if($target.constructor.name === 'HTMLAnchorElement'){
        let text = $target.textContent;

        $target.insertAdjacentText('afterend', text);
        $target.remove();
        $el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
    }else{
        alrt(storage.messageNotAnchorTag);
    }
}

export function makeTextDecoration(tag, tagName, className){
    if(storage.focusNode === storage.baseNode){
        let $target = storage.activeElement;
        let elName = $target.constructor.name;
        let $el = findContenteditable($target);

        if(elName === 'HTMLAnchorElement' || elName === 'HTMLSpanElement' || elName === 'HTMLElement'){
            let classList = $target.classList;
            let count = classList.length;
            let text = $target.textContent;

            if($target.tagName === tagName){
                if(count > 0){
                    $target.insertAdjacentHTML('afterend', `<span class="${classList.value}">${text}</span>`);
                    storage.activeElement = $target.nextElementSibling;
                    $target.remove();
                }else{
                    $target.insertAdjacentText('afterend', text);
                    $target.remove();
                    $el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
                    storage.activeElement = storage.wrap;
                }
            }else if($target.tagName === 'SPAN'){
                if(count > 0){
                    $target.insertAdjacentHTML('afterend', `<${tag} class="${classList.value}">${text}</${tag}>`);
                    storage.activeElement = $target.nextElementSibling;
                    $target.remove();
                }else{
                    $target.insertAdjacentHTML('afterend', `<${tag}>${text}</${tag}>`);
                    storage.activeElement = $target.nextElementSibling;
                    $target.remove();
                }
            }else{
                if($target.classList.contains(className) === true){
                    $target.classList.remove(className);
                }else{
                    $target.classList.add(className);
                }
            }
        }else{
            if(window.getSelection().focusOffset !== window.getSelection().baseOffset){
                wrapElement(className);
            }else{
                if($target.classList.contains(className) === true){
                    $target.classList.remove(className);
                }else{
                    $target.classList.add(className);
                }
            }
        }
    }else{
        alert(storage.messageWrongNode);
    }
}

export function makeWordBlock(){
    if(window.getSelection().focusNode === window.getSelection().baseNode){
        let $target = storage.activeElement;
        let elName = $target.tagName;
        let $el = findContenteditable($target);
        let text = $target.textContent;

        if(elName === 'CODE'){
            $target.insertAdjacentText('afterend', text);
            $target.remove();
            $el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
            storage.activeElement = storage.wrap;
        }else{
            wrapElement('wordblock');
        }
    }else{
        alert(storage.messageWrongNode);
    }
}

function checkSameNode(){
    if(storage.focusNode === storage.baseNode){
        return true;
    }else{
        return false;
    }
}

function wrapElement(type, url = null, className = null){
    let text = storage.focusNode.textContent;
    let $el = findContenteditable(storage.focusNode);
    $el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
    let child = $el.childNodes;
    let count = child.length;
    let number, firstCursor, endCursor, code;
    let html = '';

    // 노드 순서 구하기
    for(let i = 0;i < count;i += 1){
        if(child[i].constructor.name === 'Text'){
            if(text === child[i].textContent){
                number = i;
                break;
            }
        }
    }

    if(storage.startTextCursor > storage.endTextCursor){
        firstCursor = storage.endTextCursor;
        endCursor = storage.startTextCursor;
    }else{
        firstCursor = storage.startTextCursor;
        endCursor = storage.endTextCursor;
    }

    switch(type){
        case 'link' :
            code = `${text.substring(0, firstCursor)}<a href="${url}" rel="nofollow">${text.substring(firstCursor, endCursor)}</a>${text.substring(endCursor)}`;
        break;
        case 'bold' :
            code = `${text.substring(0, firstCursor)}<b>${text.substring(firstCursor, endCursor)}</b>${text.substring(endCursor)}`;
        break;
        case 'italic' :
            code = `${text.substring(0, firstCursor)}<i>${text.substring(firstCursor, endCursor)}</i>${text.substring(endCursor)}`;
        break;
        case 'underline' :
            code = `${text.substring(0, firstCursor)}<u>${text.substring(firstCursor, endCursor)}</u>${text.substring(endCursor)}`;
        break;
        case 'strike' :
            code = `${text.substring(0, firstCursor)}<s>${text.substring(firstCursor, endCursor)}</s>${text.substring(endCursor)}`;
        break;
        case 'wordblock' :
            code = `${text.substring(0, firstCursor)}<code class="wordblock">${text.substring(firstCursor, endCursor)}</code>${text.substring(endCursor)}`;
        break;
        case 'color' :
            code = `${text.substring(0, firstCursor)}<span class="${className}">${text.substring(firstCursor, endCursor)}</span>${text.substring(endCursor)}`;
        break;
    }

    for(let j = 0;j < count;j += 1){
        if(j !== number){
            if(child[j].constructor.name === 'Text'){
                html += child[j].textContent;
            }else{
                html += child[j].outerHTML;
            }
        }else{
            html += code;
        }
    }

    $el.innerHTML = html;
}