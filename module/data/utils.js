import * as _ from "../external/underscore/underscore-esm-min.js";

// #region CONSTANTS (INTERNAL)
const noCapTitleCase = [
    "above",
    "after",
    "at",
    "below",
    "by",
    "down",
    "for",
    "from",
    "in",
    "onto",
    "of",
    "off",
    "on",
    "out",
    "to",
    "under",
    "up",
    "with",
    "for",
    "and",
    "nor",
    "but",
    "or",
    "yet",
    "so",
    "the",
    "an",
    "a",
];
const loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultricies 
nibh sed massa euismod lacinia. Aliquam nec est ac nunc ultricies scelerisque porta vulputate odio. 
Integer gravida mattis odio, semper volutpat tellus. Ut elit leo, auctor eget fermentum hendrerit, 
aliquet ac nunc. Suspendisse porta turpis vitae mi posuere molestie. Cras lectus lacus, vulputate a 
vestibulum in, mattis vel mi. Mauris quis semper mauris. Praesent blandit nec diam eget tincidunt. Nunc 
aliquet consequat massa ac lacinia. Ut posuere velit sagittis, vehicula nisl eget, fringilla nibh. Duis 
volutpat mattis libero, a porttitor sapien viverra ut. Phasellus vulputate imperdiet ligula, eget 
eleifend metus tempor nec. Nam eget sapien risus. Praesent id suscipit elit. Sed pellentesque ligula 
diam, non aliquet magna feugiat vitae. Pellentesque ut tortor id erat placerat dignissim. Pellentesque 
ut dui vel leo laoreet sodales nec ac tellus. In hac habitasse platea dictumst. Proin sed ex sed augue 
sollicitudin interdum. Sed id lacus porttitor nisi vestibulum tincidunt. Nulla facilisi. Vestibulum 
feugiat finibus magna in pretium. Proin consectetur lectus nisi, non commodo lectus tempor et. Cras 
viverra, mi in consequat aliquet, justo mauris fringilla tellus, at accumsan magna metus in eros. Sed 
vehicula, diam ut sagittis semper, purus massa mattis dolor, in posuere.`;
// #endregion

// #region CONSOLE LOGGING
const groupStyles = {
    data: "color: black; background-color: white; font-family: Oswald; font-size: 16px; font-weight: bold; padding: 0px 5px;",
    info: "color: black; background-color: grey; font-family: Voltaire; font-size: 14px; font-weight: bold; padding: 0px 5px;",
    log: "color: white; background-color: black; font-family: 'Fira Code'; font-size: 12px; font-weight: bold; padding: 2px;",
    debug: "color: black; background-color: grey; font-family: 'Fira Code'; font-size: 12px; font-weight: bold; padding: 2px;",
    error: "color: #FAA; background-color: #A00; font-family: Oswald; font-size: 16px; font-weight: bold; padding: 0 5px;",
    trace:
        "color: gold; width: 400px; min-width: 400px; background-color: #550; font-family: Oswald; font-size: 14px; : 1; font-weight: bold; padding: 2px 400px 2px 10px;",
    l1: "color: cyan; background-color: #003; font-family: Oswald; font-size: 16px; font-weight: bold; padding: 0 5px;",
    l2: "color: lime; background-color: #030; font-family: Oswald; font-size: 14px; font-weight: bold; padding: 0 5px;",
    l3: "color: khaki; background-color: #330; font-family: Voltaire; font-size: 12px; font-weight: bold; padding: 0 2px;",
    l4: "color: magenta; background-color: #303; font-family: Oswald; font-size: 16px; font-weight: bold; padding: 0 2px;",
};
const logStyles = {
    data: "color: black; background-color: white; font-family: Oswald; font-size: 14px; padding: 0px 5px;",
    info: "color: black; background-color: grey; font-family: Voltaire; font-size: 12px; padding: 0px 5px;",
    log: "color: white; background-color: black; font-family: 'Fira Code'; font-size: 10px; padding: 2px;",
    debug: "color: black; background-color: grey; font-family: 'Fira Code'; font-size: 10px; padding: 2px;",
    error: "color: #FAA; background-color: #A00; font-family: 'Fira Code'; font-size: 14px; padding: 2px;",
    traceFoundry: "color: white; background-color: transparent; font-family: 'Fira Code'; font-size: 10px;",
    traceLocal: "color: black; background-color: #FFF; font-family: 'Fira Code'; font-weight: bold; font-size: 12px; padding: 2px 3px 0px 3px;",
    traceString: "color: #999; background-color: black; font-family: 'Fira Code'; font-size: 10px; padding: 0 3px;",
    l1: "color: cyan; background-color: #003; font-family: Oswald; font-size: 16px; padding: 0 5px;",
    l2: "color: lime; background-color: #030; font-family: Oswald; font-size: 14px; padding: 0 5px;",
    l3: "color: khaki; background-color: #330; font-family: Voltaire; font-size: 12px; padding: 0 2px;",
    l4: "color: magenta; background-color: #303; font-family: Oswald; font-size: 16px; padding: 0 2px;",
};
const stackTraceBlacklist = [/jquery\.min\.js/u,];
/*
 *const testStack = `Error
 *    at stackTrace (http://localhost:30000/systems/scion/module/data/utils.js:33:25)
 *    at Module.LOG (http://localhost:30000/systems/scion/module/data/utils.js:68:143)
 *    at HTMLDivElement.<anonymous> (http://localhost:30000/systems/scion/module/mixins/generalMixins.js:207:27)
 *    at Function.each (http://localhost:30000/scripts/jquery.min.js:2:2976)
 *    at S.fn.init.each (http://localhost:30000/scripts/jquery.min.js:2:1454)
 *    at MajorActorSheet.activateListeners (http://localhost:30000/systems/scion/module/mixins/generalMixins.js:181:46)
 *    at MajorActorSheet.activateListeners (http://localhost:30000/systems/scion/module/mixins/generalMixins.js:59:15)
 *    at MajorActorSheet.activateListeners (http://localhost:30000/systems/scion/module/actor/actor-major-sheet.js:99:15)
 *    at MajorActorSheet._render (http://localhost:30000/scripts/foundry.js:4537:10)
 *    at async MajorActorSheet._render (http://localhost:30000/scripts/foundry.js:5163:5)
 *    at stackTrace (http://localhost:30000/systems/scion/module/data/utils.js:33:25)
 *    at Module.LOG (http://localhost:30000/systems/scion/module/data/utils.js:73:90)
 *    at Function.RegisterSheet (http://localhost:30000/systems/scion/module/item/item-sheet.js:20:11)
 *    at http://localhost:30000/systems/scion/module/scion.js:53:98
 *    at Array.forEach (<anonymous>)
 *    at http://localhost:30000/systems/scion/module/scion.js:53:40
 *    at Function._call (http://localhost:30000/scripts/foundry.js:2496:14)
 *    at Function.callAll (http://localhost:30000/scripts/foundry.js:2456:12)
 *    at Game.initialize (http://localhost:30000/scripts/foundry.js:6465:11)
 *    at window.addEventListener.once (http://localhost:30000/scripts/foundry.js:7436:8)`;
 *const testStackMapped = testStack
 *    .replace(/(\n\s+at\s+)(http:[^\n]+)(\n?)/gu, "$1BASE ($2)$3")
 *    .split(/\n\s+at\s+/gu)
 *    .slice(1)
 *    .filter((line) => !stackTraceBlacklist.some((regex) => regex.test(line)))
 *    .map((line) => line.replace(/http:\/\/localhost:[^:]*?(\/scion\/(module\/)?|\/scripts\/)/gu, ""))
 *    .map((line) => (line.match(/^([^(]+)(?: \(|)([^())]*)\)?$/u) || []).slice(1, 3))
 *    .map(([name, loc]) => [name.toUpperCase(), ...loc.replace(":","=").split("=")]);
 *console.log(testStackMapped);
 */
const delayedLogQueue = [];
const isDebugging = (tag, {isLoud,},) => isLoud || game.scion?.debug.isDebugging || (tag && game.scion?.debug.watchList.some((watchTag) => new RegExp(watchTag).test(tag)));
const stackTrace = () => {
    const stackString = new Error().stack;
    const stack = stackString
        .replace(/(\n\s+at\s+)(http:[^\n]+)(\n?)/gu, "$1<Anonymous> ($2)$3",)
        .split(/\n\s+at\s+/gu,)
        .slice(1,)
        .filter((line,) => !stackTraceBlacklist.some((regex,) => regex.test(line,),),)
        .map((line,) => line.replace(/http:\/\/localhost:[^:]*?(\/scion\/(module\/)?|\/scripts\/)/gu, "",),)
        .map((line,) => (line.match(/^([^(]+)(?: \(|)([^())]*)\)?$/u,) || []).slice(1, 3,),)
        .map(([name, loc,],) => [name, ...(loc ?? "").replace(":", "=",).split("=",),],);
    while (stack.length && (stack[0] || []).join(" ",).includes("utils.js",)) {
        stack.shift();
    }
    return [
        stack.shift(),
        Object.assign(
            KeyMapObj(
                stack,
                (k, v,) => `${v[0]} (${v[1]})`,
                (v,) => _.last(v,),
            ),
            {"traceString:": stackString.replace(/ +/gu, " ",).replace(/Error/u, "",),},
        ),
    ];
};
const logLine = (output, title, {style, groupStyle, isGrouping,},) => {
    if (isGrouping && game.scion.debug.isFullDebugConsole) {
        if (game.scion.debug.isFullDebugConsole) {
            console.groupCollapsed(`%c ${isGrouping}`, groupStyles[groupStyle],);
        } else {
            console.groupCollapsed(isGrouping,);
        }
    }
    if (output !== undefined) {
        if (game.scion.debug.isFullDebugConsole) {
            console.log(`%c ${title}`, logStyles[style], output,);
        } else {
            console.log(
                title,
                _.pick(output, (v, k,) => Object.prototype.hasOwnProperty.call(output, k,),),
            );
        }
    } else {
        console.log(`No Output for ${title}`,);
    }
};
const logStackTrace = (stack,) => {
    if (stack) {
        const [stackRef, stackData,] = stack;
        Object.entries(stackData,).forEach(([locRef, lineRef,], i,) => {
            const style = (/foundry\.js/u.test(locRef,) && "traceFoundry") || (locRef === "traceString:" && "traceString") || "traceLocal";
            if (i === 0) {
                logLine(lineRef, locRef, {style, groupStyle: "trace", isGrouping: `STACK TRACE [${stackRef.shift()}]: ${stackRef.join(" at ",)}`,},);
            } else {
                logLine(lineRef, locRef, {style,},);
            }
        },);
        console.groupEnd();
    }
};
const logGroup = (outputs, groupTitle, tag, {style, groupStyle,}, stack,) => {
    if (["number", "string",].includes(typeof outputs,)) {
        logGroup({}, outputs, tag, {style, groupStyle,}, stack,);
    } else if (game.scion.debug.isFullDebugConsole) {
        if (Array.isArray(outputs,)) {
            outputs = outputs.map((x, i,) => ({[`${i}. ${JSON.stringify(x,)}`]: "",}),);
        }
        outputs = Object.entries(outputs,);
        (([lineTitle, lineOutput,],) => {
            logLine(lineOutput, lineTitle, {style, groupStyle, isGrouping: _.compact([tag && `[${tag}]`, groupTitle,],).join(" ",),},);
        })(outputs.shift() || [null, null,],);
        outputs.forEach(([lineTitle, lineOutput,],) => {
            logLine(lineOutput, lineTitle, {style,},);
        },);
        logStackTrace(stack,);
        console.groupEnd();
    } else {
        console.log(groupTitle, outputs,);
    }
};
export const IsDebug = () => Boolean(game.scion?.debug.isDebugging,);
export const LOG = (
    outputs = {title: Object,},
    groupTitle = "",
    tag = undefined,
    {style = "log", groupStyle = "data", isLoud = false,} = {},
    stack = stackTrace(),
) => {
    if (isDebugging(tag, {isLoud,},)) {
        if (CONFIG.isHoldingLogs) {
            delayedLogQueue.push([outputs, groupTitle, tag, {style, groupStyle, isLoud,}, stack,],);
        } else {
            logGroup(outputs, groupTitle, tag, {style, groupStyle,}, stack,);
        }
    }
};
export const ReleaseLogs = () => {
    CONFIG.isHoldingLogs = false;
    const logQueue = [...delayedLogQueue,];
    delayedLogQueue.length = 0;
    logQueue.forEach((log,) => LOG(...log,),);
};
export const DB = (data, tag, {isLoud = false,} = {},) => LOG(data, tag ? `[DB: ${tag}]` : "[DB]", null, {groupStyle: "debug", style: "debug", isLoud,},);
export const THROW = (data, tag, {isLoud = true,} = {},) =>
    LOG(data, tag ? `[${tag} ERROR]` : "[ERROR]", null, {groupStyle: "error", style: "error", isLoud,},) && false;
// #endregion

// #region LOGIC FUNCTIONS // null, String, Number, Boolean, Array, Set, HTMLElement, Object

export const GetType = (val,) => {
    if (_.isUndefined(val,)) {
        return "undefined";
    }
    const tVal = getType(val,);
    if (tVal === "Object" && typeof val === "function") {
        return "Function";
    }
    return tVal;
};
export const Equal = (val1, val2,) => {
    const [tVal1, tVal2,] = [GetType(val1,), GetType(val2,),];
    if (tVal1 === tVal2) {
        switch (tVal1) {
            case "null":
            case "String":
            case "Number":
            case "Boolean":
                return val1 === val2;
            case "Array":
            case "Set":
            case "Object":
                return _.isEqual(val1, val2,);
            default: {
                try {
                    return JSON.stringify(val1,) === JSON.stringify(val2,);
                } catch {
                    return false;
                }
            }
        }
    }
    return false;
};
// #endregion

// #region STRING FUNCTIONS: Capitalization, Parsing, Localization
export const UCase = (str,) => `${str}`.toUpperCase();
export const LCase = (str,) => `${str}`.toLowerCase();
export const SCase = (str,) => `${`${str}`.slice(0, 1,).toUpperCase()}${`${str}`.slice(1,)}`;
export const TCase = (str,) =>
    `${str}`
        .split(/\s/u,)
        .map((x, i,) => (i && noCapTitleCase.includes(`${x}`.toLowerCase(),) ? `${x}`.toLowerCase() : SCase(x,)),)
        .join(" ",)
        .replace(/\s+/gu, " ",)
        .trim();
export const Loc = (locRef, formatDict = {},) => {
    if (/^"?scion\./u.test(JSON.stringify(locRef,),)) {
        for (const [key, val,] of Object.entries(formatDict,)) {
            formatDict[key] = Loc(val,);
        }
        return game.i18n.format(locRef, formatDict,) || "";
    }
    return locRef;
};
export const ParseArticles = (str,) => `${str}`.replace(/\b(a|A)\s([aeiouAEIOU])/gu, "$1n $2",);
export const LoremIpsum = (numWords = 200,) => {
    const loremIpsumWords = loremIpsumText.replace(/\n/gu, "",).split(/ /u,);
    while (loremIpsumWords.length < numWords) {
        loremIpsumWords.push(...loremIpsumWords,);
    }
    loremIpsumWords.length = numWords;
    loremIpsumWords[loremIpsumWords.length - 1] = `${loremIpsumWords[loremIpsumWords.length - 1].replace(/[^a-zA-Z]$/u, "",)}.`;
    return loremIpsumWords.join(" ",);
};
// #endregion

// #region NUMBER FUNCTIONS: Parsing
export const Int = (num,) => parseInt(`${Math.round(parseFloat(`${num}`,) || 0,)}`,);
export const Float = (num, sigDigits = 2,) => Math.round((parseFloat(`${num}`,) || 0) * 10 ** sigDigits,) / 10 ** sigDigits;
export const Rand = (n1, n2,) => Math.round(Math.random() * (Math.max(Int(n2,), Int(n1,),) - Math.min(Int(n2,), Int(n1,),)),) + Math.min(Int(n2,), Int(n1,),);
// #endregion

// #region ARRAY FUNCTIONS: Last
export const Last = (arr,) => (Array.isArray(arr,) && arr.length ? arr[arr.length - 1] : undefined);
export const Insert = (arr, val, index,) => {
    arr[Int(index,)] = val;
    return arr;
};
export const Change = (arr, findFunc = (e, i, a,) => true, changeFunc = (e, i, a,) => e,) => {
    const index = arr.findIndex(findFunc,);
    if (index >= 0) {
        arr[index] = changeFunc(arr[index], index, arr,);
        return arr;
    } else {
        return false;
    }
};
export const Remove = (arr, findFunc = (e, i, a,) => true,) => {
    const index = arr.findIndex(findFunc,);
    if (index >= 0) {
        delete arr[index];
        for (let i = index; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        arr.length -= 1;
        return arr;
    } else {
        return false;
    }
};

// const testArray = [0, 1, 2, 3, 4, 5];
// const findFunc = (e, i) => i > 3;
// const changeFunc = (e) => e + 3;
// console.log(Remove(testArray, findFunc, changeFunc));
// console.log(testArray);
// #endregion

// #region OBJECT FUNCTIONS: Dot Notation, MapObject, MakeDictionary
export const KeyMapObj = (obj, keyFunc = (x,) => x, valFunc = undefined,) => {
    /*
     * An object-equivalent Array.map() function, which accepts mapping functions to transform both keys and values.
     *      If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
     */
    [valFunc, keyFunc,] = [valFunc, keyFunc,].filter((x,) => typeof x === "function",);
    keyFunc = keyFunc || ((k,) => k);
    const newObj = {};
    Object.entries(obj,).forEach(([key, val,],) => {
        newObj[keyFunc(key, val,)] = valFunc(val, key,);
    },);
    return newObj;
};
export const Clone = (obj,) => {
    let cloneObj;
    try {
        cloneObj = JSON.parse(JSON.stringify(obj,),);
    } catch (err) {
        // THROW({obj, err}, "ERROR: U.Clone()");
        cloneObj = {...obj,};
    }
    return cloneObj;
};
export const Merge = (target, source, {isMergingArrays = true, isOverwritingArrays = true,} = {},) => {
    target = Clone(target,);
    const isObject = (obj,) => obj && typeof obj === "object";

    if (!isObject(target,) || !isObject(source,)) {
        return source;
    }

    Object.keys(source,).forEach((key,) => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue,) && Array.isArray(sourceValue,)) {
            if (isOverwritingArrays) {
                target[key] = sourceValue;
            } else if (isMergingArrays) {
                target[key] = targetValue.map((x, i,) =>
                    (sourceValue.length <= i ? x : Merge(x, sourceValue[i], {isMergingArrays, isOverwritingArrays,},)),);
                if (sourceValue.length > targetValue.length) {
                    target[key] = target[key].concat(sourceValue.slice(targetValue.length,),);
                }
            } else {
                target[key] = targetValue.concat(sourceValue,);
            }
        } else if (isObject(targetValue,) && isObject(sourceValue,)) {
            target[key] = Merge({...targetValue,}, sourceValue, {isMergingArrays, isOverwritingArrays,},);
        } else {
            target[key] = sourceValue;
        }
    },);

    return target;
};
export const Filter = (obj, testFunc = (v, k,) => true,) =>
    Object.keys(obj,).reduce((newObj, key,) => Object.assign(newObj, testFunc(obj[key], key,) ? {[key]: obj[key],} : {},), {},);
export const Expand = (obj,) => {
    const expObj = {};
    for (let [key, val,] of Object.entries(obj,)) {
        if (getType(val,) === "Object") {
            val = Expand(val,);
        }
        setProperty(expObj, key, val,);
    }
    return expObj;
};
export const Flatten = (obj,) => {
    const flatObj = {};
    for (const [key, val,] of Object.entries(obj,)) {
        if (getType(val,) === "Object") {
            if (isObjectEmpty(val,)) {
                flatObj[key] = val;
            } else {
                for (const [subKey, subVal,] of Object.entries(Flatten(val,),)) {
                    flatObj[`${key}.${subKey}`] = subVal;
                }
            }
        } else {
            flatObj[key] = val;
        }
    }
    return flatObj;
};
export const SumVals = (...objs) => {
    const valKey = objs.pop();
    if (typeof valKey === "object") {
        objs.push(valKey,);
    }
    return objs.reduce(
        (tot, obj,) => tot + Object.values(obj,).reduce((subTot, val,) => subTot + (typeof val === "object" && valKey in val ? val[valKey] : val), 0,),
        0,
    );
};
export const MakeDict = (objRef, valFunc = (v,) => v, keyFunc = (k,) => k,) => {
    const newDict = {};
    for (const key of Object.keys(objRef,)) {
        const val = objRef[key];
        const newKey = keyFunc(key, val,);
        let newVal = valFunc(val, key,);
        if (typeof newVal === "object" && !Array.isArray(newVal,)) {
            const newValProp = ((nVal,) => ["label", "name", "value",].find((x,) => x in nVal,))(newVal,);
            newVal = newValProp && newVal[newValProp];
        }
        if (["string", "number",].includes(typeof newVal,)) {
            newDict[newKey] = Loc(newVal,);
        }
    }
    return newDict;
};

export const NestedValues = (obj, flatVals = [],) => {
    if (obj && typeof obj === "object") {
        for (const key of Object.keys(obj,)) {
            const val = obj[key];
            if (val && typeof val === "object") {
                flatVals.push(...NestedValues(val,),);
            } else {
                flatVals.push(val,);
            }
        }
        return flatVals;
    }
    return [obj,].flat();
};
// #endregion
