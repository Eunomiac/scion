import * as _ from "../external/underscore/underscore-esm-min.js";
import * as U from "../data/utils.js";
/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ScionActor extends Actor {
    prepareData() {
        super.prepareData();
        if (this.data.type === "character")
            this._prepareCharacterData();
        U.LOG(this.data.data, "[.Data]", "prepareData", {style: "data", isGrouping: `[Actor] ${this.name}`});
        U.LOG(this.data.items, "[.Items]", "prepareData", {style: "data"});
    }

    _prepareCharacterData() {
        const ownedItems = Array.from(this.data.items);

        // #region PREPARE PATH ITEMS
        const pathData = {};
        // Find the first Path Item of each type, if it exists;
        // ... if it doesn't exist, add its creation data to pathData
        ["originPath", "rolePath", "pantheonPath"].forEach((pathType) => {
            if (!ownedItems.find((xx) => xx.data.type === pathType))
                pathData[pathType] = {
                    name: U.Loc(`scion.game.${pathType}`),
                    type: "path",
                    data: {
                        type: pathType,
                        skills: _.sample(Object.keys(CONFIG.scion.SKILLS), 3)
                    }
                };
        });
        if (Object.keys(pathData).length)
            this.createEmbeddedEntity("OwnedItem", Object.values(pathData)).then(() => U.LOG(this.paths, "[Paths]", "prepareCharacterData"));
        // #endregion
    }

    get paths() {
        return U.KeyMapObj(
            ["originPath", "rolePath", "pantheonPath"],
            (i, pathType) => pathType,
            (pathType) => Array.from(this.items).find((item) => item.data.data.type === pathType)
        );
    }
}
