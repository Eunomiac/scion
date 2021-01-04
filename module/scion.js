// #region Import Modules
import {_, U, SCION, handlebarTemplates, testChars} from "./modules.js";

import {ScionActor} from "./actor/actor.js";
import {MajorActorSheet} from "./actor/actor-major-sheet.js";
import {MinorActorSheet} from "./actor/actor-minor-sheet.js";
import {GroupActorSheet} from "./actor/actor-group-sheet.js";

import {ScionItem} from "./item/item.js";
import {PathItemSheet} from "./item/item-path-sheet.js";
import {ConditionItemSheet} from "./item/item-condition-sheet.js";

import "./external/gl-matrix-min.js";
// #endregion

const createTestChar = async (name) => {
    game.actors.entries.find((actor) => actor.name === name)?.delete();
    const defaultActorData = testChars.actorData;
    const sigCharActorData = testChars.sigChars[name]?.actorData ?? {};
    const actorData = U.Merge(defaultActorData, sigCharActorData);
    const defaultItemData = testChars.itemCreateData;
    const sigCharItemData = testChars.sigChars[name]?.itemCreateData ?? [];
    const itemCreateData = U.Merge(defaultItemData, sigCharItemData);

    // #region Determine Path Skills & Randomly Assign Available Skill Dots
    const skills = Object.keys(SCION.SKILLS.list);
    const baseSkillVals = U.KeyMapObj(SCION.SKILLS.list, () => 0);
    const pathSkills = {
        origin: [],
        role: [],
        pantheon: SCION.PANTHEONS[actorData.pantheon].assetSkills
    };
    ["origin", "role", "pantheon"].forEach((pathType) => {
        const baseVal = U.Clone(actorData.pathPriorities).reverse().findIndex((path) => path === pathType) + 1;
        const skillsToAdd = 3 - pathSkills[pathType].length;
        for (let i = 0; i < skillsToAdd; i++) {
            const availableSkills = skills.filter((skill) => Object.values(pathSkills).flat().filter((pathSkill) => pathSkill === skill).length < 2 && !pathSkills[pathType].includes(skill));
            pathSkills[pathType].push(_.sample(availableSkills));
        }
        for (const skill of pathSkills[pathType]) {baseSkillVals[skill] += baseVal}
    });
    let assignableSkillDots = U.Rand(0, Object.values(actorData.skills.assignableDots).reduce((tot, val) => tot + val, 0));
    while (assignableSkillDots) {
        const availableSkills = skills.filter((skill) => (baseSkillVals[skill] + actorData.skills.list[skill].assigned) < 5);
        actorData.skills.list[_.sample(availableSkills)].assigned++;
        assignableSkillDots--;
    }
    // #endregion

    // #region Determine Attribute Arenas, Favored Approach & Randomly Assign Available Skill Dots
    const attributes = Object.keys(SCION.ATTRIBUTES.list);
    const baseAttrVals = U.KeyMapObj(SCION.ATTRIBUTES.list, (v, k) => (SCION.ATTRIBUTES.approaches[actorData.attributes.favoredApproach].includes(k) ? 3 : 1));
    const priorityAttrs = {
        primary: SCION.ATTRIBUTES.arenas[actorData.attributes.priorities[0]],
        secondary: SCION.ATTRIBUTES.arenas[actorData.attributes.priorities[1]],
        tertiary: SCION.ATTRIBUTES.arenas[actorData.attributes.priorities[2]]
    };
    ["primary", "secondary", "tertiary"].forEach((priority) => {
        let assignableArenaDots = U.Rand(0, actorData.attributes.assignableArenaDots[priority]);
        while (assignableArenaDots) {
            const availableAttrs = priorityAttrs[priority].filter((attr) => (baseAttrVals[attr] + actorData.attributes.list[attr].assigned) < 5);
            actorData.attributes.list[_.sample(availableAttrs)].assigned++;
            assignableArenaDots--;
        }
    });
    let assignableGeneralAttrDots = U.Rand(0, Object.values(actorData.attributes.assignableGeneralDots).reduce((tot, val) => tot + val, 0));
    while (assignableGeneralAttrDots) {
        const availableAttrs = attributes.filter((attr) => (baseAttrVals[attr] + actorData.attributes.list[attr].assigned) < 5);
        actorData.attributes.list[_.sample(availableAttrs)].assigned++;
        assignableGeneralAttrDots--;
    }
    // #endregion

    // #region Randomly Select Callings, Assign Dots, Select Keywords
    const callings = U.KeyMapObj(_.uniq([
        _.sample(SCION.GODS[actorData.patron].callings),
        ..._.sample(Object.keys(SCION.CALLINGS.list), 4)
    ]).slice(0, 3), (k, calling) => calling, (calling) => ({
        name: calling,
        value: 1,
        keywordsChosen: _.sample(U.Loc(`scion.calling.${calling}.keywords`).split(", "), 3),
        keywordsUsed: []
    }));
    let randomCalling = _.sample(Object.keys(callings));
    for (let i = 0; i < 2; i++) {
        callings[randomCalling].value++;
        randomCalling = _.sample(Object.keys(callings));
    }
    const chosenKnacks = [];
    for (const calling of Object.keys(callings)) {
        callings[calling].keywordsChosen.length = callings[calling].value;
        let callingPointsLeft = callings[calling].value;
        while (callingPointsLeft) {
            const availableKnacks = Object.keys(SCION.KNACKS.list).filter((knackName) => {
                const knack = SCION.KNACKS.list[knackName];
                return !chosenKnacks.some((knack) => knack.name === knackName)
                    && ["any", calling].includes(knack.calling)
                    && (callingPointsLeft >= 2 || knack.tier === "heroic");
            }).map((knackName) => ({name: knackName, assignment: calling, ...SCION.KNACKS.list[knackName]}));
            chosenKnacks.unshift(_.sample(availableKnacks));
            callingPointsLeft -= SCION.KNACKS.list[chosenKnacks[0].name].tier === "immortal" ? 2 : 1;
        }
    }
    callings[randomCalling].keywordsUsed = [_.sample(callings[randomCalling].keywordsChosen)];
    actorData.callings.chargen = Object.keys(callings);
    actorData.callings.list = callings;
    actorData.knacks.list = chosenKnacks;

    // #endregion

    // #region Update itemCreationData with selected path skills, and assign to actorData for later item creation
    actorData.testItemCreateData = itemCreateData.map((itemData) => {
        if (itemData.type === "path") {itemData.data.skills = pathSkills[itemData.data.type]}
        return itemData;
    });
    // #endregion


    U.LOG(U.IsDebug() && {
        attrPriorities: actorData.attributes.priorities,
        favoredApproach: actorData.attributes.favoredApproach,
        attributes: actorData.attributes,
        pathPriorities: actorData.pathPriorities,
        pathSkills,
        baseSkillVals,
        skills: actorData.skills,
        items: actorData.testItemCreateData,
        "ACTOR DATA": actorData
    }, `Creating Test Character: ${name} ...`, "TEST CHARACTER CREATION", {style: "data"});
    const thisActor = await Actor.create({
        name,
        type: "major",
        data: actorData
    });
    U.LOG(U.IsDebug() && thisActor, `... ${thisActor.name} Created!`, "TEST CHARACTER CREATION", {style: "data"});
    return thisActor;
};
const createSigChars = async () => {
    for (const sigName of Object.keys(testChars.sigChars)) {await createTestChar(sigName)}
    return true;
};
// #region Hook: Initialization
Hooks.once("init", async () => {
    CONFIG.isHoldingLogs = true;
    CONFIG.isInitializing = true;
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
            isFormattingGroup: true,
            watchList: []
        },
        createSigChars: createSigChars
    };

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
        math: function(v1, operator, v2, options) {
            switch (operator) {
                case "+": return U.Int(v1) + U.Int(v2);
                case "-": return U.Int(v1) - U.Int(v2);
                case "++": return U.Int(v1) + 1;
                case "--": return U.Int(v1) - 1;
                case "*": return U.Int(v1) * U.Int(v2);
                case "/": return U.Int(U.Float(v1) / U.Float(v2));
                case "%": return U.Int(v1) % U.Int(v2);
                case "**": case "^": return U.Int(Math.pow(U.Float(v1), U.Float(v2)));
                case "min": return Math.max(U.Int(v1), U.Int(v2));
                case "max": return Math.min(U.Int(v1), U.Int(v2));
                default: return U.Int(v1);
            }
        },
        test: function(v1, operator, v2) {
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
        case: function(v1, operator) {
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
            const [categories, trait, subTrait] = args;
            const [cat, subCat] = categories.split(":");
            const actor = game.actors.get(options.data.root.actor._id);
            switch (cat) {
                case "calling": {
                    const callings = Object.values(actor.getProp("data.callings.list")).filter((v) => Boolean(v));
                    switch (subCat) {
                        case "other": {
                            if (callings.filter((calling) => calling.name in SCION.CALLINGS.list).length >= 2
                                && !callings.some((calling) => SCION.GODS[actor.getProp("data.patron")].callings.includes(calling.name))) {
                                return "invalid";
                            }
                        }
                        // falls through
                        case "patron": {
                            if (callings.map((calling) => calling.name).includes(trait)) {
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
                    const calling = actor.callings[subTrait];
                    if (actor.getKnacksValue([knackData]) > (calling.value - actor.getKnacksValue(calling.knacks))) {
                        return "invalid";
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
