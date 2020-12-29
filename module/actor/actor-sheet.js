import {_, U, handlebarTemplates, MIX, ActorMixins as MIXINS} from "../modules.js";
import "../external/gl-matrix-min.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ScionActorSheet extends MIX(ActorSheet).with(MIXINS.ClampText, MIXINS.EditableDivs, MIXINS.PopoutControl, MIXINS.CloseButton) {
    // Getters: Data Retrieval
    get aData() { return this.actor.aData }
    get eData() { return this.actor.eData }
    get ownedItems() { return this.actor.ownedItems }
    get sheet() {
        this._sheet = this._sheet ?? document.getElementById(`actor-${this.actor._id}`);
        return this._sheet;
    }

    static get defaultOptions() {
        /*
         *  super.defaultOptions = {
         *      baseApplication: "ActorSheet",
         *      classes: ["sheet"],
         *      template: "templates/sheets/actor-sheet.html",
         *      id: "",
         *      title: "",
         *      top: null,
         *      left: null,
         *      height: 720,
         *      width: 800,
         *      editable: true,
         *      minimizable: true,
         *      popOut: true,
         *      resizable: true,
         *      submitOnChange: true,
         *      submitOnClose: true,
         *      closeOnSubmit: false,
         *      tabs: [],
         *      filters: [],
         *      scrollY: [],
         *      dragDrop: [
         *          {
         *              dragSelector: ".item-list .item",
         *              dropSelector: null
         *          }
         *      ],
         *      viewPermission: 1
         *  }; 
         */
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "actor"]
        });
    }
    static RegisterSheet(label = "actor", types = [], makeDefault = true) {
        const locLabel = `scion.sheet.${label}Sheet`;
        Actors.registerSheet("scion", this, {makeDefault, types, locLabel});
        U.LOG({"Sheet Registered": this.name, types, defaultOptions: this.defaultOptions}, `${U.TCase(label)} Sheet Registered`, "ScionActorSheet");
    }

    get template() {
        return `systems/scion/templates/actor/actor-${this.object.data.type}-sheet.hbs`;
    }

    getData() {
        const data = super.getData();
        data.config = CONFIG.scion;
        data.blocks = handlebarTemplates;
        return data;
    }

    /*
     * activateListeners(html) {
     *  super.activateListeners(html);
     * 
     *  if (this.options.editable) {
     * 
     *  }
     * } 
     */
}
