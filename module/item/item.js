/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class ScionItem extends Item {
    prepareData() {
        super.prepareData();

        // Get the Item's data
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};
        const data = itemData.data;
    }
}
