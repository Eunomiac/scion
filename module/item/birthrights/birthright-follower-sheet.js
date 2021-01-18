import {MIX, ItemMixins as MIXINS, SCION, U, _} from "../../modules.js";
import {BirthrightItemSheet} from "../item-birthright-sheet.js";

export class FollowerItemSheet extends BirthrightItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            "classes": [...super.defaultOptions.classes, "follower"],
            "width": 400,
            "height": 310,
            "tabs": []
        });
    }

    getData() {
        const data = super.getData();

        U.LOG(U.IsDebug() && {
            "this FollowerItemSheet": this,
            "... .getData() [Sheet Context]": data,
            "... ... .data": data.data
        }, this.item.name, "FollowerItemSheet: getData()", {"groupStyle": "l2"});

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}