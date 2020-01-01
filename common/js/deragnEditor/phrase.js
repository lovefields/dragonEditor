import { removeLastsetClass, findContenteditable, getClassName } from './element';
import { getEl, getElList, findParent } from './selector';

export function addTextBlock($target, content = '', position = 'afterend'){
    removeLastsetClass($target);

    let html = storage.HTMLTextBlock.replace('[content]', content);

    $target.insertAdjacentHTML(position, html);
    $target.nextElementSibling.focus();
}

export function addQuote($target){
    removeLastsetClass($target);
    $target.insertAdjacentHTML('afterend', storage.HTMLQuote);
    $target.nextElementSibling.children[0].focus();
}

export function setTextAlgin(algin){
    let $target = findContenteditable(storage.activeElement) === null ? findParent(storage.activeElement, 'item') : findContenteditable(storage.activeElement);
    let className = getClassName($target.classList.value, 'align');

    if(className !== ''){
        $target.classList.remove(className);
    }
    $target.classList.add(algin);
}