import {U, MIX, MIXINS} from "../modules.js";
// import "../external/dragula.min.js"

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export default class ScionItem extends Item {
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

    // get iData() { return this.data.data }
    // get eData() { return this.iData }
    // get subtype() { return this.iData.type }
    // get aData() { return this.actor?.aData }

    prepareData() {
        super.prepareData();

        // console.log({"ITEM: THIS.ACTOR": this.actor});
        // Get the Item's data, as well as the owning Actor, if there is one
        const {data} = this.data;
        const actorData = this.actor?.data ?? {};
    }

    getActorItems(itemType) { return this.actor?.items.filter((item) => item.type === itemType) }
}