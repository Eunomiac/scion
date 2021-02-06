import {U, MIX, MIXINS, itemCategories} from "../modules.js";
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
}