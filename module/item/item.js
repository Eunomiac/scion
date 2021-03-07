import {_, U, MIX, MIXINS, itemCategories} from "../modules.js";
import ScionActor from "../actor/actor.js";
// import "../external/dragula.min.js"

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export default class ScionItem extends MIX(Item).with(MIXINS.Accessors) {   
    initSubItems() {
        switch (this.$type) {
            case "path": {
                U.LOG({parentItem: this}, `Creating 2x Condition Sub Items for '${this.name}' ► 'Suspension', 'Revocation'`, `on.createOwnedItem: '${this.name}'`, {groupStyle: "l3"});
                ["pathSuspension", "pathRevocation"].forEach((subtype) => {
                    this.actor.makeSubItem({
                        name: U.Loc(`scion.condition.${subtype}`),
                        type: "condition",
                        data: {
                            type: subtype,
                            title: subtype.slice(4),
                            isPersistent: true
                        }
                    }, this);
                });
                break
            }
            // no default
        }
    }

    getSubItem(type, subtype) {
        let itemIDs = U.Flatten(this.$data.items);
        if (type) {
            itemIDs = _.pick(itemIDs, (v, k) => k.startsWith(type));
        }
        if (subtype) {
            itemIDs = _.pick(itemIDs, (v, k) => new RegExp(`\\.${subtype}\\.?`, "gu").test(k));
        }
        switch (itemIDs.length) {
            case 0: return false;
            case 1: return this.$items.get(itemIDs[0]);
            default: return Object.values(itemIDs).map((itemID) => this.$items.get(itemID));
        }
    }
}