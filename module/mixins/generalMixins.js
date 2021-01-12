// #region Import Modules
import {GetType, THROW} from "../data/utils.js";
import {_, U, popoutData, SCION} from "../modules.js";
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
export const UpdateQueue = (superClass) => class extends superClass {
    get isQueueing() {
        return true;
    }


    // prepareData() {
        // console.log("MIXIN PrepData");
        // this.pendingUpdateData = this.pendingUpdateData ?? {};
        // this.updatingData = false;
        // super.prepareData();
    // }

    get pendingUpdateData() {
        return isObjectEmpty(this._pendingUpdateData ?? {}) ? false : this._pendingUpdateData;
    }
    set pendingUpdateData(v) {
        if (v && typeof v === "object") {
            if (!this.isQueueing) {
                this.entity.update(v);
            } else {
                this._pendingUpdateData = {...this._pendingUpdateData ?? {}, ...v};
            }
        } else {
            this._pendingUpdateData = null;
        }
    }

    get updatingData() {
        return isObjectEmpty(this._updatingData ?? {}) ? false : _.pick(this._updatingData, "data");
    }
    set updatingData(v) {
        if (v && typeof v === "object") {
            this._updatingData = v;
        } else {
            this._updatingData = null; 
        }
    }

    getProp(fieldKey, fieldIndex) {
        let entityVal;
        const reportTitle = `gPr("${fieldKey}"${fieldIndex !== undefined ? `, ${fieldIndex}` : ""})`;
        let reportString = "";
        
        if (!this.isQueueing || !fieldKey.startsWith("data.")) {            
            // Only fields stored in entity.data are queued; things like 'name' don't need it,
            // and are instead fetched directly from the entity instance.
            entityVal = getProperty(this, fieldKey.replace(/^(data\.)+/u, "data.data."));
        } else {
            // Standardize the "data.(data.)?" ambiguity between Handlebars and get/setProperty by ensuring "data." appears once:
            fieldKey = fieldKey.replace(/^(data\.)+/u, "data.");
            // Look through the three places data could be, in order of "freshness":
            /*
                // First check data that is being applied right this moment by the async processUpdateQueue method (below)...
            entityVal = (this.updatingData ? getProperty(this.updatingData, fieldKey) : null)  
                // ... if nothing, retrieve value if it's in the pendingUpdateData queue ...
                ?? getProperty(this.pendingUpdateData, fieldKey)
                // ... if nothing, retrieve value from entity instance directly.
                ?? getProperty(this, `data.${fieldKey}`);
            */
            if (this.updatingData) {
                entityVal = getProperty(this.updatingData, fieldKey);
                if (entityVal) {
                    reportString += " >>> uD: " + entityVal;
                }
            }
            if (!entityVal) {
                entityVal = getProperty(this.pendingUpdateData, fieldKey);
                if (entityVal) {
                    reportString += " >> puD: " + entityVal;
                }
            }
            if (!entityVal) {
                entityVal = getProperty(this, `data.${fieldKey}`);
            }
        }
        if (fieldIndex !== undefined) {
            // If a fieldIndex is given and the value retrieved by fieldKey is an array, return associated element:
            if (this.isQueueing && reportString && Array.isArray(entityVal)) {
                reportString += ` -> [${fieldIndex}]: ${entityVal[U.Int(fieldIndex)]}`;
            }
            entityVal = Array.isArray(entityVal) ? entityVal[U.Int(fieldIndex)] : undefined;
        }
        // Clone everything (simple JSON.parse(JSON stringify)) because I always get tripped up by unexpected mutations:
        if (this.isQueueing && reportString) {
            // console.log(`${reportTitle} ${reportString}`);
        }
        return U.Clone(entityVal);
    }

    async setProp(fieldKey, fieldIndex, value) {
        // Hacky function overloading; can do 'setProp(fieldKey, value)' and this ensures it'll work:
        if (value === undefined) {
            [value, fieldIndex] = [fieldIndex, undefined];
        }
        if (fieldIndex !== undefined) {
            // If array index given: Set update value to entire array, then change the indicated element.
            // (By using the above 'getProp' method, we know we're getting the most current data, even if it
            // hasn't been set on the entity yet.)
            value = U.Insert(this.getProp(fieldKey), value, fieldIndex);
        }   
        if (this.isQueueing && fieldKey.startsWith("data.")) {
            return this.queueUpdateData({[fieldKey]: value});
        }
        return await this.update({[fieldKey]: value});
    }

    queueUpdateData(updateData) {
        if (!this.isQueueing) {
            this.entity.update(updateData);
            return true;
        }
        const reportObj = {
            newData: {...updateData},
            prevPending: {...this.pendingUpdateData}
        };
        // Filter out any data that isn't changing.
        updateData = _.omit(U.Flatten(updateData), (value, fieldKey) => U.Equal(value, this.getProp(fieldKey)));
        if (isObjectEmpty(updateData)) {
            return false;
        }
        // Merge new data with data awaiting update.
        reportObj.newPending = U.Merge(this.pendingUpdateData, updateData);
        this.pendingUpdateData = U.Merge(this.pendingUpdateData, updateData);

        console.dir({"QUEUING DATA:": reportObj});
        return true;
    }
    async processUpdateQueue(isForcing = false) {
        if (this.updatingData) { // Ignore calls if in the process of updating.
            // console.warn("Blocking Update: Currently Updating!");
            // console.dir(this.updatingData);
            // console.dir(this);
        } else if (this.pendingUpdateData) {
            this.updatingData = U.Expand(this.pendingUpdateData);
            this.pendingUpdateData = null;
            // console.log("PROCESSING UPDATE QUEUE...");
            await this.update(this.updatingData);
            // console.log("PROCESSED!");
            this.updatingData = null;
            return true;
        } else if (isForcing) {
            await this.sheet.render(); // Can force a re-render with isForcing = true.
        }
        return false;
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
            dragend: async (dotBins, dot) => {
                dotBins.each((i, bin) => { 
                    bin.classList.remove("fade75");
                });
                await this.actor.processUpdateQueue(true);
                // this.render();
            },
            drop: (dot, targetBin, sourceBin) => {
                const {targetTypes, sourceTypes} = this.getDragTypes(dot, sourceBin, targetBin);
                const updateData = {};
                if (targetBin.dataset.binid !== sourceBin.dataset.binid) {
                    console.log(`LAST BIN: ${targetBin.dataset.binid}`);
                    this.lastBin = targetBin;
                    // Increment Target Trait
                    if (targetTypes.includes("attribute")) {
                        const {attribute, field, fieldindex} = targetBin.dataset;
                        this.actor.setProp(field, fieldindex, this.actor.assignedAttrVals[attribute] + 1);
                    } else if (targetTypes.includes("skill")) {
                        const {skill, field, fieldindex} = targetBin.dataset;
                        this.actor.setProp(field, fieldindex, this.actor.assignedSkillVals[skill] + 1);
                    } else if (targetTypes.includes("calling")) {
                        const {calling, field, fieldindex} = targetBin.dataset;
                        this.actor.setProp(field, fieldindex, this.actor.callings[calling].value + 1);
                    }
                    // If source was another skill/attribute, decrement that.
                    if (!sourceTypes.includes("unassigned")) {
                        if (sourceTypes.includes("attribute")) {
                            const {attribute, field, fieldindex} = sourceBin.dataset;
                            this.actor.setProp(field, fieldindex, this.actor.assignedAttrVals[attribute] - 1);
                            updateData[sourceBin.dataset.field] = this.actor.assignedAttrVals[attribute] - 1;
                        } else if (sourceTypes.includes("skill")) {
                            const {skill, field, fieldindex} = sourceBin.dataset;
                            this.actor.setProp(field, fieldindex, this.actor.assignedSkillVals[skill] - 1);
                        } else if (sourceTypes.includes("calling")) {
                            const {calling, field, fieldindex} = sourceBin.dataset;
                            this.actor.setProp(field, fieldindex, this.actor.callings[calling].value - 1);
                            this.actor.queueSyncKnacks();
                        }
                    }
                    U.LOG(U.IsDebug() && {targetTypes, sourceTypes, updateData, ACTOR: this.actor.fullLogReport}, "Dot Dropped!", "onDotDrop");
                }
            },
            remove: (dot, x, sourceBin) => {
                const {dotTypes, sourceTypes} = this.getDragTypes(dot, sourceBin);
                const updateData = {};
                if (!sourceTypes.includes("unassigned")) {
                    if (sourceTypes.includes("attribute")) {
                        const {attribute, field, fieldindex} = sourceBin.dataset;
                        this.actor.setProp(field, fieldindex, this.actor.assignedAttrVals[attribute] - 1);
                        updateData[sourceBin.dataset.field] = this.actor.assignedAttrVals[attribute] - 1;
                    } else if (sourceTypes.includes("skill")) {
                        const {skill, field, fieldindex} = sourceBin.dataset;
                        this.actor.setProp(field, fieldindex, this.actor.assignedSkillVals[skill] - 1);
                    } else if (sourceTypes.includes("calling")) {
                        const {calling, field, fieldindex} = sourceBin.dataset;
                        this.actor.setProp(field, fieldindex, this.actor.callings[calling].value - 1);
                    }
                }
                U.LOG(U.IsDebug() && {dotTypes, sourceTypes, updateData, ACTOR: this.actor.fullLogReport}, "Dot Removed!", "onDropRemove");
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
        dragger.on(listener, async (...args) => await listenFunc.bind(this)(...args));
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
            const checkForPlaceholder = (element) => {
                if (!element.innerText && "placeholder" in element.dataset) {
                    element.classList.add("placeholder");
                    element.innerHTML = element.dataset.placeholder;
                } else {
                    element.classList.remove("placeholder");
                }
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
                    element.innerHTML = "";
                    element.classList.remove("placeholder");
                    this.unClamp(element);
                }
                if (element.classList.contains("quote")) {element.innerHTML = element.innerText.replace(/^\s*"?|"?\s*$/gu, "").trim()}
                // Add an event listener for when the player hits the 'Enter' key.
                element.addEventListener("keydown", _onEditKeyDown.bind(this));
                // Focus the element, which will fire the _onEditFocus event to select all text.
                element.focus();
            };
            const _onEditFocus = () => { document.execCommand("selectAll") };
            const _onEditClickOff = async (event) => {
                event.preventDefault();
                const element = event.currentTarget;
                const dataSet = element.dataset;
                element.setAttribute("contenteditable", false);
                element.removeEventListener("keydown", _onEditKeyDown);
                this.clamp(element);

                if ("field" in dataSet) {
                    const elementVal = element.innerText.replace(/^\s*"?|"?\s*$/gu, "").trim();
                    let entityVal = elementVal;
                    if ("fieldindex" in dataSet) {
                        entityVal = this.entity.getProp(dataSet.field);
                        entityVal[U.Int(dataSet.fieldindex)] = elementVal;
                    }
                    await this.entity.setProp(dataSet.field, entityVal);
                    await this.entity.processUpdateQueue();
                    if (entityVal && element.classList.contains("quote")) {
                        element.innerHTML = _.escape(`"${entityVal}"`);
                    }
                }
                checkForPlaceholder(element);
            };
            // #endregion

            // #region INITIALIZATION
            html.find("div.contentEditable").each((i, element) => {
                const dataSet = element.dataset;
                element.setAttribute("contenteditable", false);
                element.addEventListener("click", _onEditClickOn.bind(this));
                element.addEventListener("focus", _onEditFocus.bind(this));
                element.addEventListener("blur", _onEditClickOff.bind(this));
                this.clamp(element);

                // If dataset includes a field, fill the element with the current data:
                if ("field" in dataSet) {
                    const entityVal = this.entity.getProp(dataSet.field, dataSet.fieldindex) || "";
                    if (!entityVal || (typeof entityVal === "object" && _.isEmpty(entityVal))) {
                        element.innerHTML = "";
                    } else {
                        element.innerHTML = (element.classList.contains("quote") ? _.escape(`"${entityVal}"`) : `${entityVal}`).trim();
                    }
                }
                checkForPlaceholder(element);
            });
            // #endregion
        }
    }
};
/* jshint ignore:start */
export const CloseButton = (superClass) => class extends superClass {
    activateListeners(html) {
        super.activateListeners(html);
        html.find("div.closeButton").click(() => this.close());
    }
};
// #endregion