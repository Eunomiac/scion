/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ScionActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "actor"],
            template: "systems/scion/templates/actor/actor-sheet.html",
            width: 700,
            height: 700,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "front"}]
        });
    }
    /* -------------------------------------------- */
    /** @override */
    getData() {
        const data = super.getData();

        const actorData = data.data;

        actorData.SYSTEMDATA = {
            TIERS: CONFIG.TIERS,
            PANTHEONS: {},
            PANTHEONMEMBERS: {},
            HERITAGES: CONFIG.HERITAGES,
            ASSETSKILLS: {},
            PARENTCALLINGS: {},
            PARENTPURVIEWS: {}
        };
        console.log(CONFIG.TIERS);
        const sysData = actorData.SYSTEMDATA;
        for (const [pantheonKey, pantheonData] of Object.entries(CONFIG.PANTHEONS)) // Update list of Pantheons
            sysData.PANTHEONS[pantheonKey] = pantheonData.label;
        if (actorData.pantheon in CONFIG.PANTHEONS) { //                     If a Pantheon has been chosen:
            const PANTHEONDATA = CONFIG.PANTHEONS[actorData.pantheon];
            for (const assetSkill of PANTHEONDATA.assetSkills) //      ... update Asset Skills
                sysData.ASSETSKILLS[assetSkill] = assetSkill in actorData ? actorData[assetSkill].label : assetSkill;
            for (const member of Object.keys(PANTHEONDATA.members)) // ... update Pantheon Members (for Divine Parent selection)
                sysData.PANTHEONMEMBERS[member] = member;
            if (actorData.parent.name in sysData.PANTHEONMEMBERS) { //      If a Divine Parent has been chosen:
                const PARENTDATA = PANTHEONDATA.members[actorData.parent.name];
                actorData.parent.mantle = PARENTDATA.mantle;
                for (const calling of PARENTDATA.callings) // ... update Callings
                    sysData.PARENTCALLINGS[calling] = calling;
                for (const purview of PARENTDATA.purviews) // ... update Purviews
                    sysData.PARENTPURVIEWS[purview] = purview;
                if (actorData.heritage in sysData.HERITAGES) //                    If a Divine Heritage has been chosen:
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

        data.blocks = {
            chargen: {
                class: "charGen",
                template: () => "systems/scion/templates/actor/actor-chargen.html"
            }
        };

        return data; // handlebar access: {{data.SYSTEMDATA}}
    }

    activateListeners(html) {
        super.activateListeners(html);
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable)
            return;

        if (this.actor.owner) {
            const handler = (event) => this._onDragItemStart(event);
            html.find("div.dot").each((i, div) => {
                div.setAttribute("draggable", true);
                div.addEventListener("dragstart", handler, false);
            });
        }
    }
}
