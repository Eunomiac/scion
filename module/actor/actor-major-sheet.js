import {_, U, SCION, itemCategories, Dragger} from "../modules.js";
import {ScionActorSheet} from "./actor-sheet.js";
import "../external/dragula.min.js";
import {THROW} from "../data/utils.js";


export class MajorActorSheet extends ScionActorSheet {
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

        // #region CHARGEN
        actorData.charGen = actorData.charGen || {};

        // Update Patron List
        if (pantheon)
            actorData.charGen.patronList = U.MakeDict(
                panthData[pantheon].members,
                (v) => U.Loc(`scion.pantheon.god.${v}`),
                (k, v) => v
            );
        // #endregion

        // #region OWNED ITEM SORTING
        data.items = {};
        for (const [itemCategory, itemTypes] of Object.entries(itemCategories))
            data.items[itemCategory] = this.actor.items.filter((item) => itemTypes.includes(item.type));
        // #endregion

        // #region PATH PRIORITIES & SKILLS
        const pathItems = [];
        for (const pathType of actorData.pathPriorities)
            pathItems.push(data.items.paths.find((item) => item.data.data.type === pathType));
        data.items.paths = pathItems;

        data.pathSkillsCount = U.KeyMapObj(SCION.SKILLS, () => 0);
        Object.values(data.items.paths).forEach((pathItem) => {
            pathItem.data.data.skills.forEach((skill) => {
                data.pathSkillsCount[skill]++;
            });
        });
        // #endregion

        // #region Skills
        data.skillVals = U.KeyMapObj(
            _.omit(this.actor.data.data.skills.list, ((data) => data.value === 0)),
            (v) => v.value
        );
        // #endregion

        U.LOG({
            "this MajorActorSheet": this,
            "... .getData() [Sheet Context]": data,
            "... ... .data": data.data
        }, this.actor.name, "MajorActorSheet: getData()", {groupStyle: "l2"});
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


            const priorityContainer = html.find("#prioritySort")[0];
            const drake = dragula(
                [priorityContainer],
                {
                    direction: "horizontal",
                    mirrorContainer: html.find(".sortStorer")[0]
                }
            );
            drake.on("drop", () => {
                console.log({["@@ DRAKE DROP @@"]: this});
                const prioritiesContainer = html.find("#prioritySort")[0];
                const children = Array.from(prioritiesContainer.children).map((x) => ["mental", "physical", "social"].find((xx) => Array.from(x.classList).includes(xx)));
                const updateData = {};
                children.forEach((x, i) => {
                    updateData[`data.attributes.priorities.${Object.keys(CONFIG.scion.ATTRIBUTES.priorities)[i]}`] = x;
                });
                console.log(updateData);
                this.actor.update(updateData);
            });
            // #endregion
        }
    }
}
