"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var converter_1 = require("./converter");
console.log(converter_1.test);
var DragonEditor = {
    component: function () {
        return "VUE compoenet return";
    },
    binding: function (areaClassName) {
        console.log(areaClassName);
    },
    getText: function (name) {
        return "Hello ".concat(converter_1.test || 'world');
    }
};
exports.default = DragonEditor;
