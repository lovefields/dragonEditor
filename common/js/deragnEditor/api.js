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