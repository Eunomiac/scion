import {U} from "../modules.js";
// import "../external/dragula.min.js";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ScionItem extends Item {
    get iData() { return this.data.data }
    get aData() { return this.actor.aData }
    get subtype() { return this.iData.type }

    prepareData() {
        super.prepareData();

        // Get the Item's data, as well as the owning Actor, if there is one
        const data = this.data.data;
        const actorData = this.actor?.data ?? {};

        U.LOG({
            "this ScionItem": this,
            "... .data": this.data,
            "... ... .data": this.iData,
            " this.actor": this.actor,
            " ... .data": this.actor.data,
            " ... ... .data": this.aData
        }, this.name, "ScionItem: prepareData()", {groupStyle: "l2"});
    }

    getActorItems(itemType) { return this.actor?.items.filter((item) => item.type === itemType) }
}