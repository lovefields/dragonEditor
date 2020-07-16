import { getEl, findParent } from './selector';
import { setCursor } from './cursor';
import { addImage } from './image';
import { fetchURL } from './api';

export async function pasteClipboard(e){
    let $target = e.target;
    let $item = findParent($target, 'item');
    let data = getDataAndKind(e.clipboardData);
    let itemType = $item.dataset['type'];

    if(data.type === 'text'){
        if(itemType === 'codeblock'){
            let code = data.value.trim();
            let $child = $item.querySelector('code');
            let text = $child.textContent;

            if(text !== ''){
                let message = confirm(storage.messageRePasteCode);

                if(message === true){
                    $child.textContent = code;
                }
            }else{
                $child.textContent = code;
            }
        }else{
            let dataArr = data.value.trim().split('\n');
            let count = dataArr.length;
            let olListReg = new RegExp(' ?\\d\\.', 'i');
            let ulListReg = new RegExp(' ?\\- ?', 'i');
            let type = 'text';
            let textOrHtml = '';

            if(count > 1){
                if(olListReg.test(data) || ulListReg.test(data)){
                    type = 'html';
                }
        
                if(type === 'html'){
                    let start = false;
                    let listType;
                    dataArr.forEach(function(row){
                        if(olListReg.test(row)){
                            if(start === false){
                                start = true;
                                listType = 'ol';
                                textOrHtml += '<ol type="1" class="item item_list lastset" data-type="list_o">';
                                textOrHtml += storage.HTMLChildList.replace('[content]', row.replace(olListReg, '').trim());
                            }else{
                                textOrHtml += storage.HTMLChildList.replace('[content]', row.replace(olListReg, '').trim());
                            }
                        }else if(ulListReg.test(row)){
                            if(start === false){
                                start = true;
                                listType = 'ul';
                                textOrHtml += '<ul class="item item_list lastset" data-type="list_u">';
                                textOrHtml += storage.HTMLChildList.replace('[content]', row.replace(ulListReg, '').trim());
                            }else{
                                textOrHtml += storage.HTMLChildList.replace('[content]', row.replace(ulListReg, '').trim());
                            }
                        }else{
                            if(start === true){
                                start = false;
                                if(listType === 'ol'){
                                    textOrHtml += '</ol>';
                                }else{
                                    textOrHtml += '</ul>';
                                }
                                textOrHtml += storage.HTMLTextBlock.replace('[content]', row);
                            }else{
                                textOrHtml += storage.HTMLTextBlock.replace('[content]', row);
                            }
                        }
                    });
                }else{
                    textOrHtml = dataArr.join('');
                }
            }else{
                textOrHtml = dataArr[0];
            }
        
            if(type === 'html'){
                $target.insertAdjacentHTML('afterend', textOrHtml);
                window.scrollTo(0, window.scrollY + 1);
            }else{
                let textContent = $target.textContent;
        
                if(textContent === ''){
                    let position = textOrHtml.length;
                    $target.textContent = textOrHtml;
                    setCursor($target.childNodes[0], position);
                }else{
                    alert('Sorry we are not ready for this.');
                }
            }
        }
    }else if(data.type === 'image'){
        let contentArea = storage.contentArea;
        let file = data.value;
        let form = new FormData();
        let type = 'image';
        let article_idx = contentArea.dataset['idx'];
        let temp_idx = contentArea.dataset['tempIdx'];

        form.append('request_type', 'upload');
        form.append('file_type', type);
        form.append('file', file);
        form.append('article_idx', article_idx);
        form.append('temp_idx', temp_idx);

        let result = await fetchURL(storage.mediaUploadURL, {
            method : 'POST',
            body : form
        });
        if(result['result'] === true){
            let $el = getEl('.lastset') === null ? getEl(`${storage.contentAreaName} > *:nth-last-child(1)`) : getEl('.lastset');
            let imgList = result['list'];
            let html = '';

            for(let item of imgList){
                let webp = item['webp'] === 'y' ? true : false;
                html += storage.HTMLMediaRow.replace(/\[idx\]/g, item['idx'])
                    .replace('[webp]', webp)
                    .replace('[height]', item['height'])
                    .replace('[width]', item['width'])
                    .replace('[src]', `${item['src']}${item['name']}.${item['format']}`)
                    .replace('[alt]', item['alt'])
                    .replace('[name]', item['alt']);

                addImage($el, {
                    'idx' : item['idx'],
                    'src' : `${item['src']}${item['name']}`,
                    'webp' : webp,
                    'format' : item['format'],
                    'alt' : item['alt'],
                    'width' : item['width'],
                    'height' : item['height']
                });
            }

            if($el.classList.contains('btn')){
                $el.remove();
            }
            storage.mediaList.insertAdjacentHTML('beforeend', html);
            storage.popMedia.classList.add('act');
        }else{
            alert(result['message']);
        }
    }
}


function getDataAndKind(data){
    if(data === false){
        return undefined;
    }
    
    let items = data.items;

    if(items === undefined){
        return undefined;
    }

    let count = items.length;
    let type,clipboardData;
    for(let i = 0;i < count;i += 1){
        if(items[i].type.indexOf('image') === 0){
            type = 'image';
            clipboardData = items[i].getAsFile();
            break;
        }

        type = 'text';
    }

    if(type === 'text'){
        clipboardData = data.getData('text');
    }

    return {
        'type' : type,
        'value' : clipboardData
    };
}