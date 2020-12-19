import {_, U, SCION, MIX, ItemMixins as MIXINS} from "../modules.js";
import {ScionItemSheet} from "./item-sheet.js";

export class ConditionItemSheet extends MIX(ScionItemSheet).with(MIXINS.RichEdit) {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [...super.defaultOptions.classes, "condition"],
            width: 400,
            height: 310,
            tabs: []
        });
    }

    getData() {
        const data = super.getData();

        U.LOG({
            "this ConditionItemSheet": this,
            "... .getData() [Sheet Context]": data,
            "... ... .data": data.data
        }, this.item.name, "ConditionItemSheet: getData()", {groupStyle: "l2"});

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}