export function getIcon(nameOrPath: string) {
    let structure: string = `<svg viewBox="0 0 64 64">`;

    switch (nameOrPath) {
        case "plus":
            structure += `<path d="M32 9C30.3431 9 29 10.3431 29 12V29H12C10.3431 29 9 30.3431 9 32C9 33.6569 10.3431 35 12 35H29V52C29 53.6569 30.3431 55 32 55C33.6569 55 35 53.6569 35 52V35H52C53.6569 35 55 33.6569 55 32C55 30.3431 53.6569 29 52 29H35V12C35 10.3431 33.6569 9 32 9Z"></path>`;
            break;
        default:
            structure += nameOrPath;
    }

    structure += `</svg>`;

    return structure;
}
