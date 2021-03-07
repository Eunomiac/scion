// #region MIXINS GUIDE
/*  *** BASIC MIXINS ***

        const MyMixin = (superclass) => class extends superclass {
            foo() {
                if (super.foo)
                    super.foo(); // Check for property before calling super
                console.log("foo from MyMixin");

            }
        };

    *** MIXIN INHERITING FROM ANOTHER MIXIN ***

        const mySubMixin = (superclass) => class extends MyMixin(superclass) {
            // Add or Override methods here.
        };

    *** Using Mixins with Utils.JS Helper Class ***
    class MyClass extends MIX(MyBaseClass).with(Mixin1, Mixin2) {
        // ...
    } */
// #endregion

// #region CLASS FACTORIES: Applying Mixins
class MixinBuilder {
    constructor(superclass) { this.superclass = superclass }
    with(...mixins) { return mixins.reduce((c, mixin = (x) => x) => mixin(c), this.superclass) }
}

export const applyMixins = (superclass) => new MixinBuilder(superclass);
/* #endregion */

// #region BASIC MIXINS
export const ItemHierarchy = (superClass) => class extends superClass {
    /** A mixin for items to access and control their sub items
     * 
     *
     */

    get parentItem() { return (this._parentItem = this._parentItem ?? this.$items.get(this.$data.parentItemID) ?? null) }


    createSubItem() {}
    getSubItem(dotpath) {}
    getSubItemCat(category) {}
    updateSubItem() {}


}

// #endregion