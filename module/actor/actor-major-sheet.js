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
        data.arenaPriorities = this.eData.attributes.priorities;
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
            numChosen: Object.keys(this.actor.callings).filter((calling) => calling in SCION.CALLINGS.list).length,
            selected: actorData.callings.selected || false
        };
        data.callings.available.other = Object.keys(SCION.CALLINGS.list).filter((calling) => !data.callings.available.patron.includes(calling));

        data.unassignedCallingDots = this.actor.unassignedCallingDots;

        // #endregion

        // #endregion

        U.LOG({
            "ACTOR REPORT": {
                "[Sheet Context]": data,
                "... data": data.data,
                "ACTOR": this.actor.fullLogReport
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
                    const actorCallings = this.eData.callings.list;
                    if (sourceBin.classList.contains("callingDrop")) {
                        const sourceData = U.Clone(actorCallings[U.Int(sourceBin.dataset.slot)]);
                        actorCallings[U.Int(sourceBin.dataset.slot)] = U.Clone(actorCallings[U.Int(targetBin.dataset.slot)]);
                        actorCallings[U.Int(targetBin.dataset.slot)] = sourceData;
                    } else {
                        actorCallings[U.Int(targetBin.dataset.slot)] = {...SCION.CALLINGS.actorDefault, name: callingElement.dataset.calling, value: 1};
                    }
                    await this.actor.update({"data.callings.list": actorCallings});
                }
            };
            const remCalling = async (callingBin) => {
                const actorCallings = this.eData.callings.list;
                actorCallings[U.Int(callingBin.dataset.slot)] = {...SCION.CALLINGS.actorDefault};
                await this.actor.update({"data.callings.list": actorCallings});
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
            const selectCalling = async (callingBin) => {
                if (this.eData.callings.selected === callingBin.dataset.calling) {
                    await this.actor.update({["data.callings.selected"]: false});
                } else {    
                    await this.actor.update({["data.callings.selected"]: callingBin.dataset.calling});
                }
            };

            const callingSource = html.find("#callingsSource");
            const [callingMirror] = html.find("#callingsMirror");
            const callingDrop = html.find(".callingDrop");
            const callingHandles = html.find(".callingHeader");
            const callingDragger = dragula({
                "containers": [...callingSource, ...callingDrop],
                "moves": (element, source, handle) => handle.classList.contains("handle") && !element.classList.contains("invalid"),                    
                "accepts": (element, target, source) => {
                    if (source.id === "callingsSource") {
                        return target.classList.contains("callingDrop")
                            && this.eData.callings.list.filter((calling) => calling.name in SCION.CALLINGS.list).length < 3
                            && !this.eData.callings.list.map((calling) => calling.name).includes(element.dataset.calling);
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

            html.find(".callingHeader").each((i, element) => {

            })

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
            this.addDragListener(chargenThreeDotDragger, "drag", [chargenThreeDotBins]);
            this.addDragListener(chargenThreeDotDragger, "dragend", [chargenThreeDotBins]);
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

            this.addDragListener(chargenFourDotDragger, "drag", [chargenFourDotBins]);
            this.addDragListener(chargenFourDotDragger, "dragend", [chargenFourDotBins]);
            this.addDragListener(chargenFourDotDragger, "drop");
            this.addDragListener(chargenFourDotDragger, "remove");   
            // #endregion
            // #endregion
            
            // #endregion
        }
    }
}
