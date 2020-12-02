import {_, U} from "../modules.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ScionActor extends Actor {
    prepareData() {
        super.prepareData();
        if (this.data.type === "major")
            this._prepareMajorCharData();
        U.GLOG({
            ".Data": this.data.data,
            ".Items": this.data.items
        }, this.name, "Actor");
    }

    _prepareMajorCharData() {
        const ownedItems = Array.from(this.data.items);

        // #region PREPARE PATH ITEMS
        const pathData = {};
        // Find the first Path Item of each type, if it exists;
        // ... if it doesn't exist, add its creation data to pathData

        ["origin", "role", "pantheon"].forEach((pathType) => {
            if (!ownedItems.find((xx) => xx.data.type === pathType))
                pathData[pathType] = {
                    name: U.Loc(`scion.paths.${pathType}`),
                    type: "path",
                    data: {
                        type: pathType,
                        title: this.data.data.pathData?.[pathType].title,
                        skills: this.data.data.pathData?.[pathType].skills,
                        condition: this.data.data.pathData?.[pathType].condition
                    }
                };
        });
        if (Object.keys(pathData).length)
            this.createEmbeddedEntity("OwnedItem", Object.values(pathData));
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
