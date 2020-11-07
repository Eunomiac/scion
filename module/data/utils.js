export const parsePath = (obj, path) => {
    // If an actor is the object, resolve to first data attribute.
    if (obj instanceof Actor) {
        obj = obj.data;
        path = path.replace(/^actor\./u, "");
    }
    // To resolve any issues with duplicate 'data.data' calls, first resolve the object 
    // and path to any inner data object.
    while ("data" in obj)
        obj = obj.data;
    path = path.replace(/^(data.)+/u, ""); // ... and resolve the path accordingly.
    const pathKeys = path.split(".");
    while (pathKeys.length > 1 && pathKeys[0] in obj)
        obj = obj[pathKeys.shift()];
    if (pathKeys.length === 1)
        return [obj[pathKeys[0]], obj, pathKeys[0]];
    throw new Error({[`Unable to resolve path '${path}' given obj`]: obj});
};

export const getValue = (obj, path, paramToCheck = "value", isStrict = false) => {
    const [ref] = parsePath(obj, path);
    if (ref && typeof ref === "object" && paramToCheck in ref)
        return ref[paramToCheck];
    return !isStrict && ref;
};

export const getUpdateData = (actor, path, value, paramToCheck = "value", isStrict = false) => {
    if (path.startsWith("actor"))
        throw new Error(`ERROR: Can update actor.data.data ONLY with getUpdateData. Path '${path}' invalid!`);
    const [targetVal] = parsePath(actor, path);
    if (targetVal && typeof targetVal === "object" && paramToCheck in targetVal)
        return {[`${`data.${path}`.replace(/(data\.)+/u, "data.")}.${paramToCheck}`]: value};
    return isStrict ? {} : {[`data.${path}`]: value};
};

export const mapObj = (objRef, keyValFunc = (x) => x, valFunc) => {
    // An object-equivalent Array.map() function, which accepts mapping functions for both keys and values.
    //      If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
    if (!valFunc) {
        valFunc = keyValFunc;
        keyValFunc = (k) => k;
    }
    const newObj = {};
    for (const [key, val] of Object.entries(objRef))
        newObj[keyValFunc(key, val)] = valFunc(val, key);
    return newObj;
};

export const makeDict = (objRef, filterFunc = (key) => true, valMapFunc = (v, k) => v, keyMapFunc = (k, v) => k) => {
    const newDict = {};
    for (const key of Object.keys(objRef).filter(filterFunc)) {
        const val = objRef[key];
        const newKey = keyMapFunc(key, val);
        let newVal = valMapFunc(val, key);
        if (typeof newVal === "object") {
            if (Array.isArray(newVal))
                continue;
            newVal = newVal.label || newVal.name || newVal.value || false;
        }
        if (["string", "number"].includes(typeof newVal)) {
            if (`${newVal}`.startsWith("scion."))
                newVal = game.i18n.localize(newVal);
        } else {
            continue;
        }
        newDict[newKey] = newVal;
    }
    return newDict;
};

export const localize = (str, params = {}) => {
    let returnStr = game.i18n.localize(str);
    for (const [param, val] of Object.entries(params))
        returnStr = returnStr.replace(new RegExp(`\\\{${param}\\\}`, "gu"), val);
    return returnStr;
};
