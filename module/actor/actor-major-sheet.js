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
        data.arenaPriorities = this.actor.getProp("data.attributes.priorities");
        data.arenas = U.KeyMapObj(SCION.ATTRIBUTES.arenas, (arenaAttrs) => U.KeyMapObj(arenaAttrs, (i, attrName) => attrName, (attrName) => this.actor.attrVals[attrName]));
        data.unassignedAttributeDots = {...this.actor.unassignedArenaAttrDots, general: this.actor.unassignedGeneralAttrDots};
        data.isUnassignedAttributeDots = Boolean(U.SumVals(data.unassignedAttributeDots));

        // #endregion
        
        // #region STEP FOUR
        data.callings = {
            available: {
                patron: patron ? SCION.GODS[patron].callings : [],
                other: []
            },
            actor: this.actor.callings,
            chargen: this.actor.getProp("data.callings.chargen"),
            numChosen: Object.keys(this.actor.callings).filter((calling) => calling in SCION.CALLINGS.list).length,
            selected: actorData.callings.selected || false
        };
        data.callings.available.other = Object.keys(SCION.CALLINGS.list).filter((calling) => !data.callings.available.patron.includes(calling));

        data.unassignedCallingDots = this.actor.unassignedCallingDots;

        // #endregion

        // #endregion

        U.LOG(game.scion.debug.isFormattingGroup 
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
    }

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
                    const {calling: targetCalling} = targetBin.dataset;
                    const chargenCallings = this.actor.getProp("data.callings.chargen");
                    chargenCallings[U.Int(targetBin.dataset.slot)] = calling;
                    if (sourceBin.classList.contains("callingDrop")) {
                        chargenCallings[U.Int(sourceBin.dataset.slot)] = targetCalling;
                    } else {
                        this.actor.setProp({...SCION.CALLINGS.actorDefault, name: callingElement.dataset.calling, value: 1}, `data.callings.list.${calling}`);
                        if (targetCalling !== "empty") {
                            this.actor.setProp(null, `data.callings.list.${targetCalling}`);
                            if (this.actor.getProp("data.callings.selected") === targetCalling) {
                                this.actor.setProp(false, "data.callings.selected");
                            }
                        }
                    }
                    this.actor.setProp(chargenCallings, "data.callings.chargen");
                    await this.actor.processUpdateQueue();
                }
            };
            const remCalling = async (callingBin) => {
                if (this.actor.getProp("data.callings.selected")) {
                    this.actor.setProp(false, "data.callings.selected");
                }
                this.actor.setProp(null, "data.callings.chargen", U.Int(callingBin.dataset.slot));
                this.actor.setProp(null, `data.callings.list.${callingBin.dataset.calling}`);
                await this.actor.processUpdateQueue();
            };
            const addHoverGlow = (callingElement, callingBin) => {
                if (callingBin.classList.contains("callingDrop")) {
                    callingBin.classList.add("glow");
                }
            };
            const remHoverGlow = (callingElement, callingBin) => {
                if (callingBin.classList.contains("glow")) {
                    callingBin.classList.remove("glow");
                }
            };

            const callingSource = html.find("#callingsSource");
            const [callingMirror] = html.find("#callingsMirror");
            const callingDrop = html.find(".callingDrop");
            const callingDragger = dragula({
                "containers": [...callingSource, ...callingDrop],
                "moves": (element, source, handle) => handle.classList.contains("handle") && !element.classList.contains("invalid"),                    
                "accepts": (element, target, source) => {
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
                "direction": "horizontal",
                "copy": true,
                "removeOnSpill": true,
                "mirrorContainer": callingMirror,
                "sheetElement": this.sheetElem
            });
            callingDragger.on("cancel", (element, container, source) => {
                if (source.classList.contains("callingDrop") && this.currentlyOver?.dataset.calling !== element.dataset.calling) {
                    remCalling(source);
                }
            });
            callingDragger.on("drop", (element, target, source) => addCalling(element, target, source));
            callingDragger.on("over", (element, target) => {this.currentlyOver = target; addHoverGlow(element, target)});
            callingDragger.on("out", (element, target) => {this.currentlyOver = null; remHoverGlow(element, target)});
            
            html.find("h1.callingHeader").click(async (event) => { 
                const curSelect = this.actor.getProp("data.callings.selected");
                const newSelect = event.currentTarget.dataset.calling;
                if (curSelect === newSelect) {
                    this.actor.setProp(false, "data.callings.selected");
                } else {
                    this.actor.setProp(newSelect, "data.callings.selected");
                }
                return await this.actor.processUpdateQueue();
            });

            const addKnack = async (knackElement, targetBin, sourceBin) => {
                if (targetBin.dataset.binid !== sourceBin.dataset.binid) {
                    const {knack: elementKnack} = knackElement.dataset;
                    const {knack: targetKnack} = targetBin.dataset;
                    const knackData = U.Clone(this.actor.knacks);
                    const knackIndex = knackData.findIndex((knack) => knack.name === elementKnack);
                    if (knackIndex > -1) {
                        knackData[knackIndex].assignment = targetBin.dataset.calling;
                        this.actor.setProp(knackData, "data.knacks.list");
                    } else {
                        this.actor.addKnack(elementKnack, targetBin.dataset.calling);
                    }
                    if (this.actor.unassignedKnackDots[targetBin.dataset.calling] - (SCION.KNACKS.list[elementKnack].tier === "immortal" ? 2 : 1) === 0) {
                        this.actor.setProp(false, "data.callings.selected");
                    }
                    await this.actor.processUpdateQueue();
                }
            };
            const remKnack = async (knackName, sourceBin) => {
                this.actor.remKnack(knackName);                
                if (sourceBin.classList.contains("knackDrop") && !this.actor.getProp("data.callings.selected")) {
                    this.actor.setProp(sourceBin.dataset.calling, "data.callings.selected");
                }
                await this.actor.processUpdateQueue();
            };

            const knackSource = html.find("#knacksSource");
            const [knackMirror] = html.find("#knacksMirror");
            const knackDrop = html.find(".knackDrop");
            const knackDragger = dragula({
                "containers": [...knackSource, ...knackDrop],
                "moves": (element) => !element.classList.contains("invalid"),                    
                "accepts": (element, target, source) => {
                    return target.classList.contains("knackDrop")
                        && ["any", target.dataset.calling].includes(element.dataset.calling)
                        && this.actor.unassignedKnackDots[target.dataset.calling] >= (SCION.KNACKS.list[element.dataset.knack].tier === "immortal" ? 2 : 1);
                },
                "direction": "horizontal",
                "copy": false,
                "removeOnSpill": true,
                "mirrorContainer": knackMirror,
                "sheetElement": this.sheetElem
            });            
            knackDragger.on("remove", (element, container, source) => {
                if (source.classList.contains("knackDrop") && this.currentlyOver?.dataset.knack !== element.dataset.knack) {
                    remKnack(element.dataset.knack, source);
                }
            });
            knackDragger.on("cancel", (element, container, source) => {
                if (source.classList.contains("knackDrop") && this.currentlyOver?.dataset.knack !== element.dataset.knack) {
                    remKnack(element.dataset.knack, source);
                }
            });
            knackDragger.on("drop", (element, target, source) => addKnack(element, target, source));
            // knackDragger.on("over", (element, target) => {this.currentlyOver = target; addHoverGlow(element, target)});
            // knackDragger.on("out", (element, target) => {this.currentlyOver = null; remHoverGlow(element, target)});


            if (game.scion.debug.isDebuggingDragula) {
                ["drag", "dragend", "drop", "cancel", "remove", "shadow", "over", "out", "cloned"].forEach((event) => {
                    callingDragger.on(event, (...args) => console.log([event, args]));
                });
            }
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
