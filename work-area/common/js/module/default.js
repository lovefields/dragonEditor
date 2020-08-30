export function typeCheckThrow(target, type) {
    if (typeof type == "string") {
        if (typeof target != type) {
            throw `invaild type ${target} : ${type}`;
        }
    } else if (!(target instanceof type)) {
        throw `invaild type ${target} : ${type}`;
    }
    return target;
}

export function typeCheckBoolean(target, type) {
    if (typeof type == "string") {
        if (typeof target != type) {
            return false;
        }
    } else if (!(target instanceof type)) {
        return false;
    }
    return true;
}

export function eventBinding($node, type, fn, useCapture = false, _0 = typeCheckThrow($node, "object"), _1 = typeCheckThrow(type, "string"), _2 = typeCheckThrow(fn, "function"), _3 = typeCheckThrow(useCapture, "boolean")) {
    if ($node.length > 0) {
        $node.forEach(($item) => {
            $item.addEventListener(type, fn, useCapture);
        });
    } else {
        $node.addEventListener(type, fn, useCapture);
    }
}

// export function removeEvent($node, type, fn, _0 = typeCheckThrow($node, "object"), _1 = typeCheckThrow(type, "string"), _2 = typeCheckThrow(fn, "function")) {
//     if ($node.length > 0) {
//         $node.forEach(($item) => {
//             $item.removeEventListener(type, fn, true);
//         });
//     } else {
//         $node.removeEventListener(type, fn, true);
//     }
// }

export function classControl($node, action, className, _0 = typeCheckThrow($node, "object"), _1 = typeCheckThrow(action, "string"), _2 = typeCheckThrow(className, "string")) {
    if ($node.length > 0) {
        $node.forEach(($item) => {
            if (action == "add") {
                $item.classList.add(className);
            } else if (action == "remove") {
                $item.classList.remove(className);
            } else if (action == "toggle") {
                $item.classList.toggle(className);
            }
        });
    } else {
        if (action == "add") {
            $node.classList.add(className);
        } else if (action == "remove") {
            $node.classList.remove(className);
        } else if (action == "toggle") {
            $node.classList.toggle(className);
        }
    }
}

export function hasClass($node, className, _0 = typeCheckThrow($node, Node), _1 = typeCheckThrow(className, "string")) {
    let value = false;
    let nameList = className.split(".");

    nameList.some((name) => {
        if(name !== ""){
            if($node.classList.contains(name)){
                value = true;
            }else{
                value = false;
            }

            return value == false;
        }
    });

    return value;
}
