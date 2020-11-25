import * as _ from "../external/underscore/underscore-esm-min.js";
import * as U from "../data/utils.js";
import {handlebarTemplates, itemCategories} from "../data/constants.js";
import "../external/dragula.min.js";
import {Dust} from "../external/dust.js";
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */

export class ScionActorSheet extends ActorSheet {
    static get defaultOptions() {
        /*  super.defaultOptions = {
                baseApplication: "ActorSheet",
                classes: ["sheet"],
                template: "templates/sheets/actor-sheet.html",
                id: "",
                title: "",
                top: null,
                left: null,
                height: 720,
                width: 800,
                editable: true,
                minimizable: true,
                popOut: true,
                resizable: true,
                submitOnChange: true,
                submitOnClose: true,
                closeOnSubmit: false,
                tabs: [],
                filters: [],
                scrollY: [],
                dragDrop: [
                    {
                        dragSelector: ".item-list .item",
                        dropSelector: null
                    }
                ],
                viewPermission: 1
            }; */
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "actor"],
            width: 750,
            height: 750,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "front"
                },
                {
                    navSelector: ".chargen-tabs",
                    contentSelector: ".chargen-body",
                    initial: "step-one"
                }
            ]
        });
    }
    get template() {
        return `systems/scion/templates/actor/${this.object.data.type}-sheet.hbs`;
    }
    getData() {
        const data = super.getData();
        const actorData = data.data;
        const panthData = CONFIG.scion.PANTHEONS;
        const godData = CONFIG.scion.GODS;

        data.config = CONFIG.scion;
        data.blocks = handlebarTemplates;

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
        U.LOG(data, "[Sheet Context]", "getData", {style: "data", isGrouping: `[ActorSheet] ${this.actor.name}`});
        U.LOG(actorData, "[Actor.Data]", "getData", {style: "data"});
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable)
            return;

        // #region CONTENT-EDITABLE ELEMENTS
        const _onEditKeyDown = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                event.currentTarget.blur();
            }
        };
        const _onEditClickOn = (event) => {
            event.preventDefault();
            const element = event.currentTarget;
            element.setAttribute("contenteditable", true);
            if (element.classList.contains("placeholder")) {
                element.innerHTML = "";
                element.classList.remove("placeholder");
            }
            // Add an event listener for when the player hits the 'Enter' key.
            element.addEventListener("keydown", _onEditKeyDown.bind(this));
            // Focus the element, which will fire the _onEditFocus event to select all text.
            element.focus();
        };
        const _onEditFocus = () => { document.execCommand("selectAll") };
        const _onEditClickOff = (event) => {
            event.preventDefault();
            const element = event.currentTarget;
            const dataSet = element.dataset;
            element.setAttribute("contenteditable", false);
            element.removeEventListener("keydown", _onEditKeyDown);
            if ("path" in dataSet) {
                if (dataSet.path.endsWith("divineTitle") && element.innerText)
                    element.innerHTML = `"${element.innerText.replace(/(^\s*"+|"+\s*$)/gu, "").trim()}"`;
                if (dataSet.path.startsWith("actor"))
                    this.actor.update({[dataSet.path.slice(6)]: element.innerText.trim()});
                else
                    this.actor.update({[dataSet.path]: element.innerText.trim()});
            }
            if (!element.innerText && "placeholder" in dataSet) {
                U.DB([element.innerText, !element.innerText], "Inner Text Check");
                element.classList.add("placeholder");
                element.innerHTML = dataSet.placeholder;
            } else {
                U.DB([element.innerText, !element.innerText], "Inner Text Check");
                element.classList.remove("placeholder");
                // element.innerHTML = "";
            }
        };
        html.find("div.contentEditable").each((i, element) => {
            const data = element.dataset;
            element.setAttribute("contenteditable", false);
            element.addEventListener("click", _onEditClickOn.bind(this));
            element.addEventListener("focus", _onEditFocus.bind(this));
            element.addEventListener("blur", _onEditClickOff.bind(this));

            // If dataset includes a path, fill the element with the current data:
            if ("path" in data) {
                const actorVal = U.DigActor(this.actor, data.path);
                if (actorVal)
                    element.innerHTML = actorVal.trim();
                else
                    element.innerHTML = "";
            }

            // If element innerHTML is blank, populate with placeholder if one is available
            if (!element.innerText && "placeholder" in data) {
                element.innerHTML = data.placeholder;
                element.classList.add("placeholder");
            } else {
                element.classList.remove("placeholder");
            }
        });
        // #endregion

        // #region OWNED ITEM POP-OUTS
        const _onOpenOwnedItem = (event) => {
            event.preventDefault();
            const element = event.currentTarget;
            const dataSet = element.dataset;
        };
        html.find(".clickable.item-open").each((i, element) => {
            element.addEventListener("click", _onOpenOwnedItem.bind(this));
        });

        // #endregion

        // > Dragula: Sort Attribute Priorities

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
/*     _onDotClick(event) {
        event.preventDefault();
        console.log("~~ _onDotClick(event) ~~  event =");
        console.log(event);
        let element = event.currentTarget;
        const dataset = element.dataset;
        if ("trait" in dataset && "val" in dataset) {
            if (element.classList.contains("full")) {
                this.actor.update({[`data.${dataset.trait}.value`]: parseInt(dataset.val) - 1});
                do {
                    element.classList = element.classList.filter((x) => x !== "full");
                    element = element.nextElementSibling;
                } while (element && element.classList.contains("dot"));
            } else {
                this.actor.update({[`data.${dataset.trait}.value`]: parseInt(dataset.val)});
                do {
                    element.classList.push("full");
                    element = element.previousElementSibling;
                } while (element && element.classList.contains("dot"));
            }
            console.log(`Trait ${dataset.trait} set to ${this.object.data.data[dataset.trait].value}`);
        } else {
            console.log("Failed Dot Click:");
            console.log(event);
        }
    }

    _onDotDrag(event) {
        console.log("~~ _onDragDotStart(event) ~~  event =");
        console.log(event);

        const element = event.target;
        const dragData = {
            dotType: element.dataset.dottype,
            actorId: this.actor.id,
            fromTrait: element.dataset.trait
        };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }

    _onDotDrop(event) {
        console.log("~~ _onDragDotStop(event) ~~  event =");
        console.log(event);

        const {dotType, actorId, fromTrait} = JSON.parse(event.dataTransfer.getData("text/plain"));
        const binData = event.path.find((x) => x.classList.contains("dotDropBin")).dataset;
        const updateData = {};
        const fromTypes = dotType.split("|");
        const toTypes = binData.dottype.split("|");
        console.log({fromTypes, toTypes, fromTrait, toTrait: binData.trait});
        if (fromTypes.filter((x) => toTypes.includes(x)).length && fromTrait !== binData.trait) {
            const fromVal = U.getValue(this.actor.data.data, fromTrait);
            const fromMin = U.getValue(this.actor.data.data, fromTrait, "min", true);
            const toVal = U.getValue(this.actor.data.data, binData.trait);
            const toMax = U.getValue(this.actor.data.data, binData.trait, "max", true);
            if (fromVal > fromMin && toVal < toMax) {
                Object.assign(updateData, U.getUpdateData(this.actor, fromTrait, fromVal - 1));
                Object.assign(updateData, U.getUpdateData(this.actor, binData.trait, toVal + 1));
                this.actor.update(updateData);
            }
            console.log("~~ UPDATE DATA: ~~");
            console.log(updateData);
        }
    } */
