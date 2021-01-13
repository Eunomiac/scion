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

        const actorData = this.eData;        
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
        data.callings = this.callingData;

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

    get freshCallingData() {        
        const actorCallingData = U.Clone(this.actor.callings);
        const actorKnackData = U.Clone(this.actor.knacks);
        const actorAssignableCallingDots = this.actor.assignableCallingDots;
        const callingData = {
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
        return callingData;
    }
    refreshCallingData() { this._callingData = this.freshCallingData; return this._callingData }
    processCallingData() {
        const sumKnackVals = (calling) => this.callingData.groupedKnacks[calling].reduce((tot, knack) => tot + (knack.tier === "immortal" ? 2 : 1), 0);
        this.callingData.groupedKnacks.overflow.forEach((knack) => U.Remove(this.callingData.knacks, (cKnack) => cKnack.name === knack.name));
        for (const [calling, callingData] of Object.entries(this.callingData.callings)) {
            const dataRef = this.callingData.callings[calling];
            while (sumKnackVals(calling) > callingData.value) {
                U.Remove(this.callingData.knacks, (knack) => knack.assignment === calling);
                console.log(`SumKnackVals(${calling}) = ${sumKnackVals(calling)}, callingData.value = ${callingData.value}, knacks = ${this.callingData.knacks}`);
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
        if (this.callingData.chargen?.length < 3) {
            this.callingData.selected = false;
        } else {
            // If the selected calling is no longer chosen, clear it.
            if (!(this.callingData.selected in this.callingData.callings)) {
                this.callingData.selected = false;
            // If the selected calling has no more knack slots, clear it.
            } else if (sumKnackVals(this.callingData.selected) === this.callingData.callings[this.callingData.selected].value) {
                this.callingData.selected = false;
            }
            // If selected calling has been falsified, set it to a calling with available knack slots.
            if (!this.callingData.selected) {
                const newCalling = this.callingData.chargen.find((calling) => sumKnackVals(calling) < this.callingData.callings[calling].value);
                this.callingData.selected = newCalling || false;
            }
        }
    }
    get callingData() { return this._callingData ?? this.refreshCallingData() }
    async updateCallingData(overrides = {}) {
        this.processCallingData();
        await this.actor.update({
            data: {
                callings: {
                    chargen: this.callingData.chargen,
                    list: U.KeyMapObj(this.callingData.callings, (cData) => _.pick(cData, "name", "value", "keywordsChosen", "keywordsUsed")),
                    selected: this.callingData.selected
                },
                knacks: {
                    list: this.callingData.knacks
                }
            }, ...overrides});
        this.refreshCallingData();
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
            const addCalling = (callingElement, targetBin, sourceBin) => {
                const targetSlot = U.Int(targetBin.dataset.slot);
                const sourceSlot = U.Int(sourceBin.dataset.slot);
                if (targetBin.dataset.binid !== sourceBin.dataset.binid) {
                    const {calling} = callingElement.dataset;
                    const {calling: targetCalling} = targetBin.dataset;
                    this.callingData.chargen[targetSlot] = calling;
                    if (sourceBin.classList.contains("callingDrop")) {
                        this.callingData.chargen[sourceSlot] = targetCalling;
                    } else {
                        this.callingData.callings[calling] = {...SCION.CALLINGS.actorDefault, name: calling, value: 1};
                        if (targetCalling !== "empty") {
                            delete this.callingData.callings[targetCalling];
                        }
                    }
                }
                this.processCallingData();
            };
            const remCalling = (callingBin) => {
                this.callingData.chargen[callingBin.dataset.slot] = null;
                delete this.callingData.callings[callingBin.dataset.calling];
                this.processCallingData();
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
            callingDragger.on("cancel", (element, __, source) => {
                if (source.classList.contains("callingDrop") && this.currentlyOver?.dataset.calling !== element.dataset.calling) {
                    remCalling(source);
                }
            });
            callingDragger.on("drop", (element, target, source) => addCalling(element, target, source));
            callingDragger.on("over", (element, target) => {this.currentlyOver = target; addHoverGlow(element, target)});
            callingDragger.on("out", (element, target) => {this.currentlyOver = null; remHoverGlow(element, target)});
            callingDragger.on("dragend", async () => await this.updateCallingData());
            
            html.find("h1.callingHeader").click(async (event) => {
                await this.updateCallingData({data: {callings: {selected: event.currentTarget.dataset.calling}}});
            });

            const addKnack = (knackElement, targetBin, sourceBin) => {
                if (targetBin.dataset.binid !== sourceBin.dataset.binid) {
                    const {knack: elementKnack} = knackElement.dataset;
                    if (!U.Change(this.callingData.knacks, (knack) => knack.name === elementKnack, (knack) => knack.assignment = targetBin.dataset.calling)) {
                        this.callingData.knacks.push({...SCION.KNACKS.list[elementKnack], name: elementKnack, assignment: targetBin.dataset.calling});
                    }
                    this.processCallingData();
                }
            };
            const remKnack = (knackName) => {
                U.Remove(this.callingData.knacks, (knack) => knack.name === knackName);
                this.processCallingData();
            };
            const cancelKnack = (element, target, source) => {
                if (source.classList.contains("knackDrop") && this.currentlyOver?.dataset.knack !== element.dataset.knack) {
                    remKnack(element.dataset.knack);
                }
            };

            const knackSource = html.find("#knacksSource");
            const [knackMirror] = html.find("#knacksMirror");
            const knackDrop = html.find(".knackDrop");
            const knackDragger = dragula({
                containers: [...knackSource, ...knackDrop],
                moves: (element) => !element.classList.contains("invalid"),                    
                accepts: (element, target, source) => {
                    return target.classList.contains("knackDrop")
                        && ["any", target.dataset.calling].includes(element.dataset.calling)
                        && this.actor.unassignedKnackDots[target.dataset.calling] >= (SCION.KNACKS.list[element.dataset.knack].tier === "immortal" ? 2 : 1);
                },
                direction: "horizontal",
                copy: false,
                removeOnSpill: true,
                mirrorContainer: knackMirror,
                sheetElement: this.sheetElem
            });            
            knackDragger.on("remove", cancelKnack.bind(this));
            knackDragger.on("cancel", cancelKnack.bind(this));
            knackDragger.on("drop", addKnack.bind(this));
            knackDragger.on("dragend", async () => await this.updateCallingData());

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
            this.addDragListener(chargenFourDotDragger, "dragend", {extraArgs: [chargenFourDotBins], extraFunc: () => {
                this.refreshCallingData();
                this.processCallingData();
            }});
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
