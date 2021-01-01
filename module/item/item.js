import {U, MIX, MIXINS} from "../modules.js";
// import "../external/dragula.min.js";

/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ScionItem extends MIX(Item).with(MIXINS.Updater) {
    // Getters: Data Retrieval
    get iData() { return this.data.data }
    get eData() { return this.iData }
    get subtype() { return this.iData.type }
    get aData() { return this.actor?.aData }

    prepareData() {
        super.prepareData();

        // Get the Item's data, as well as the owning Actor, if there is one
        const {data} = this.data;
        const actorData = this.actor?.data ?? {};

        Handlebars.registerHelper("ifCond", function(v1, operator, v2, options) {
            switch (operator) {
                /* eslint-disable eqeqeq */
                case "==":
                    return v1 == v2 ? options.fn(this) : options.inverse(this);
                case "!=":
                    return v1 != v2 ? options.fn(this) : options.inverse(this);
                /* eslint-enable eqeqeq */
                case "===":
                    return v1 === v2 ? options.fn(this) : options.inverse(this);
                case "!==":
                    return v1 !== v2 ? options.fn(this) : options.inverse(this);
                case "<":
                    return v1 < v2 ? options.fn(this) : options.inverse(this);
                case "<=":
                    return v1 <= v2 ? options.fn(this) : options.inverse(this);
                case ">":
                    return v1 > v2 ? options.fn(this) : options.inverse(this);
                case ">=":
                    return v1 >= v2 ? options.fn(this) : options.inverse(this);
                case "&&":
                    return v1 && v2 ? options.fn(this) : options.inverse(this);
                case "||":
                    return v1 || v2 ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });
    }


    getActorItems(itemType) { return this.actor?.items.filter((item) => item.type === itemType) }
}