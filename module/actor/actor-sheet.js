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

    getData() {
        const data = super.getData();

        data.config = CONFIG.scion;

        const actorData = data.data;
        const systemData = data.config;

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

        const testPriorities = {
            primary: "physical",
            secondary: "social",
            tertiary: "mental"
        };

        actorData.attributes = {
            primary: systemData.ATTRIBUTES[testPriorities.primary],
            secondary: systemData.ATTRIBUTES[testPriorities.secondary],
            tertiary: systemData.ATTRIBUTES[testPriorities.tertiary]
        };

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

        html.find(".dot").click(this._onDotClick.bind(this));

        if (this.actor.owner) {
            const handler = (event) => this._onDragItemStart(event);
            html.find("div.dot").each((i, div) => {
                div.setAttribute("draggable", true);
                div.addEventListener("dragstart", handler, false);
            });
        }
    }

    _onDotClick(event) {
        event.preventDefault();
        let element = event.currentTarget;
        const dataset = element.dataset;
        // <span class="dot" data-trait="closeCombat" data-val=2></span>
        if ("trait" in dataset && "val" in dataset) {
            if (element.className.includes("full")) {
                this.actor.update({[`data.${dataset.trait}.value`]: parseInt(dataset.val) - 1});
                do {
                    element.className = element.className.replace(/ ?full ?/gu, "");
                    element = element.nextElementSibling;
                } while (element && element.className.includes("dot"));
            } else {
                this.actor.update({[`data.${dataset.trait}.value`]: parseInt(dataset.val)});
                do {
                    element.className += " full";
                    element = element.previousElementSibling;
                } while (element && element.className.includes("dot"));
            }
            console.log(`Trait ${dataset.trait} set to ${this.object.data.data[dataset.trait].value}`);
        } else {
            console.log("Failed Dot Click:");
            console.log(event);
        }
    }
}
