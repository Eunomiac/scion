import {
    baseConstants as C,
    scionSystemData,
    itemCategories,
    handlebarTemplates,
    signatureChars
} from "./constants.js";
import _ from "../external/underscore/underscore-esm-min.js";

const groupStyles = {
    data: "color: black; background-color: white; font-family: Oswald; font-size: 16px; padding: 0px 5px;",
    info: "color: black; background-color: grey; font-family: Voltaire; font-size: 14px; padding: 0px 5px;"
};
const logStyles = {
    data: "color: black; background-color: white; font-family: Oswald; font-size: 14px; padding: 0px 5px;",
    info: "color: black; background-color: grey; font-family: Voltaire; font-size: 12px; padding: 0px 5px;"
};

// #region Helper Functions
const loc = (str, formatTemplate) => {
    if (!str.length)
        return str;
    if (formatTemplate)
        return game.i18n.format(str, formatTemplate);
    return game.i18n.localize(str);
};
/* const getEntityData = (dataObj) => {
    dataObj = dataObj || this;
    for (let i = 0; i < 6; i++) {
        const checkKeys = ["actor", "data", "object"].filter((x) => x in dataObj);
        if (checkKeys.length)
            dataObj = dataObj[checkKeys.shift()];
        else
            break;
    }
    return dataObj;
}; */
/* const tracePathString = (dataObj, path, isGettingRef = false) => {
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
}; */
// #endregion

// #region Prototype Extensions
const namespaceCollisions = _.intersection(
    ["lCase", "uCase", "sCase", "tCase", "localize"],
    Object.getOwnPropertyNames(String.prototype)
);
if (namespaceCollisions.length) {
    console.error(`NAMESPACE COLLISION: String.prototype already includes [${namespaceCollisions.join(", ")}]`);
} else {
    /* String.prototype.lCase = function lowerCase() {
        if (!this.length)
            return this;
        return this.toLowerCase();
    };
    console.log(Object.getOwnPropertyNames(String.prototype));
    String.prototype.uCase = function upperCase() {
        if (!this.length)
            return this;
        return this.toUpperCase();
    };
    String.prototype.sCase = function sentenceCase() {
        if (!this.length)
            return this;
        return `${`${this}`.slice(0, 1).uCase()}${`${this}`.slice(1)}`;
    };
    String.prototype.tCase = function titleCase() {
        if (!this.length)
            return this;
        return this.split(/\s/)
            .map((x, i) => ((i && C.noCapTitleCase.includes(`${x}`.lCase())) ? `${x}`.lCase() : this.sCase()))
            .join(" ")
            .replace(/\s+/gu, " ")
            .trim();
    };
    String.prototype.localize = function localize(formatTemplate) {
        console.log(`LOCALIZING: ${this}`);
        if (!this.length)
            return this;
        if (formatTemplate)
            return game.i18n.format(this, formatTemplate);
        return game.i18n.localize(this);
    }; */
}
// #endregion

const U = {
    // #region ACTOR DATA: Parsing Paths, Getting Values, Updating Data
    DigActor: (dataObj, pathStr, subPropsToCheck = ["value"]) => {
        // Given Actor, ActorSheet or actor.data[.data], will follow path string and return value.
        const regExpPatterns = [
            ["", ""],
            [new RegExp("^actor\\."), ""],
            [new RegExp("^(data\\.)+", "g"), "data."]
        ];
        let dataVal;
        do {
            pathStr = pathStr.replace(...regExpPatterns.shift());
            dataVal = getProperty(dataObj, pathStr);
            console.log(pathStr, dataVal);
        } while (!dataVal);
        if (typeof dataVal === "object" && subPropsToCheck.find((x) => x in dataVal))
            return dataVal[subPropsToCheck.find((x) => x in dataVal)];
        return dataVal;
    },
    Loc: (str, formatTemplate) => loc(str, formatTemplate),
    // #endregion

    // #region NUMBER FUNCTIONS: Parsing
    Int: (num) => parseInt(`${Math.round(parseFloat(`${num}`))}`),
    Float: (num, sigDigits = 2) => Math.round(parseFloat(`${num}`) * 10 ** sigDigits) / 10 ** sigDigits,
    // #endregion

    // #region OBJECT FUNCTIONS: MapObject, MakeDictionary
    KeyMapObj: (obj, keyFunc = (x) => x, valFunc) => {
        // An object-equivalent Array.map() function, which accepts mapping functions to transform both keys and values.
        //      If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
        [valFunc, keyFunc] = [valFunc, keyFunc].filter((x) => typeof x === "function");
        keyFunc = keyFunc || ((k) => k);
        const newObj = {};
        Object.entries(obj).forEach(([key, val]) => {
            newObj[keyFunc(key, val)] = valFunc(val, key);
        });
        return newObj;
    },
    MakeDict: (objRef, valFunc = (v, k) => v, keyFunc = (k, v) => k) => {
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
                    newVal = loc(newVal);
            } else {
                continue;
            }
            newDict[newKey] = newVal;
        }
        return newDict;
    },
    FlattenNestedValues: (obj) => {
        const flattenVals = (thisObj) => {
            const flatVals = [];
            if (thisObj && typeof thisObj === "object") {
                for (const key of Object.keys(thisObj)) {
                    const val = thisObj[key];
                    if (val && typeof val === "object")
                        flatVals.push(...flattenVals(val));
                    else
                        flatVals.push(val);
                }
                return flatVals;
            }
            return [thisObj].flat();
        };
        return flattenVals(obj);
    },
    // #endregion

    // #region DEBUG & ERROR: Console Logging
    LOG: (output, title, tag, options = {}) => {
        options = Object.assign({style: "info", isLoud: false, isClearing: false, isTracing: false, isGrouping: false, groupStyle: undefined, isUngrouping: true, logLevel: "log"}, options);
        if (game.scion.debug.isDebugging || options.isLoud || game.scion.debug.watchList.includes(tag)) {
            if (options.isClearing)
                console.clear();
            if (options.isGrouping)
                console.groupCollapsed(`%c ${options.isGrouping} `, groupStyles[options.style]);
            console[options.isTracing ? "trace" : options.logLevel](`%c ${title} `, logStyles[options.style], output);
            if (options.isUngrouping && !options.isGrouping)
                console.groupEnd();
        }
    },
    DB: (data, tag, options = {isLoud: false}) => {
        if (game.scion.debug.isDebugging || options.isLoud || game.scion.debug.watchList.includes(tag)) {
            tag = tag ? `[DB: ${tag}]` : "[DB]";
            console.log({[tag]: data});
        }
    },
    THROW: (data, tag, options = {isLoud: false}) => {
        this.DB(data, tag, options);
        return false;
    }
    // #endregion
};

export {
    U,
    _,
    C,
    scionSystemData as SCION,
    itemCategories, handlebarTemplates, signatureChars
};
