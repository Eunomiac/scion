import {_, U, SCION} from "../modules.js";
import {ScionItemSheet} from "./item-sheet.js";
import "../external/dragula.min.js";

export class PathItemSheet extends ScionItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [...super.defaultOptions.classes, "path"],
            width: 500,
            height: 500,
            tabs: []
        });
    }

    getData() {
        const data = super.getData();
        data.skills = SCION.SKILLS;
        data.tooltip = {
            title: U.Loc("scion.paths.tooltip.title", {path: `scion.paths.${this.item.data.data.type}`}),
            content: U.Loc(`scion.paths.tooltip.content.${this.item.data.data.type}`)
        };

        // data.skillslist = data.items.find((item) => item.data.type === "skillslist");

        const allPathSkills = this.actor.paths
            .map((path) => path.data.data.skills)
            .flat();

        // data.path
        data.pathSkillsCount = U.KeyMapObj(SCION.SKILLS, (label, skill) => allPathSkills.reduce((count, pathSkill) => (pathSkill === skill ? count + 1 : count), 0));

        U.GLOG({
            "this PathItemSheet": this,
            "... .getData() [Sheet Context]": data,
            "... ... .data": data.data,
            "... ... .pathSkillsCount": data.pathSkillsCount
        }, this.item.name, "PathItemSheet: getData()", {groupStyle: "l2"});

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        const actorData = this.actor.data.data;
        const pathData = this.getData().data;

        // #region DRAGULA: PATH SKILLS
        const addPathSkill = async (skillElement) => {
            await this.item.update({["data.skills"]: [...pathData.skills, skillElement.dataset.skill]});
            this.actor.updateSkills();
        };
        const remPathSkill = async (skillElement) => {
            await this.item.update({["data.skills"]: _.without(pathData.skills, skillElement.dataset.skill)});
            this.actor.updateSkills();
        };

        const skillSource = html.find("#pathSkillSource");
        const skillDrops = html.find(".skillDrop");
        //const mirrorContainer = html.find("body")[0];
        const pathSkillDragger = dragula({
            containers: [...skillSource, ...skillDrops],
            moves: (element, source) => !element.classList.contains("invalid")
                && !element.classList.contains("pantheon")
                && (source.classList.contains("skillDrop")
                || (_.compact(pathData.skills).length < 3
                    && !(pathData.skills.includes(element.dataset.skill)))),
            accepts: (element, target) => target.classList.contains("pathSkills")
                && _.compact(pathData.skills).length < 3
                && !(pathData.skills.includes(element.dataset.skill)),
            direction: "horizontal",
            copy: true,
            removeOnSpill: true
        });
        pathSkillDragger.on("cancel", (element, container, source) => {
            if (source.classList.contains("pathSkills"))
                remPathSkill(element);
        });
        pathSkillDragger.on("drop", (element) => addPathSkill(element));

        if (game.scion.debug.isDebuggingDragula) {
            pathSkillDragger.on("drag", (el, source) => {
                U.GLOG({el, source}, "on DRAG", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("dragend", (el) => {
                U.GLOG({el}, "on DRAGEND", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("drop", (el, target, source, sibling) => {
                U.GLOG({el, target, source, sibling}, "on DROP", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("cancel", (el, container, source) => {
                U.GLOG({el, container, source}, "on CANCEL", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("remove", (el, container, source) => {
                U.GLOG({el, container, source}, "on REMOVE", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("shadow", (el, container, source) => {
                U.GLOG({el, container, source}, "on SHADOW", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("over", (el, container, source) => {
                U.GLOG({el, container, source}, "on OVER", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("out", (el, container, source) => {
                U.GLOG({el, container, source}, "on OUT", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("cloned", (clone, original, type) => {
                U.GLOG({clone, original, type}, "on CLONED", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
        }


       // #endregion

        // #endregion
    }
}
