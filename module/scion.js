// #region Import Modules
import {ScionActor} from "./actor/actor.js";
import {ScionActorSheet} from "./actor/actor-sheet.js";
import {ScionItem} from "./item/item.js";
import {ScionItemSheet} from "./item/item-sheet.js";
// #endregion

// #region Hook: Initialization
Hooks.once("init", async () => {
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

    // #region Handlebar Helpers
    Handlebars.registerHelper("concat", (...args) => {
        let outStr = "";
        for (const arg in args)
            if (typeof args[arg] !== "object")
                outStr += args[arg];

        return outStr;
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
