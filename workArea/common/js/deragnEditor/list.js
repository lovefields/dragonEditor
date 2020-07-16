import { removeLastsetClass } from './element';

export function addList($target, tag, type = null, content = ''){
    removeLastsetClass($target);
    let dataType;
    if(tag === 'ol'){
        dataType = 'list_o';
    }else{
        dataType = 'list_u';
    }
    let attribute = type === null ? '' : 'type="'+ type +'"';
    let child = storage.HTMLChildList.replace(/\[content\]/g, content);
    let html = storage.HTMLList.replace(/\[tag\]/g, tag)
                .replace('[dataType]', dataType)
                .replace('[type]', attribute)
                .replace('[child]', child);

    $target.insertAdjacentHTML('afterend', html);
    $target.nextElementSibling.children[0].focus();
}