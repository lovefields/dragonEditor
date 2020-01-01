import { removeLastsetClass } from './element';

export function addLinkBox($target, data, position = 'afterend'){
    removeLastsetClass($target);
    if(data.img === ''){
        data.img = storage.defaultLinkBoxImage;
    }
    let html = storage.HTMLLinkBox.replace('[url]', data.url)
                .replace('[imgSrc]', data.img)
                .replace('[title]', data.title)
                .replace('[description]', data.description)
                .replace('[domain]', data.domain);

    $target.insertAdjacentHTML(position, html);
}