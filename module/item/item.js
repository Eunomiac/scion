import {_, U, MIX, ItemMixins as MIXINS} from "../modules.js";

// #region Item Superclass
export class ScionItem extends Item {
    prepareData() {
        super.prepareData();

        // Get the Item's data
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};
        const data = itemData.data;
    }
}
// #endregion

// #region Paths & Path Connections
export class Path extends ScionItem {
    static get entity() { return "Path" }
    get entity() { return "Path" }

    constructor(...args) {
        super(...args);
        console.log(this.entity);
    }
}

export class SupernaturalPath extends Path {

}

class Connection extends ScionItem {

}

export class AccessConnection extends Connection {

}

export class ContactConnection extends MIX(Connection).with(MIXINS.ActorLink, MIXINS.DotRating) {

}

export class GroupConnection extends MIX(Connection).with(MIXINS.ActorLink) {

}
// #endregion

// #region Birthrights
class Birthright extends MIX(ScionItem).with(MIXINS.DotRating) {

}

export class Covenant extends Birthright {

}

export class Cult extends MIX(Birthright).with(MIXINS.ActorLink) {

}

export class Follower extends MIX(Birthright).with(MIXINS.ActorLink) {

}

export class Creature extends MIX(Birthright).with(MIXINS.ActorLink) {

}

export class Guide extends MIX(Birthright).with(MIXINS.ItemLink) {

}

export class Relic extends MIX(Birthright).with(MIXINS.ActorLink, MIXINS.ItemLink) {

}

export class RelicWeapon extends MIX(Relic).with(MIXINS.WeaponTraits) {

}
export class RelicArmor extends MIX(Relic).with(MIXINS.ArmorTraits) {

}
export class RelicVehicle extends MIX(Relic).with(MIXINS.VehicleTraits) {

}
// #endregion

// #region Callings & Legendary Title
export class Calling extends MIX(ScionItem).with(MIXINS.DotRating) {

}

export class Title extends MIX(ScionItem).with(MIXINS.ItemLink) {

}
// #endregion

// #region Powers
class Power extends ScionItem {

}

export class Knack extends Power {

}
export class Purview extends MIX(Power).with(MIXINS.ItemLink) {

}
export class Boon extends Power {

}
export class Quality extends Power {

}
export class Innate extends Power {

}
export class Flair extends Power {

}
export class Stunt extends Power {

}
// #endregion

// #region Equipment & Gear
class Equipment extends ScionItem {

}
export class Weapon extends MIX(Equipment).with(MIXINS.WeaponTraits) {

}
export class Armor extends MIX(Equipment).with(MIXINS.ArmorTraits) {

}
export class Vehicle extends MIX(Equipment).with(MIXINS.VehicleTraits) {

}
// #endregion

// #region Conditions
export class Condition extends ScionItem {

}
export class Field extends Condition {

}
export class PathCondition extends Condition {

}
export class Fatebinding extends MIX(Condition).with(MIXINS.ActorLink, MIXINS.DotRating) {

}


// #endregion