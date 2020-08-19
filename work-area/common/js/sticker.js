import { removeLastsetClass } from './element';

export function addSticker($target, sticker){
    removeLastsetClass($target);
    let html = storage.HTMLsticker.replace('[el]', sticker.innerHTML);
    $target.insertAdjacentHTML('afterend', html);
}