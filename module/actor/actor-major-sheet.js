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
            if (genesis)
                actorData.patronageLine = U.Loc(
                    `scion.genesis.${genesis}Line`,
                    {
                        divinePatronName: U.Loc(godData[patron].label),
                        divinePatronMantle: godData[patron].mantle ? `, ${U.Loc(godData[patron].mantle)}` : ""
                    }
                );
        } else {
            actorData.patron = "";
        }
        // #endregion

        // #region OWNED ITEM SORTING
        data.items = {};
        for (const [itemCategory, itemTypes] of Object.entries(itemCategories))
            data.items[itemCategory] = this.actor.items.filter((item) => itemTypes.includes(item.type));
        // #endregion

        // #region CHARGEN
        actorData.charGen = actorData.charGen || {};

        // #region STEP ONE
        // Update Patron List
        if (pantheon)
            actorData.charGen.patronList = U.MakeDict(
                panthData[pantheon].members,
                (v) => U.Loc(`scion.pantheon.god.${v}`),
                (k, v) => v
            );
        // #endregion

        // #region STEP TWO
        // PATH PRIORITIES
        const pathItems = [];
        for (const pathType of actorData.pathPriorities)
            pathItems.push(data.items.paths.find((item) => item.data.data.type === pathType));
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
        data.filteredSkillVals = _.pick(data.skillVals, (val) => val > 0);
        data.unspentSkillDots = Math.max(0, this.actor.unassignedSkillDots);
        // EXPOSING SPECIALTY DATA
        data.skillSpecialties = this.actor.specialties;

        // ATTRIBUTE PRIORITIES
        data.arenaPriorities = this.aData.attributes.priorities;
        data.arenas = U.KeyMapObj(
            SCION.ATTRIBUTES.arenas,
            (v) => U.KeyMapObj(v, (k, v) => v, (v) => this.actor.attrVals[v])
        );

        // CREATING ATTRIBUTE DOTS REPORT
        // const attrUpdate = this.actor.checkAttributes();
        // U.LOG(attrUpdate, "Attribute Update Received", this.actor.name);

        // attrUpdate.unspentArenaDots = {physical: 3, mental: 10, social: 15};
        // attrUpdate.unspentGeneralDots = 5;

        const unspentArenaDots = _.pick(this.actor.unassignedArenaAttrDots, (v) => v > 0);
        data.unspentArenaDots = [];
        if (isObjectEmpty(unspentArenaDots))
            data.unspentArenaDots = false;
        else
            for (const [arena, num] of Object.entries(unspentArenaDots))
                data.unspentArenaDots.push(...new Array(num).fill(arena));
        data.unspentGeneralAttrDots = Math.max(0, this.actor.unassignedGeneralAttrDots);

        // #endregion
        // #endregion
        // #endregion

        // #region FRONT
        U.LOG({
            "[Sheet Context]": data,
            "... data": data.data,
            "ACTOR": this.actor.fullLogReport
        }, this.actor.name, "MajorActorSheet", {groupStyle: "l2"});
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (this.options.editable) {
            const menuRosette = html.find("nav.menuRosette")[0];
            const sheetContainer = document.getElementById(`actor-${this.actor.id}`);
            const sheetElement = html.find("section#characterSheet")[0];
            const closeButton = html.find("div.closeButton")[0];

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
                if (menuDragger.isCollapsed)
                    menuDragger.expand();
                else
                    menuDragger.collapse();
            });

            // #region DRAGULA: DRAG & DROP

            // #region SORTING PATH PRIORITIES
            const pathContainer = html.find("#pathContainer")[0];
            const pathDragger = dragula({containers: [pathContainer]});

            pathDragger.on("drop", async () => {
                await this.actor.update({
                    "data.pathPriorities": Array.from(pathContainer.children)
                        .map((element) => this.entity.items.get(element.dataset.itemid).data.data.type)
                });
                this.actor.updateSkills();
            });
            // #endregion

            // #region SORTING ATTRIBUTE PRIORITIES
            const arenaContainer = html.find("#arenaContainer")[0];
            const arenaDragger = dragula({
                containers: [arenaContainer],
                moves: (e, s, handle) => handle.classList.contains("handle")
            });

            arenaDragger.on("drop", async () => {
                await this.actor.update({
                    "data.attributes.priorities": Array.from(arenaContainer.children)
                        .map((element) => element.dataset.arena)
                });
                const {newAttrVals} = this.actor.checkAttributes();
                await this.actor.updateAttributes(newAttrVals);
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
            const getDragTypes = (dot, sourceBin, targetBin) => {
                const returnVal = {
                    dotTypes: dot.dataset.types.split("|")
                };
                if (sourceBin)
                    returnVal.sourceTypes = sourceBin.dataset?.types?.split("|") ?? [];
                if (targetBin)
                    returnVal.targetTypes = targetBin.dataset?.types?.split("|") ?? [];
                return returnVal;
            };
            const isDotDraggable = (dot, sourceBin) => {
                const {dotTypes, sourceTypes} = getDragTypes(dot, sourceBin);
                if (sourceTypes.includes("unassigned")) {
                    // U.LOG({dotTypes, sourceTypes}, "Unassigned Is Draggable!", "isDotDraggable");
                    return true;
                } if (sourceTypes.includes("attribute")) {
                    const attribute = sourceBin.dataset.attribute;
                    if (this.actor.attrVals[attribute] === this.actor.baseAttrVals[attribute]) {
                        // U.LOG({dotTypes, sourceTypes}, `${attribute} is at Base Value: NOT Draggable`, "isDotDraggable");
                        return false;
                    }
                    // U.LOG({dotTypes, sourceTypes}, `${attribute} is Draggable!`, "isDotDraggable");
                    return true;
                }
                if (sourceTypes.includes("skill")) {
                    const skill = sourceBin.dataset.skill;
                    if (this.actor.skillVals[skill] === this.actor.baseSkillVals[skill]) {
                        // U.LOG({dotTypes, sourceTypes}, `${skill} is at Base Value: NOT Draggable`, "isDotDraggable");
                        return false;
                    }
                    // U.LOG({dotTypes, sourceTypes}, `${skill} is Draggable!`, "isDotDraggable");
                    return true;
                }
                // U.LOG({dotTypes, sourceTypes}, "No Draggable Attributes Found: NOT Draggable!", "isDotDraggable");
                return false;
            };
            const isTargetDroppable = (dot, sourceBin, targetBin) => {
                if (sourceBin.dataset.binid === targetBin.dataset.binid) {
                    // U.LOG({dot, sourceBin, targetBin}, "Source = Target: NOT Droppable!", "isTargetDroppable");
                    return false;
                }
                const {dotTypes, sourceTypes, targetTypes} = getDragTypes(dot, sourceBin, targetBin);
                if (targetTypes.includes("unassigned")) {
                    // U.LOG({dotTypes, targetTypes}, "Can't Drop to Unassigned Bin: NOT Droppable!", "isTargetDroppable");
                    return false;
                }
                if (dotTypes.every((dotType) => !targetTypes.includes(dotType))) {
                    // U.LOG({dotTypes, targetTypes}, "No Matching Types: NOT Droppable!", "isTargetDroppable");
                    return false;
                }
                if (dotTypes.includes("attribute")) {
                    if (!targetTypes.includes("attribute")) {
                        // U.LOG({dotTypes, targetTypes}, "Target isn't an Attribute Bin: NOT Droppable!", "isTargetDroppable");
                        return false;
                    }
                    if (!dotTypes.includes("general")) {
                        const dotArenas = dotTypes.filter((dotType) => ["physical", "mental", "social"].includes(dotType));
                        if (dotArenas.every((dotArena) => !targetTypes.includes(dotArena))) {
                            // U.LOG({dotTypes, targetTypes}, "Arena-Specific Dot Not Accepted Here: NOT Droppable!", "isTargetDroppable");
                            return false;
                        }
                    }
                    const attribute = targetBin.dataset.attribute;
                    if (this.actor.attrVals[attribute] === SCION.ATTRIBUTES.max) {
                        // U.LOG({dotTypes, sourceTypes}, `${attribute} is at MAX: NOT Droppable`, "isTargetDroppable");
                        return false;
                    }
                    // U.LOG({dotTypes, sourceTypes}, `${attribute} is OK: Droppable!`, "isTargetDroppable");
                    return true;
                }
                if (dotTypes.includes("skill")) {
                    if (!targetTypes.includes("skill")) {
                        // U.LOG({dotTypes, targetTypes}, "Target isn't a Skill Bin: NOT Droppable!", "isTargetDroppable");
                        return false;
                    }
                    const skill = targetBin.dataset.skill;
                    if (this.actor.skillVals[skill] === SCION.SKILLS.max) {
                        // U.LOG({dotTypes, sourceTypes}, `${skill} is at MAX: NOT Droppable`, "isTargetDroppable");
                        return false;
                    }
                    // U.LOG({dotTypes, sourceTypes}, `${skill} is OK: Droppable!`, "isTargetDroppable");
                    return true;
                }
                // U.LOG({dotTypes, sourceTypes}, "No Droppable Attributes Found: NOT Droppable!", "isTargetDroppable");
                return false;
            };


            const dotBins = html.find(".dotBin");
            const dots = html.find(".dot");
            const dotDragger = dragula({
                containers: [...dotBins],
                moves: (dot, sourceBin) => isDotDraggable(dot, sourceBin),
                accepts: (dot, targetBin, sourceBin) => isTargetDroppable(dot, sourceBin, targetBin),
                direction: "horizontal",
                copy: false,
                removeOnSpill: false
            });

            const _onDotDrag = (dot, sourceBin) => {
                dotBins.each((i, bin) => {
                    if (isTargetDroppable(dot, sourceBin, bin))
                        bin.classList.add("validDrop");
                    else
                        bin.classList.remove("validDrop");
                });
            };
            const _onDotDragEnd = (dot) => {
                dotBins.each((i, bin) => { bin.classList.remove("validDrop") });
            };
            const _onDotDrop = (dot, targetBin, sourceBin) => {
                const {dotTypes, targetTypes, sourceTypes} = getDragTypes(dot, sourceBin, targetBin);
                const updateData = {};
                // Increment Target Trait
                if (targetTypes.includes("attribute")) {
                    const attribute = targetBin.dataset.attribute;
                    updateData[targetBin.dataset.field] = this.actor.assignedAttrVals[attribute] + 1;
                } else if (targetTypes.includes("skill")) {
                    const skill = targetBin.dataset.skill;
                    updateData[targetBin.dataset.field] = this.actor.assignedSkillVals[skill] + 1;
                }
                // If source was another skill/attribute, decrement that.
                if (!sourceTypes.includes("unassigned")) {
                    if (sourceTypes.includes("attribute")) {
                        const attribute = sourceBin.dataset.attribute;
                        updateData[sourceBin.dataset.field] = this.actor.assignedAttrVals[attribute] - 1;
                    } else if (sourceTypes.includes("skill")) {
                        const skill = sourceBin.dataset.skill;
                        updateData[sourceBin.dataset.field] = this.actor.assignedSkillVals[skill] - 1;
                    }
                }
                dot.remove();
                U.LOG({targetTypes, sourceTypes, updateData, ACTOR: this.actor.fullLogReport}, "Dot Dropped!", "onDotDrop");
                this.actor.update(updateData);
            };
            const _onDropRemove = (dot, x, sourceBin) => {
                const {dotTypes, sourceTypes} = getDragTypes(dot, sourceBin);
                const updateData = {};
                if (!sourceTypes.includes("unassigned")) {
                    if (sourceTypes.includes("attribute")) {
                        const attribute = sourceBin.dataset.attribute;
                        updateData[sourceBin.dataset.field] = this.actor.assignedAttrVals[attribute] - 1;
                    } else if (sourceTypes.includes("skill")) {
                        const skill = sourceBin.dataset.skill;
                        updateData[sourceBin.dataset.field] = this.actor.assignedSkillVals[skill] - 1;
                    }
                }
                U.LOG({dotTypes, sourceTypes, updateData, ACTOR: this.actor.fullLogReport}, "Dot Removed!", "onDropRemove");
                this.actor.update(updateData);
            };

            dotDragger.on("drag", _onDotDrag);
            dotDragger.on("dragend", _onDotDragEnd);
            dotDragger.on("drop", _onDotDrop);
            dotDragger.on("remove", _onDropRemove);

            // #endregion
            // #endregion
        }
    }
}
