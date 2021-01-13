import {_, U, SCION, itemCategories, Dragger} from "../modules.js";
import {ScionActorSheet} from "./actor-sheet.js";
import "../external/dragula.min.js";
import {THROW} from "../data/utils.js";


export class MajorActorSheet extends ScionActorSheet {
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
        data.arenaPriorities = this.actor.eData.attributes.priorities;
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
                patron: this.eData.patron ? SCION.GODS[this.eData.patron].callings : [],
                get other() { return Object.keys(SCION.CALLINGS.list).filter((calling) => !this.patron.includes(calling)) }
            },
            callings: actorCallingData,
            knacks: actorKnackData,
            selected: this.actor.eData.callings.selected || false,
            chargen: U.Clone(this.actor.eData.callings.chargen),
            get numChosen() { return Object.keys(this.callings).length },
            get unassignedCallingDots() { return Math.max(0, actorAssignableCallingDots - Object.values(this.callings).reduce((tot, val) => tot + val.value - 1, 0)) },
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
        U.LOG(game.scion.debug.isFullDebugConsole 
            ? {
                    "data [Sheet Context]": data,
                    "... data": data.data,
                    "ACTOR LOG": this.actor.fullLogReport,
                    "Instances": {
                        sheet: this,
                        entity: this.ent
                    }
                }
            : {
                    "CALLING DATA": U.Clone(data.callings),
                    "ACTOR SHEET REPORT": {
                        "data [Sheet Context]": data,
                        "... data": data.data,
                        "ACTOR LOG": this.actor.fullLogReport,
                        "Instances": {
                            sheet: this,
                            entity: this.ent
                        }
                    }
                }, this.actor.name, "MajorActorSheet", {isLoud: true});

        return data;
        // #endregion
    }
    // #endregion

    // #region ENTITY UPDATING
    async processCallingUpdate(updateData = {}) {
        const mergedUpdateData = U.Merge(
            {
                data: {
                    callings: _.pick(this.eData.callings, "chargen", "list", "selected"),
                    knacks: {list: U.Clone(this.eData.knacks.list)}
                }
            },
            U.Expand(updateData)
        );
        const initialMergedUpdateData = U.Clone(mergedUpdateData);

        const sumKnackVals = (calling) => mergedUpdateData.data.knacks.list.reduce((tot, knack) => tot + (
            knack.assignment === calling ? {heroic: 1, immortal: 2}[knack.tier] : 0
        ), 0);
        for (const [calling, callingData] of Object.entries(mergedUpdateData.data.callings.list)) {
            const dataRef = mergedUpdateData.data.callings.list[calling];
            while (sumKnackVals(calling) > callingData.value) {
                U.Remove(mergedUpdateData.data.knacks.list, (knack) => knack.assignment === calling);
                console.log(`SumKnackVals(${calling}) = ${sumKnackVals(calling)}, callingData.value = ${callingData.value}, knacks = ${mergedUpdateData.data.knacks.list}`);
            }
            dataRef.keywordsUsed = dataRef.keywordsUsed.filter((keyword) => dataRef.keywordsChosen.includes(keyword));
            while (dataRef.keywordsChosen.length > callingData.value) {
                const thisKeyword = dataRef.keywordsChosen.find((keyword) => !dataRef.keywordsUsed.includes(keyword))
                    || U.Last(dataRef.keywordsChosen);
                U.Remove(dataRef.keywordsChosen, (keyword) => keyword === thisKeyword);
                U.Remove(dataRef.keywordsUsed, (keyword) => keyword === thisKeyword);
            }
            dataRef.keywordsUsed.length = Math.min(dataRef.keywordsUsed.length, callingData.value);
        }
        // If any of the callings are not chosen, clear selected callings and break.
        if (mergedUpdateData.data.callings.chargen?.length < 3) {
            mergedUpdateData.data.callings.selected = false;
        } else {
            // If the selected calling is no longer chosen, clear it.
            if (!(mergedUpdateData.data.callings.selected in mergedUpdateData.data.callings.list)) {
                mergedUpdateData.data.callings.selected = false;
            // If the selected calling has no more knack slots, clear it.
            } else if (sumKnackVals(mergedUpdateData.data.callings.selected) === mergedUpdateData.data.callings.list[mergedUpdateData.data.callings.selected].value) {
                mergedUpdateData.data.callings.selected = false;
            }
            // If selected calling has been falsified, set it to a calling with available knack slots.
            if (!mergedUpdateData.data.callings.selected) {
                const newCalling = mergedUpdateData.data.callings.chargen.find((calling) => calling && sumKnackVals(calling) < mergedUpdateData.data.callings.list[calling].value);
                mergedUpdateData.data.callings.selected = newCalling || false;
            }
        }
        console.dir({updateData, initialMergedUpdateData, mergedUpdateData});
        await this.actor.update(mergedUpdateData);
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
                    const updateData = {
                        "data.callings.chargen": U.Clone(this.eData.callings.chargen)
                    };
                    const targetSlot = U.Int(targetBin.dataset.slot);
                    const sourceSlot = U.Int(sourceBin.dataset.slot);
                    const {calling} = callingElement.dataset;
                    const {calling: targetCalling} = targetBin.dataset;
                    updateData["data.callings.chargen"][targetSlot] = calling;
                    if (sourceBin.classList.contains("callingDrop")) {
                        updateData["data.callings.chargen"][sourceSlot] = targetCalling;
                    } else {
                        updateData["data.callings.list"] = U.Clone(this.eData.callings.list);
                        if (targetCalling !== "empty") {
                            delete updateData["data.callings.list"][targetCalling];
                        }
                        updateData["data.callings.list"][calling] = {...SCION.CALLINGS.actorDefault, name: calling, value: 1};
                    }
                    await this.processCallingUpdate(updateData);
                }
            };
            const remCalling = async (callingBin) => {
                const updateData = {
                    "data.callings.chargen": U.Clone(this.eData.callings.chargen),
                    "data.callings.list": U.Clone(this.eData.callings.list)
                };
                updateData["data.callings.chargen"][callingBin.dataset.slot] = null;
                delete updateData["data.callings.list"][callingBin.dataset.calling];
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
                moves: (element, source, handle) => handle.classList.contains("handle") && !element.classList.contains("invalid"),                    
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
            callingDragger.on("drop", async (element, target, source) => await addCalling(element, target, source));
            callingDragger.on("over", (element, target) => {this.currentlyOver = target; addHoverGlow(element, target)});
            callingDragger.on("out", (element, target) => {this.currentlyOver = null; remHoverGlow(element, target)});
            
            html.find("h1.callingHeader").click(async (event) => {
                await this.actor.update({["data.callings.selected"]: event.currentTarget.dataset.calling});
            });

            const isKnackTargetDroppable = (element, target, source) => {
                return (source.classList.contains("knackSource") && target.classList.contains("knackSource"))
                || (target.classList.contains("knackDrop")
                    && ["any", target.dataset.calling].includes(element.dataset.calling)
                    && this.actor.unassignedKnackDots[target.dataset.calling] >= (SCION.KNACKS.list[element.dataset.knack].tier === "immortal" ? 2 : 1));
            };
            const addKnack = async (knackElement, targetBin, sourceBin) => {
                if (targetBin.dataset.binid !== sourceBin.dataset.binid) {
                    const updateData = {
                        "data.knacks.list": U.Clone(this.eData.knacks.list)
                    };
                    const {knack: elementKnack} = knackElement.dataset;
                    if (!U.Change(updateData["data.knacks.list"], (knack) => knack.name === elementKnack, (knack) => {knack.assignment = targetBin.dataset.calling; return knack})) {
                        updateData["data.knacks.list"].push({...SCION.KNACKS.list[elementKnack], name: elementKnack, assignment: targetBin.dataset.calling});
                    }
                    await this.processCallingUpdate(updateData);
                }
            };
            const remKnack = async (knackName) => {
                const updateData = {
                    "data.knacks.list": U.Clone(this.eData.knacks.list)
                };                
                U.Remove(updateData["data.knacks.list"], (knack) => knack.name === knackName);
                await this.processCallingUpdate(updateData);
            };
            const cancelKnack = async (element, target, source) => {
                if (source.classList.contains("knackDrop")) {
                    await remKnack(element.dataset.knack);
                }
            };

            const knackSource = html.find("#knacksSource");
            const [knackMirror] = html.find("#knacksMirror");
            const knackDrop = html.find(".knackDrop");
            const knackDragger = dragula({
                containers: [...knackSource, ...knackDrop],
                moves: (element) => !element.classList.contains("invalid"),                    
                accepts: (element, target, source) => isKnackTargetDroppable(element, target, source),
                direction: "horizontal",
                copy: false,
                removeOnSpill: true,
                mirrorContainer: knackMirror,
                sheetElement: this.sheetElem
            });     
            knackDragger.on("drag", (el) => {
                callingDrop.each((i, bin) => {
                    const knackBin = Array.from(knackDrop).find((el) => el.dataset.calling = bin.dataset.calling);
                    if (["any", bin.dataset.calling].includes(el.dataset.calling) && isKnackTargetDroppable(el, knackBin, knackBin)) {
                        bin.classList.remove("fade75");
                    } else {
                        bin.classList.add("fade75");
                    }
                });
            });   
            knackDragger.on("dragend", () => {
                callingDrop.each((i, bin) => {
                    bin.classList.remove("fade75");
                });
            });      
            knackDragger.on("remove", async (...args) => await cancelKnack.bind(this)(...args));
            knackDragger.on("cancel", async (...args) => await cancelKnack.bind(this)(...args));
            knackDragger.on("drop", async (...args) => await addKnack.bind(this)(...args));

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

            /* ["drag", "dragend", "drop", "cancel", "remove", "shadow", "over", "out", "cloned"].forEach((event) => {
                [callingDragger, knackDragger, chargenThreeDotDragger, chargenFourDotDragger].forEach((dragger) => {
                    dragger.on(event, (...args) => {
                        if (game.scion.debug.isDebuggingDragula === true || Array.isArray(game.scion.debug.isDebuggingDragula) && game.scion.debug.isDebuggingDragula.includes(event)) {
                            console.log([event, args]);
                        }
                    });
                });
            }); */


            // #endregion
            
            // #endregion
        }
    }
}
