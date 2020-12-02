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
export const MIX = (superclass) => new MixinBuilder(superclass);

// DEFINING MIXINS: Packaged methods to add to any subclass without requiring inheritance
const MIXINS = {
    ActorLink: (superClass) => class extends superClass {
        // ... methods for linking Actors to the instance
    },
    DotRating: (superClass) => class extends superClass {
        // ... methods for instances with a rating displayed as dots
    }
};

// CLASS EXAMPLE: Extending an Item Class with Mixins
class BaseItemClass extends Item { // Base system item class
    // ... standard item methods
}
class MixedItemClass extends MIX(BaseItemClass).with(MIXINS.ActorLink, MIXINS.DotRating) {
    // ... subclass item methods
    // ... end result includes methods from BaseItemClass, MIXINS and this subclass,
    //      and 'super' refers to BaseItemClass in all of them
}

/* #endregion */

// #region BASIC MIXINS
export const ActorLink = (superClass) => class extends superClass {
    prepareData() {
        if (super.prepareData)
            super.prepareData();
    }
};
// #endregion
