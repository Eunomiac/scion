/* jshint ignore:start */
// #region AGGREGATING EXTERNAL MODULES
export * as _ from "./external/underscore/underscore-esm-min.js";
export {Dust as DUST} from "./external/dust.js";
// #endregion

// #region AGGREGATING INTERNAL MODULES
export * as U from "./data/utils.js"; // Utilities
export {applyMixins as MIX} from "./mixins/generalMixins.js"; // Mixin-Enabled Class Factory
export {
    baseConstants as C,
    scionSystemData as SCION,
    handlebarTemplates,
    itemCategories,
    popoutData,
    signatureChars
} from "./data/constants.js"; // Constants & System Data
// #endregion

// #region AGGREGATING MIXINS
import * as generalMixins from "./mixins/generalMixins.js";
import * as actorMixins from "./mixins/actorMixins.js";
import * as itemMixins from "./mixins/itemMixins.js";

export const MIXINS = Object.assign({}, generalMixins, actorMixins, itemMixins);
export const ActorMixins = Object.assign({}, generalMixins, actorMixins);
export const ItemMixins = Object.assign({}, generalMixins, itemMixins);
// #endregion