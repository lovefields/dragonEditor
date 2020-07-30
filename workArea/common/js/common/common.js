export function typeCheckThrow(target, type){
    if (typeof type == "string") {
        if (typeof target != type) {
            throw `invaild type ${target} : ${type}`;
        }
    } else if (!(target instanceof type)) {
        throw `invaild type ${target} : ${type}`;
    }
    return target;
};

export function typeCheckBoolean(target, type){
    if (typeof type == "string") {
        if (typeof target != type) {
            return false;
        }
    } else if (!(target instanceof type)) {
        return false;
    }
    return true;
};