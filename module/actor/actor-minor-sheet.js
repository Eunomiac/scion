import {_, U, handlebarTemplates, itemCategories} from "../modules.js";
import {ScionActorSheet} from "./actor-sheet.js";

export class MinorActorSheet extends ScionActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [...super.defaultOptions.classes, "minor"],
            width: 750,
            height: 400
        });
    }

    getData() {
        const data = super.getData();

        return data;
    }
}
