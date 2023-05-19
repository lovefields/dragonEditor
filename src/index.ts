import { test } from "./converter";

console.log(test);


const DragonEditor = {
    component: () => {
        return "VUE compoenet return";
    },
    binding: (areaClassName: string) => {
        console.log(areaClassName);
    },
    getText: (name: string) => {
        return `Hello ${test || 'world'}`;
    }
}

export default DragonEditor;