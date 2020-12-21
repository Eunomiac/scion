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

        Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
            switch (operator) {
                case "==":
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case "===":
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case "!=":
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case "!==":
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case "<":
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case "<=":
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case ">":
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case ">=":
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case "&&":
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case "||":
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });


    }


    getActorItems(itemType) { return this.actor?.items.filter((item) => item.type === itemType) }
}