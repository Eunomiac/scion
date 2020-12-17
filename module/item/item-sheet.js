import {U, handlebarTemplates, MIX, ItemMixins as MIXINS} from "../modules.js";
/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class ScionItemSheet extends MIX(ItemSheet).with(MIXINS.EditableDivs, MIXINS.PopoutControl) {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "item"],
            width: 520,
            height: 480
            // tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
        });
    }

    static RegisterSheet(label = "item", types = [], makeDefault = true) {
        label = `scion.sheets.${label}Sheet`;
        Items.registerSheet("scion", this, {makeDefault, types, label});
        U.LOG({"Sheet Registered": this, types, defaultOptions: this.defaultOptions}, `${U.Loc(label)} Registered`, "ScionItemSheet");
    }

    get template() {
        return `systems/scion/templates/item/item-${this.object.data.type}-sheet.hbs`;
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData();
        data.blocks = handlebarTemplates;
        data.openPopouts = data.openPopouts || {};
        return data;
    }

    /* -------------------------------------------- */


    /* -------------------------------------------- */

    /* activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        // if (!this.options.editable)
        //    return;

    // Roll handlers, click handlers, etc. would go here.
    } */
}
