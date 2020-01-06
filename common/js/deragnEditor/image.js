import { removeLastsetClass } from './element';
<<<<<<< HEAD
=======
import { getEl, getElList, findParent } from './selector';

export function changeImageWidth(parent, width){
    let $el = getEl('.lastset .img');
    let massage = storage.messageExceedSize.replace('[size]', storage.maxImageWidth);

    if($el !== null){
        if(storage.numberReg.test(width)){
            if(width <= storage.maxImageWidth){
                $el.setAttribute('width', width);
            }else{
                alert(massage);
                parent.value = storage.maxImageWidth;
                $el.setAttribute('width', storage.maxImageWidth);
            }
            let offset = getEl('.lastset').getBoundingClientRect();
            openOptionPop(offset, 'img');
        }else{
            alert(storage.messageWrongValue);
        }
    }else{
        alert(storage.messageNotSelecImage);
    }
}
>>>>>>> e55148af9b8d6bf84ae3fed6c00ad8ca3a9e0149

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