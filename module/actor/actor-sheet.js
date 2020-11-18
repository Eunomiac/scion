import * as _ from "../external/underscore/underscore-esm-min.js";
import * as U from "../data/utils.js";
import "../external/dragula.min.js";
/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ScionActorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "actor"],
            width: 700,
            height: 700,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "front"}]
        });
    }
    get template() {
        return `systems/scion/templates/actor/${this.object.data.type}-sheet.hbs`;
    }
    get charGenStep() {
        const actorData = this.object.data.data;
        if (actorData.concept && actorData.genesis && actorData.patron.name)
            return 2;
        return 1;
    }

    getData() {
        const data = super.getData();

        data.config = CONFIG.scion;
        const [actorData, scionData] = [data.data, data.config];
        actorData.charGen = actorData.charGen || {};
        data.blocks = {
            chargen: {
                class: "charGen",
                template: () => `systems/scion/templates/actor/actor-chargen-step${actorData.charGen.charGenStep || 1}.hbs`
            }
        };

        console.log(this.object.data.data);
        // Update Patronage Subheader
        const {genesis, pantheon, patron} = actorData;
        if (pantheon && patron.name && scionData.PANTHEONS[pantheon].members.includes(patron.name)) {
            if (genesis) {
                const mantle = scionData.GODS[patron.name].mantle ? U.localize(scionData.GODS[patron.name].mantle) : "";
                actorData.patronageLine = U.localize(
                    `scion.geneses.${genesis}Line`,
                    {
                        divinePatronName: U.localize(scionData.GODS[patron.name].label),
                        mantleDelim: mantle ? ", " : "",
                        divinePatronMantle: mantle
                    }
                );
            } else {
                actorData.patronageLine = "";
            }
        } else {
            actorData.patron.name = "";
            actorData.patronageLine = "";
        }

        // Update Patrons List
        if (pantheon)
            actorData.charGen.patronList = U.makeDict(
                scionData.PANTHEONS[pantheon].members,
                (v) => U.localize(`scion.gods.${v}`),
                (k, v) => v
            );

        // Update Character Creation Step (or false if character finished)
        actorData.charGen.charGenStep = this.charGenStep;

        return data;
    }

    _initializeAttributes(actorData) {
        const unspentDots = {
            general: parseInt(actorData.dotsPurchased),
            primary: 0,
            secondary: 0,
            tertiary: 0
        };
        const updateData = {};
        // First, adjust minimum and set Favored Approach attributes:
        for (const attribute of CONFIG.scion.ATTRIBUTES.all) {
            if (CONFIG.scion.ATTRIBUTES.approaches[actorData.favoredApproach].includes(attribute)) {
                actorData[attribute].value = 3;
                actorData[attribute].min = 3;
            } else {
                actorData[attribute].value = 1;
                actorData[attribute].min = 1;
            }
            Object.assign(updateData, U.getUpdateData(this.actor, attribute, actorData[attribute].value, "value", true));
            Object.assign(updateData, U.getUpdateData(this.actor, attribute, actorData[attribute].min, "min", true));
        }

        // For each Arena, calculate unspentDots:
        for (const [priority, data] of Object.entries(CONFIG.scion.ATTRIBUTES.priorities)) {
            const numDots = data.startingDots;
            if (actorData.priorities[priority].arena in CONFIG.scion.ATTRIBUTES.arenas) {
                const attrList = CONFIG.scion.ATTRIBUTES.arenas[actorData.priorities[priority].arena];
                const assignedDots = attrList.reduce((tot, attr) => tot + actorData[attr].value - 1, 0);
                unspentDots[priority] = numDots - (assignedDots - 2); // Subtract 2 for favored approach dots.
                if (unspentDots[priority] < 0) {
                    unspentDots.general += parseInt(unspentDots[priority]);
                    unspentDots[priority] = 0;
                }
            }
        }
        Object.assign(updateData, U.getUpdateData(this.actor, "generalUnspentDots", unspentDots.general));
        Object.assign(updateData, U.getUpdateData(this.actor, "priorities.primary.unspentDots", unspentDots.primary));
        Object.assign(updateData, U.getUpdateData(this.actor, "priorities.secondary.unspentDots", unspentDots.secondary));
        Object.assign(updateData, U.getUpdateData(this.actor, "priorities.tertiary.unspentDots", unspentDots.tertiary));
        console.log({"@@@ ACTOR.UPDATE (PREPARE ATTRIBUTES) @@@": updateData});
        this.actor.update(updateData);
    }

    _resetAttributes() {
        const updateData = {};
        for (const attribute of CONFIG.scion.ATTRIBUTES.all) {
            Object.assign(updateData, U.getUpdateData(this.actor, attribute, 1, "value", true));
            Object.assign(updateData, U.getUpdateData(this.actor, attribute, 1, "min", true));
            Object.assign(updateData, U.getUpdateData(this.actor, attribute, [], "modifier", true));
        }
        for (const [priority, data] of Object.entries(CONFIG.scion.ATTRIBUTES.priorities)) {
            Object.assign(updateData, U.getUpdateData(this.actor, `priorities.${priority}.unspentDots`, data.startingDots));
            Object.assign(updateData, U.getUpdateData(this.actor, `priorities.${priority}.arena`, ""));
        }
        Object.assign(updateData, U.getUpdateData(this.actor, "generalUnspentDots", 0));
        Object.assign(updateData, U.getUpdateData(this.actor, "favoredApproach", ""));
        console.log({"@@@ ACTOR.UPDATE (RESET ATTRIBUTES) @@@": updateData});
        this.actor.update(updateData);
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable)
            return;

        // #region CONTENT-EDITABLE ELEMENTS
        html.find(".edit").each((i, element) => {
            const data = element.dataset;
            element.setAttribute("contenteditable", false);
            element.addEventListener("click", (event) => this._onEditClickOn(event), false);
            element.addEventListener("blur", (event) => this._onEditClickOff(event), false);

            // If dataset includes a path, fill the element with the current data:
            if ("path" in data) {
                const actorVal = U.getValue(data.path.startsWith("actor") ? this : this.actor.data.data, data.path);
                if (actorVal)
                    element.innerHTML = actorVal.trim();
                else
                    element.innerHTML = "";
            }

            // If element innerHTML is blank, populate with placeholder OR a single blank space (to preserve element height)
            let isDisplayingPlaceholderText = false;
            if (!element.innerText)
                if ("placeholder" in data) {
                    element.innerHTML = data.placeholder;
                    isDisplayingPlaceholderText = true;
                } else {
                    element.innerHTML = "&nbsp;";
                }

            // Apply placeholder class if necessary:
            if (isDisplayingPlaceholderText)
                element.classList.add("placeholder");
            else
                element.classList.remove("placeholder");
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
                updateData[`data.priorities.${Object.keys(CONFIG.scion.ATTRIBUTES.priorities)[i]}.arena`] = x;
            });
            console.log(updateData);
            this.actor.update(updateData);
            // this._updateChargen();
        });
        // #endregion
    }

    _onEditClickOn(event) {
        event.preventDefault();
        const element = event.currentTarget;
        console.log({"@@ CLICK ON @@": element});
        element.setAttribute("contenteditable", true);
        if (element.classList.contains("placeholder")) {
            element.innerHTML = " ";
            element.classList.remove("placeholder");
        }
    }
    _onEditClickOff(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const data = element.dataset;
        console.log({"@@ CLICK OFF @@": element});
        element.setAttribute("contenteditable", false);
        if ("path" in data) {
            if (data.path.endsWith("divineTitle") && element.innerText)
                element.innerHTML = `"${element.innerHTML}"`.replace(/""/gu, "\"");
            if (data.path.startsWith("actor"))
                this.actor.update({[data.path.slice(6)]: element.innerText});
            else
                this.actor.update({[data.path]: element.innerText});
            let isDisplayingPlaceholderText = false;
            if (!element.innerText)
                if ("placeholder" in data) {
                    element.innerHTML = data.placeholder;
                    isDisplayingPlaceholderText = true;
                } else {
                    element.innerHTML = "&nbsp;";
                }

            // Apply placeholder class if necessary:
            if (isDisplayingPlaceholderText)
                element.classList.add("placeholder");
            else
                element.classList.remove("placeholder");
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
}
