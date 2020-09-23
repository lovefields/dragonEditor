const { typeCheckThrow, fetchURL, isMobile } = require("./default");
const { setMediaList, getImageBlockHTML, addBlockToContent } = require("./layout");

export function openFile(type, _0 = typeCheckThrow(type, "string")) {
    switch (type) {
        case "imageBlock":
            condition.uploadForm.dataset["type"] = "image";
            condition.uploadInput.setAttribute("accept", "image/*");
            break;
        default:
            condition.uploadForm.dataset["type"] = "default";
            condition.uploadInput.removeAttribute("accept");
    }

    condition.uploadInput.click();
}

export async function fileUpload() {
    let $form = condition.uploadForm;
    let formData = new FormData($form);

    formData.append("type", $form.dataset["type"]);
    formData.append("articleIdx", condition.articleIdx);
    formData.append("articleTempIdx", condition.articleTempIdx);

    let request = await fetchURL(condition.uploadURL, {
        method: "POST",
        body: formData,
        mode: "no-cors",
    });

    if (request.respon == true) {
        setMediaList(request.list);

        request.list.forEach((item) => {
            let setWidth = 700;
            let block;

            if (isMobile() == true) {
                setWidth = 300;
            } else {
                if (item.width < item.height) {
                    setWidth = 400;
                }
            }
            block = getImageBlockHTML(item, setWidth);

            addBlockToContent(block);
        });
    } else {
        alert(request.error.message);
    }
}
