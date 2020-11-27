// #region Import Modules
import {_, U, C, SCION, itemCategories, handlebarTemplates, signatureChars} from "./data/utils.js";
import {ScionActor} from "./actor/actor.js";
import {ScionActorSheet} from "./actor/actor-sheet.js";
import {ScionItem} from "./item/item.js";
import {ScionItemSheet} from "./item/item-sheet.js";
import "./external/gl-matrix-min.js";
// #endregion

// #region Hook: Initialization
Hooks.once("init", async () => {
    console.clear();
    console.log("INITIALIZING SCION.JS ...");

    game.scion = {
        ScionActor,
        ScionItem,
        debug: {
            isDebugging: true,
            watchList: []
        }
    };

    // Register System-Specific Constants
    CONFIG.scion = SCION;

    // Debug
    // CONFIG.debug.hooks = true;

    // Define custom Entity classes
    CONFIG.Actor.entityClass = ScionActor;
    CONFIG.Item.entityClass = ScionItem;

    U.LOG(CONFIG, "[CONFIG]", "CONFIG", {style: "info"});

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("scion", ScionActorSheet, {makeDefault: true});
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("scion", ScionItemSheet, {makeDefault: true});

    U.LOG(U.FlattenNestedValues(handlebarTemplates), "[Handlebar Templates]", "CONFIG", {style: "info"});
    // Preload Handlebars Template Partials
    (
        async () => loadTemplates(U.FlattenNestedValues(handlebarTemplates).map((x) => (typeof x === "function" ? x() : x)))
    )();

    // #region Handlebar Helpers
    Handlebars.registerHelper("display", (...args) => {
        const [path, key] = args;
        const pathParts = path.split(".");
        let ref;
        while (typeof ref === "object" && pathParts.length)
            ref = ref[pathParts.shift()];
        if (typeof ref === "object" && key in ref)
            ref = ref[key];
        if (typeof ref === "object" && "label" in ref)
            ref = ref.label;
        return typeof ref === "object" ? "&lt;DISPLAY ERROR&gt;" : ref;
    });

    Handlebars.registerHelper("dotstate", (...args) => {
        const [trait, dotVal, data] = args;
        const actData = data.data.root.data.attributes.list;
        return (trait in actData && actData[trait].value >= parseInt(dotVal)) ? "full" : "";
    });

    Handlebars.registerHelper("for", (n, options) => {
        const results = [];
        const data = Handlebars.createFrame(options.data);
        for (let i = 1; i <= n; i++) {
            data.index = i;
            results.push(options.fn(i, {data}));
        }
        return results.join("");
    });

    Handlebars.registerHelper("concat", (...args) => args.slice(0, -1).join(""));
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
    // const charNames = Array.from(ActorDirectory.collection).map((data) => data.name);
    const charNames = ActorDirectory.collection.map((x) => x.name);
    console.log(charNames);
    Object.keys(signatureChars).forEach((sigName) => {
        if (!charNames.includes(sigName))
            sigChars.add(sigName);
    });
    // ActorDirectory.collection.forEach((data) => { sigChars.delete(data.name) });
    sigChars.forEach((sigName) => {
        const actorData = signatureChars[sigName];
        U.LOG(actorData, "Sig Char Creation", "hookReady");
        Actor.create({
            name: sigName,
            type: "character",
            data: actorData
        });
    });
});
// #endregion
