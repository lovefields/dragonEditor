const { typeCheckThrow, fetchURL, isMobile } = require("./default");
const { setMediaList, getImageBlockHTML, addBlockToContent } = require("./layout");
const { findParentByClass, getChild } = require("./selector");

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

export async function fileUpload(data, _0 = typeCheckThrow(data, "formdata")) {
    let request = await fetchURL(condition.uploadURL, {
        method: "POST",
        body: data,
    });

    if (request.response == true) {
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

        condition.uploadInput.value = "";
    } else {
        alert(request.error.message);
    }
}

export async function mediaNameUpdate($node, _0 = typeCheckThrow($node, "node")) {
    let $field = findParentByClass($node, "djs-name");
    let $item = findParentByClass($node, "djs-media");
    let text = $field.textContent;
    let preText = $field.dataset["preText"];
    let idx = $item.dataset["idx"];

    $field.scrollTo(0, 0);
    $field.removeAttribute("contenteditable");
    $field.removeAttribute("data-pre-text");

    let request = await fetchURL(
        condition.uploadURL,
        {
            method: "PUT",
            body: {
                imageName: text,
                imageIdx: idx,
            },
        },
        "json",
    );

    if (request.response == true) {
        let $childs = getChild(condition.areaContent, `img[alt="${preText}"]`);

        $childs.forEach(($child) => {
            $child.setAttribute("alt", text);
        });
    } else {
        alert(request.error.message);
    }
}
