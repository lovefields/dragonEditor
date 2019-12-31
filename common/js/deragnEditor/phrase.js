import { removeLastsetClass } from './element';

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