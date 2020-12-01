import {_, U, MIX, MIXINS} from "../modules.js";
console.log(U, MIX, MIXINS);
/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ScionActor extends Actor {
    prepareData() {
        super.prepareData();
        this._prepareCharacterData?.();
        U.LOG(this.data.data, "[.Data]", "prepareData", {style: "data", isGrouping: `[Actor] ${this.name}`});
        U.LOG(this, "[THIS]", "prepareData", {style: "data", isUngrouping: false});
        U.LOG(this.data.items, "[.Items]", "prepareData", {style: "data"});
    }
}

export class MajorActor extends ScionActor {
    static create(...args) {
        U.LOG(this._prepareCharacterData, "[._prepareCharacterData]", "prepareData", {style: "data", isUngrouping: false});
        super.create(...args);
    }

    _prepareCharacterData() {
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
                        concept: this.data.data.pathData[pathType].title,
                        skills: this.data.data.pathData[pathType].skills,
                        condition: this.data.data.pathData[pathType].condition
                    }
                };
        });
        U.LOG(pathData, "Paths to Create", "paths", {style: "data"});
        if (Object.keys(pathData).length)
            this.createOwnedItem(Object.values(pathData));
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

export class MinorActor extends ScionActor {

}

export class GroupActor extends ScionActor {

}
