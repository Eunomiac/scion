import {_, U, handlebarTemplates, itemCategories} from "../modules.js";
import ScionActorSheet from "./actor-sheet.js";

export default class GroupActorSheet extends ScionActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [...super.defaultOptions.classes, "group"],
            width: 750,
            height: 750,
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

        return data;
    }
}
