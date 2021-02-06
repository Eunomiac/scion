import {_, U} from "../modules.js"; // eslint-disable-line import/no-cycle
// #region CLASS FACTORIES: Applying Mixins
class MixinBuilder {
    constructor(superclass) { this.superclass = superclass }
    with(...mixins) { return mixins.reduce((c, mixin = (x) => x) => mixin(c), this.superclass) }
}

export const applyMixins = (superclass) => new MixinBuilder(superclass);
// #endregion

// #region BASIC MIXINS
export const OwnedItemBuilder = (superClass) => class extends superClass {

    constructor(...args) {
        super(...args);
        this.pendingOwnedItems = [];

        this._buildOwnedItems = debounce(async () => {
            if (this.pendingOwnedItems.length) {
                const ownedItemDataSet = [..._.flatten(this.pendingOwnedItems)];
                this.pendingOwnedItems = [];
                await this.createOwnedItem(ownedItemDataSet);
                await this._linkSubItems();
            }
        }, 500);
    }
    
    makeOwnedItem(itemDataSet) {
        this.pendingOwnedItems.push(..._.flatten([itemDataSet]));
        this._buildOwnedItems();
    }

    makeSubItem(itemDataSet, parentItem) {
        this.makeOwnedItem(_.flatten([itemDataSet]).map((itemData) => {
            itemData.data.parentItemID = parentItem.$id;
            return itemData;
        }));
    }

    async _linkSubItems() {
        const [updateDataSet, updatePromises] = [{}, []];
        this.$items.entries?.filter((item) => item.$data.isLinked === false).forEach((subitem) => {
            updateDataSet[subitem.$data.parentItemID] = updateDataSet[subitem.$data.parentItemID] ?? {};
            updateDataSet[subitem.$id] = updateDataSet[subitem.$id] ?? {};
            updateDataSet[subitem.$data.parentItemID][`data.items.${subitem.$category}.${subitem.$subtype}`] = subitem.$id;
            updateDataSet[subitem.$id]["data.isLinked"] = true;
        });
        U.LOG({updateDataSet}, `Found ${Object.values(updateDataSet).length}x Sub Items on ${this.name} for ${Object.keys(updateDataSet).length}x Parent Items. Linking...`, "ScionActor.linkSubItems()", {groupStyle: "l4"});
        for (const [itemID, updateData] of Object.entries(updateDataSet)) {
            const item = this.$items.get(itemID);
            if (item) {
                // updatePromises.push(item.update(updateData)); 
                U.LOG({item, updateData}, `Updating ${item.name}`, "LinkSubItems", {groupStyle: "l2"});               
                await item.update(updateData);
                await U.Sleep(1000);
            } else {
                throw new Error(`Item with ID '${itemID}' not found on Entity '${this.name}'`);
            }
        }
        U.LOG("Finished!", null, null, {groupStyle: "l2"});
        // return Promise.all(updatePromises);
    }
};
// #endregion