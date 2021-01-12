import {_, U, handlebarTemplates, MIX, ActorMixins as MIXINS} from "../modules.js";
import "../external/gl-matrix-min.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ScionActorSheet extends MIX(ActorSheet).with(MIXINS.ClampText, MIXINS.EditableDivs, MIXINS.PopoutControl, MIXINS.CloseButton, MIXINS.DotDragger) {
    // Getters: Data Retrieval
    get ent() { return typeof this.entity === "string" ? this : this.entity }
    get sht() { return this.ent.sheet }
    get eID() { return this.ent._id }
    get eData() { return this.ent.data.data }
    get subtype() { return this.eData.type }
    get sheetElem() {
        this._sheet = this._sheet ?? $(`[id$='${this.eID}']`)[0];
        return this._sheet;
    }
    get ownedItems() { return this.ent.data.items }
    get actor() { 
        if (super.actor ?? this._actor) {
            return super.actor ?? this._actor;
        }
        this._actor = this.entity === "Actor" ? this : undefined;
        return this._actor;
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
        U.LOG(U.IsDebug() && {"Sheet Registered": this.name, types, defaultOptions: this.defaultOptions}, `${U.TCase(label)} Sheet Registered`, "ScionActorSheet");
    }

    get template() {
        return `systems/scion/templates/actor/actor-${this.object.data.type}-sheet.hbs`;
    }

    getData() {
        // console.log({"ACTORSHEET: THIS.ACTOR": this.actor});
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
