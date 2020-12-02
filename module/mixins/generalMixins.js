// #region Import Modules
import {_, U} from "../modules.js";

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
export const ActorLink = (superClass) => class extends superClass {
    prepareData() {
        if (super.prepareData)
            super.prepareData();
    }
};
export const EditableDivs = (superClass) => class extends superClass {
    activateListeners(html) {
        super.activateListeners(html);

        if (this.options.editable) {
            // #region CONTENT-EDITABLE ELEMENTS
            const _onEditKeyDown = (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    event.currentTarget.blur();
                }
            };
            const _onEditClickOn = (event) => {
                event.preventDefault();
                const element = event.currentTarget;
                element.setAttribute("contenteditable", true);
                if (element.classList.contains("placeholder")) {
                    element.innerHTML = "";
                    element.classList.remove("placeholder");
                }
                if (element.classList.contains("quote"))
                    element.innerHTML = element.innerText.replace(/^\s*"?|"?\s*$/gu, "").trim();                
                // Add an event listener for when the player hits the 'Enter' key.
                element.addEventListener("keydown", _onEditKeyDown.bind(this));
                // Focus the element, which will fire the _onEditFocus event to select all text.
                element.focus();
            };
            const _onEditFocus = () => { document.execCommand("selectAll") };
            const _onEditClickOff = (event) => {
                event.preventDefault();
                const element = event.currentTarget;
                const dataSet = element.dataset;
                element.setAttribute("contenteditable", false);
                element.removeEventListener("keydown", _onEditKeyDown);

                if ("path" in dataSet) {
                    const entityVal = element.innerText.replace(/^\s*"?|"?\s*$/gu, "").trim();
                    this.entity.update({[dataSet.path.replace(/^(actor|item)\./u, "")]: entityVal});
                    if (element.classList.contains("quote") && entityVal)
                        element.innerHTML = _.escape(`"${entityVal}"`);
                    U.GLOG({
                        "This.Entity": this.entity,
                        "Parsed Path": dataSet.path.replace(/^(actor|item)\./u, ""),
                        entityVal
                    }, dataSet.path, "Setting Editable Div", {style: "log", groupStyle: "info"});
                }
                if (!element.innerText && "placeholder" in dataSet) {
                    element.classList.add("placeholder");
                    element.innerHTML = dataSet.placeholder;
                } else {
                    element.classList.remove("placeholder");
                }
            };
            html.find("div.contentEditable").each((i, element) => {
                const dataSet = element.dataset;
                element.setAttribute("contenteditable", false);
                element.addEventListener("click", _onEditClickOn.bind(this));
                element.addEventListener("focus", _onEditFocus.bind(this));
                element.addEventListener("blur", _onEditClickOff.bind(this));

                // If dataset includes a path, fill the element with the current data:
                if ("path" in dataSet) {
                    const entityVal = getProperty(this.entity, `data.${dataSet.path}`.replace(/^data\.(actor|item)\./u, ""));
                    U.GLOG({
                        "This.Entity": this.entity,
                        "Parsed Path": `data.${dataSet.path}`.replace(/^data\.(actor|item)\./u, ""),
                        entityVal
                    }, dataSet.path, "Reading Editable Div", {style: "log", groupStyle: "info"});
                    if (entityVal)
                        element.innerHTML = (element.classList.contains("quote") ? _.escape(`"${entityVal}"`) : entityVal).trim();
                    else
                        element.innerHTML = "";
                }

                // If element innerHTML is blank, populate with placeholder if one is available
                if (!element.innerText && "placeholder" in dataSet) {
                    element.innerHTML = dataSet.placeholder;
                    element.classList.add("placeholder");
                } else {
                    element.classList.remove("placeholder");
                }
            });
            // #endregion
        }
    }
};
// #endregion