export * from "./block";
export * from "./cursor";
export * from "./node";

// 난수 아이디 생성
export function _generateId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";

    for (let i = 0; i < 6; i += 1) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return str;
}

// 배열이 동일한지 확인
export function _isStrictlyEqualArrays(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }

    return arr1.every((value, index) => value === arr2[index]);
}

// 에디팅 엘리먼트 내부 구조를 텍스트로 추출
export function _getEditingElementTextContent($element: HTMLElement): string {
    let value: string = "";

    if ($element.textContent !== "") {
        $element.childNodes.forEach(($node) => {
            if ($node.nodeType === Node.TEXT_NODE) {
                const text = $node.textContent || "";

                value += text.replaceAll(/&/g, "&amp;").replaceAll(/</g, "&lt;").replaceAll(/>/g, "&gt;");
            } else {
                value += ($node as HTMLElement).outerHTML;
            }
        });
    }

    return value;
}
