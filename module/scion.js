// #region Import Modules
// import _, {map} from "./external/underscore/underscore-esm-min";
import {_, U, SCION, handlebarTemplates, SIG_CHARS} from "./modules.js";
import {ScionActor, MajorActor, MinorActor, GroupActor} from "./actor/actor.js";
import {MajorActorSheet, MinorActorSheet, GroupActorSheet} from "./actor/actor-sheet.js";
import {ScionItem, Path} from "./item/item.js";
import {PathSheet} from "./item/item-sheet.js";
// import {preloadHandlebarsTemplates} from "./templates.js";
import "./external/gl-matrix-min.js";
// #endregion

// #region Hook: Initialization
Hooks.once("init", async () => {
    console.clear();
    console.log("INITIALIZING SCION.JS ...");
    CONFIG.scion = SCION;

    // Scion namespace within game object
    game.scion = {
        debug: {
            isDebugging: true,
            watchList: []
        }
    };
    // Define custom Entity classes
    CONFIG.Actor.entityClass = ScionActor;
    CONFIG.Item.entityClass = ScionItem;
    CONFIG.Path = Object.assign({}, CONFIG.Item, {entityClass: Path});

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);

    [MajorActorSheet, MinorActorSheet, GroupActorSheet, PathSheet].forEach((cls) => cls.RegisterDefault());
    
    /* MajorActorSheet.RegisterDefault();

    Actors.registerSheet("scion", MajorActorSheet, {
        types: ["major"],
        makeDefault: true,
        label: "scion.sheets.major"
    });
    Actors.registerSheet("scion", MinorActorSheet, {
        types: ["minor"],
        makeDefault: true,
        label: "scion.sheets.minor"
    });
    Actors.registerSheet("scion", GroupActorSheet, {
        types: ["group"],
        makeDefault: true,
        label: "scion.sheets.group"
    });
    Items.unregisterSheet("core", ItemSheet);
    PathSheet.RegisterDefault(); */


    /* Items.registerSheet("scion", PathSheet, {
        types: ["path"],
        makeDefault: true,
        label: "scion.sheets.path"
    }); */

    U.LOG(CONFIG, "CONFIG", "CONFIG", {style: "data"});
    // Preload Handlebars Template Partials
    (async () => loadTemplates(U.FlattenNestedValues(handlebarTemplates).map((x) => (typeof x === "function" ? x() : x))))();

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
    const charNames = Array.from(ActorDirectory.collection).map((data) => data.name);
    Object.keys(SIG_CHARS).forEach((sigName) => {
        if (!charNames.includes(sigName))
            sigChars.add(sigName);
    });
    // ActorDirectory.collection.forEach((data) => { sigChars.delete(data.name) });
    sigChars.forEach((sigName) => {
        const actorData = SIG_CHARS[sigName];
        U.LOG(actorData, "Data", "hookReady", {style: "info", isGrouping: `Creating Major Actor '${sigName}'`, groupStyle: "data"});
        const thisActor = MajorActor.create({
            name: sigName,
            type: "major",
            data: actorData
        });
        U.LOG(thisActor, "Instance", "hookReady");
    });
});
// #endregion
