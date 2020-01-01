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
            fn(item);
        }
    }

    xmlhttp.send(data);
}

export function fetchURL(url){
    return fetch(url).then(response => {
        if (response.ok) return response.json();
        throw new Error('Network response was not ok.')
    })
}