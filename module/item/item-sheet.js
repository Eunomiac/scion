import {MIX, ItemMixins as MIXINS, U, handlebarTemplates} from "../modules.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class ScionItemSheet extends MIX(ItemSheet).with(MIXINS.EditableDivs, MIXINS.PopoutControl, MIXINS.ClampText, MIXINS.CloseButton) {
    // Getters: Data Retrieval
    get iData() { return this.item.iData }

    get eData() { return this.item.eData }

    get subtype() { return this.item.subtype }

    get aData() { return this.item.aData }

    get sheetElem() {
        if (!this._sheet) {
            if (this.actor) {
                this._sheet = document.getElementById(`actor-${this.actor._id}-item-${this.item._id}`);
            } else {
                this._sheet = document.getElementById(`item-${this.item._id}`);
            }
        }
        return this._sheet;
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            "classes": ["scion", "sheet", "item"],
            "width": 520,
            "height": 480
            // tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
        });
    }

    static RegisterSheet(label = "item", types = [], makeDefault = true) {
        const locLabel = `scion.sheet.${label}Sheet`;
        Items.registerSheet("scion", this, {makeDefault,
                                            types,
                                            "label": locLabel});
        U.LOG(U.IsDebug() && {"Sheet Registered": this.name,
               types,
               "defaultOptions": this.defaultOptions}, `${U.TCase(label)} Sheet Registered`, "ScionItemSheet");
    }

    get template() {
        return `systems/scion/templates/item/item-${this.object.data.type}-sheet.hbs`;
    }

    getData() {
        const data = super.getData();
        data.blocks = handlebarTemplates;
        data.openPopouts = data.openPopouts || {};
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (this.options.editable) {
            new Draggable(this, html, html.find("h1.title")[0], false);
        }
    }
}
