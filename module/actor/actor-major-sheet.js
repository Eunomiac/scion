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

            // SORTING PATH PRIORITIES
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

            // SORTING ATTRIBUTE PRIORITIES
            const arenaContainer = html.find("#arenaContainer")[0];
            const arenaDragger = dragula({containers: [arenaContainer]});

            arenaDragger.on("drop", async () => {
                await this.actor.update({
                    "data.attributes.priorities": Array.from(arenaContainer.children)
                        .map((element) => element.dataset.arena)
                });
                const {newAttrVals} = this.actor.checkAttributes();
                await this.actor.updateAttributes(newAttrVals);
            });
            // #endregion
        }
    }
}
