/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ScionActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "actor"],
            template: "systems/scion/templates/actor/actor-sheet.html",
            width: 1000,
            height: 1000,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "front"}]
        });
    }
    /* -------------------------------------------- */
    /** @override */
    getData() {
        const data = super.getData();
        return data;
    }
}
