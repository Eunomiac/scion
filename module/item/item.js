import {U} from "../modules.js";
// import "../external/dragula.min.js";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ScionItem extends Item {
    prepareData() {
        super.prepareData();

        // Get the Item's data
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};
        const data = itemData.data;

        U.GLOG({
            "this ScionItem": this,
            "... .data": this.data,
            "... ... .data": this.data.data,
            " this.actor": this.actor,
            " ... .data": this.actor.data,
            " ... ... .data": this.actor.data.data
        }, this.name, "ScionItem: prepareData()", {groupStyle: "l2"});
    }
}
