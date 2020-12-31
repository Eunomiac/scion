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

        // #endregion
        
        // #region STEP FOUR
        data.callings = {
            patron: (patron && SCION.GODS[patron].callings) || [],
            other: Object.keys(SCION.CALLINGS.list).filter((calling) => !patron || !SCION.GODS[patron].callings.includes(calling)),
            actorSelected: Object.values(actorData.callings.list).filter((calling) => calling.name in SCION.CALLINGS.list).map((calling) => calling.name),
            actor: actorData.callings.list,
            selectedCalling: actorData.callings.selected,
            keywordsAvailable: {},
            heroicKnacksList: actorData.callings.selected ? SCION.CALLINGS.list[actorData.callings.selected].knacks.heroic : false,
            immortalKnacksList: actorData.callings.selected ? SCION.CALLINGS.list[actorData.callings.selected].knacks.immortal : false
        };
        data.unspentCallingDots = Math.max(0, U.SumVals(actorData.callings.assignableGeneralDots)
            - U.SumVals(actorData.callings.list.map((calling) => Math.max(0, calling.value - 1))));
        data.callings.actorSelected.forEach((callingName) => {
            data.callings.keywordsAvailable[callingName] = U.Loc(`scion.calling.${callingName}.keywords`).
                split(", ").
                filter((keyword) => !this.actor.callings[callingName].keywordsChosen.includes(keyword));
        });

        // #endregion

        // #endregion

        // #region FRONT
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
            const [sheetElement] = html.find("section#characterSheet");
            const [closeButton] = html.find("div.closeButton");

            // Make Menu Rosette draggable
            const menuDragger = new Dragger(this, html, menuRosette, [sheetContainer, sheetElement], {height: 100, width: 100}, [menuRosette, closeButton]);

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
                sheetElement: this.sheet
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
                sheetElement: this.sheet
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
                    const actorCallings = this.aData.callings.list;
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
                const actorCallings = this.aData.callings.list;
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
                if (this.aData.callings.selected === callingBin.dataset.calling) {
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
                            && this.aData.callings.list.filter((calling) => calling.name in SCION.CALLINGS.list).length < 3
                            && !this.aData.callings.list.map((calling) => calling.name).includes(element.dataset.calling);
                    } else if (source.classList.contains("callingDrop")) {
                        return target.classList.contains("callingDrop");
                    }
                    return false;
                },
                "direction": "horizontal",
                "copy": false,
                "removeOnSpill": true,
                "mirrorContainer": callingMirror,
                "sheetElement": this.sheet
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
                copy: false,
                removeOnSpill: true,
                mirrorContainer: chargenThreeDotMirror,
                sheetElement: this.sheet
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
                copy: false,
                removeOnSpill: true,
                mirrorContainer: chargenFourDotMirror,
                sheetElement: this.sheet
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
