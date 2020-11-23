// #region Import Modules
// import _, {map} from "./external/underscore/underscore-esm-min";
import * as U from "./data/utils.js";
import {scionSystemData, itemCategories, signatureChars} from "./data/constants.js";
import {ScionActor} from "./actor/actor.js";
import {ScionActorSheet} from "./actor/actor-sheet.js";
import {ScionItem} from "./item/item.js";
import {ScionItemSheet} from "./item/item-sheet.js";
// import {preloadHandlebarsTemplates} from "./templates.js";
import "./external/gl-matrix-min.js";
// #endregion

// #region Hook: Initialization
Hooks.once("init", async () => {
    console.clear();
    console.log("INITIALIZING SCION.JS ...");
    CONFIG.scion = scionSystemData;

    game.scion = {
        ScionActor,
        ScionItem,
        debug: {
            isDebugging: true,
            watchList: []
        }
    };

    // Define custom Entity classes
    CONFIG.Actor.entityClass = ScionActor;
    CONFIG.Item.entityClass = ScionItem;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("scion", ScionActorSheet, {makeDefault: true});
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("scion", ScionItemSheet, {makeDefault: true});

    // Preload Handlebars Templates
    // preloadHandlebarsTemplates();
    (async () => {
        // Define template paths to load
        const templatePaths = [
            // Actor Sheet Partials
            "systems/scion/templates/actor/chargen/actor-chargen.hbs",
            "systems/scion/templates/actor/chargen/actor-chargen-step-one.hbs",
            "systems/scion/templates/actor/chargen/actor-chargen-step-two.hbs",
            "systems/scion/templates/actor/chargen/actor-chargen-step-three.hbs",
            "systems/scion/templates/actor/chargen/actor-chargen-step-four.hbs",
            "systems/scion/templates/actor/chargen/actor-chargen-step-five.hbs",
            "systems/scion/templates/actor/chargen/actor-chargen-step-six.hbs",
            "systems/scion/templates/actor/chargen/actor-chargen-step-seven.hbs",
            // Item Sheet Partials
            "systems/scion/templates/item/path-block.hbs"
        ];
        /* for (const itemTypes of Object.values(itemCategories))
            for (const itemType of itemTypes)
                templatePaths.push(`systems/scion/templates/item/${itemType}-block.hbs`);

        U.DB({templatePaths}, "templatePaths"); */

        // Load the template parts
        return loadTemplates(templatePaths);
    })();

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
    Object.keys(signatureChars).forEach((sigName) => sigChars.add(sigName));
    ActorDirectory.collection.forEach((data) => { sigChars.delete(data.name) });
    sigChars.forEach((sigName) => {
        const actorData = signatureChars[sigName];
        Actor.create({
            name: sigName,
            type: "character",
            data: actorData
        });
    });
});
// #endregion
