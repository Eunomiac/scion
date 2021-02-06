import {_, U, SCION, itemCategories, Dragger} from "../modules.js";
import ScionActorSheet from "./actor-sheet.js";
import "../external/dragula.min.js";
import {THROW} from "../data/utils.js";

export default class MajorActorSheet extends ScionActorSheet {
    static get classDefaultOptions() {
        return {
            classes: [...super.defaultOptions.classes, "major"],
            width: 750,
            height: 750,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "chargen"
                },
                {
                    navSelector: ".chargen-tabs",
                    contentSelector: ".chargen-body",
                    initial: "step-one"
                }
            ]
        };
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [...super.defaultOptions.classes, "major"],
            width: 750,
            height: 750,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "chargen"
                },
                {
                    navSelector: ".chargen-tabs",
                    contentSelector: ".chargen-body",
                    initial: "step-one"
                }
            ]
        });
    }

    get selectedCalling() {
        const chosenCallings = Object.keys(this.actor.callings);
        const sumKnackVals = (calling) => this.actor.knacks.reduce((tot, knack) => tot + (
            knack.assignment === calling ? {heroic: 1, immortal: 2}[knack.tier] : 0
        ), 0);
        if (chosenCallings.length < 3) {
            this._selectedCalling = false;
            return this._selectedCalling;
        }
        if (this._selectedCalling && (
            !(this._selectedCalling in this.actor.callings)
            || sumKnackVals(this._selectedCalling) === this.actor.callings[this._selectedCalling].value
        )) {
            this._selectedCalling = false;
        }
        // If selected calling has been falsified, set it to a calling with available knack slots.
        if (!this._selectedCalling) {
            const newCallingData = _.max(this.actor.callings, (callingData, callingName) => callingData.value - sumKnackVals(callingName));
            if (newCallingData && newCallingData.value > sumKnackVals(newCallingData.name)) {
                this._selectedCalling = newCallingData.name;
            }
        }
        return this._selectedCalling;
    }
    get tooltipLines() {
        this._tooltipLines = this._tooltipLines ?? {
            knacks: U.KeyMapObj(SCION.KNACKS.list, (data, name) => ({
                lines: [
                    ["h3 class=\"alignCenter\"", U.Loc(`scion.knack.${name}.name`)],
                    ...U.Loc(`scion.knack.${name}.description`).
                        split("<").
                        map((line) => (/^\w{0,2}>/u.test(line) ? [line.match(/^(\w{0,2})>/u)[1], line.replace(/^\w{0,2}>/gu, "")] : [line])),
                    ...data.stunts.map((stunt) => ["li", `<span class="stuntName">${U.Loc(`scion.stunt.${stunt}.name`)}</span> <span class="stuntCost">(${U.Loc(`scion.stunt.${stunt}.cost`)})</span> — ${U.Loc(`scion.stunt.${stunt}.effect`)}`])
                ]
            }))
        };
        return this._tooltipLines;
    }
    // #region GET DATA
    getData() {
        const data = super.getData();

        const actorData = data.data;        
        const C = _.pick(CONFIG.scion, "PANTHEONS", "GODS");

        // #region HEADER
        const {genesis, pantheon, patron} = actorData;
        actorData.patronageLine = "";
        if (pantheon && patron && C.PANTHEONS[pantheon].members.includes(patron)) {
            if (genesis) {
                actorData.patronageLine = U.Loc(`scion.genesis.${genesis}Line`, {
                    divinePatronName: U.Loc(C.GODS[patron].label),
                    divinePatronMantle: C.GODS[patron].mantle ? `, ${U.Loc(C.GODS[patron].mantle)}` : ""
                });
            }
        } else {
            actorData.patron = "";
        }
        // #endregion

        // #region OWNED ITEM SORTING
        data.items = {};
        for (const [itemCategory, itemTypes] of Object.entries(itemCategories)) {data.items[itemCategory] = this.actor.items.filter((item) => itemTypes.includes(item.type))}
        // #endregion

        // #region TOOLTIP DATA
        data.tooltips = this.tooltipLines;

        // #endregion

        // #region FRONT PAGE
        if (pantheon) {data.virtues = C.PANTHEONS[pantheon].virtues.map((virtue) => U.Loc(`scion.virtue.${virtue}`))}
        // #endregion

        // #region CHARGEN
        actorData.charGen = actorData.charGen ?? {};

        // #region STEP ONE

        // Update Patron List
        if (pantheon) {actorData.charGen.patronList = U.MakeDict(C.PANTHEONS[pantheon].members, (v) => U.Loc(`scion.pantheon.god.${v}`), (k, v) => v)}
        // #endregion

        // #region STEP TWO

        // PATH PRIORITIES
        const pathItems = [];
        for (const pathType of actorData.pathPriorities) {
            pathItems.push(data.items.paths.find((item) => item.data.data.type === pathType));
        }
        data.items.paths = pathItems;

        // PATH SKILL COUNTS
        data.pathSkills = _.pick(this.actor.pathSkillVals, (v) => v > 0);
        data.pathSkillsCount = U.KeyMapObj(SCION.SKILLS.list, () => 0);
        Object.values(data.items.paths).forEach((pathItem) => {
            pathItem.data.data.skills.forEach((skill) => {
                data.pathSkillsCount[skill]++;
            });
        });
        // #endregion

        // #region STEP THREE

        // SKILLS
        data.skillVals = this.actor.skillVals;
        data.unassignedSkillDots = this.actor.unassignedSkillDots;

        // SPECIALTIES
        data.skillSpecialties = this.actor.specialties;

        // ATTRIBUTES
        data.arenaPriorities = this.actor.$data.attributes.priorities;
        data.arenas = U.KeyMapObj(SCION.ATTRIBUTES.arenas, (arenaAttrs) => U.KeyMapObj(arenaAttrs, (i, attrName) => attrName, (attrName) => this.actor.attrVals[attrName]));
        data.unassignedAttributeDots = {...this.actor.unassignedArenaAttrDots, general: this.actor.unassignedGeneralAttrDots};
        data.isUnassignedAttributeDots = Boolean(U.SumVals(data.unassignedAttributeDots));

        // #endregion
        
        // #region STEP FOUR       
        const actorCallingData = U.Clone(this.actor.callings);
        const actorKnackData = U.Clone(this.actor.knacks);
        const actorAssignableCallingDots = this.actor.assignableCallingDots;
        data.callings = {
            available: {
                patron: this.$data.patron ? SCION.GODS[this.$data.patron].callings : [],
                get other() { return Object.keys(SCION.CALLINGS.list).filter((calling) => !this.patron.includes(calling)) }
            },
            callings: actorCallingData,
            genericKnacks: this.actor.getAvailableCallingKnacks("any"),
            knacks: actorKnackData,
            selected: this.selectedCalling,
            chargen: this.actor.orderedCallings,
            get numChosen() { return Object.keys(this.callings).filter((key) => key && key in SCION.CALLINGS.list).length },
            get unassignedCallingDots() { return Math.max(0, actorAssignableCallingDots - Object.values(this.callings).reduce((tot, val) => tot + val.value - 1, 0)) },
            get areAllCallingsChosen() { return this.numChosen === 3 },
            get areAllDotsAssigned() { return this.unassignedCallingDots === 0 },
            get areAllKnacksFull() { return Object.values(actorCallingData).reduce((result, calling) => result && calling.areKnacksFull, true) },
            get areAllKeywordsFull() { return Object.values(actorCallingData).reduce((result, calling) => result && calling.areKeywordsFull, true) },
            get areCallingsDone() { return this.areAllCallingsChosen && this.areAllKnacksFull && this.areAllKeywordsFull },
            get groupedKnacks() {
                const knackData = {
                    all: [],
                    extra: this.knacks.filter((knack) => knack.assignment === "extra")
                };
                Object.keys(this.callings).forEach((callingName) => {
                    knackData[callingName] = this.knacks.filter((knack) => knack.assignment === callingName);
                    knackData.all.push(...knackData[callingName]);
                });
                knackData.all.push(...knackData.extra);
                knackData.overflow = this.knacks.filter((knack) => knackData.all.every((aKnack) => aKnack.name !== knack.name));
                return knackData;
            }
        };
        
        // #endregion

        // #endregion

        // #region RETURN
        // U.LOG({
        //     "SHEET CONTEXT": data,
        //     "ACTOR LOG": this.actor.fullLogReport,
        //     "Instances": {
        //         sheet: this,
        //         entity: this.$entity
        //     }
        // }, this.actor.name, "MajorActorSheet", {isLoud: true});

        return data;
        // #endregion
    }
    // #endregion

    // #region ENTITY UPDATING
    async processCallingUpdate(updateData = {}) {
        updateData = U.Expand(updateData);
        const mergedUpdateData = U.Expand(Object.assign(
            U.Flatten({
                data: {
                    callings: {list: U.Clone(this.$data.callings.list)},
                    knacks: {list: U.Clone(this.$data.knacks.list)}
                }
            }),
            U.Flatten(updateData)
        ));
        const initialMergedUpdateData = U.Clone(mergedUpdateData);

        const sumKnackVals = (calling) => mergedUpdateData.data.knacks.list.reduce((tot, knack) => tot + (
            knack.assignment === calling ? {heroic: 1, immortal: 2}[knack.tier] : 0
        ), 0);
        for (const [calling, callingData] of Object.entries(mergedUpdateData.data.callings.list)) {
            if (Number.isInteger(callingData.slot)) {
                const dataRef = mergedUpdateData.data.callings.list[calling];
                while (sumKnackVals(calling) > callingData.value) {
                    U.Remove(mergedUpdateData.data.knacks.list, (knack) => knack.assignment === calling);
                    // console.log(`SumKnackVals(${calling}) = ${sumKnackVals(calling)}, callingData.value = ${callingData.value}, knacks = ${mergedUpdateData.data.knacks.list}`);
                }
                dataRef.keywordsUsed = dataRef.keywordsUsed.filter((keyword) => dataRef.keywordsChosen.includes(keyword));
                while (dataRef.keywordsChosen.length > callingData.value) {
                    const thisKeyword = dataRef.keywordsChosen.find((keyword) => !dataRef.keywordsUsed.includes(keyword))
                        || U.Last(dataRef.keywordsChosen);
                    U.Remove(dataRef.keywordsChosen, (keyword) => keyword === thisKeyword);
                    U.Remove(dataRef.keywordsUsed, (keyword) => keyword === thisKeyword);
                }
                dataRef.keywordsUsed.length = Math.min(dataRef.keywordsUsed.length, callingData.value);
            } else {
                mergedUpdateData.data.knacks.list = mergedUpdateData.data.knacks.list.filter((knack) => knack.assignment !== calling);
            }
        }
        // console.dir({updateData, initialMergedUpdateData, mergedUpdateData});
        U.LOG({"1: updateData": updateData, "2: initialMerge": initialMergedUpdateData, "3: finalData": mergedUpdateData}, this.actor.name, "processCallingData", {groupStyle: "l2"});
        await this.actor.update(U.Flatten(mergedUpdateData));
    }
    // #endregion
    activateListeners(html) {
        super.activateListeners(html);
        if (this.options.editable) {
            // #region Menu Rosette
            const [menuRosette] = html.find("nav.menuRosette");
            const sheetContainer = document.getElementById(`actor-${this.actor.id}`);
            const [sheetElem] = html.find("section#characterSheet");
            const [closeButton] = html.find("div.closeButton");

            // Make Menu Rosette draggable
            const menuDragger = new Dragger(this, html, menuRosette, [sheetContainer, sheetElem], {height: 100, width: 100}, [menuRosette, closeButton]);

            // Double-Click on Menu Rosette to Collapse Sheet
            html.find("nav.menuRosette").dblclick((event) => {
                event.preventDefault();
                if (menuDragger.isCollapsed) {menuDragger.expand()} else {menuDragger.collapse()}
            });
            // #endregion

            // #region Pantheon Themes
            // Update Pantheon Theme Data when Pantheon Changed
            html.find("#pantheonSelect").change((event) => {
                event.preventDefault();
                this.actor.updatePantheon(event.target.value);
            });
            // #endregion

            // #region *** GENERAL DRAG & DROP ***

            // #region [GEN DRAG] SORTING PATH PRIORITIES
            const [pathContainer] = html.find("#pathContainer");
            const [pathMirror] = html.find("#pathMirror");
            const pathDragger = dragula({
                containers: [pathContainer],
                mirrorContainer: pathMirror,
                sheetElement: this.sheetElem
            });
            pathDragger.on("drop", async () => {
                await this.actor.update({
                    "data.pathPriorities": Array.from(pathContainer.children).
                        map((element) => this.entity.items.get(element.dataset.itemid).data.data.type)
                });
            });
            // #endregion

            // #region [GEN DRAG] SORTING ATTRIBUTE PRIORITIES
            const [arenaContainer] = html.find("#arenaContainer");
            const [arenaMirror] = html.find("#chargenThreeArenaMirror");
            const arenaDragger = dragula({
                containers: [arenaContainer],
                moves: (e, s, handle) => handle.classList.contains("handle"),
                mirrorContainer: arenaMirror,
                sheetElement: this.sheetElem
            });

            arenaDragger.on("drop", async () => {
                await this.actor.update({
                    "data.attributes.priorities": Array.from(arenaContainer.children).
                        map((element) => element.dataset.arena)
                });
            });
            // #endregion

            // #region [GEN DRAG] CALLING SELECTION

            const addCalling = async (callingElement, targetBin, sourceBin) => {
                if (targetBin.dataset.binid !== sourceBin.dataset.binid) {
                    const {calling} = callingElement.dataset;
                    const {slot: targetSlot, calling: targetCalling} = targetBin.dataset;
                    const {slot: sourceSlot, calling: sourceCalling} = sourceBin.dataset;
                    const updateData = {"data.callings.list": U.Clone(this.$data.callings.list)};
                    if (sourceCalling && sourceCalling !== "empty") {
                        updateData["data.callings.list"][sourceCalling].slot = U.Int(targetSlot);
                        updateData["data.callings.list"][targetCalling].slot = U.Int(sourceSlot);                               
                    } else {
                        if (targetCalling !== "empty") {
                            updateData["data.callings.list"][targetCalling].slot = null;
                        }
                        updateData["data.callings.list"][calling] = {...SCION.CALLINGS.actorDefault, name: calling, value: 1, slot: U.Int(targetSlot)};
                    }
                    await this.processCallingUpdate(updateData);
                }
            };
            const remCalling = async (callingBin) => {
                const updateData = {"data.callings.list": U.Clone(this.$data.callings.list)};
                updateData["data.callings.list"][callingBin.dataset.calling].slot = null;
                await this.processCallingUpdate(updateData);
            };
            const addHoverGlow = (__, callingBin) => {
                if (callingBin.classList.contains("callingDrop")) {
                    callingBin.classList.add("glow");
                }
            };
            const remHoverGlow = (__, callingBin) => {
                if (callingBin.classList.contains("glow")) {
                    callingBin.classList.remove("glow");
                }
            };

            const callingSource = html.find("#callingsSource");
            const [callingMirror] = html.find("#callingsMirror");
            const callingDrop = html.find(".callingDrop");
            const callingDragger = dragula({
                containers: [...callingSource, ...callingDrop],
                moves: (element, source, handle) => handle.classList.contains("callingHandle") && !element.classList.contains("invalid"),                    
                accepts: (element, target, source) => {
                    if (source.id === "callingsSource") {
                        const callings = Object.keys(this.actor.callings);
                        return target.classList.contains("callingDrop")
                            && callings.length < 3
                            && !callings.includes(element.dataset.calling);
                    } else if (source.classList.contains("callingDrop")) {
                        return target.classList.contains("callingDrop");
                    }
                    return false;
                },
                direction: "horizontal",
                copy: true,
                removeOnSpill: true,
                mirrorContainer: callingMirror,
                sheetElement: this.sheetElem
            });
            callingDragger.on("cancel", async (element, __, source) => {
                if (source.classList.contains("callingDrop") && this.currentlyOver?.dataset.calling !== element.dataset.calling) {
                    await remCalling(source);
                }
            });
            callingDragger.on("drop", async (element, target, source) => addCalling(element, target, source));
            callingDragger.on("over", (element, target) => {this.currentlyOver = target; addHoverGlow(element, target)});
            callingDragger.on("out", (element, target) => {this.currentlyOver = null; remHoverGlow(element, target)});
            
            html.find("h1.callingHeader").click((event) => {
                this._selectedCalling = event.currentTarget.dataset.calling;
                this.render();
            });

            const isKnackTargetDroppable = (element, target, source) => source.classList.contains("knackBin") && target.classList.contains("knackBin") && (
                (source.dataset.binid === target.dataset.binid)
                || (target.classList.contains("knackDrop")
                    && ["any", target.dataset.calling].includes(element.dataset.calling)
                    && this.actor.unassignedKnackDots[target.dataset.calling] >= (SCION.KNACKS.list[element.dataset.knack].tier === "immortal" ? 2 : 1))
            );
            const addKnack = async (knackElement, targetBin, sourceBin) => {
                const knackData = U.Clone(knackElement.dataset);
                const targetData = U.Clone(targetBin.dataset);
                const sourceData = U.Clone(sourceBin.dataset);
                if (targetData.binid !== sourceData.binid) {
                    const updateData = {
                        "data.knacks.list": U.Clone(this.$data.knacks.list)
                    };
                    const {knack: knackName} = knackData;
                    const knackIndex = updateData["data.knacks.list"].findIndex((knack) => knack.name === knackName);
                    if (knackIndex >= 0) {
                        updateData["data.knacks.list"][knackIndex].assignment = targetData.calling;
                    } else {
                        updateData["data.knacks.list"].push({...SCION.KNACKS.list[knackName], name: knackName, assignment: targetData.calling});
                    }
                    await this.processCallingUpdate(updateData);
                }
            };
            const remKnack = async (knackName) => {
                const updateData = {
                    "data.knacks.list": U.Clone(this.$data.knacks.list)
                };                
                U.Remove(updateData["data.knacks.list"], (knack) => knack.name === knackName);
                await this.processCallingUpdate(updateData);
            };
            const removeKnack = async (element, __, source) => {
                if (source.classList.contains("knackDrop")) {
                    await remKnack(element.dataset.knack);
                }
            };
            const cancelKnack = async (element, target, source) => {
                if (source.dataset.binid !== target?.dataset.binid && source.classList.contains("knackDrop")) {
                    await remKnack(element.dataset.knack);
                }
            };

            const knackSource = html.find(".knackSource");
            const [knackMirror] = html.find("#knacksMirror");
            const knackDrop = html.find(".knackDrop");
            const knackTooltips = html.find(".knack.tooltip");
            const knackDragger = dragula({
                containers: [...knackSource, ...knackDrop],
                moves: (element, source, handle) => handle.classList.contains("knackHandle") && !element.classList.contains("invalid"),                    
                accepts: (element, target, source) => isKnackTargetDroppable(element, target, source),
                direction: "horizontal",
                copy: true,
                removeOnSpill: true,
                mirrorContainer: knackMirror,
                sheetElement: this.sheetElem
            });     
            knackDragger.on("drag", (element, knackSourceBin) => {
                callingDrop.each((i, callingBin) => {
                    const knackTargetBin = Array.from(knackDrop).find((el) => el.dataset.calling === callingBin.dataset.calling);
                    if (["any", callingBin.dataset.calling].includes(element.dataset.calling) && isKnackTargetDroppable(element, knackTargetBin, knackSourceBin)) {
                        callingBin.classList.remove("fade75");
                    } else {
                        callingBin.classList.add("fade75");
                    }
                });
                knackTooltips.each((i, knackTooltip) => {
                    knackTooltip.classList.add("hideTooltip");
                });
            });   
            knackDragger.on("dragend", () => {
                callingDrop.each((i, bin) => {
                    bin.classList.remove("fade75");
                });
                setTimeout(() => {
                    knackTooltips.each((i, knackTooltip) => {
                        knackTooltip.classList.remove("hideTooltip");
                    });
                }, 500);
            });      
            knackDragger.on("remove", async (...args) => removeKnack.bind(this)(...args));
            knackDragger.on("cancel", async (...args) => cancelKnack.bind(this)(...args));
            knackDragger.on("drop", async (...args) => addKnack.bind(this)(...args));

            // #endregion

            // #region *** DOT DRAG-AND-DROP ***
            /**
             * DOTS: class="dot" dataset-types: "attribute|physical|social|mental|skill|general|all"
             * BINS: class="dotBin" dataset-types: "unassigned|attribute|physical|social|mental|skill|general|all", dataset-attribute / dataset-skill
             */

            // #region [DOT DRAG] Chargen Step Three
            const chargenThreeDotBins = html.find(".chargenThreeDotBin");
            const [chargenThreeDotMirror] = html.find("#chargenThreeDotMirror");
            const chargenThreeDotDragger = dragula({
                containers: [...chargenThreeDotBins],
                moves: (dot, sourceBin) => this.isDotDraggable(dot, sourceBin),
                accepts: (dot, targetBin, sourceBin) => this.isTargetDroppable(dot, sourceBin, targetBin),
                direction: "horizontal",
                copy: true,
                removeOnSpill: true,
                mirrorContainer: chargenThreeDotMirror,
                sheetElement: this.sheetElem
            });
            this.addDragListener(chargenThreeDotDragger, "drag", {extraArgs: [chargenThreeDotBins]});
            this.addDragListener(chargenThreeDotDragger, "dragend", {extraArgs: [chargenThreeDotBins]});
            this.addDragListener(chargenThreeDotDragger, "drop");
            this.addDragListener(chargenThreeDotDragger, "remove");
            // #endregion
            
            // #region [DOT DRAG] Chargen Step Four
            const chargenFourDotBins = html.find(".chargenFourDotBin");
            const [chargenFourDotMirror] = html.find("#chargenFourDotMirror");
            const chargenFourDotDragger = dragula({
                containers: [...chargenFourDotBins],
                moves: (dot, sourceBin) => this.isDotDraggable(dot, sourceBin),
                accepts: (dot, targetBin, sourceBin) => this.isTargetDroppable(dot, sourceBin, targetBin),
                direction: "horizontal",
                copy: true,
                removeOnSpill: true,
                mirrorContainer: chargenFourDotMirror,
                sheetElement: this.sheetElem
            });

            this.addDragListener(chargenFourDotDragger, "drag", {extraArgs: [chargenFourDotBins]});
            this.addDragListener(chargenFourDotDragger, "dragend", {extraArgs: [chargenFourDotBins]});
            this.addDragListener(chargenFourDotDragger, "drop");
            this.addDragListener(chargenFourDotDragger, "remove");
            // #endregion

            

            // #endregion
            
            // #endregion
        }
    }
}
