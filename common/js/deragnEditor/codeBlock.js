import { removeLastsetClass } from './element';

export function addCodeBlock($target){
    removeLastsetClass($target);
    $target.insertAdjacentHTML('afterend', storage.HTMLCodeBlock);
    $target.nextElementSibling.children[0].focus();
}