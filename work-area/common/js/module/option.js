const { typeCheckThrow } = require("./default");

export function getTextItemOption($node, _0 = typeCheckThrow($node, Node)) {
    let styleList = ["textStyle", "color", "fontSize", "align"];
    let attr = {
        textStyle: "",
        color: "",
        fontSize: "",
        align: "",
    };

    if ($node.constructor.name == "Text") {
        $node = $node.parentNode;
    }

    if ($node.dataset != undefined) {
        styleList.forEach((value) => {
            attr[value] = $node.dataset[value] == undefined ? "" : $node.dataset[value];
        });
    }

    return attr;
}

export function setTextItemOption($node, option, _0 = typeCheckThrow($node, Node), _1 = typeCheckThrow(option, "object")) {
    for (const [key, value] of Object.entries(option)) {
        if (value != "") {
            $node.dataset[key] = value;
        }
    }
}
