/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
import {PANTHEONS} from "../data/constants.js";

export class ScionActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "actor"],
            template: "systems/scion/templates/actor/actor-sheet.html",
            width: 1000,
            height: 1000,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "front"}]
        });
    }
    /* -------------------------------------------- */
    /** @override */
    getData() {
        const data = super.getData();
        const actorData = data.data;
        actorData.SYSTEMDATA = {
            PANTHEONS: {},
            PANTHEONMEMBERS: {},
            HERITAGES: {
                Born: "Born",
                Chosen: "Chosen",
                Incarnation: "Incarnation",
                Created: "Created"
            },
            ASSETSKILLS: {},
            PARENTCALLINGS: {},
            PARENTPURVIEWS: {}
        };
        const sysData = actorData.SYSTEMDATA;
        for (const [pantheonKey, pantheonData] of Object.entries(PANTHEONS))
            sysData.PANTHEONS[pantheonKey] = pantheonData.label;
        if (actorData.pantheon in PANTHEONS) { // If a Pantheon has been chosen, populate Asset Skills & pantheon members
            for (const assetSkill of PANTHEONS[actorData.pantheon].assetSkills)
                actorData.SYSTEMDATA.ASSETSKILLS[assetSkill] = assetSkill in actorData ? actorData[assetSkill].label : assetSkill;
            for (const member of Object.keys(PANTHEONS[actorData.pantheon].members))
                sysData.PANTHEONMEMBERS[member] = member;
            if (actorData.parent.name in sysData.PANTHEONMEMBERS) { // If a parent has been chosen, update mantle, callings & purviews
                actorData.parent.mantle = PANTHEONS[actorData.pantheon].members[actorData.parent.name].mantle;
                for (const calling of PANTHEONS[actorData.pantheon].members[actorData.parent.name].callings)
                    sysData.PARENTCALLINGS[calling] = calling;
                for (const purview of PANTHEONS[actorData.pantheon].members[actorData.parent.name].purviews)
                    sysData.PARENTPURVIEWS[purview] = purview;
                if (actorData.heritage in sysData.HERITAGES)
                    switch (actorData.heritage) {
                        case "Born": actorData.parentageLine = `Scion of ${actorData.parent.name}${actorData.parent.mantle ? ", " : ""}${actorData.parent.mantle}`; break;
                        case "Chosen": actorData.parentageLine = `Chosen of ${actorData.parent.name}${actorData.parent.mantle ? ", " : ""}${actorData.parent.mantle}`; break;
                        case "Incarnation": actorData.parentageLine = `${actorData.parent.name}${actorData.parent.mantle ? ", " : ""}${actorData.parent.mantle} Incarnate`; break;
                        case "Created": actorData.parentageLine = `Creation of ${actorData.parent.name}${actorData.parent.mantle ? ", " : ""}${actorData.parent.mantle}`; break;
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
        return data; // handlebar access: {{data.SYSTEMDATA.PANTHEONS}}
    }
}
