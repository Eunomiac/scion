import * as U from "../data/utils.js";
/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ScionActor extends Actor {
    prepareData() {
        super.prepareData();
        U.LOG(this, `${this.name} --- Actor.prepareData()`, "prepareData");

        if (this.data.type === "character")
            this._prepareCharacterData();
    }

    _prepareCharacterData() {
        const ownedItems = Array.from(this.data.items);

        // #region PREPARE PATH ITEMS
        const pathData = [];
        // Find the first Path Item of each type, if it exists;
        // ... if it doesn't exist, add its creation data to pathData
        const currentPaths = ["originPath", "rolePath", "pantheonPath"].map((pathType) => {
            const thisPathItem = ownedItems.find((xx) => xx.data.type === pathType);
            if (thisPathItem)
                return thisPathItem;
            pathData.push({
                name: U.Loc(`scion.game.${pathType}`),
                type: "path",
                data: {type: pathType}
            });
            return undefined;
        });
        U.LOG(currentPaths, `${this.name} --- Current Paths`, "prepareData", {isUngrouping: false});
        if (pathData.length) {
            this.createEmbeddedEntity("OwnedItem", pathData);
            U.LOG(pathData, "Paths to Add", "prepareData");
        }
        console.groupEnd();
        // #endregion
    }
}

