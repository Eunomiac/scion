// #region AGGREGATING EXTERNAL MODULES
export * as _ from "./external/underscore/underscore-esm-min.js";
export {Dust as DUST} from "./external/dust.js";
// #endregion

// #region AGGREGATING INTERNAL MODULES
export * as U from "./data/utils.js"; // Utilities
export {Dragger} from "./data/dragger.js"; // Collapsible Draggable Subclass
export {
    scionSystemData as SCION,
    handlebarTemplates,
    itemCategories,
    popoutData,
    testChars
} from "./data/constants.js"; // Constants & System Data
// #endregion

// #region AGGREGATING MIXINS
import * as generalMixins from "./mixins/generalMixins.js";
import * as actorMixins from "./mixins/actorMixins.js";
import * as itemMixins from "./mixins/itemMixins.js";

export {applyMixins as MIX} from "./mixins/generalMixins.js"; // Mixin-Enabling Class Factory
export const MIXINS = {...generalMixins, ...actorMixins, ...itemMixins};
export const ActorMixins = {...generalMixins, ...actorMixins};
export const ItemMixins = {...generalMixins, ...itemMixins};
// #endregion