export function ajax(method,url,data,type,fn){
    let formData = new FormData();
    let xmlhttp = new XMLHttpRequest();

    if(type === 'json'){
        for(let key in data){
            formData.append(key, data[key]);
        }

        data = formData;
    }

    xmlhttp.open(method, url);

    xmlhttp.onreadystatechange = function(){
        if(xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status === 200){
            let httpData = xmlhttp.responseText;
            let item = JSON.parse(httpData);
            return item;
        }
    }

    xmlhttp.send(data);
}

export function fetchURL(url, option = {}, type = 'form'){
    let formData = new FormData();
    if(type === 'json'){
        for(let key in option.body){
            formData.append(key, option.body[key]);
        }

        option.body = formData;
    }

    return fetch(url, option).then(response => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.')
    })
}