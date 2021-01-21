import {MIX, ItemMixins as MIXINS, SCION, U, _} from "../modules.js";
import ScionItemSheet from "./item-sheet.js";

export default class BirthrightItemSheet extends MIX(ScionItemSheet).with(MIXINS.RichEdit) {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            "classes": [...super.defaultOptions.classes, "birthright"],
            "width": 400,
            "height": 310,
            "tabs": []
        });
    }

    get template() {
        return `systems/scion/templates/item/birthrights/item-birthright-${this.object.data.type}-sheet.hbs`;
    }

    getData() {
        const data = super.getData();
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}