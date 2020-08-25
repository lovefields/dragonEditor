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

export function eventBinding($node, type, fn, _0 = typeCheckThrow($node, "object"), _1 = typeCheckThrow(type, "string"), _2 = typeCheckThrow(fn, "function")) {
    if ($node.length > 0) {
        $node.forEach(($item) => {
            $item.addEventListener(type, fn);
        });
    } else {
        $node.addEventListener(type, fn);
    }
}

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
