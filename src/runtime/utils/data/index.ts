export * from "./block";

// 난수 아이디 생성
export function _generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 6; i += 1) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

// function __isMultiline(element: HTMLElement) {
//     const { height } = element.getBoundingClientRect();
//     const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
//     const padding = parseFloat(window.getComputedStyle(element).paddingTop) + parseFloat(window.getComputedStyle(element).paddingBottom);

//     return height - padding > lineHeight;
// }
