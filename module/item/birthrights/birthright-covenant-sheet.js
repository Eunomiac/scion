import {MIX, ItemMixins as MIXINS, SCION, U, _} from "../../modules.js";
import BirthrightItemSheet from "../item-birthright-sheet.js";

export default class CovenantItemSheet extends BirthrightItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            "classes": [...super.defaultOptions.classes, "covenant"],
            "width": 400,
            "height": 310,
            "tabs": []
        });
    }

    getData() {
        const data = super.getData();

        U.LOG(U.IsDebug() && {
            "this CovenantItemSheet": this,
            "... .getData() [Sheet Context]": data,
            "... ... .data": data.data
        }, this.item.name, "CovenantItemSheet: getData()", {"groupStyle": "l2"});

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}