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
