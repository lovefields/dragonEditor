// @ts-nocheck
import { editorContentType } from "../../../types";

export function convertToHTML(data: editorContentType) {
    let htmlStructure = "";

    data.forEach((row) => {
        // TODO : amp 서포트...?
        switch (row.type) {
            case "text":
                htmlStructure += `<p class="d-text-block ${row.classList.join(" ")}">${row.content}</p>`;
                break;
            case "image":
                htmlStructure += `
                <div class="d-image-block ${row.classList.join(" ")}">
                    <div class="d-image-area">
                        <img class="d-img" src="${row.src}" width="${row.width}" height="${row.height}" alt="${row.caption}" loading="lazy">
                    </div>
                `;

                if (row.caption) {
                    htmlStructure += `<p class="d-caption">${row.caption}</p>`;
                }

                htmlStructure += `</div>`;
                break;
            case "ol":
                htmlStructure += `<ol class="d-ol-block ${row.classList.join(" ")}">`;

                row.childList.forEach((child) => {
                    htmlStructure += `<li class="d-li-item ${child.classList.join(" ")}">${child.content}</li>`;
                });

                htmlStructure += `</ol>`;
                break;
            case "ul":
                htmlStructure += `<ul class="d-ul-block ${row.classList.join(" ")}">`;

                row.childList.forEach((child) => {
                    htmlStructure += `<li class="d-li-item ${child.classList.join(" ")}">${child.content}</li>`;
                });

                htmlStructure += `</ul>`;
                break;
            default:
                htmlStructure += row.innerHTML;
        }
    });

    //         <ol class="d-ol-block" v-if="row.type === 'ol'" :class="row.classList">
    //             <li class="d-li-item"></li>
    //         </ol>
    //     </template>

    return htmlStructure;
}
