import {_, U} from "../modules.js";
import {ScionItemSheet} from "./item-sheet.js";

export class PathItemSheet extends ScionItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [...super.defaultOptions.classes, "path"],
            width: 500,
            height: 500,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "front"
                }
            ]
        });
    }

    getData() {
        const data = super.getData();
        const itemData = data.data;

        U.GLOG({
            "Sheet Context": data,
            "Item.Data": itemData
        }, this.item.name, "PathItemSheet");

        return data;
    }
}
