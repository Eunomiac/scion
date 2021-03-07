// #region Import Modules
import {_, U, SCION, handlebarTemplates, testChars} from "./modules.js";

import ScionActor from "./actor/actor.js";
import MajorActorSheet from "./actor/actor-major-sheet.js";
import MinorActorSheet from "./actor/actor-minor-sheet.js";
import GroupActorSheet from "./actor/actor-group-sheet.js";

import ScionItem from "./item/item.js";
import PathItemSheet from "./item/item-path-sheet.js";
import ConditionItemSheet from "./item/item-condition-sheet.js";
import CultItemSheet from "./item/birthrights/birthright-cult-sheet.js";
import CovenantItemSheet from "./item/birthrights/birthright-covenant-sheet.js";
import CreatureItemSheet from "./item/birthrights/birthright-creature-sheet.js";
import FollowerItemSheet from "./item/birthrights/birthright-follower-sheet.js";
import GuideItemSheet from "./item/birthrights/birthright-guide-sheet.js";
import RelicItemSheet from "./item/birthrights/birthright-relic-sheet.js";

import "./external/gl-matrix-min.js";
// #endregion


// #region Hook: Initialization
Hooks.once("init", async () => {
    CONFIG.isHoldingLogs = true;
    CONFIG.isInitializing = true;
    // CONFIG.debug.hooks = true;
    // console.clear();
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
            condition: ConditionItemSheet,
            covenant: CovenantItemSheet,
            creature: CreatureItemSheet,
            cult: CultItemSheet,
            follower: FollowerItemSheet,
            guide: GuideItemSheet,
            relic: RelicItemSheet
        },
        debug: {
            isDebugging: true,
            isDebuggingDragula: true,
            isFullDebugConsole: true,
            watchList: ["Rhys"]
        }
    };

    window.scion = {
        report: () => {
            game.actors.entries.forEach((actor) => {
                const fullReportData = actor.fullLogReport;
                const reportData = {
                    ..._.pick(fullReportData, (v, k) => k.startsWith(".*.")),
                    INSTANCE: actor,
                    "... data": actor.data,
                    ..._.omit(fullReportData, (v, k) => k.startsWith(".") || k.startsWith("this")),
                    "ITEM REPORT": {
                        ids: _.groupBy(Array.from(actor.items), (item) => item.$subtype), // (item) => `id: ${item.id}, type: ${item.$subtype}, link: ${item.data.data.linkedItem}`),
                        data: _.groupBy(Array.from(actor.items).map((item) => ({id: item.id, link: item.data.data.linkedItem ?? null, ...item.data.data})), (item) => item.type),
                        instances: _.groupBy(Array.from(actor.items, (item) => item.$subtype))
                    }
                };
                U.LOG(reportData, `"${actor.name}" (${actor.id})`, "ACTOR REPORT", {isLoud: true});
            });
        },
        getActor: (name) => game.actors.entries.find((actor) => new RegExp(`^${name}`).test(actor.name)),
        getActorItems: (name) => {
            const actor = game.actors.entries.find((entity) => new RegExp(`^${name}`).test(entity.name));
            U.LOG({
                "ITEM REPORT": Array.from(actor.items).map((item) => ({id: item.id, linkedTo: item.data.data.linkedItem ?? null, ...item.data.data})),
                "...items": actor.items
            }, "ACTOR ITEMS", actor.name, {isLoud: true});
        },
        createSigChars: testChars.createSigChars
    }

    U.LOG(U.IsDebug() && "INITIALIZING SCION.JS ...");

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
    (async () => loadTemplates(U.NestedValues(handlebarTemplates).
        map((x) => (typeof x === "function" ? x() : x)))
    )();

    // #region Handlebar Helpers
    Handlebars.registerHelper({
        for: (n, options) => {            
            const results = [];
            const data = Handlebars.createFrame(options.data);
            for (let i = 0; i < n; i++) {
                data.index = i;
                try {
                    results.push(options.fn(i, {data}));
                } catch {
                    results.push(`Bad For at ${i} of ${n}`);
                }
            }
            return results.join("");
        },
        loc: (...args) => {
            args.pop();
            const locString = args.shift();
            const formatDict = {};
            while (args.length && args.length % 2 === 0) {formatDict[args.shift()] = args.shift()}
            return U.Loc(locString, formatDict);
        },
        count: (val) => Object.values(val ?? {})?.length ?? 0,
        concat: (...args) => {
            args.pop();
            args = args.filter((arg) => arg !== "");
            const returnVals = [];
            let delim = "";
            if (args.some((arg) => Array.isArray(arg)) && ["string", "number"].includes(typeof U.Last(args))) {delim = args.pop()}
            for (const arg of _.compact(args)) {returnVals.push(..._.flatten([arg]))}
            return returnVals.join(delim ?? "");
        },
        wrap: (content, tag) => new Handlebars.SafeString(`<${tag}>${content}</${tag}>`),
        split: (string, ...args) => {
            args.pop();
            const delim = args[0] ?? ",";
            return `${string}`.split(`${delim}`).map((str) => `${str}`.trim());
        },
        merge: (...args) => {
            args.pop();
            args = args.filter((arg) => arg && typeof arg === "object" && (Array.isArray(arg) || Array.isArray(Object.keys(arg))));
            let mergedObject = {};
            while (args.length) {
                mergedObject = U.Merge(mergedObject, args.shift());
            }
            return mergedObject;
        },
        bundle: (...args) => {
            args.pop();
            const bundle = {};
            while (args.length && args.length % 2 === 0) {
                bundle[args.shift()] = args.shift();
            }
            return bundle;
        },
        math(v1, operator, v2, options) {
            switch (operator) {
                case "+": return U.Int(v1) + U.Int(v2);
                case "-": return U.Int(v1) - U.Int(v2);
                case "++": return U.Int(v1) + 1;
                case "--": return U.Int(v1) - 1;
                case "*": return U.Int(v1) * U.Int(v2);
                case "/": return U.Int(U.Float(v1) / U.Float(v2));
                case "%": return U.Int(v1) % U.Int(v2);
                case "**": case "^": return U.Int(U.Float(v1) ** U.Float(v2));
                case "min": return Math.max(U.Int(v1), U.Int(v2));
                case "max": return Math.min(U.Int(v1), U.Int(v2));
                default: return U.Int(v1);
            }
        },
        test(v1, operator, v2) {
            /* eslint-disable eqeqeq */
            switch (operator) {
                case "==": return v1 == v2;
                case "===": return v1 === v2;
                case "!=": return v1 != v2;
                case "!==": return v1 !== v2;
                case "<": return v1 < v2;
                case "<=": return v1 <= v2;
                case ">": return v1 > v2;
                case ">=": return v1 >= v2;
                case "&&": return v1 && v2;
                case "||": return v1 || v2;
                case "not": return !v1;
                case "in": {
                    if (Array.isArray(v2)) {return v2.includes(v1)}
                    if (typeof v2 === "object" && Array.isArray(Object.keys(v2))) {return Object.keys(v2).includes(v1)}
                    if (["string", "number"].includes(typeof v2)) {return `${v2}`.includes(`${v1}`)}
                    return false;
                }
                default: return Boolean(v1);
            }
        },
        article: (val) => U.ParseArticles(val),
        case(v1, operator) {
            switch (U.LCase(operator.charAt(0))) {
                case "l": return U.LCase(v1);
                case "u": return U.UCase(v1);
                case "s": return U.SCase(v1);
                case "t": return U.TCase(v1);
                default: return v1;
            }
        },
        checkInvalid: (...args) => {
            const options = args.pop();
            const actorID = U.Remove(args, (val) => typeof val === "string" && game.actors.get(val)) || options.data.root.actor?._id;
            const [categories, trait, subTrait] = args;
            const [cat, subCat] = categories.split(":");
            U.LOG({args, options, actorID, parsed: {
                categories,
                cat,
                subCat,
                trait,
                subTrait
            }}, "checkInvalid", "checkInvalid", {groupStyle: "l3"});
            const actor = game.actors.get(actorID);
            switch (cat) {
                case "skill": {
                    switch (subCat) {
                        case "path": {
                            if (actor.pathSkills[trait].includes(subTrait)) {
                                return "invalid";
                            }
                            if (_.countBy(_.flatten(Object.values(actor.pathSkills)), (skill) => skill)[subTrait] >= 2) {
                                return "invalid";
                            }
                            break
                        }
                        // no default
                    }
                    break;
                }
                case "calling": {
                    const callings = U.Clone(Object.values(actor.callings));
                    switch (subCat) {
                        case "other": {
                            if (callings.length >= 2
                                && !callings.some((calling) => SCION.GODS[actor.$data.patron].callings.includes(calling.name))) {
                                return "invalid";
                            }
                        }
                        // falls through
                        case "patron": {
                            if (trait in actor.callings) {
                                return "invalid";
                            }
                            break;
                        }
                        // no default
                    }
                    break;
                }
                case "knack": {
                    const [knackData, knackName] = [SCION.KNACKS.list[trait], trait];
                    if (actor.knacks.some((knack) => knack.name === knackName)) {
                        return "hidden";
                    }
                    if (subTrait) {
                        const calling = actor.callings[subTrait];
                        if (actor.getKnacksValue([knackData]) > (calling.value - actor.getKnacksValue(calling.knacks))) {
                            return "invalid";
                        }
                    }
                    break;                    
                }
                // no default
            }
            return "";
        },
        dottype: (category, trait, value, options) => {
            const actor = game.actors.get(options.data.root.actor._id);
            const dTypes = [];
            if (actor) {
                switch (category) {
                    case "skill": {
                        dTypes.push("skill");
                        if (value <= actor.baseSkillVals[trait]) {dTypes.push("base")} else {dTypes.push("general")}
                        break;
                    }
                    case "attribute": {
                        dTypes.push("attribute");
                        if (value <= actor.baseAttrVals[trait]) {
                            dTypes.push("base");
                        } else {
                            const arena = _.findKey(SCION.ATTRIBUTES.arenas, (attrs) => attrs.includes(trait));
                            let assignedArenaDots = actor.assignedArenaAttrDots[arena];
                            const assignedAttrDots = U.Clone(_.pick(actor.baseAttrVals, (v, attr) => SCION.ATTRIBUTES.arenas[arena].includes(attr)));
                            while (assignedArenaDots) {
                                try {
                                    const [[thisAttr]] = _.sortBy(Object.entries(_.omit(assignedAttrDots, (val, attr) => val === actor.attrVals[attr])), (v) => v[1] - actor.attrVals[v[0]]);
                                    assignedAttrDots[thisAttr]++;
                                    assignedArenaDots--;
                                } catch (err) {
                                    return "";
                                }
                            }
                            if (value <= assignedAttrDots[trait]) {
                                dTypes.push(arena);
                            } else {
                                dTypes.push("general");
                            }
                        }
                        break;
                    }
                    case "calling": {
                        dTypes.push("calling");
                        if (value === 1) {
                            dTypes.push("base");
                        } else {
                            dTypes.push("general");
                        }
                        break;
                    }
                    // no default
                }
            }

            return dTypes.join("|");
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
    CONFIG.scion.favoredApproachList = U.MakeDict(CONFIG.scion.ATTRIBUTES.approaches, (v, k) => U.Loc(`scion.game.${k}`));
    U.LOG(U.IsDebug() && {
        CONFIG,
        "game": game,
        "... .scion": game.scion
    }, "GLOBALS: Hooks.ready", "SCION", {groupStyle: "l1"});
    CONFIG.isInitializing = false;
});
// #endregion
Hooks.on("createActor", (actor, options) => {
    actor.createItemData = actor.createItemData ?? [];
    switch (actor.data.type) {
        case "major": {
            U.LOG({createItemData: actor.createItemData}, "Creating 3x Owned Path Items ► 'Origin', 'Role', 'Pantheon'", `on.createActor: '${actor.name}'`, {groupStyle: "l3"});
            actor.createItemData.push(...["origin", "role", "pantheon"].map((pathType) => (
                {
                    name: U.Loc(`scion.path.${pathType}`),
                    type: "path",
                    data: { type: pathType }
                }
            )));
            actor.createOwnedItem(actor.createItemData);
            break;
        }
        default: return true;
    }
    return true;
});


Hooks.on("createOwnedItem", (actor, itemData) => actor.items.find((_item) => _item.$id === itemData._id)?.initSubItems());