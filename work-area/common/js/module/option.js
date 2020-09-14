const { typeCheckThrow } = require("./default");

export function getTextItemOption($node, _0 = typeCheckThrow($node, Node)) {
    let styleList = ["textStyle", "color", "fontSize", "align"];
    let attr = {
        textStyle: "",
        color: "",
        fontSize: "",
        align: "",
    };

    if($node.dataset != undefined){
        styleList.forEach((value) => {
            attr[value] = $node.dataset[value] == undefined ? "" : $node.dataset[value];
        });
    }

    return attr;
}
