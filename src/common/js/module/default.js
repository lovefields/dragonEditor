const { message } = require("./message");

export function typeCheckThrow(target, type) {
    if (type !== "*") {
        if (typeof type === "string") {
            let typeofValue = typeof target;
            let typeArr = type.split(",");
            let instanseName;

            if (typeofValue !== "object") {
                instanseName = typeofValue;
            } else {
                if (target.addEventListener !== undefined) {
                    instanseName = "node";
                } else {
                    if (target instanceof Event) {
                        instanseName = "event";
                    } else {
                        instanseName = target.constructor.name.toLowerCase();
                    }
                }
            }

            if (typeArr.indexOf(instanseName) == -1) {
                throw `DRAGON EDITOR - invalid type ${target} : ${typeArr.join(",")}`;
            }
        } else {
            throw `DRAGON EDITOR - type augment is must be String : ${type}`;
        }
    }

    return target;
}

export function typeCheckBoolean(target, type) {
    let status = true;

    if (type !== "*") {
        if (typeof type === "string") {
            let typeofValue = typeof target;
            let typeArr = type.split(",");
            let instanseName;

            if (typeofValue !== "object") {
                instanseName = typeofValue;
            } else {
                if (target.addEventListener !== undefined) {
                    instanseName = "node";
                } else {
                    if (target instanceof Event) {
                        instanseName = "event";
                    } else {
                        instanseName = target.constructor.name.toLowerCase();
                    }
                }
            }

            if (typeArr.indexOf(instanseName) == -1) {
                status = false;
            }
        } else {
            status = false;
        }
    }

    return status;
}

export function eventBinding($node, type, fn, useCapture = false, _0 = typeCheckThrow($node, "*"), _1 = typeCheckThrow(type, "string"), _2 = typeCheckThrow(fn, "function"), _3 = typeCheckThrow(useCapture, "boolean")) {
    let typeList = type.split(",");

    if ($node.forEach != undefined) {
        $node.forEach(($item) => {
            typeList.forEach((eventName) => {
                $item.addEventListener(eventName, fn, true);
            });
        });
    } else if ($node.addEventListener != undefined) {
        typeList.forEach((eventName) => {
            $node.addEventListener(eventName, fn, true);
        });
    }
}

export function removeEvent($node, type, fn, _0 = typeCheckThrow($node, "object"), _1 = typeCheckThrow(type, "string"), _2 = typeCheckThrow(fn, "function")) {
    let typeList = type.split(",");

    if ($node.forEach != undefined) {
        $node.forEach(($item) => {
            typeList.forEach((eventName) => {
                $item.removeEventListener(eventName, fn, true);
            });
        });
    } else {
        typeList.forEach((eventName) => {
            $node.removeEventListener(eventName, fn, true);
        });
    }
}

export function classControl($node, action, className, _0 = typeCheckThrow($node, "*"), _1 = typeCheckThrow(action, "string"), _2 = typeCheckThrow(className, "string")) {
    if ($node.forEach != undefined) {
        $node.forEach(($item) => {
            if (action == "add") {
                $item.classList.add(className);
            } else if (action == "remove") {
                $item.classList.remove(className);
            } else if (action == "toggle") {
                $item.classList.toggle(className);
            }
        });
    } else if ($node.addEventListener != undefined) {
        if (action == "add") {
            $node.classList.add(className);
        } else if (action == "remove") {
            $node.classList.remove(className);
        } else if (action == "toggle") {
            $node.classList.toggle(className);
        }
    }
}

export function hasClass($node, className, _0 = typeCheckThrow($node, "node"), _1 = typeCheckThrow(className, "string")) {
    let value = false;
    let nameList = className.split(".");

    nameList.some((name) => {
        if (name !== "") {
            if ($node.classList.contains(name)) {
                value = true;
            } else {
                value = false;
            }

            return value == false;
        }
    });

    return value;
}

export function fetchURL(url, option = {}, type = "form", _0 = typeCheckThrow(url, "string"), _1 = typeCheckThrow(option, "object"), _2 = typeCheckThrow(type, "string")) {
    let formData = new FormData();
    let csrfHeader = Object.entries(condition.csrfHeader);

    if (type == "json") {
        for (let key in option.body) {
            formData.append(key, option.body[key]);
        }

        option.body = formData;
    }

    if (csrfHeader.length > 0) {
        option.headers = new Headers(condition.csrfHeader);
    }

    return fetch(url, option)
        .then((res) => {
            if (res.ok == false) {
                throw new Error(message.serverNotWorking);
            }

            return res.json();
        })
        .catch((error) => {
            return {
                respon: false,
                error: error,
            };
        });
}

export function upperFirstChar(text, _0 = typeCheckThrow(text, "string")) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export function isMobile() {
    if (condition.windowWidth < condition.changePoint) {
        return true;
    } else {
        return false;
    }
}

export function hasValueArrToArr(baseArr, inputArr, _0 = typeCheckThrow(baseArr, "array"), _1 = typeCheckThrow(inputArr, "array")) {
    let boolean = false;

    inputArr.forEach((item) => {
        if (baseArr.indexOf(item) > -1) {
            boolean = true;
        }
    });

    return boolean;
}
