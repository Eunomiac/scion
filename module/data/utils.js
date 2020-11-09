import {baseConstants as C} from "./constants.js";

// #region ACTOR DATA: Parsing Paths, Getting Values, Updating Data
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
// #endregion

// #region STRING FUNCTIONS: Capitalization, Parsing, Localization
export const uCase = (str) => `${str}`.toUpperCase();
export const lCase = (str) => `${str}`.toLowerCase();
export const sCase = (str) => `${`${str}`.slice(0, 1).toUpperCase()}${`${str}`.slice(1)}`;
export const tCase = (str) => `${str}`.split(/\s/)
    .map((x, i) => ((i && C.noCapTitleCase.includes(`${x}`.toLowerCase())) ? `${x}`.toLowerCase() : sCase(x)))
    .join(" ")
    .replace(/\s+/gu, " ")
    .trim();
export const localize = (str, params = {}) => {
    let returnStr = game.i18n.localize(str);
    for (const [param, val] of Object.entries(params))
        returnStr = returnStr.replace(new RegExp(`\\\{${param}\\\}`, "gu"), val);
    return returnStr.trim();
};
// #endregion

// #region NUMBER FUNCTIONS: Parsing
export const int = (num) => parseInt(`${Math.round(parseFloat(`${num}`))}`);
export const float = (num, sigDigits = 2) => Math.round(parseFloat(`${num}`) * 10 ** sigDigits) / 10 ** sigDigits;
// #endregion

// #region OBJECT FUNCTIONS: MapObject, MakeDictionary
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

export const makeDict = (objRef, valMapFunc = (v, k) => v, keyMapFunc = (k, v) => k) => {
    const newDict = {};
    for (const key of Object.keys(objRef)) {
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
// #endregion

// #region VALIDATION: Type Validation
export const VAL = (...args) => {
    // ARGUMENTS:  Any number of objects of {type: value, type: value}
    //                Prepend key with "arrayOf{type}" if checking multiple values.
    const errorLines = {};
    const validate = (type, testVal) => {
        switch (type.replace(/^arrayOf/u, "").slice(0, 3).toLowerCase()) {
            case "str": {
                if (typeof testVal !== "string")
                    errorLines[`TYPE ERROR: '${testVal}' Not a String`] = testVal;
                break;
            }
            case "num": {
                if (typeof float(testVal) !== "number")
                    errorLines[`TYPE ERROR: '${testVal}' Not a Number`] = testVal;
                break;
            }
            case "int": {
                if (typeof float(testVal) !== "number" || int(testVal) !== float(testVal))
                    errorLines[`TYPE ERROR: '${testVal}' Not an Integer`] = testVal;
                break;
            }
            case "arr": {
                if (!Array.isArray(testVal))
                    errorLines[`TYPE ERROR: '${testVal}' Not an Array`] = testVal;
                break;
            }
            case "boo": {
                if (![true, false].includes(testVal))
                    errorLines[`TYPE ERROR: '${testVal}' Not a Boolean`] = testVal;
                break;
            }
            case "fun": {
                if (typeof testVal !== "function")
                    errorLines[`TYPE ERROR: '${testVal}' Not a Function`] = testVal;
                break;
            }
            // no default
        }
    };
    args.forEach((checkObj) => {
        if (!errorLines.length)
            for (const [type, testCase] of Object.entries(checkObj)) {
                if (type.startsWith("arrayOf"))
                    testCase.forEach((x) => validate(type, x));
                else
                    validate(type, testCase);
                if (errorLines.length)
                    break;
            }
    });
    if (errorLines.length)
        return THROW(errorLines);
    return true;
};
// #endregion

// #region DEBUG & ERROR: Console Logging
export const DB = (data, tag, options = {isLoud: false}) => {
    if (game.scion.debug.isDebugging || options.isLoud || game.scion.debug.watchList.includes(tag)) {
        tag = tag ? `[DB: ${tag}]` : "[DB]";
        console.log({[tag]: data});
    }
};
export const THROW = (data, tag, options = {isLoud: false}) => {
    DB(data, tag, options);
    return false;
};
// #endregion
