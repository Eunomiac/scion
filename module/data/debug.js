const groupStyles = {
    data: "color: black; background-color: white; font-family: Oswald; font-size: 16px; font-weight: bold; padding: 0px 5px;",
    info: "color: black; background-color: grey; font-family: Voltaire; font-size: 14px; font-weight: bold; padding: 0px 5px;",
    log: "color: white; background-color: black; font-family: 'Fira Code'; font-size: 12px; font-weight: bold; padding: 2px;",
    debug: "color: black; background-color: grey; font-family: 'Fira Code'; font-size: 12px; font-weight: bold; padding: 2px;",
    error: "color: #FAA; background-color: #A00; font-family: Oswald; font-size: 16px; font-weight: bold; padding: 0 5px;",
    trace: "color: gold; width: 400px; min-width: 400px; background-color: #550; font-family: Oswald; font-size: 14px; line-height: 14px; font-weight: bold; padding: 2px 400px 2px 10px;",
    l1: "color: cyan; background-color: #003; font-family: Oswald; font-size: 16px; font-weight: bold; padding: 0 5px;",
    l2: "color: lime; background-color: #030; font-family: Oswald; font-size: 14px; font-weight: bold; padding: 0 5px;",
    l3: "color: khaki; background-color: #330; font-family: Voltaire; font-size: 12px; font-weight: bold; padding: 0 2px;",
    l4: "color: magenta; background-color: #303; font-family: Oswald; font-size: 16px; font-weight: bold; padding: 0 2px;"
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
    l4: "color: magenta; background-color: #303; font-family: Oswald; font-size: 16px; padding: 0 2px;"
};
const delayedLogQueue = [];
const stackTraceBlacklist = [
    /jquery\.min\.js/u
];
export const Initialize = ({isDebugging=true, isStylingGroups=true, isHoldingLogs=true, isClearingConsole=true, watchList=[], blackList=[], traceBlackList=[]} = {}) => {
    CONFIG.hDebug = {isDebugging, isStylingGroups, isHoldingLogs, watchList, blackList, traceBlackList};
    if (isClearingConsole)
        console.clear();
    LOG("Initializing Herald Debugger ...", null, "Herald DB", {style: "l1"});
};
/*
const testStack = `Error
    at stackTrace (http://localhost:30000/systems/scion/module/data/utils.js:33:25)
    at Module.LOG (http://localhost:30000/systems/scion/module/data/utils.js:68:143)
    at HTMLDivElement.<anonymous> (http://localhost:30000/systems/scion/module/mixins/generalMixins.js:207:27)
    at Function.each (http://localhost:30000/scripts/jquery.min.js:2:2976)
    at S.fn.init.each (http://localhost:30000/scripts/jquery.min.js:2:1454)
    at MajorActorSheet.activateListeners (http://localhost:30000/systems/scion/module/mixins/generalMixins.js:181:46)
    at MajorActorSheet.activateListeners (http://localhost:30000/systems/scion/module/mixins/generalMixins.js:59:15)
    at MajorActorSheet.activateListeners (http://localhost:30000/systems/scion/module/actor/actor-major-sheet.js:99:15)
    at MajorActorSheet._render (http://localhost:30000/scripts/foundry.js:4537:10)
    at async MajorActorSheet._render (http://localhost:30000/scripts/foundry.js:5163:5)
    at stackTrace (http://localhost:30000/systems/scion/module/data/utils.js:33:25)
    at Module.LOG (http://localhost:30000/systems/scion/module/data/utils.js:73:90)
    at Function.RegisterSheet (http://localhost:30000/systems/scion/module/item/item-sheet.js:20:11)
    at http://localhost:30000/systems/scion/module/scion.js:53:98
    at Array.forEach (<anonymous>)
    at http://localhost:30000/systems/scion/module/scion.js:53:40
    at Function._call (http://localhost:30000/scripts/foundry.js:2496:14)
    at Function.callAll (http://localhost:30000/scripts/foundry.js:2456:12)
    at Game.initialize (http://localhost:30000/scripts/foundry.js:6465:11)
    at window.addEventListener.once (http://localhost:30000/scripts/foundry.js:7436:8)`;
const testStackMapped = testStack
    .replace(/(\n\s+at\s+)(http:[^\n]+)(\n?)/gu, "$1BASE ($2)$3")
    .split(/\n\s+at\s+/gu)
    .slice(1)
    .filter((line) => !stackTraceBlacklist.some((regex) => regex.test(line)))
    .map((line) => line.replace(/http:\/\/localhost:[^:]*?(\/scion\/(module\/)?|\/scripts\/)/gu, ""))
    .map((line) => (line.match(/^([^(]+)(?: \(|)([^())]*)\)?$/u) || []).slice(1, 3))
    .map(([name, loc]) => [name.toUpperCase(), ...loc.replace(":","=").split("=")]);
console.log(testStackMapped);
*/
const isDebugging = (tag, {isLoud}) => isLoud 
    || CONFIG.hDebug.isDebugging && !CONFIG.hDebug.blackList.includes(tag)
    || CONFIG.hDebug.watchList.includes(tag);
const stackTrace = () => {
    const stackString = new Error().stack;
    const stack = stackString
        .replace(/(\n\s+at\s+)(http:[^\n]+)(\n?)/gu, "$1<Anonymous> ($2)$3")
        .split(/\n\s+at\s+/gu)
        .slice(1);
        .filter()

        .filter((line) => !stackTraceBlacklist.some((regex) => regex.test(line)))
        .map((line) => line.replace(/http:\/\/localhost:[^:]*?(\/scion\/(module\/)?|\/scripts\/)/gu, ""))
        .map((line) => (line.match(/^([^(]+)(?: \(|)([^())]*)\)?$/u) || []).slice(1, 3))
        .map(([name, loc]) => [name, ...loc.replace(":","=").split("=")]);
    while (stack.length && (stack[0] || []).join(" ").includes("utils.js"))
        stack.shift();
    return [
        stack.shift(),
        Object.assign(
            KeyMapObj(
                stack,
                (k, v) => `${v[0]} (${v[1]})`,
                (v) => _.last(v)
            ),
            {"traceString:": stackString.replace(/ +/gu, " ").replace(/Error/u, "")}
        )
    ];
};
const logLine = (output, title, {style, groupStyle, isGrouping}) => {
    if (isGrouping)
        console.groupCollapsed(`%c ${isGrouping.replace(/[\[\]]/gu, "")}`, groupStyles[groupStyle]);
    if (output)
        console.log(`%c ${title.replace(/[\[\]]/gu, "")}`, logStyles[style], output);
    else
        console.log(`No Output for ${title}`);
};
const logStackTrace = (stack) => {
    if (stack) {
        const [stackRef, stackData] = stack;
        Object.entries(stackData).forEach(([locRef, lineRef], i) => {
            const style = /foundry\.js/u.test(locRef) && "traceFoundry"
                || locRef === "traceString:" && "traceString"
                || "traceLocal";
            if (i === 0)
                logLine(lineRef, locRef, {style, groupStyle: "trace", isGrouping: `STACK TRACE [${stackRef.shift()}]: ${stackRef.join(" at ")}`});
            else
                logLine(lineRef, locRef, {style});
        });
        console.groupEnd();
    }
};
const logGroup = (outputs, groupTitle, tag, {style, groupStyle}, stackTrace) => {
    if (["number", "string"].includes(typeof outputs)) {
        logGroup({}, outputs, tag, {style, groupStyle}, stackTrace);
    } else {
        if (Array.isArray(outputs))
            outputs = outputs.map((x, i) => ({[`${i}. ${JSON.stringify(x)}`]: ""}));
        outputs = Object.entries(outputs);
        (([lineTitle, lineOutput]) => {
            logLine(lineOutput, lineTitle, {style, groupStyle, isGrouping: _.compact([tag && `[${tag}]`, groupTitle]).join(" ")});
        })(outputs.shift() || [null, null]);
        outputs.forEach(([lineTitle, lineOutput]) => {
            logLine(lineOutput, lineTitle, {style});
        });
        logStackTrace(stackTrace);
        console.groupEnd();
    }
};
export const LOG = (outputs = {title: Object}, groupTitle = "", tag = undefined, {style="log", groupStyle="data", isLoud=false} = {}, stack = stackTrace()) => {
    if (isDebugging(tag, {isLoud}))
        if (CONFIG.isHoldingLogs)
            delayedLogQueue.push([outputs, groupTitle, tag, {style, groupStyle, isLoud}, stack]);
        else
            logGroup(outputs, groupTitle, tag, {style, groupStyle}, stack);
};
export const ReleaseLogs = () => {
    CONFIG.isHoldingLogs = false;
    const logQueue = [...delayedLogQueue];
    delayedLogQueue.length = 0;
    logQueue.forEach((log) => LOG(...log));
};
export const DB = (data, tag, {isLoud=false} = {}) => LOG(data, tag ? `[DB: ${tag}]` : "[DB]", null, {groupStyle: "debug", style: "debug", isLoud});
export const THROW = (data, tag, {isLoud=true} = {}) => LOG(data, tag ? `[${tag} ERROR]` : "[ERROR]", null, {groupStyle: "error", style: "error", isLoud}) && false;
// #endregion