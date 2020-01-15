import { findParent } from './selector';
import { addTextBlock } from './phrase';
import { openOptionPop } from './option';

export async function keybroadControl(event){
    let selection = window.getSelection();
    let key = event.key;
    let shift = event.shiftKey;
    let $activeEl = document.activeElement.constructor.name === 'HTMLBodyElement' ? false : document.activeElement;
    let $item = findParent($activeEl, 'item');
    let tagName = $activeEl.tagName;
    let textContent = $activeEl.textContent;

    if($activeEl !== false){
        storage.activeElement = document.activeElement;
    }

    switch(true){
        case key === 'Enter' && $activeEl !== false :
            if(shift !== true){
                event.preventDefault();
                if(storage.enterCount === 0){
                    if(tagName === 'LI'){
                        if(textContent === ''){
                            let count = $item.querySelectorAll('li').length;

                            addTextBlock($item);
                            if(count > 1){
                                $activeEl.remove();
                            }
                        }else{
                            $activeEl.insertAdjacentHTML('afterend', storage.HTMLChildList.replace('[content]', ''));
                            setTimeout(() => {
                                $activeEl.nextElementSibling.focus();
                            }, 10);
                        }
                    }else{
                        addTextBlock($item);
                        let $target = $item.nextElementSibling;
                        storage.activeElement = $target;
                        openOptionPop($target.getBoundingClientRect(), 'text');
                    }
                    storage.enterCount += 1;
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
        case key === 'Backspace'&& $activeEl !== false:
            if(selection.focusOffset === 0 && selection.focusNode === $item.childNodes[0]){
                if(textContent === ''){
                    if(tagName === 'LI'){

                    }else if(tagName === 'P'){
    
                    }
                }else{
                    console.log(selection.focusNode, $activeEl.childNodes[0]);
                    console.log(selection.focusOffset === 0 , selection.focusNode === $item.childNodes[0]);
                    console.log('y');
                    if(tagName === 'LI'){

                    }else if(tagName === 'P'){
    
                    }
                }
            }
        break;
        case key === 'Delete':
        break;
    }
}