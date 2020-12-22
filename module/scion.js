// #region Import Modules
import {_, U, SCION, handlebarTemplates, signatureChars} from "./modules.js";

import {ScionActor} from "./actor/actor.js";
import {MajorActorSheet} from "./actor/actor-major-sheet.js";
import {MinorActorSheet} from "./actor/actor-minor-sheet.js";
import {GroupActorSheet} from "./actor/actor-group-sheet.js";

import {ScionItem} from "./item/item.js";
import {PathItemSheet} from "./item/item-path-sheet.js";
import {ConditionItemSheet} from "./item/item-condition-sheet.js";

import "./external/gl-matrix-min.js";
// #endregion

const createSigChars = async (isDeletingOriginals = false, isClearing = false, nameFilter) => {
    if (isDeletingOriginals) {
        for (const id of ActorDirectory.collection.keys())
            await game.actors.get(id).delete();
        for (const id of ItemDirectory.collection.keys())
            await game.items.get(id).delete();
    }
    const sigChars = new Set();
    const charNames = Array.from(ActorDirectory.collection).map((data) => data.name);
    (nameFilter ?? Object.keys(signatureChars)).forEach((sigName) => {
        if (!charNames.includes(sigName))
            sigChars.add(sigName);
    });
    for (const sigName of sigChars) {
        const {actorData, itemCreateData} = signatureChars[sigName];
        if (itemCreateData) {
            const skillCounts = U.KeyMapObj(SCION.SKILLS, (k) => k, () => 0);
            const pantheonPathSkills = SCION.PANTHEONS[actorData.pantheon].assetSkills;
            pantheonPathSkills.forEach((skill) => skillCounts[skill]++);
            actorData.callings = itemCreateData.map((itemData) => {
                if (["origin", "role"].includes(itemData.data.type) && !itemData.data.skills.length) {
                    itemData.data.skills = _.sample(Object.keys(_.omit(skillCounts, (v) => v === 2)), 3);
                    itemData.data.skills.forEach((skill) => skillCounts[skill]++);
                } else if (itemData.data.type === "pantheon") {
                    itemData.data.skills[0] = pantheonPathSkills[0];
                    itemData.data.skills[1] = pantheonPathSkills[1];
                    if (itemData.data.skills.length === 2)
                        itemData.data.skills[2] = _.sample(Object.keys(_.omit(skillCounts, (v) => v === 2)));
                    skillCounts[itemData.data.skills[2]]++;
                }
                return itemData;
            });
        }
        U.LOG(actorData, `Creating Signature Character: ${sigName} ...`, "SIGNATURE CHARACTER CREATION", {style: "data"});
        const thisActor = await Actor.create({
            name: sigName,
            type: "major",
            data: actorData
        });
        U.LOG(thisActor, `... ${thisActor.name} Created!`, "SIGNATURE CHARACTER CREATION", {style: "data"});
    }
    return true;
};
// #region Hook: Initialization
Hooks.once("init", async () => {
    CONFIG.isHoldingLogs = true;
    console.clear();
    CONFIG.scion = SCION;

    game.scion = {
        baseActor: ScionActor,
        baseItem: ScionItem,
        actorSheets: {
            major: MajorActorSheet,
            minor: MinorActorSheet,
            group: GroupActorSheet
        },
        itemSheets: {
            path: PathItemSheet,
            condition: ConditionItemSheet
        },
        debug: {
            isDebugging: true,
            isDebuggingDragula: false,
            isFormattingGroup: false,
            watchList: ["Rhys Callaghan", "SIGNATURE CHARACTER CREATION"]
        },
        createSigChars: createSigChars
    };

    U.LOG("INITIALIZING SCION.JS ...");

    // Define custom Entity classes
    CONFIG.Actor.entityClass = ScionActor;
    CONFIG.Item.entityClass = ScionItem;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Object.keys(game.scion.actorSheets).forEach((entityType) => {
        game.scion.actorSheets[entityType].RegisterSheet(entityType, [entityType]);
    });

    Items.unregisterSheet("core", ItemSheet);
    // ScionItemSheet.RegisterSheet("item", ["item"]);
    Object.keys(game.scion.itemSheets).forEach((entityType) => game.scion.itemSheets[entityType].RegisterSheet(entityType, [entityType]));

    // Preload Handlebars Template Partials
    (async () => loadTemplates(U.FlattenNestedValues(handlebarTemplates)
        .map((x) => (typeof x === "function" ? x() : x)))
    )();

    // #region Handlebar Helpers
    Handlebars.registerHelper({
        for: (n, options) => {
            const results = [];
            const data = Handlebars.createFrame(options.data);
            for (let i = 1; i <= n; i++) {
                data.index = i;
                results.push(options.fn(i, {data}));
            }
            return results.join("");
        },
        loc: (...args) => {
            args.pop();
            const locString = args.shift();
            const formatDict = {};
            while (args.length && args.length % 2 === 0)
                formatDict[args.shift()] = args.shift();
            return U.Loc(locString, formatDict);
        },
        count: (val) => Object.values(val)?.length || 0,
        concat: (...args) => args.slice(0, -1).join(""),
        contains: (arr, val) => arr.includes(val),
        math: function (v1, operator, v2, options) {
            switch (operator) {
                case "+": return U.Int(v1) + U.Int(v2);
                case "-": return U.Int(v1) - U.Int(v2);
                case "++": return U.Int(v1) + 1;
                case "--": return U.Int(v1) - 1;
                case "*": return U.Int(v1) * U.Int(v2);
                case "/": return U.Int(U.Float(v1) / U.Float(v2));
                case "%": return U.Int(v1) % U.Int(v2);
                case "**": case "^": return U.Int(Math.pow(U.Float(v1), U.Float(v2)));
                default: return U.Int(v1);
            }
        },
        test: function (v1, operator, v2) {
            /* eslint-disable eqeqeq */
            switch (operator) {
                case "==": return (v1 == v2);
                case "===": return (v1 === v2);
                case "!=": return (v1 != v2);
                case "!==": return (v1 !== v2);
                case "<": return (v1 < v2);
                case "<=": return (v1 <= v2);
                case ">": return (v1 > v2);
                case ">=": return (v1 >= v2);
                case "&&": return (v1 && v2);
                case "||": return (v1 || v2);
                default: return true;
            }
        },
        article: (val) => U.ParseArticles(val),
        case: function (v1, operator) {
            switch (U.LCase(operator.charAt(0))) {
                case "l": return U.LCase(v1);
                case "u": return U.UCase(v1);
                case "s": return U.SCase(v1);
                case "t": return U.TCase(v1);
                default: return v1;
            }
        }
    });
    // #endregion
});
// #endregion

// #region Hook: Ready
Hooks.once("ready", async () => {
    U.ReleaseLogs();
    // Make Localized Dictionaries for Handlebar Select Options
    CONFIG.scion.tierList = U.MakeDict(CONFIG.scion.TIERS);
    CONFIG.scion.pantheonList = U.MakeDict(CONFIG.scion.PANTHEONS);
    CONFIG.scion.genesisList = U.MakeDict(CONFIG.scion.GENESES);
    CONFIG.scion.favoredApproachList = U.MakeDict(
        CONFIG.scion.ATTRIBUTES.approaches,
        (v, k) => U.Loc(`scion.game.${k}`)
    );
    await createSigChars();
    U.LOG({
        CONFIG,
        "game": game,
        "... .scion": game.scion
    }, "GLOBALS: Hooks.ready", "SCION", {groupStyle: "l1"});
});
// #endregion
