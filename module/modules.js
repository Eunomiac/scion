// #region AGGREGATING EXTERNAL MODULES
export * as _ from "./external/underscore/underscore-esm-min.js";
export * as DRAG from "./external/dragula.min.js";
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
    signatureChars as SIG_CHARS
} from "./data/constants.js"; // Constants & System Data
// #endregion

// #region AGGREGATING MIXINS
import * as GeneralMixins from "./mixins/generalMixins.js";
import * as ActorMixins from "./mixins/actorMixins.js";
import * as ItemMixins from "./mixins/itemMixins.js";

const allMixins = Object.assign({}, GeneralMixins, ActorMixins, ItemMixins);
const actorMixins = Object.assign({}, GeneralMixins, ActorMixins);
const itemMixins = Object.assign({}, GeneralMixins, ItemMixins);

export {
    allMixins as MIXINS,
    GeneralMixins,
    actorMixins as ActorMixins,
    itemMixins as ItemMixins
};
// #endregion