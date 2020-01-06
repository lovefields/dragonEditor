import { removeLastsetClass } from './element';

export function addImage($target, data, position = 'afterend'){
    removeLastsetClass($target);
    let html;
    let width;

    if(((100 / data.width) * data.height) > 100){
        width = 300;
    }else{
        width = data.width;
    }

    if(width > storage.maxImageWidth){
        width = storage.maxImageWidth;
    }

    if(storage.useWebp === true == true){
        html = storage.HTMLImageType01.replace('[src]', `${data.src}.${data.format}`)
                .replace('[alt]', data.alt)
                .replace('[width]', width);

        if(data.webp === true){
            let source = storage.HTMLImageSource.replace('[webp]', `${data.src}.webp`);
            html = html.replace('[source]', source);
        }else{
            html = html.replace('[source]', '');
        }
    }else{
        html = storage.HTMLImageType02.replace('[src]', `${data.src}.${data.format}`)
            .replace('[alt]', data.alt)
            .replace('[width]', width);
    }

    $target.insertAdjacentHTML(position, html);
}