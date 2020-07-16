import { removeLastsetClass } from './element';

export function addYoutube($target, src, position = 'afterend'){
    removeLastsetClass($target);
    let code = src.replace(storage.youtubeCodeReg, '$7');
    let html = storage.HTMLYoutube.replace('[src]', `https://www.youtube.com/embed/${code}`);
    $target.insertAdjacentHTML(position, html);
}

export function addCodepen($target, src, position = 'afterend', height = 300){
    removeLastsetClass($target);
    let nickname = src.replace(storage.codepenCodeReg, '$2');
    let code = src.replace(storage.codepenCodeReg, '$4');
    let html = storage.HTMLCodepen.replace('[src]', `https://codepen.io/${nickname}/embed/${code}?height=${height}&theme-id=${storage.codepenTheme}&default-tab=result`).replace('[height]', height);
    $target.insertAdjacentHTML(position, html);
}