"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const converter_1 = require("./converter");
console.log(converter_1.test);
const DragonEditor = {
    component: () => {
        return "VUE compoenet return";
    },
    binding: (areaClassName) => {
        console.log(areaClassName);
    },
    getText: (name) => {
        return `Hello ${converter_1.test || 'world'}`;
    }
};
exports.default = DragonEditor;
//# sourceMappingURL=index.js.map