import { removeLastsetClass } from './element';

export function tableConstrol($target){
    let name = $target.constructor.name;
    let classList = $target.classList;

    if(name === 'HTMLButtonElement'){
        let table = document.querySelector('.lastset .item_table');
        let colgroup = table.querySelector('colgroup');
        let colCount = table.querySelectorAll('col').length;
        let row = table.querySelectorAll('tr');
        let tbody = table.querySelector('tbody');

        switch(true){
            case classList.contains('btn_col_add') :
                row.forEach(function(item){
                    let y = item.querySelector('*:nth-child(1)').dataset['y'];

                    item.insertAdjacentHTML('beforeend', `<td contenteditable="true" data-x="${colCount}" data-y="${y}"></td>`);
                });
                colgroup.insertAdjacentHTML('beforeend', '<col class="size_100">');
            break;
            case classList.contains('btn_col_del') :
                if(colCount > 1){
                    let lastCol = colgroup.querySelector('*:last-child');

                    row.forEach(function(item){
                        let lastChild = item.querySelector('*:last-child');

                        lastChild.remove();
                    });
                    lastCol.remove();
                }
            break;
            case classList.contains('btn_row_add') :
                let html = '<tr>';

                for(let i = 0;i < colCount;i += 1){
                    html += `<td contenteditable="true" data-x="${i}" data-y="${row.length}"></td>`;
                }
                html += '</tr>';

                tbody.insertAdjacentHTML('beforeend', html);
            break;
            case classList.contains('btn_row_del') :
                if(row.length > 1){
                    tbody.querySelector('tr:last-child').remove();
                }
            break;
        }
    }
}

export function addTable($target){
    removeLastsetClass($target);
    $target.insertAdjacentHTML('afterend', storage.HTMLTable);
    $target.nextElementSibling.querySelector('caption').focus();
}