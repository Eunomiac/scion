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

    // Determine Path Skills & Randomly Assign Available Skill Dots
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

    // Determine Attribute Arenas, Favored Approach & Randomly Assign Available Skill Dots
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

    // Update itemCreationData with selected path skills, and assign to actorData for later creation
    actorData.testItemCreateData = itemCreateData.map((itemData) => {
        if (itemData.type === "path") {itemData.data.skills = pathSkills[itemData.data.type]}
        return itemData;
    });
    U.LOG({
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
    U.LOG(thisActor, `... ${thisActor.name} Created!`, "TEST CHARACTER CREATION", {style: "data"});
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
            isDebugging: false,
            isDebuggingDragula: false,
            isFormattingGroup: false,
            watchList: []
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
    (async () => loadTemplates(U.FlattenNestedValues(handlebarTemplates).
        map((x) => (typeof x === "function" ? x() : x)))
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
            while (args.length && args.length % 2 === 0) {formatDict[args.shift()] = args.shift()}
            return U.Loc(locString, formatDict);
        },
        count: (val) => Object.values(val)?.length ?? 0,
        concat: (...args) => {
            args.pop();
            args = args.filter((arg) => arg !== "");
            const returnVals = [];
            let delim = "";
            if (args.some((arg) => Array.isArray(arg)) && ["string", "number"].includes(typeof U.Last(args))) {delim = args.pop()}
            for (const arg of _.compact(args)) {returnVals.push(..._.flatten([arg]))}
            return returnVals.join(delim ?? "");
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
        dottype: (category, trait, value, options) => {
            // U.LOG({options, category, trait, value}, "dotType Handler");
            const actor = game.actors.get(options.data.root.actor._id);
            // const iterLog = [];
            if (actor) {
                switch (category) {
                    case "skill": {
                        const dTypes = ["skill"];
                        if (value <= actor.baseSkillVals[trait]) {dTypes.push("base")} else {dTypes.push("general")}
                        return dTypes.join("|");
                    }
                    case "attribute": {
                        const dTypes = ["attribute"];
                        if (value <= actor.baseAttrVals[trait]) {
                            // iterLog.push(`${trait}:${value} <= ${actor.baseAttrVals[trait]}: BASE`);
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
                                // iterLog.push(`${assignedArenaDots + 1} Assigned. Of [${Object.keys(assignedAttrDots).map((attr) => `${attr.slice(0,3)}:${assignedAttrDots[attr]}/${actor.attrVals[attr]}`).join(", ")}], increasing ${thisAttr} from ${assignedAttrDots[thisAttr] - 1} to ${assignedAttrDots[thisAttr]}`);
                            }
                            if (value <= assignedAttrDots[trait]) {
                                // iterLog.push(`${value} > ${actor.baseAttrVals[trait]} <= ${assignedAttrDots[trait]}: ${U.UCase(arena)}`);
                                dTypes.push(arena);
                            } else {
                                // iterLog.push(`${value} > ${assignedAttrDots[trait]}: GENERAL`);
                                dTypes.push("general");
                            }
                        }
                        // U.LOG({log: iterLog}, `Checking ${trait}:${value}`);
                        return dTypes.join("|");
                    }
                    default: return "";
                }
            }

            return "";
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
    U.LOG({
        CONFIG,
        "game": game,
        "... .scion": game.scion
    }, "GLOBALS: Hooks.ready", "SCION", {groupStyle: "l1"});
    CONFIG.isInitializing = false;
});
// #endregion
