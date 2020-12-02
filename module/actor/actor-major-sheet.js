import {_, U, itemCategories} from "../modules.js";
import {ScionActorSheet} from "./actor-sheet.js";
import "../external/dragula.min.js";

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
                    `scion.geneses.${genesis}Line`,
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
                (v) => U.Loc(`scion.gods.${v}`),
                (k, v) => v
            );
        // #endregion

        // #region OWNED ITEM SORTING
        const itemsArray = Array.from(this.actor.items);
        for (const [itemCategory, itemTypes] of Object.entries(itemCategories))
            data[itemCategory] = itemsArray.filter((item) => itemTypes.includes(item.type));
        // #endregion

        U.GLOG({
            "Sheet Context": data,
            "Actor.Data": actorData
        }, this.actor.name, "MajorActorSheet");
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (this.options.editable) {
            // #region DRAGULA: DRAG & DROP

            /* FOR SORTING ON A GRID
                1) Assign each grid a number, moving in an s-formation so all cells move on a track.
                2) Be able to get closest grid of dragged element (that's where mirror snaps to)
                3) Figure out which grids have to move to make room
                4) Animate all moving cells
            */


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
