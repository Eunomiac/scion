import * as U from "../data/utils.js";

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
        console.log(this);
        return `systems/scion/templates/actor/${this.object.data.type}-sheet.hbs`;
    }

    _prepareDivineHeritage(actorData, systemData) {
        actorData.SYSDATA = {
            PANTHEONS: {},
            PANTHEONMEMBERS: {},
            ASSETSKILLS: {},
            PARENTCALLINGS: {},
            PARENTPURVIEWS: {}
        };
        const actSysData = actorData.SYSDATA;
        for (const [pantheonKey, pantheonData] of Object.entries(systemData.PANTHEONS)) // Update list of Pantheons
            actSysData.PANTHEONS[pantheonKey] = pantheonData.label;
        if (actorData.pantheon in systemData.PANTHEONS) { //                     If a Pantheon has been chosen:
            const PANTHEONDATA = systemData.PANTHEONS[actorData.pantheon];
            for (const assetSkill of PANTHEONDATA.assetSkills) //      ... update Asset Skills
                actSysData.ASSETSKILLS[assetSkill] = assetSkill in actorData ? actorData[assetSkill].label : assetSkill;
            for (const member of Object.keys(PANTHEONDATA.members)) // ... update Pantheon Members (for Divine Parent selection)
                actSysData.PANTHEONMEMBERS[member] = member;
            if (actorData.parent.name in actSysData.PANTHEONMEMBERS) { //      If a Divine Parent has been chosen:
                const PARENTDATA = PANTHEONDATA.members[actorData.parent.name];
                actorData.parent.mantle = PARENTDATA.mantle;
                for (const calling of PARENTDATA.callings) // ... update Callings
                    actSysData.PARENTCALLINGS[calling] = calling;
                for (const purview of PARENTDATA.purviews) // ... update Purviews
                    actSysData.PARENTPURVIEWS[purview] = purview;
                if (actorData.heritage in systemData.HERITAGES) //                    If a Divine Heritage has been chosen:
                    switch (actorData.heritage) { //                                                     ... update Parentage Line
                        case "Born": actorData.parentageLine = `Scion of ${actorData.parent.name.replace(/^The/u, "the")}${actorData.parent.mantle ? ", " : ""}${actorData.parent.mantle}`; break;
                        case "Chosen": actorData.parentageLine = `Chosen of ${actorData.parent.name.replace(/^The/u, "the")}${actorData.parent.mantle ? ", " : ""}${actorData.parent.mantle}`; break;
                        case "Incarnation": actorData.parentageLine = `${actorData.parent.name.replace(/^The/u, "the")}${actorData.parent.mantle ? ", " : ""}${actorData.parent.mantle} Incarnate`; break;
                        case "Created": actorData.parentageLine = `Creation of ${actorData.parent.name.replace(/^The/u, "the")}${actorData.parent.mantle ? ", " : ""}${actorData.parent.mantle}`; break;
                        // no default
                    }
                else
                    actorData.parentageLine = "";
            } else {
                actorData.parent.mantle = "";
                actorData.parentageLine = "";
            }
        } else {
            actorData.parent.name = "";
            actorData.parent.mantle = "";
            actorData.parentageLine = "";
        }
    }

    _prepareAttributes(actorData, systemData) {
        console.log(actorData);
        const unspentDots = {
            general: parseInt(actorData.dotsPurchased),
            primary: 0,
            secondary: 0,
            tertiary: 0
        };
        const updateData = {};
        // First, adjust minimum and set Favored Approach attributes:
        console.log({favApproach: actorData.favoredApproach, arenas: systemData.ATTRIBUTES.approaches});
        if (actorData.favoredApproach in systemData.ATTRIBUTES.approaches) {
            for (const attribute of Object.keys(systemData.ATTRIBUTES.all)) {
                if (systemData.ATTRIBUTES[actorData.favoredApproach].includes(attribute)) {
                    actorData[attribute].value = Math.max(actorData[attribute].value, 3);
                    actorData[attribute].min = 3;
                } else {
                    actorData[attribute].min = 1;
                }
                Object.assign(updateData, U.getUpdateData(this.actor, attribute, actorData[attribute].value, "value", true));
                Object.assign(updateData, U.getUpdateData(this.actor, attribute, actorData[attribute].min, "min", true));
            }
        }
        // For each Arena, calculate unspentDots:
        for (const [priority, numDots] of Object.entries(systemData.ATTRIBUTES.priorities))
            if (actorData.priorities[priority].arena) {
                const attrList = systemData.ATTRIBUTES[actorData.priorities[priority].arena];
                actorData.priorities[priority].attributes = attrList;
                const assignedDots = attrList.reduce((tot, attr) => tot + actorData[attr].value - 1, 0);
                unspentDots[priority] = numDots - assignedDots + (actorData.favoredApproach ? 2 : 0);
                if (unspentDots[priority] < 0) {
                    unspentDots.general += parseInt(unspentDots[priority]);
                    unspentDots[priority] = 0;
                }
            }
        Object.assign(updateData, U.getUpdateData(this.actor, "generalUnspentDots", unspentDots.general));
        Object.assign(updateData, U.getUpdateData(this.actor, "priorities.primary.unspentDots", unspentDots.primary));
        Object.assign(updateData, U.getUpdateData(this.actor, "priorities.secondary.unspentDots", unspentDots.secondary));
        Object.assign(updateData, U.getUpdateData(this.actor, "priorities.tertiary.unspentDots", unspentDots.tertiary));
        this.actor.update(updateData);

        console.log("UPDATE DATA:");
        console.log(updateData);
    }

    getData() {
        const data = super.getData();

        data.config = CONFIG.scion;

        const actorData = data.data;
        const systemData = data.config;

        this._prepareDivineHeritage(actorData, systemData);
        this._prepareAttributes(actorData, systemData);

        data.blocks = {
            chargen: {
                class: "charGen",
                template: () => "systems/scion/templates/actor/actor-chargen.hbs"
            }
        };

        return data; // handlebar access: {{data.SYSTEMDATA}}
    }

    activateListeners(html) {
        super.activateListeners(html);
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable)
            return;

        // html.find(".dot.click").click(this._onDotClick.bind(this));

        const [dragHandler, dropHandler] = [
            (event) => this._onDotDrag(event),
            (event) => this._onDotDrop(event)
        ];
        html.find(".dot").each((i, element) => {
            element.setAttribute("draggable", true);
            element.addEventListener("dragstart", dragHandler, false);
        });
        html.find(".dotDropBin").each((i, element) => {
            element.addEventListener("drop", dropHandler, false);
        });
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
    } */

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
    }
}
