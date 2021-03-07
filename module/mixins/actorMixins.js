import {_, U} from "../modules.js"; // eslint-disable-line import/no-cycle
// #region CLASS FACTORIES: Applying Mixins
class MixinBuilder {
    constructor(superclass) { this.superclass = superclass }
    with(...mixins) { return mixins.reduce((c, mixin = (x) => x) => mixin(c), this.superclass) }
}

export const applyMixins = (superclass) => new MixinBuilder(superclass);
// #endregion

// #region BASIC MIXINS

export const OwnedItemManager = (superClass) => class extends superClass {
    /** A mixin to handle owned items WITH support for creating nested subitems
     *    Bundles and debounces mass subitem creation.
     *    
     * 
     * 
     * 
     * 
     * 
     * */

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
        const [updateDataSet, updateData] = [{}, []];
        this.$items.entries?.filter((item) => item.$data.isLinked === false).forEach((subitem) => {
            updateDataSet[subitem.$data.parentItemID] = updateDataSet[subitem.$data.parentItemID] ?? {};
            updateDataSet[subitem.$id] = updateDataSet[subitem.$id] ?? {};
            updateDataSet[subitem.$data.parentItemID][`data.items.${subitem.$category}.${subitem.$subtype}`] = subitem.$id;
            updateDataSet[subitem.$id]["data.isLinked"] = true;
        });
        Object.entries(updateDataSet).forEach(([itemID, itemData]) => updateData.push({...itemData, _id: itemID}));
        U.LOG({updateDataSet, updateData}, `Found ${Object.values(updateDataSet).length}x Sub Items on ${this.name} for ${Object.keys(updateDataSet).length}x Parent Items. Linking...`, "ScionActor.linkSubItems()", {groupStyle: "l4"});
        await this.updateEmbeddedEntity("OwnedItem", updateData);
    }
};
// #endregion