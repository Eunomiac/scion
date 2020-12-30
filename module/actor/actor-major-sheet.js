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
        const panthData = CONFIG.scion.PANTHEONS;
        const godData = CONFIG.scion.GODS;

        // #region HEADER
        const {genesis, pantheon, patron} = actorData;
        actorData.patronageLine = "";
        if (pantheon && patron && panthData[pantheon].members.includes(patron)) {
            if (genesis) {
                actorData.patronageLine = U.Loc(`scion.genesis.${genesis}Line`, {
                    divinePatronName: U.Loc(godData[patron].label),
                    divinePatronMantle: godData[patron].mantle ? `, ${U.Loc(godData[patron].mantle)}` : ""
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
        if (pantheon) {data.virtues = panthData[pantheon].virtues.map((virtue) => U.Loc(`scion.virtue.${virtue}`))}
        // #endregion

        // #region CHARGEN
        actorData.charGen = actorData.charGen ?? {};

        // #region STEP ONE

        // Update Patron List
        if (pantheon) {actorData.charGen.patronList = U.MakeDict(panthData[pantheon].members, (v) => U.Loc(`scion.pantheon.god.${v}`), (k, v) => v)}
        // #endregion

        // #region STEP TWO

        // PATH PRIORITIES
        const pathItems = [];
        for (const pathType of actorData.pathPriorities) {pathItems.push(data.items.paths.find((item) => item.data.data.type === pathType))}
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
        data.skillVals = this.actor.skillVals;

        // FILTERING OUT 0-SKILLS
        data.unspentSkillDots = this.actor.unassignedSkillDots;
        data.assignableSkillDots = this.actor.assignableSkillDots;

        // EXPOSING SPECIALTY DATA
        data.skillSpecialties = this.actor.specialties;

        // ATTRIBUTE PRIORITIES
        data.arenaPriorities = this.aData.attributes.priorities;
        data.arenas = U.KeyMapObj(SCION.ATTRIBUTES.arenas, (v) => U.KeyMapObj(v, (k, v) => v, (v) => this.actor.attrVals[v]));

        const unspentArenaDots = _.pick(this.actor.unassignedArenaAttrDots, (v) => v > 0);
        data.unspentGeneralAttrDots = this.actor.unassignedGeneralAttrDots;
        data.unspentAttributeDots = U.SumVals(unspentArenaDots) + data.unspentGeneralAttrDots;
        data.unspentArenaDots = [];
        if (isObjectEmpty(unspentArenaDots)) {
            data.unspentArenaDots = false;
        } else {
            for (const [arena, num] of Object.entries(unspentArenaDots)) {
                data.unspentArenaDots.push(...new Array(num).fill(arena));
            }
        }
        data.assignableGeneralAttrDots = this.actor.assignableGeneralAttrDots;

        // data.skillReportLines = [
        //     `Total Dots: Base (${U.SumVals(this.actor.baseSkillVals)}) + Assigned (${U.SumVals(this.actor.assignedSkillVals)}) = ${U.SumVals(this.actor.baseSkillVals) + U.SumVals(this.actor.assignedSkillVals)} = ${U.SumVals(this.actor.skillVals)}`,
        //     `Assignable Dots: Assigned (${U.SumVals(this.actor.assignedSkillVals)}) + Unspent (${data.unspentSkillDots}) = ${U.SumVals(this.actor.assignedSkillVals) + data.unspentSkillDots} = ${this.actor.assignableSkillDots}`
        // ];
        // data.attrReportLines = [
        //     `Total Dots: Base (${U.SumVals(this.actor.baseAttrVals)}) + Arena (${U.SumVals(this.actor.assignedArenaAttrDots)}) + Assigned (${this.actor.assignedGeneralAttrDots}) = ${U.SumVals(this.actor.baseAttrVals) + U.SumVals(this.actor.assignedArenaAttrDots) + this.actor.assignedGeneralAttrDots} = ${U.SumVals(this.actor.attrVals)}`,
        //     `Assignable General Dots: Assigned (${this.actor.assignedGeneralAttrDots}) + Unspent (${data.unspentGeneralAttrDots}) = ${this.actor.assignedGeneralAttrDots + data.unspentGeneralAttrDots} = ${this.actor.assignableGeneralAttrDots}`,
        //     `Assignable Physical Dots: Assigned (${this.actor.assignedArenaAttrDots.physical}) + Unspent (${this.actor.unassignedArenaAttrDots.physical}) = ${this.actor.assignedArenaAttrDots.physical + this.actor.unassignedArenaAttrDots.physical} = ${this.actor.assignableArenaDots.physical}`,
        //     `Assignable Mental Dots: Assigned (${this.actor.assignedArenaAttrDots.mental}) + Unspent (${this.actor.unassignedArenaAttrDots.mental}) = ${this.actor.assignedArenaAttrDots.mental + this.actor.unassignedArenaAttrDots.mental} = ${this.actor.assignableArenaDots.mental}`,
        //     `Assignable Social Dots: Assigned (${this.actor.assignedArenaAttrDots.social}) + Unspent (${this.actor.unassignedArenaAttrDots.social}) = ${this.actor.assignedArenaAttrDots.social + this.actor.unassignedArenaAttrDots.social} = ${this.actor.assignableArenaDots.social}`
        // ];

        // #endregion
        
        // #region STEP FOUR
        data.callings = {
            patron: (patron && SCION.GODS[patron].callings) || [],
            other: Object.keys(SCION.CALLINGS.list).filter((calling) => !patron || !SCION.GODS[patron].callings.includes(calling)),
            actorSelected: Object.values(actorData.callings.list).filter((calling) => calling.name in SCION.CALLINGS.list).map((calling) => calling.name),
            actor: actorData.callings.list
        };
        data.unspentCallingDots = Math.max(0, U.SumVals(actorData.callings.assignableGeneralDots)
            - U.SumVals(actorData.callings.list.map((calling) => Math.max(0, calling.value - 1))));

        // #endregion

        // #endregion

        // #region FRONT
        U.LOG({
            "[Sheet Context]": data,
            "... data": data.data,
            "ACTOR": this.actor.fullLogReport
        }, this.actor.name, "MajorActorSheet", {isLoud: true});
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (this.options.editable) {
            const [menuRosette] = html.find("nav.menuRosette");
            const sheetContainer = document.getElementById(`actor-${this.actor.id}`);
            const [sheetElement] = html.find("section#characterSheet");
            const [closeButton] = html.find("div.closeButton");

            // Make Menu Rosette draggable
            const menuDragger = new Dragger(this, html, menuRosette, [sheetContainer, sheetElement], {height: 100, width: 100}, [menuRosette, closeButton]);

            // Update Pantheon Theme Data when Pantheon Changed
            html.find("#pantheonSelect").change((event) => {
                event.preventDefault();
                this.actor.updatePantheon(event.target.value);
            });

            // Double-Click on Menu Rosette to Collapse Sheet
            html.find("nav.menuRosette").dblclick((event) => {
                event.preventDefault();
                if (menuDragger.isCollapsed) {menuDragger.expand()} else {menuDragger.collapse()}
            });

            // #region DRAGULA: DRAG & DROP

            // #region SORTING PATH PRIORITIES
            const [pathContainer] = html.find("#pathContainer");
            const [pathMirror] = html.find("#pathMirror");
            const pathDragger = dragula({
                containers: [pathContainer],
                mirrorContainer: pathMirror,
                sheetElement: this.sheet
            });
            pathDragger.on("drop", async () => {
                await this.actor.update({
                    "data.pathPriorities": Array.from(pathContainer.children).
                        map((element) => this.entity.items.get(element.dataset.itemid).data.data.type)
                });
            });
            // #endregion

            // #region SORTING ATTRIBUTE PRIORITIES
            const [arenaContainer] = html.find("#arenaContainer");
            const [arenaMirror] = html.find("#chargenThreeArenaMirror");
            const arenaDragger = dragula({
                containers: [arenaContainer],
                moves: (e, s, handle) => handle.classList.contains("handle"),
                mirrorContainer: arenaMirror,
                sheetElement: this.sheet
            });

            arenaDragger.on("drop", async () => {
                await this.actor.update({
                    "data.attributes.priorities": Array.from(arenaContainer.children).
                        map((element) => element.dataset.arena)
                });
            });
            // #endregion

            // #region DOT DRAG-AND-DROP
            /**
             * DOTS: class="dot" dataset-types: "attribute|physical|social|mental|skill|general|all"
             * BINS: class="dotBin" dataset-types: "unassigned|attribute|physical|social|mental|skill|general|all", dataset-attribute / dataset-skill
             *
             *
             *
             */
            
            
            const addDragListener = (dragger, listener, listenFunc, extraArgs = []) => {
                dragger.on(listener, (...args) => listenFunc.bind(this)(...extraArgs, ...args));
            };            
            const getDragTypes = (dot, sourceBin, targetBin) => {
                const returnVal = {
                    dotTypes: dot.dataset.types?.split("|")
                };
                if (sourceBin) {returnVal.sourceTypes = sourceBin.dataset?.types?.split("|") ?? []}
                if (targetBin) {returnVal.targetTypes = targetBin.dataset?.types?.split("|") ?? []}
                return returnVal;
            };
            const isDotDraggable = (dot, sourceBin) => {
                const {sourceTypes} = getDragTypes(dot, sourceBin);
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
            };
            const isTargetDroppable = (dot, sourceBin, targetBin) => {
                if (sourceBin.dataset.binid === targetBin.dataset.binid) {
                    return true;
                }
                const {dotTypes, sourceTypes, targetTypes} = getDragTypes(dot, sourceBin, targetBin);
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
            };
            const _onDotDrag = (dotBins, dot, sourceBin) => {
                dotBins.each((i, bin) => {
                    if (isTargetDroppable(dot, sourceBin, bin)) {bin.classList.remove("fade75")} else {bin.classList.add("fade75")}
                });
            };
            const _onDotDragEnd = async (dotBins, dot) => {
                dotBins.each((i, bin) => { bin.classList.remove("fade75") });
                await this.actor.processUpdateQueue(true);
                this.render();
            };
            const _onDotDrop = (dot, targetBin, sourceBin) => {
                const {targetTypes, sourceTypes} = getDragTypes(dot, sourceBin, targetBin);
                const updateData = {};
                if (targetBin.dataset.binid !== sourceBin.dataset.binid) {
                    // Increment Target Trait
                    if (targetTypes.includes("attribute")) {
                        const {attribute, field, fieldindex} = targetBin.dataset;
                        this.actor.setProp(this.actor.assignedAttrVals[attribute] + 1, field, fieldindex);
                    } else if (targetTypes.includes("skill")) {
                        const {skill, field, fieldindex} = targetBin.dataset;
                        this.actor.setProp(this.actor.assignedSkillVals[skill] + 1, field, fieldindex);
                    } else if (targetTypes.includes("calling")) {
                        const {calling, field, fieldindex} = targetBin.dataset;
                        this.actor.setProp(this.actor.callings[calling].value + 1, field, fieldindex);
                    }
                    // If source was another skill/attribute, decrement that.
                    if (!sourceTypes.includes("unassigned")) {
                        if (sourceTypes.includes("attribute")) {
                            const {attribute, field, fieldindex} = sourceBin.dataset;
                            this.actor.setProp(this.actor.assignedAttrVals[attribute] - 1, field, fieldindex);
                            updateData[sourceBin.dataset.field] = this.actor.assignedAttrVals[attribute] - 1;
                        } else if (sourceTypes.includes("skill")) {
                            const {skill, field, fieldindex} = sourceBin.dataset;
                            this.actor.setProp(this.actor.assignedSkillVals[skill] - 1, field, fieldindex);
                        } else if (sourceTypes.includes("calling")) {
                            const {calling, field, fieldindex} = sourceBin.dataset;
                            this.actor.setProp(this.actor.callings[calling].value - 1, field, fieldindex);
                        }
                    }
                    U.LOG(U.IsDebug() && {targetTypes, sourceTypes, updateData, ACTOR: this.actor.fullLogReport}, "Dot Dropped!", "onDotDrop");
                }
            };
            const _onDropRemove = (dot, x, sourceBin) => {
                const {dotTypes, sourceTypes} = getDragTypes(dot, sourceBin);
                const updateData = {};
                if (!sourceTypes.includes("unassigned")) {
                    if (sourceTypes.includes("attribute")) {
                        const {attribute, field, fieldindex} = sourceBin.dataset;
                        this.actor.setProp(this.actor.assignedAttrVals[attribute] - 1, field, fieldindex);
                        updateData[sourceBin.dataset.field] = this.actor.assignedAttrVals[attribute] - 1;
                    } else if (sourceTypes.includes("skill")) {
                        const {skill, field, fieldindex} = sourceBin.dataset;
                        this.actor.setProp(this.actor.assignedSkillVals[skill] - 1, field, fieldindex);
                    } else if (sourceTypes.includes("calling")) {
                        const {calling, field, fieldindex} = sourceBin.dataset;
                        this.actor.setProp(this.actor.callings[calling].value - 1, field, fieldindex);
                    }
                }
                U.LOG(U.IsDebug() && {dotTypes, sourceTypes, updateData, ACTOR: this.actor.fullLogReport}, "Dot Removed!", "onDropRemove");
            };

            const chargenThreeDotBins = html.find(".chargenThreeDotBin");
            const [chargenThreeDotMirror] = html.find("#chargenThreeDotMirror");
            const chargenThreeDotDragger = dragula({
                containers: [...chargenThreeDotBins],
                moves: (dot, sourceBin) => isDotDraggable(dot, sourceBin),
                accepts: (dot, targetBin, sourceBin) => isTargetDroppable(dot, sourceBin, targetBin),
                direction: "horizontal",
                copy: false,
                removeOnSpill: true,
                mirrorContainer: chargenThreeDotMirror,
                sheetElement: this.sheet
            });

            addDragListener(chargenThreeDotDragger, "drag", _onDotDrag, [chargenThreeDotBins]);
            addDragListener(chargenThreeDotDragger, "dragend", _onDotDragEnd, [chargenThreeDotBins]);
            addDragListener(chargenThreeDotDragger, "drop", _onDotDrop);
            addDragListener(chargenThreeDotDragger, "remove", _onDropRemove);

            // #endregion
            
            // #region CALLING SELECTION
            const addCalling = async (callingElement, callingBin) => {
                const actorCallings = this.aData.callings.list;
                actorCallings[U.Int(callingBin.dataset.slot)] = {...SCION.CALLINGS.actorDefault, name: callingElement.dataset.calling, value: 1};
                await this.actor.update({"data.callings.list": actorCallings});
            };
            const remCalling = async (callingBin) => {
                const actorCallings = this.aData.callings.list;
                actorCallings[U.Int(callingBin.dataset.slot)] = {...SCION.CALLINGS.actorDefault};
                await this.actor.update({"data.callings.list": actorCallings});
            };

            const callingSource = html.find("#callingsSource");
            const [callingMirror] = html.find("#callingsMirror");
            const callingDrop = html.find(".callingDrop");
            const callingDragger = dragula({
                "containers": [...callingSource, ...callingDrop],
                "moves": (element, source, handle) => handle.classList.contains("handle") && !element.classList.contains("invalid"),                    
                "accepts": (element, target, source) => source.id === "callingsSource" && target.classList.contains("callingDrop")
                    && this.aData.callings.list.filter((calling) => calling.name in SCION.CALLINGS.list).length < 3
                    && !this.aData.callings.list.map((calling) => calling.name).includes(element.dataset.calling),
                "direction": "horizontal",
                "copy": true,
                "removeOnSpill": true,
                "mirrorContainer": callingMirror,
                "sheetElement": this.sheet
            });
            callingDragger.on("cancel", (element, container, source) => {
                if (source.classList.contains("callingDrop")) {
                    remCalling(source);
                }
            });
            callingDragger.on("drop", (element, target) => addCalling(element, target));

            
            const chargenFourDotBins = html.find(".chargenFourDotBin");
            const [chargenFourDotMirror] = html.find("#chargenFourDotMirror");
            const chargenFourDotDragger = dragula({
                containers: [...chargenFourDotBins],
                moves: (dot, sourceBin) => isDotDraggable(dot, sourceBin),
                accepts: (dot, targetBin, sourceBin) => isTargetDroppable(dot, sourceBin, targetBin),
                direction: "horizontal",
                copy: false,
                removeOnSpill: true,
                mirrorContainer: chargenFourDotMirror,
                sheetElement: this.sheet
            });

            addDragListener(chargenFourDotDragger, "drag", _onDotDrag, [chargenFourDotBins]);
            addDragListener(chargenFourDotDragger, "dragend", _onDotDragEnd, [chargenFourDotBins]);
            addDragListener(chargenFourDotDragger, "drop", _onDotDrop);
            addDragListener(chargenFourDotDragger, "remove", _onDropRemove);            

            // #endregion
            
            
            // #endregion
        }
    }
}
