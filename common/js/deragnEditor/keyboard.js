import { findParent, findContenteditable } from './selector';
import { addTextBlock } from './phrase';
import { openOptionPop } from './option';
import { setCursor } from './cursor';

export async function keybroadControl(event){
    let selection = window.getSelection();
    let key = event.key;
    let shift = event.shiftKey;
    let $activeEl = document.activeElement.constructor.name === 'HTMLBodyElement' ? false : document.activeElement;
    let $editableEl = findContenteditable($activeEl);
    let $item = findParent($activeEl, 'item');
    let tagName = $activeEl.tagName;
    let textContent = $activeEl.textContent;

    if($activeEl !== false){
        storage.activeElement = storage.activeElement;
    }

    switch(true){
        case key === 'Enter' && $activeEl !== false :
            if(shift !== true){
                event.preventDefault();
                if(storage.enterCount === 0){
                    if(textContent === ''){
                        if(tagName === 'LI'){
                            let count = $item.querySelectorAll('li').length;

                            addTextBlock($item);
                            if(count > 1){
                                $activeEl.remove();
                            }
                            let $target = $item.nextElementSibling;
                            storage.activeElement = $target;
                            openOptionPop($target.getBoundingClientRect(), 'text');
                        }else{
                            addTextBlock($item);
                            let $target = $item.nextElementSibling;
                            storage.activeElement = $target;
                            openOptionPop($target.getBoundingClientRect(), 'text');
                        }
                    }else{
                        if(tagName === 'LI'){
                            $activeEl.insertAdjacentHTML('afterend', storage.HTMLChildList.replace('[content]', ''));
                            setTimeout(() => {
                                $activeEl.nextElementSibling.focus();
                            }, 10);
                        }else{
                            addTextBlock($item);
                            let $target = $item.nextElementSibling;
                            storage.activeElement = $target;
                            openOptionPop($target.getBoundingClientRect(), 'text');
                        }
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
            if((selection.focusOffset === 0 && selection.baseOffset === 0) && (selection.focusNode === $item.childNodes[0] || selection.focusNode === $item || $activeEl.tagName === 'LI')){
                event.preventDefault();
                let $prevEl = $item.previousElementSibling;
                let $prevElChild = $prevEl.childNodes;
                let prevElChildCount = $prevElChild.length;
                let prevElTagName = $prevEl.tagName;

                if(textContent === ''){
                    if(tagName === 'P' && $item.tagName !== 'BLOCKQUOTE'){
                        if(prevElTagName === 'UL' || prevElTagName === 'OL'){
                            let $list = $prevEl.children;
                            let $listCount = $prevEl.childElementCount;
                            let $target = $list[$listCount - 1];
                            let $nodeList = $target.childNodes;
                            let nodeListCount = $nodeList.length;
    
                            if(nodeListCount > 0){
                                let $target = $nodeList[nodeListCount -1];
                                setCursor($target, $target.length);
                            }else{
                                setCursor($target, 0);
                            }
                            $item.remove();
                            $prevEl.classList.add('lastset');

                            if(prevElTagName === 'UL'){
                                openOptionPop($prevEl.getBoundingClientRect(), 'list_u');
                            }else if(prevElTagName === 'OL'){
                                openOptionPop($prevEl.getBoundingClientRect(), 'list_o');
                            }
                        }else if(prevElTagName === 'P'){
                            if(prevElChildCount > 0){
                                let $target = $prevElChild[prevElChildCount -1];
                                setCursor($target, $target.length);
                            }else{
                                setCursor($prevEl, 0);
                            }
                            $item.remove();
                            $prevEl.classList.add('lastset');
                            openOptionPop($prevEl.getBoundingClientRect(), 'text');
                        }
                        storage.activeElement = $prevEl;
                    }else if(tagName === 'LI'){
                        let $li = $editableEl.previousElementSibling;
                        let liCount = $item.querySelectorAll('li').length;

                        if($li === null){
                            let $target,position,type,move = false;
                            if(prevElTagName === 'P'){
                                if(prevElChildCount > 0){
                                    $target = $prevElChild[prevElChildCount -1];
                                    position = $target.length;
                                }else{
                                    $target = $prevEl;
                                    position = 0;
                                }
                                type = 'text';
                                move = true;
                            }else if(prevElTagName === 'UL' || prevElTagName === 'OL'){
                                let $liChild = $prevEl.querySelector('li:last-child').childNodes;
                                let liChildCount = $liChild.length;

                                if(liChildCount > 0){
                                    $target = $liChild[liChildCount - 1];
                                    position = $target.length;
                                }else{
                                    $target = $prevEl.querySelector('li:last-child');
                                    position = 0;
                                }

                                if(prevElTagName === 'UL'){
                                    type = 'list_u';
                                }else if(prevElTagName === 'OL'){
                                    type = 'list_o';
                                }
                                move = true;
                            }

                            if(move === true){
                                setCursor($target, position);

                                if(liCount > 1){
                                    $editableEl.remove();
                                }else{
                                    $item.remove();
                                }
                                openOptionPop($prevEl.getBoundingClientRect(), type);
                                storage.activeElement = $prevEl;
                            }
                        }else{
                            let $liNodeList = $li.childNodes;
                            let liNodeListCount = $liNodeList.length;

                            if(liNodeListCount > 0){
                                let $target = $liNodeList[liNodeListCount -1];
                                setCursor($target, $target.length);
                            }else{
                                setCursor($li, 0);
                            }
                            $editableEl.remove();
                            storage.activeElement = $li;
                        }
                    }
                }else{
                    if(tagName === 'P' && $item.tagName !== 'BLOCKQUOTE'){
                        let html = $item.innerHTML;
                        if(prevElTagName === 'UL' || prevElTagName === 'OL'){
                            let $list = $prevEl.children;
                            let $listCount = $prevEl.childElementCount;
                            let $target = $list[$listCount - 1];
                            let $nodeList = $target.childNodes;
                            let nodeListCount = $nodeList.length;
                            let nodeNumber = nodeListCount -1;
                            let position = $nodeList[nodeNumber].length;
                            $target.innerHTML += html;
    
                            if(nodeListCount > 0){
                                $target = $target.childNodes[nodeNumber];
                                setCursor($target, position);
                            }else{
                                setCursor($prevEl, 0);
                            }
                            $item.remove();
                            $prevEl.classList.add('lastset');

                            if(prevElTagName === 'UL'){
                                openOptionPop($prevEl.getBoundingClientRect(), 'list_u');
                            }else if(prevElTagName === 'OL'){
                                openOptionPop($prevEl.getBoundingClientRect(), 'list_o');
                            }
                        }else if(prevElTagName === 'P'){
                            if(prevElChildCount > 0){
                                let nodeNumber = prevElChildCount -1;
                                let position = $prevElChild[nodeNumber].length;
                                $prevEl.innerHTML += html;
                                let $target = $prevEl.childNodes[nodeNumber];
                                setCursor($target, position);
                            }else{
                                setCursor($prevEl, 0);
                            }
                            $item.remove();
                            $prevEl.classList.add('lastset');
                            openOptionPop($prevEl.getBoundingClientRect(), 'text');
                        }
                        storage.activeElement = $prevEl;
                    }else if(tagName === 'LI'){
                        let html = $editableEl.innerHTML;
                        let $li = $editableEl.previousElementSibling;
                        let liCount = $item.querySelectorAll('li').length;

                        if($li === null){
                            let $target,position,type,move = false;
                            if(prevElTagName === 'P'){
                                $prevEl.innerHTML += html;
                                if(prevElChildCount > 0){
                                    $target = $prevEl.childNodes[prevElChildCount -1];
                                    position = $prevElChild[prevElChildCount -1].length;
                                }else{
                                    $target = $prevEl;
                                    position = 0;
                                }
                                type = 'text';
                                move = true;
                            }else if(prevElTagName === 'UL' || prevElTagName === 'OL'){
                                let $lastLi = $prevEl.querySelector('li:last-child');
                                let $liChild = $lastLi.childNodes;
                                let liChildCount = $liChild.length;
                                let cursorPosition = $liChild[liChildCount - 1].length;
                                $lastLi.innerHTML += html;

                                if(liChildCount > 0){
                                    $target = $lastLi.childNodes[liChildCount - 1];
                                    position = cursorPosition;
                                }else{
                                    $target = $prevEl.querySelector('li:last-child');
                                    position = 0;
                                }

                                if(prevElTagName === 'UL'){
                                    type = 'list_u';
                                }else if(prevElTagName === 'OL'){
                                    type = 'list_o';
                                }
                                move = true;
                            }

                            if(move === true){
                                setCursor($target, position);

                                if(liCount > 1){
                                    $editableEl.remove();
                                }else{
                                    $item.remove();
                                }
                                openOptionPop($prevEl.getBoundingClientRect(), type);
                                storage.activeElement = $prevEl;
                            }
                        }else{
                            let $liNodeList = $li.childNodes;
                            let liNodeListCount = $liNodeList.length;
                            let position = $liNodeList[liNodeListCount -1].length;
                            $li.innerHTML += html;

                            if(liNodeListCount > 0){
                                let $target = $li.childNodes[liNodeListCount - 1];
                                setCursor($target, position);
                            }else{
                                setCursor($li, 0);
                            }
                            $editableEl.remove();
                            storage.activeElement = $li;
                        }
                    }
                }
            }
        break;
        case key === 'Delete':
            
        break;
    }
}