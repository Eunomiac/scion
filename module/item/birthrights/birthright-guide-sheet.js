import {MIX, ItemMixins as MIXINS, SCION, U, _} from "../../modules.js";
import BirthrightItemSheet from "../item-birthright-sheet.js";

export default class GuideItemSheet extends BirthrightItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            "classes": [...super.defaultOptions.classes, "guide"],
            "width": 400,
            "height": 310,
            "tabs": []
        });
    }

    getData() {
        const data = super.getData();

        U.LOG(U.IsDebug() && {
            "this GuideItemSheet": this,
            "... .getData() [Sheet Context]": data,
            "... ... .data": data.data
        }, this.item.name, "GuideItemSheet: getData()", {"groupStyle": "l2"});

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}