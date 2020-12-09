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

const tracePathString = (dataObj, path, isGettingRef = false) => {
    if (!(dataObj instanceof Actor && path.startsWith("actor"))) {
        dataObj = getEntityData(dataObj);
        path = path.replace(/^((actor\.)|(data\.)|(object\.))+/u, "");
    } else {
        path = path.replace(/^actor\./u, "");
    }
    const pathRefs = path.split(".");
    if (pathRefs.length && isGettingRef)
        pathRefs.pop();
    while (pathRefs.length && typeof dataObj === "object")
        dataObj = dataObj[pathRefs.shift()];
    return pathRefs.length ? false : dataObj;
};

export const DigActor = (dataObj, pathStr, subPropsToCheck = ["value"]) => {
    // Given Actor, ActorSheet or actor.data[.data], will follow path string and return value.
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
export const Loc = (locRef, replaceDict) => {
    let returnStr = game.i18n.localize(locRef);
    if (returnStr && returnStr !== locRef) {
        if (replaceDict)
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

export const FlattenNestedValues = (obj, flatVals = []) => {
    if (obj && typeof obj === "object") {
        for (const key of Object.keys(obj)) {
            const val = obj[key];
            if (val && typeof val === "object")
                flatVals.push(...FlattenNestedValues(val));
            else
                flatVals.push(val);
        }
        return flatVals;
    }
    return [obj].flat();
};
// #endregion

// #region DEBUG & ERROR: Console Logging
const groupStyles = {
    data: "color: black; background-color: white; font-family: Oswald; font-size: 16px; padding: 0px 5px;",
    info: "color: black; background-color: grey; font-family: Voltaire; font-size: 14px; padding: 0px 5px;",
    log: "color: white; background-color: black; font-family: 'Fira Code'; font-size: 12px; padding: 2px;"
};
const logStyles = {
    data: "color: black; background-color: white; font-family: Oswald; font-size: 14px; padding: 0px 5px;",
    info: "color: black; background-color: grey; font-family: Voltaire; font-size: 12px; padding: 0px 5px;",
    log: "color: white; background-color: black; font-family: 'Fira Code'; font-size: 10px; padding: 2px;"
};

export const LOG = (output, title, tag, {style="info", groupStyle="data", isLoud=false, isClearing=false, isGrouping=false, isUngrouping=true} = {}) => {
    if (game.scion.debug.isDebugging || isLoud || game.scion.debug.watchList.includes(tag)) {
        if (isClearing)
            console.clear();
        if (isGrouping)
            console.groupCollapsed(`%c ${isGrouping} `, groupStyles[groupStyle]);
        console.log(`%c ${title} `, logStyles[style], output);
        if (isUngrouping && !isGrouping)
            console.groupEnd();
    }
};
export const GLOG = (outputs = {title: Object}, groupTitle, tag, {style="info", groupStyle="data", isLoud=false, isClearing=false} = {}) => {
    Object.entries(outputs).forEach(([lineTitle, lineOutput], i) => {
        if (i === 0)
            LOG(lineOutput, lineTitle, tag, {style, groupStyle, isLoud, isClearing, isGrouping: `${tag ? `[${tag}] ` : ""} ${groupTitle}`});
        else
            LOG(lineOutput, lineTitle, tag, {style, isLoud, isUngrouping: false});
    });
    console.groupEnd();
};
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
