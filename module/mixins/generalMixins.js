// #region Import Modules
import {_, U, popoutData, itemCategories, SCION} from "../modules.js"; // eslint-disable-line import/no-cycle
import "../external/clamp.min.js";

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
        const popOutPos = {...popOutSheet.position};
        if (innerWidth - (mainLeft + mainWidth) > (popWidth + rightSpacing)) {popOutPos.left = mainLeft + mainWidth + rightSpacing} else {popOutPos.left = mainLeft - popWidth - leftSpacing}
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
                    const [popout] = html.find(`#${dataSet.htmlid}`);
                    U.LOG(U.IsDebug() && {
                        event,
                        element,
                        "... dataset": dataSet,
                        "PopOut": popout
                    }, `on CLICK: Open Popout ${dataSet.htmlid}`, "MIXIN: PopoutControl", {groupStyle: "l3"});
                    if (popout) {
                        if (popout.classList.contains("hidden")) {popout.classList.remove("hidden")} else {popout.classList.add("hidden")}
                    } else {U.THROW(event, "Popout Element Not Found!")}
                } else if ("itemid" in dataSet) {
                    const item = this.actor.items.get(dataSet.itemid);
                    U.LOG(U.IsDebug() && {
                        event,
                        element,
                        "... dataset": dataSet,
                        [`${U.TCase(this.entity.type)}.Items`]: this.actor.items,
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
                    const [popout] = html.find(`#${dataSet.htmlid}`);
                    U.LOG(U.IsDebug() && {
                        event,
                        element,
                        "... dataset": dataSet,
                        "PopIn": popout
                    }, `on BLUR: Close Popout ${dataSet.htmlid}`, "MIXIN: PopoutControl", {groupStyle: "l3"});
                    if (popout && !popout.classList.contains("hidden")) {popout.classList.add("hidden")} else {U.THROW(event, "Popout Element Not Found or already hidden!")}
                }
            };

            html.find(".clickable.openPopout").click(_onPopout.bind(this));
            html.find(".clickable.openTooltip").click(_onPopout.bind(this));
            html.find(".clickable.openTooltip").blur(_onPopin.bind(this));
        }
    }
};
export const ClampText = (superClass) => class extends superClass {
    clamp(element) {
        if ("clamplines" in element.dataset) {$clamp(element, {clamp: U.Int(element.dataset.clamplines)})} else if ("clampheight" in element.dataset) {$clamp(element, {clamp: element.dataset.clampheight})} else {$clamp(element, {clamp: "auto"})}
    }
    unClamp(element) { element.style.cssText = "" }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".clampText").each((i, element) => { this.clamp(element) });
    }
};
export const DotDragger = (superClass) => class extends superClass {
    get lastBin() { return this._lastBin ?? null }
    set lastBin(bin) { this._lastBin = bin }
    get basicDotFuncs() {
        return {
            drag: (dotBins, dot, sourceBin) => {
                dotBins.each((i, bin) => {
                    if (this.isTargetDroppable(dot, sourceBin, bin)) {
                        bin.classList.remove("fade75");
                    } else {
                        bin.classList.add("fade75");
                    }
                });
            },
            dragend: (dotBins, dot) => {
                dotBins.each((i, bin) => { 
                    bin.classList.remove("fade75");
                });
                // setTimeout(() => this.render(), 150);
            },
            drop: async (dot, targetBin, sourceBin) => {
                const {targetTypes, sourceTypes} = this.getDragTypes(dot, sourceBin, targetBin);
                const updateData = {};
                if (targetBin.dataset.binid !== sourceBin.dataset.binid) {
                    this.lastBin = targetBin;
                    // Increment Target Trait
                    if (targetTypes.includes("attribute")) {
                        const {attribute, field} = targetBin.dataset;
                        updateData[field] = this.actor.assignedAttrVals[attribute] + 1;
                        // this.actor.setProp(field, fieldindex, this.actor.assignedAttrVals[attribute] + 1);
                    } else if (targetTypes.includes("skill")) {
                        const {skill, field} = targetBin.dataset;
                        updateData[field] = this.actor.assignedSkillVals[skill] + 1;
                        // this.actor.setProp(field, fieldindex, this.actor.assignedSkillVals[skill] + 1);
                    } else if (targetTypes.includes("calling")) {
                        const {calling, field} = targetBin.dataset;
                        updateData[field] = this.actor.callings[calling].value + 1;
                        // this.actor.setProp(field, fieldindex, this.actor.callings[calling].value + 1);
                    }
                    // If source was another skill/attribute, decrement that.
                    if (!sourceTypes.includes("unassigned")) {
                        if (sourceTypes.includes("attribute")) {
                            const {attribute, field} = sourceBin.dataset;
                            // this.actor.setProp(field, this.actor.assignedAttrVals[attribute] - 1);
                            updateData[field] = this.actor.assignedAttrVals[attribute] - 1;
                        } else if (sourceTypes.includes("skill")) {
                            const {skill, field} = sourceBin.dataset;
                            updateData[field] = this.actor.assignedSkillVals[skill] - 1;
                            // this.actor.setProp(field, this.actor.assignedSkillVals[skill] - 1);
                        } else if (sourceTypes.includes("calling")) {
                            const {calling, field} = sourceBin.dataset;
                            updateData[field] = this.actor.callings[calling].value - 1;
                            // this.actor.setProp(field, this.actor.callings[calling].value - 1);
                        }
                    }
                    if (targetTypes.includes("calling")) {
                        await this.processCallingUpdate(updateData);
                    } else {
                        await this.actor.update(updateData);
                    }
                    // U.LOG(U.IsDebug() && {targetTypes, sourceTypes, updateData, ACTOR: this.actor.fullLogReport}, "Dot Dropped!", "onDotDrop");
                }
            },
            remove: async (dot, x, sourceBin) => {
                const {dotTypes, sourceTypes} = this.getDragTypes(dot, sourceBin);
                const updateData = {};
                if (!sourceTypes.includes("unassigned")) {
                    if (sourceTypes.includes("attribute")) {
                        const {attribute, field} = sourceBin.dataset;
                        updateData[field] = this.actor.assignedAttrVals[attribute] - 1;
                        // this.actor.setProp(field, this.actor.assignedAttrVals[attribute] - 1);
                    } else if (sourceTypes.includes("skill")) {
                        const {skill, field} = sourceBin.dataset;
                        updateData[field] = this.actor.assignedSkillVals[skill] - 1;
                        // this.actor.setProp(field, this.actor.assignedSkillVals[skill] - 1);
                    } else if (sourceTypes.includes("calling")) {
                        const {calling, field} = sourceBin.dataset;
                        updateData[field] = this.actor.callings[calling].value - 1;
                        // this.actor.setProp(field, this.actor.callings[calling].value - 1);
                    }
                    if (sourceTypes.includes("calling")) {
                        await this.processCallingUpdate(updateData);
                    } else {
                        await this.actor.update(updateData);
                    }
                }
                // U.LOG(U.IsDebug() && {dotTypes, sourceTypes, updateData, ACTOR: this.actor.fullLogReport}, "Dot Removed!", "onDropRemove");
            }
        };
    }

    addDragListener(dragger, listener, {extraArgs = [], extraFunc} = {}) {
        const listenFunc = async (...args) => {
            await this.basicDotFuncs[listener].bind(this)(...extraArgs, ...args);
            if (extraFunc) {
                await extraFunc.bind(this)(...extraArgs, ...args);
            }
        };
        dragger.on(listener, async (...args) => listenFunc.bind(this)(...args));
    }
    getDragTypes(dot, sourceBin, targetBin) {
        const returnVal = {
            dotTypes: dot.dataset.types?.split("|")
        };
        if (sourceBin) {returnVal.sourceTypes = sourceBin.dataset?.types?.split("|") ?? []}
        if (targetBin) {returnVal.targetTypes = targetBin.dataset?.types?.split("|") ?? []}
        return returnVal;
    }
    isDotDraggable(dot, sourceBin) {
        const {sourceTypes} = this.getDragTypes(dot, sourceBin);
        if (sourceTypes.includes("unassigned")) {
            return true;
        } if (sourceTypes.includes("attribute")) {
            const {attribute} = sourceBin.dataset;
            if (this.actor.attrVals[attribute] === this.actor.baseAttrVals[attribute]) {
                return false;
            }
            return true;
        }
        if (sourceTypes.includes("skill")) {
            const {skill} = sourceBin.dataset;
            if (this.actor.skillVals[skill] === this.actor.baseSkillVals[skill]) {
                return false;
            }
            return true;
        }
        if (sourceTypes.includes("calling")) {
            const {calling} = sourceBin.dataset;
            if (this.actor.callings[calling].value === 1) {
                return false;
            }
            return true;
        }
        return false;
    }
    isTargetDroppable(dot, sourceBin, targetBin) {
        if (sourceBin.dataset.binid === targetBin.dataset.binid) {
            return true;
        }
        const {dotTypes, sourceTypes, targetTypes} = this.getDragTypes(dot, sourceBin, targetBin);
        if (targetTypes.includes("unassigned")) {
            return false;
        }
        if (dotTypes.every((dotType) => !targetTypes.includes(dotType))) {
            return false;
        }
        if (dotTypes.includes("attribute")) {
            if (!dotTypes.includes("general")) {
                const dotArenas = dotTypes.filter((dotType) => ["physical", "mental", "social"].includes(dotType));
                if (dotArenas.every((dotArena) => !targetTypes.includes(dotArena))) {
                    return false;
                }
            }
            const {attribute} = targetBin.dataset;
            if (this.actor.attrVals[attribute] === SCION.ATTRIBUTES.max) {
                return false;
            }
            return true;
        }
        if (dotTypes.includes("skill")) {
            const {skill} = targetBin.dataset;
            if (this.actor.skillVals[skill] === SCION.SKILLS.max) {
                return false;
            }
            return true;
        }
        if (dotTypes.includes("calling")) {
            const {calling} = targetBin.dataset;
            if (this.actor.callings[calling].value === SCION.CALLINGS.max) {
                return false;
            }
            return true;
        }
        return false;
    }
};
export const EditableDivs = (superClass) => class extends ClampText(superClass) {
    activateListeners(html) {
        super.activateListeners(html);

        if (this.options.editable) {
            const setContent = (element, content) => {
                if (!["number", "string"].includes(typeof content)) {
                    content = "";
                } else {
                    content = `${content}`.trim();
                }
                if (content) {
                    element.classList.remove("placeholder");
                    if (element.classList.contains("quote")) {
                        content = `"${content}"`;
                    }
                } else {
                    if ("placeholder" in element.dataset) {
                        element.classList.add("placeholder");
                        content = element.dataset.placeholder;
                    } else {
                        content = " ";
                    }
                }
                element.innerHTML = _.escape(content);
            };
            // #region ON-EVENT FUNCTIONS
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
                    element.innerHTML = "&nbsp;";
                    element.classList.remove("placeholder");
                    this.unClamp(element);
                }
                if (element.classList.contains("quote")) {
                    element.innerHTML = element.innerText.replace(/^\s*"?|"?\s*$/gu, "").trim();
                }
                // Add an event listener for when the player hits the 'Enter' key.
                element.addEventListener("keydown", _onEditKeyDown.bind(this));
                // Focus the element, which will fire the _onEditFocus event to select all text.
                element.focus();
            };
            const _onEditFocus = () => { document.execCommand("selectAll") };
            const _onEditClickOff = async (event) => {
                event.preventDefault();
                const element = event.currentTarget;
                const {dataset} = element;
                const elementText = element.innerText.replace(/^\s*"?|"?\s*$/gu, "").trim();
                this.clamp(element);
                setContent(element, elementText);
                element.setAttribute("contenteditable", false);
                element.removeEventListener("keydown", _onEditKeyDown);

                if ("field" in dataset) {
                    if ("fieldindex" in dataset) {
                        const fieldVal = getProperty(this.entity, dataset.field.replace(/^(data\.)+/gu, "data.data."));
                        fieldVal[U.Int(dataset.fieldindex)] = elementText;
                        await this.entity.update({[dataset.field]: fieldVal});
                    } else {
                        await this.entity.update({[dataset.field]: elementText});
                    }
                }
            };
            // #endregion

            // #region INITIALIZATION
            html.find("div.contentEditable").each((i, element) => {
                const {dataset} = element;
                element.setAttribute("contenteditable", false);
                element.addEventListener("click", _onEditClickOn.bind(this));
                element.addEventListener("focus", _onEditFocus.bind(this));
                element.addEventListener("blur", _onEditClickOff.bind(this));
                this.clamp(element);
                let elementText;

                // If dataset includes a field, fill the element with the current data:
                if ("field" in dataset) {
                    elementText = getProperty(this.entity.data, dataset.field);
                    if (dataset.fieldindex !== undefined && Array.isArray(elementText)) {
                        elementText = elementText[U.Int(dataset.fieldindex)];
                    }
                }
                setContent(element, elementText);
            });
            // #endregion
        }
    }
};
export const Accessors = (superClass) => class extends superClass {

    get $entity() { return typeof this.entity === "string" ? this : this.entity }
    get $sheet() { return this.$entity.sheet }
    get $id() { return this.$entity._id }
    get $base() { return this.$entity.data }
    get $data() { return this.$base.data }
    get $type() { return this.$base.type }
    get $subtype() { return this.$data.type }
    get $items() { return this.$entity.items ?? new Map(
        Object.values(flattenObject(this.$data.items ?? {}))
            .filter((val) => typeof val === "string")
            .map((itemID) => [
                itemID,
                this.actor.items.find((item) => item.$id === itemID)
            ])
        );
    }
    get $category() { 
        this._category = this._category ?? Object.keys(itemCategories).find((cat) => itemCategories[cat].includes(this.$entity.data.type));
        return this._category;
    }


    get $sheetDOM() {
        this._sheetDOM = this._sheetDOM ?? $(`[id$='${this.$id}']`)[0];
        return this._sheetDOM;
    }
    
    get actor() {
        this._actor = this._actor ?? super.actor ?? (this.$entity.entity === "Actor" ? this.$entity : false);
        return this._actor;
    }
};

export const CloseButton = (superClass) => class extends superClass {
    activateListeners(html) {
        super.activateListeners(html);
        html.find("div.closeButton").click(() => this.close());
    }
};
// #endregion