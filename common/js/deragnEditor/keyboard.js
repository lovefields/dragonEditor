import { findParent } from './selector';
import { addTextBlock } from './phrase';

export function keybroadControl(event){
    let key = event.key;
    let shift = event.shiftKey;
    let $activeEl = document.activeElement.constructor.name === 'HTMLBodyElement' ? false : document.activeElement;
    let $item = findParent($activeEl, 'item');

    if($activeEl !== false){
        storage.activeElement = document.activeElement;
    }

    switch(true){
        case key === 'Enter' && $activeEl !== false :
            let tagName = $activeEl.tagName;

            if(shift !== true){
                if(tagName === 'LI'){
                    event.preventDefault();

                    let text = $activeEl.textContent;

                    if(text === ''){
                        let count = $item.querySelectorAll('li').length;

                        addTextBlock($item);
                        if(count > 1){
                            $activeEl.remove();
                        }
                    }else{
                        $activeEl.insertAdjacentHTML('afterend', storage.HTMLChildList.replace('[content]', ''));
                        $activeEl.nextElementSibling.focus();
                    }
                }else{
                    event.preventDefault();
                    addTextBlock($item);
                }
            }
        break;
        case key === 'Tab' && $activeEl !== false:
            if(shift === true){
                if($activeEl.classList.contains('title') === true){
                    event.preventDefault();
                }
            }else{
                let $lastItem = storage.contentArea.querySelector('.item:nth-last-child(1)');
                if($lastItem === $item){
                    event.preventDefault();
                }
            }
        break;
    }
}