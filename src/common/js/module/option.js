const { typeCheckThrow } = require("./default");

export function setTextItemOption($node, option, _0 = typeCheckThrow($node, "node"), _1 = typeCheckThrow(option, "object")) {
    for (const [key, value] of Object.entries(option)) {
        if (value != "") {
            $node.dataset[key] = value;
        }
    }
}
