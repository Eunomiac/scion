export const parsePath = (obj, path) => {
    const pathKeys = path.split(".");
    while (pathKeys.length && pathKeys[0] in obj)
        obj = obj[pathKeys.shift()];
    return obj;
};

export const getValue = (obj, path, paramToCheck = "value", isStrict = false) => {
    const ref = parsePath(obj, path);
    if (typeof ref === "object" && paramToCheck in ref)
        return ref[paramToCheck];
    return !isStrict && ref;
};

export const getUpdateData = (actor, path, value, paramToCheck = "value", isStrict = false) => {
    const actorData = actor.data.data;
    const targetVal = parsePath(actorData, path);
    if (typeof targetVal === "object" && paramToCheck in targetVal)
        return {[`data.${path}.${paramToCheck}`]: value};
    return isStrict ? {} : {[`data.${path}`]: value};
};
