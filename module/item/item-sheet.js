import {MIX, ItemMixins as MIXINS, U, handlebarTemplates} from "../modules.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export default class ScionItemSheet extends MIX(ItemSheet).with(MIXINS.Accessors, 
                                                                MIXINS.ClampText,
                                                                MIXINS.EditableDivs,
                                                                MIXINS.PopoutControl,
                                                                MIXINS.CloseButton) {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            "classes": ["scion", "sheet", "item"],
            "width": 520,
            "height": 480
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

    get template() { return `systems/scion/templates/item/item-${this.object.data.type}-sheet.hbs`; }

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
