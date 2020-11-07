// #region Import Modules
// import _, {map} from "./external/underscore/underscore-esm-min";
import * as U from "./data/utils.js";
// import "../scripts/inline/dragula.js";
import {scionSystemData} from "./data/constants.js";
import {ScionActor} from "./actor/actor.js";
import {ScionActorSheet} from "./actor/actor-sheet.js";
import {ScionItem} from "./item/item.js";
import {ScionItemSheet} from "./item/item-sheet.js";
import {preloadHandlebarsTemplates} from "./templates.js";
// #endregion

// #region Hook: Initialization
Hooks.once("init", async () => {
    CONFIG.scion = scionSystemData;
    console.log("INITIALIZING!");
    console.log(CONFIG.scion);

    game.scion = {
        ScionActor,
        ScionItem
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
    preloadHandlebarsTemplates();

    // #region Handlebar Helpers
    Handlebars.registerHelper("display", (...args) => {
        const [path, key] = args;
        return U.getValue(CONFIG.scion, `${path}.${key}`, "label");
    });

    Handlebars.registerHelper("dotstate", (...args) => {
        const [trait, dotVal, data] = args;
        const actData = data.data.root.data;
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
    // #endregion
});
// #endregion

// #region Hook: Ready
Hooks.once("ready", async () => {
    // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
    // Hooks.on("hotbarDrop", (bar, data, slot) => createScionMacro(data, slot));
});
// #endregion
