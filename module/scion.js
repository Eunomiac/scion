// Import Modules
import {ScionActor} from "./actor/actor.js";
import {ScionActorSheet} from "./actor/actor-sheet.js";
import {ScionItem} from "./item/item.js";
import {ScionItemSheet} from "./item/item-sheet.js";

Hooks.once("init", async () => {
    game.scion = {
        ScionActor,
        ScionItem,
        rollItemMacro
    };

    /**
   * Set an initiative formula for the system
   * @type {String}
   */
    CONFIG.Combat.initiative = {
        formula: "1d20 + @abilities.dex.mod",
        decimals: 2
    };

    // Define custom Entity classes
    CONFIG.Actor.entityClass = ScionActor;
    CONFIG.Item.entityClass = ScionItem;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("scion", ScionActorSheet, {makeDefault: true});
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("scion", ScionItemSheet, {makeDefault: true});

    // If you need to add Handlebars helpers, here are a few useful examples:
    Handlebars.registerHelper("concat", (...args) => {
        let outStr = "";
        for (const arg in args)
            if (typeof args[arg] !== "object")
                outStr += args[arg];

        return outStr;
    });

    Handlebars.registerHelper("toLowerCase", (str) => str.toLowerCase());
});

Hooks.once("ready", async () => {
    // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
    Hooks.on("hotbarDrop", (bar, data, slot) => createScionMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createScionMacro(data, slot) {
    if (data.type !== "Item")
        return;
    if (!("data" in data)) {
        ui.notifications.warn("You can only create macro buttons for owned Items");
        return;
    }
    const item = data.data;

    // Create the macro command
    const command = `game.scion.rollItemMacro("${item.name}");`;
    let macro = game.macros.entities.find((m) => (m.name === item.name) && (m.command === command));
    if (!macro)
        macro = await Macro.create({
            name: item.name,
            type: "script",
            img: item.img,
            command,
            flags: {"scion.itemMacro": true}
        });

    game.user.assignHotbarMacro(macro, slot);
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token)
        actor = game.actors.tokens[speaker.token];
    if (!actor)
        actor = game.actors.get(speaker.actor);
    const item = actor ? actor.items.find((i) => i.name === itemName) : null;
    if (!item)
        return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

    // Trigger the item roll
    return item.roll();
}
