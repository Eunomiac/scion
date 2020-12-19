// #region Import Modules
import { THROW } from "../data/utils.js";
import {_, U, popoutData} from "../modules.js";

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
export const PopoutControl = (superClass) => class extends superClass {
    popoutSheet(popOutSheet, {leftSpacing, rightSpacing} = {}) {
        const {left: mainLeft, top: mainTop, width: mainWidth} = this.entity.sheet.position;
        const {width: popWidth} = popOutSheet.position;
        const popOutPos = Object.assign({}, popOutSheet.position);
        if (innerWidth - (mainLeft + mainWidth) > (popWidth + rightSpacing))
            popOutPos.left = mainLeft + mainWidth + rightSpacing;
        else
            popOutPos.left = mainLeft - popWidth - leftSpacing;
        popOutPos.top = mainTop;
        popOutSheet.position = popOutPos;
        popOutSheet.render(true);
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (this.options.editable) {
            const _onPopout = (event) => {
                event.preventDefault();
                const element = event.currentTarget;
                const dataSet = element.dataset;
                if ("htmlid" in dataSet) {
                    const popout = html.find(`#${dataSet.htmlid}`)[0];
                    U.LOG({
                        event,
                        element,
                        "... dataset": dataSet,
                        "PopOut": popout
                    }, `on CLICK: Open Popout ${dataSet.htmlid}`, "MIXIN: PopoutControl", {groupStyle: "l3"});
                    if (popout)
                        if (popout.classList.contains("hidden"))
                            popout.classList.remove("hidden");
                        else
                            popout.classList.add("hidden");
                    else
                        U.THROW(event, "Popout Element Not Found!");
                } else if ("itemid" in dataSet) {
                    const item = this.actor.items.get(dataSet.itemid);
                    U.LOG({
                        event,
                        element,
                        "... dataset": dataSet,
                        [`${U.TCase(this.type)}.Items`]: this.actor.items,
                        item
                    }, `on CLICK: Open ItemSheet ${item.name}`, "MIXIN: PopoutControl", {groupStyle: "l3"});
                    this.popoutSheet(item.sheet, popoutData[item.type]);
                }
            };
            const _onPopin = (event) => {
                // event.preventDefault();
                const element = event.currentTarget;
                const dataSet = element.dataset;
                if ("htmlid" in dataSet) {
                    const popout = html.find(`#${dataSet.htmlid}`)[0];
                    U.LOG({
                        event,
                        element,
                        "... dataset": dataSet,
                        "PopIn": popout
                    }, `on BLUR: Close Popout ${dataSet.htmlid}`, "MIXIN: PopoutControl", {groupStyle: "l3"});
                    if (popout && !popout.classList.contains("hidden"))
                        popout.classList.add("hidden");
                    else
                        U.THROW(event, "Popout Element Not Found or already hidden!");
                }
            };

            html.find(".clickable.openPopout").click(_onPopout.bind(this));
            html.find(".clickable.openTooltip").click(_onPopout.bind(this));
            html.find(".clickable.openTooltip").blur(_onPopin.bind(this));
        }
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

                if ("field" in dataSet) {
                    const elementVal = element.innerText.replace(/^\s*"?|"?\s*$/gu, "").trim();
                    let entityVal = getProperty(this.entity.data, dataSet.field);
                    if (entityVal === undefined)
                        entityVal = getProperty(this.entity, dataSet.field);
                    if ("fieldindex" in dataSet && Array.isArray(entityVal))
                        entityVal[U.Int(dataSet.fieldindex)] = elementVal;
                    else
                        entityVal = elementVal;
                    U.LOG({
                        "this": this,
                        "...entity": this.entity,
                        "dataSet.field": dataSet.field,
                        "entityVal-data": getProperty(this.entity.data, dataSet.field),
                        "entityVal-root": getProperty(this.entity, dataSet.field),
                        entityVal,
                        elementVal: elementVal
                    }, `Setting ${dataSet.field} of ${this.entity.name} to '${entityVal}'`, "Editable Divs", {groupStyle: "l3"});
                    this.entity.update({[dataSet.field]: entityVal});
                    if (elementVal && element.classList.contains("quote"))
                        element.innerHTML = _.escape(`"${elementVal}"`);
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

                // If dataset includes a field, fill the element with the current data:
                if ("field" in dataSet) {
                    // const elementVal = element.innerText.replace(/^\s*"?|"?\s*$/gu, "").trim();
                    let entityVal = getProperty(this.entity.data, dataSet.field);
                    if (entityVal === undefined)
                        entityVal = getProperty(this.entity, dataSet.field);
                    if ("fieldindex" in dataSet && Array.isArray(entityVal))
                        entityVal = entityVal[U.Int(dataSet.fieldindex)];
                    if (entityVal && typeof entityVal !== "string") {
                        U.THROW({
                            "this": this,
                            "...entity": this.entity,
                            "dataSet.field": dataSet.field,
                            "entityVal-data": getProperty(this.entity.data, dataSet.field),
                            "entityVal-root": getProperty(this.entity, dataSet.field),
                            entityVal
                        }, "Invalid Field");
                    } else {
                        entityVal = entityVal || "";
                        U.LOG({
                            "this": this,
                            "...entity": this.entity,
                            "dataSet.field": dataSet.field,
                            "entityVal-data": getProperty(this.entity.data, dataSet.field),
                            "entityVal-root": getProperty(this.entity, dataSet.field),
                            entityVal
                        }, `Initializing ${dataSet.field} of ${this.entity.name} to '${entityVal}'`, "Editable Divs", {groupStyle: "l3"});
                        element.innerHTML = (entityVal && element.classList.contains("quote") ? _.escape(`"${entityVal}"`) : entityVal).trim();
                    }
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
/* jshint ignore:start */
export const RichEdit = (superClass) => class extends superClass {
    get _richEditDefaults() {
        return {
            menubar: false,
            statusbar: false,
            inline: true,
            toolbar: false,

            selector: "[class$=\"Editor\"]",
            theme: "silver",

            height: "100%",
            width: "100%",

            plugins: [
                "autoresize",
                "bbcode",
                "charmap",
                "emoticons",
                "lists",
                "advlist",
                "paste",
                "quickbars",
                "template",
                "help"
            ],

            placeholder: "",
            quickbars_insert_toolbar: false,
            quickbars_selection_toolbar: "bold italic underline h1 h2 h3 | fontselect fontsizeselect forecolor formatselect removeformat",
            contextmenu: "undo redo | help",
            paste_block_drop: false,
            paste_data_images: false,
            paste_as_text: true
        };
    }
    get richEditDefaults() {
        return mergeObject(
            super.richEditDefaults ?? {},
            this._richEditDefaults,
            {insertKeys: true, insertValues: true, overwrite: true, recursive: true}
        );
    }
    createRichEditor(configOptions = {}, initialHTML = "", isRecreating = false) {
        if (!("selector" in configOptions))
            return THROW({"ERROR": "You must provide a selector in configOptions.", configOptions});
        this.richEditors = this.richEditors ?? {};
        if (isRecreating || !this.richEditors[`_${configOptions.selector}`]) {
            const richEditDefaults = duplicate(this.richEditDefaults);
            if ("remPlugins" in configOptions)
                richEditDefaults.plugins = richEditDefaults.filter((plugin) => !configOptions.remPlugins.includes(plugin));
            const finalConfigOptions = mergeObject(
                mergeObject(
                    richEditDefaults,
                    configOptions,
                    {insertKeys: true, insertValues: true, overwrite: true, recursive: true}
                ),
                {"-=remPlugins": null}
            );
            finalConfigOptions.max_height = finalConfigOptions.max_height ?? finalConfigOptions.height;
            finalConfigOptions.min_height = finalConfigOptions.min_height ?? finalConfigOptions.height;
            finalConfigOptions.max_width = finalConfigOptions.max_width ?? finalConfigOptions.width;
            finalConfigOptions.min_width = finalConfigOptions.min_width ?? finalConfigOptions.width;

            (async () => {
                this.richEditors[`_${configOptions.selector}`] = await TextEditor.create(finalConfigOptions, initialHTML);
                U.LOG({
                    richEditDefaults,
                    configOptions,
                    finalConfigOptions,
                    richEditor: this.richEditors[`_${configOptions.selector}`]
                }, "Rich Editor Creation", "createRichEditor()", {groupStyle: "l2"});
            })();
        } else {
            U.LOG({
                richEditor: this.richEditors[`_${configOptions.selector}`]
            }, "Rich Editor Retrieved", "createRichEditor()", {groupStyle: "l2"});
            // this.richEditors[`_${configOptions.selector}`].render();
            this.richEditors[`_${configOptions.selector}`].editorManager.execCommand("mceAddEditor", false, this.richEditors[`_${configOptions.selector}`].id);
        }
        return this.richEditors[`_${configOptions.selector}`];
    }
};
// #endregion