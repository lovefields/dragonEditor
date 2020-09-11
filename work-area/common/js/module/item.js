const { typeCheckThrow } = require("./default");

export function itemClickEvent(e, _0 = typeCheckThrow(e, Event)) {
    console.log(e);
}

export function itemKeyboardEvent(e, _0 = typeCheckThrow(e, Event)) {}
