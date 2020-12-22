/* MIXINS GUIDE

    A "mixin" is a block of code that can be freely inserted into any class, while existing outside of the standard chain of
    inheritance (and, thus, does not require subclassing). This allows code to be written once, as a mixin, and then applied
    to any number of classes regardless of whether they inherit from each other.

    In the context of Foundry, this is especially helpful for code that is shared between the Actor and Item classes (or
    subclasses thereof), which would normally have to be duplicated within each. It also provides a new means of sharing code,
    since integrating a mixin into an existing class is seamless, requiring no modification of the inheritance structure, and
    affecting no code other than that explicitly contained within the mixin itself.

    Mixins can do everything a standard subclass can do: override methods, introduce new methods (including new static methods),
    and tap into the receiving class' properties and methods.The context remains that of the receiving class: 'this' and 'super'
    written in a mixin will refer to the instance and superclass, respectively, of whichever class receives the mixin, just as if
    the code were originally written within the class definition itself.

    USAGE
    ==================

     A "mixin" is a block of code that can be freely inserted into any class. It can do everything a standard subclass can do,
     without having to depend on inheritance. Integration is seamless: 'this' and 'super' referenced within a mixin will refer
     to the instance and superclass, respectively, of the receiving class just as if the code were originally written within it.

        const MyMixin = (superclass) => class extends superclass {
            // ... methods, properties, overrides to be integrated into the receiving class
        };

    Mixins can be exported individually, or as properties of the provided "MIXINS" parent object for ease of importing.

    Mixins can subclass from other mixins just as with a normal class:

        const MySubMixin = (superclass) => class extends MyBaseMixin(superclass) {
            // ... methods, properties, overrides to be integrated into the receiving class
        };

    The "MIX" class factory, exported from this module, makes applying multiple mixins to a receiving class syntactically simple:

        class MySubClass extends MIX(MyBaseClass).with(MyMixin, MyOtherMixin, MyOtherOtherMixin) {
            // ... subclass code, which will be subordinate to that of the mixins (i.e. mixins will be able to override this code)
        }

    An example mixin is provided for reference, both as an independent export and as part of the MIXINS object.  It locates any
    HTML element with id="closeButton" and adds a click listener to it that closes the sheet. This mixin could be applied to both
    the ActorSheet and the ItemSheet subclasses, for example, enhancing each with this new functionality without requiring code
    duplication.

    NOTES
    ==================

    When writing mixins that will be applied to Item and Actor subclasses, use "this.entity" instead of "this.actor" or "this.item"
    to retrieve the corresponding objects.

*/

/*  MIXINS
    ==================
    A "mixin" is a block of code that can be freely inserted into any class. It can do everything a standard subclass can do, 
    without having to depend on inheritance. Integration is seamless: 'this' and 'super' referenced within a mixin will refer
    to the instance and superclass, respectively, of the receiving class just as if the code were originally written within it.

    A mixin is written in much the same way as a standard subclass would be written, though it must be defined as follows:

        const MyMixin = (superclass) => class extends superclass {
            // ... methods, properties, overrides to be integrated into the receiving class
        };

    Mixins can be exported individually, or as properties of the provided "MIXINS" parent object for ease of importing.

    The "MIX" class factory, exported from this module, makes applying multiple mixins to a receiving class syntactically simple:

        class MySubClass extends MIX(MyBaseClass).with(MyMixin1, MyMixin2...) {
            // ... subclass code
        }

    An example mixin is provided for reference, both as an individual export and as part of the "MIXINS" parent object. It
    can be used to enhance any class with a custom "Close Sheet" button.
*/

// ===== "MIX" CLASS FACTORY =====
class MixinBuilder {
    constructor(superclass) { this.superclass = superclass }
    with(...mixins) { return mixins.reduce((c, mixin = (x) => x) => mixin(c), this.superclass) }
}

export const MIX = (superclass) => new MixinBuilder(superclass);

// ===== "MIXINS" PARENT OBJECT =====
export const MIXINS = {
    CloseButton: (superclass) => class extends superclass {
        activateListeners(html) {
            super.activateListeners(html);
            html.find("#closeButton").click(() => this.close());
        }
    }
};

// ===== INDEPENDENT MIXINS =====
export const CloseButton = MIXINS.CloseButton;

export const BaseFeatures = (superclass) => class extends superclass {
    static get defaultOptions() {
        if (!this.classDefaultOptions)
            console.error(`The ${this.name} class needs a static classDefaultOptions getter containing custom configuration to merge with the base class.`);
        return mergeObject(super.defaultOptions, this.classDefaultOptions || {});
    }
    static RegisterSheet(label = "actor", types = [], makeDefault = true) {
        const locLabel = `scion.sheet.${label}Sheet`;
        Actors.registerSheet("scion", this, {makeDefault, types, locLabel});
        U.LOG({"Sheet Registered": this.name, types, defaultOptions: this.defaultOptions}, `${U.TCase(label)} Sheet Registered`, "ScionActorSheet");
    }

    get template() {
        return `systems/scion/templates/actor/actor-${this.object.data.type}-sheet.hbs`;
    }


}