// #region Import Modules
import {_, U, SCION, handlebarTemplates, signatureChars} from "./modules.js";

import {ScionActor} from "./actor/actor.js";
import {MajorActorSheet} from "./actor/actor-major-sheet.js";
import {MinorActorSheet} from "./actor/actor-minor-sheet.js";
import {GroupActorSheet} from "./actor/actor-group-sheet.js";

import {ScionItem} from "./item/item.js";
import {PathItemSheet} from "./item/item-path-sheet.js";

import "./external/gl-matrix-min.js";
// #endregion

// #region Hook: Initialization
Hooks.once("init", async () => {
    console.clear();
    console.log("INITIALIZING SCION.JS ...");
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
            path: PathItemSheet
        },
        debug: {
            isDebugging: true,
            isDebuggingDragula: true,
            watchList: []
        }
    };
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
        add: (...args) => args.slice(0, -1).reduce((tot, x) => x + tot, 0),
        concat: (...args) => args.slice(0, -1).join(""),
        contains: (arr, val) => arr.includes(val)
    });
    // #endregion
});
// #endregion

// #region Hook: Ready
Hooks.once("ready", async () => {
    // Make Localized Dictionaries for Handlebar Select Options
    CONFIG.scion.tierList = U.MakeDict(CONFIG.scion.TIERS);
    CONFIG.scion.pantheonList = U.MakeDict(CONFIG.scion.PANTHEONS);
    CONFIG.scion.genesisList = U.MakeDict(CONFIG.scion.GENESES);
    CONFIG.scion.favoredApproachList = U.MakeDict(
        CONFIG.scion.ATTRIBUTES.approaches,
        (v, k) => U.Loc(`scion.game.${k}`)
    );

    // If any signature characters are missing, create them
    const sigChars = new Set();
    const charNames = Array.from(ActorDirectory.collection).map((data) => data.name);
    Object.keys(signatureChars).forEach((sigName) => {
        if (!charNames.includes(sigName))
            sigChars.add(sigName);
    });
    // ActorDirectory.collection.forEach((data) => { sigChars.delete(data.name) });
    sigChars.forEach((sigName) => {
        const actorData = signatureChars[sigName];
        U.LOG(actorData, `Creating Signature Character: ${sigName}`, "hookReady", {style: "data"});
        Actor.create({
            name: sigName,
            type: "major",
            data: actorData
        });
    });

    U.GLOG({
        CONFIG,
        "game": game,
        "... .scion": game.scion
    }, "GLOBALS: Hooks.ready", "SCION", {groupStyle: "l1"});
});
// #endregion
