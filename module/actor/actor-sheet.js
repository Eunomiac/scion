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

    getData() {
        const data = super.getData();

        data.config = CONFIG.scion;

        const actorData = data.data;
        const systemData = data.config;

        this._updateChargen(data, false);

        data.blocks = {
            chargen: {
                class: "charGen",
                template: () => "systems/scion/templates/actor/actor-chargen.hbs"
            }
        };

        console.log({["@@ GETDATA: DATA @@"]: data});

        return data; // handlebar access: {{data.SYSTEMDATA}}
    }

    _updateChargen(data = this.actor.data, isUpdatingActor = true) {
        const actorData = data.data;

        data.CHARGEN = {
            tierList: U.makeDict(CONFIG.scion.TIERS),
            pantheonList: U.makeDict(CONFIG.scion.PANTHEONS),
            heritageList: U.makeDict(CONFIG.scion.HERITAGES),
            parentList: actorData.pantheon
                ? U.makeDict(
                    CONFIG.scion.PANTHEONS[actorData.pantheon].members,
                    undefined,
                    (v) => CONFIG.scion.GODS[v],
                    (k, v) => v
                )
                : false,
            showAttributePriorities: Boolean(actorData.heritage),
            arenaList: U.makeDict(
                CONFIG.scion.ATTRIBUTES.arenas,
                undefined,
                (v, k) => U.localize(`scion.game.${k}`)
            ),
            showFavoredApproach: Object.keys(CONFIG.scion.ATTRIBUTES.priorities).reduce((allSet, x) => allSet && Boolean(actorData.priorities[x].arena), true),
            favoredApproachList: U.makeDict(
                CONFIG.scion.ATTRIBUTES.approaches,
                undefined,
                (v, k) => U.localize(`scion.game.${k}`)
            )
        };

        if (actorData.heritage
            && actorData.pantheon
            && actorData.parent.name
            && (CONFIG.scion.PANTHEONS[actorData.pantheon].members.includes(actorData.parent.name))) {
            const mantle = CONFIG.scion.GODS[actorData.parent.name].mantle ? U.localize(CONFIG.scion.GODS[actorData.parent.name].mantle).trim() : "";
            actorData.parentageLine = U.localize(
                `scion.heritages.${actorData.heritage}Line`, {
                    divineParentName: U.localize(CONFIG.scion.GODS[actorData.parent.name].label),
                    mantleDelim: mantle ? ", " : "",
                    divineParentMantle: mantle
                }
            );
        } else {
            actorData.parent.name = "";
            actorData.parent.mantle = "";
            actorData.parentageLine = "";
        }

        if (isUpdatingActor && actorData.favoredApproach) {
            console.log({"@@@ UPDATING CHARGEN FULLY @@@": this, "@@ DATA @@": data, "@@ ACTOR DATA @@": actorData});
            if (actorData.favoredApproach)
                this._prepareAttributes(actorData);
            else
                this._resetAttributes();
        } else {
            console.log({"@@@ UPDATING CHARGEN (getData) @@@": this, "@@ DATA @@": data, "@@ ACTOR DATA @@": actorData});
        }
    }

    _prepareAttributes(actorData) {
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
                actorData[attribute].value = Math.max(actorData[attribute].value, 3);
                actorData[attribute].min = 3;
            } else {
                actorData[attribute].min = 1;
            }
            Object.assign(updateData, U.getUpdateData(this.actor, attribute, actorData[attribute].value, "value", true));
            Object.assign(updateData, U.getUpdateData(this.actor, attribute, actorData[attribute].min, "min", true));
        }

        // For each Arena, calculate unspentDots:
        for (const [priority, numDots] of Object.entries(CONFIG.scion.ATTRIBUTES.priorities))
            if (actorData.priorities[priority].arena in CONFIG.scion.ATTRIBUTES.arenas) {
                const attrList = CONFIG.scion.ATTRIBUTES.arenas[actorData.priorities[priority].arena];
                const assignedDots = attrList.reduce((tot, attr) => tot + actorData[attr].value - 1, 0);
                unspentDots[priority] = numDots - (assignedDots - 2); // Subtract 2 for favored approach dots.
                if (unspentDots[priority] < 0) {
                    unspentDots.general += parseInt(unspentDots[priority]);
                    unspentDots[priority] = 0;
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

        // Content-Editable Divs
        const [editClickOnHandler, editClickOffHandler] = [
            (event) => this._onEditClickOn(event),
            (event) => this._onEditClickOff(event)
        ];

        html.find(".edit").each((i, element) => {
            const data = element.dataset;
            element.setAttribute("contenteditable", false);
            element.addEventListener("click", editClickOnHandler, false);
            element.addEventListener("blur", editClickOffHandler, false);
            if ("path" in data)
                element.innerHTML = U.getValue(data.path.startsWith("actor") ? this : this.actor.data.data, data.path);
        });

        // #region CHARGEN (SETTINGS) TAB
        html.find(".chargen").each((i, element) => {
            element.addEventListener("change", () => {
                this._updateChargen();
            }, false);
        });
        // #endregion
    }

    _onEditClickOn(event) {
        event.preventDefault();
        const element = event.currentTarget;
        console.log({"@@ CLICK ON @@": element});
        element.setAttribute("contenteditable", true);
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
