import type {allBlock} from "../../types";
import {getCursor} from "./cursor";

function arrangementAlignClass(originList: string[], className: string): string[] {
    const alignClassList = ["d-align-left", "d-align-center", "d-align-right"];
    const isNotList = originList.filter(x => !alignClassList.includes(x));

    console.log(isNotList);
    console.log(originList);


    return [];
}

export function styleSettings(type: string, blockData: allBlock, $target: HTMLElement) {
    const cursorData = getCursor();
    const rawData = blockData;

    switch (type) {
        case "alignLeft" :
            rawData.classList = arrangementAlignClass(rawData.classList, "d-align-left");
            break;
        case "alignCenter" :
            rawData.classList = arrangementAlignClass(rawData.classList, "d-align-center");
            break;
        case "alignRight" :
            rawData.classList = arrangementAlignClass(rawData.classList, "d-align-right");
            break;
    }


    // console.log(type);
    // console.log(blockData);
    // console.log($target);
    // console.log(cursorData);


    return rawData;
}