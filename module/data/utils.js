import {baseConstants as C} from "./constants.js";

// #region ACTOR DATA: Parsing Paths, Getting Values, Updating Data
const getEntityData = (dataObj) => {
    dataObj = dataObj || this;
    for (let i = 0; i < 6; i++) {
        const checkKeys = ["actor", "data", "object"].filter((x) => x in dataObj);
        if (checkKeys.length)
            dataObj = dataObj[checkKeys.shift()];
        else
            break;
    }
    return dataObj;
};

const tracePathString = (dataObj, path) => {
    dataObj = getEntityData(dataObj);
    const pathRefs = path.replace(/^((actor\.)|(data\.)|(object\.))+/u, "").split(".");
    while (pathRefs.length && typeof dataObj === "object")
        dataObj = dataObj[pathRefs.shift()];
    return pathRefs.length ? false : dataObj;
};

export const DigData = (dataObj, pathStr, subPropsToCheck = ["value"]) => {
    dataObj = tracePathString(dataObj, pathStr);
    if (typeof dataObj === "object" && subPropsToCheck.find((x) => x in dataObj))
        return dataObj[subPropsToCheck.find((x) => x in dataObj)];
    return dataObj;
};
// #endregion

// #region STRING FUNCTIONS: Capitalization, Parsing, Localization
export const UCase = (str) => `${str}`.toUpperCase();
export const LCase = (str) => `${str}`.toLowerCase();
export const SCase = (str) => `${`${str}`.slice(0, 1).toUpperCase()}${`${str}`.slice(1)}`;
export const TCase = (str) => `${str}`.split(/\s/)
    .map((x, i) => ((i && C.noCapTitleCase.includes(`${x}`.toLowerCase())) ? `${x}`.toLowerCase() : SCase(x)))
    .join(" ")
    .replace(/\s+/gu, " ")
    .trim();
export const Loc = (locRef, replaceDict = {}) => {
    let returnStr = game.i18n.localize(locRef);
    if (returnStr && returnStr !== locRef) {
        for (const [ref, val] of Object.entries(replaceDict))
            returnStr = returnStr.replace(new RegExp(`\\\{${ref}\\\}`, "gu"), val);
        return returnStr.trim();
    }
    console.error("Could not localize locRef:", locRef);
    return "";
};
// #endregion

// #region NUMBER FUNCTIONS: Parsing
export const Int = (num) => parseInt(`${Math.round(parseFloat(`${num}`))}`);
export const Float = (num, sigDigits = 2) => Math.round(parseFloat(`${num}`) * 10 ** sigDigits) / 10 ** sigDigits;
// #endregion

// #region OBJECT FUNCTIONS: MapObject, MakeDictionary
export const KeyMapObj = (obj, keyFunc = (x) => x, valFunc) => {
    // An object-equivalent Array.map() function, which accepts mapping functions to transform both keys and values.
    //      If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
    [valFunc, keyFunc] = [valFunc, keyFunc].filter((x) => typeof x === "function");
    keyFunc = keyFunc || ((k) => k);
    const newObj = {};
    Object.entries(obj).forEach(([key, val]) => {
        newObj[keyFunc(key, val)] = valFunc(val, key);
    });
    return newObj;
};

export const MakeDict = (objRef, valFunc = (v, k) => v, keyFunc = (k, v) => k) => {
    const newDict = {};
    for (const key of Object.keys(objRef)) {
        const val = objRef[key];
        const newKey = keyFunc(key, val);
        let newVal = valFunc(val, key);
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
