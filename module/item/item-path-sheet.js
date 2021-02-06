import "../external/dragula.min.js";
import {MIX, ItemMixins as MIXINS, SCION, U, _} from "../modules.js";
import ScionItemSheet from "./item-sheet.js";

export default class PathItemSheet extends MIX(ScionItemSheet).with(MIXINS.RichEdit) {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: [...super.defaultOptions.classes, "path"],
            width: 500,
            height: 510,
            tabs: [],
        });
    }

    getData() {
        const data = super.getData();
        data.skills = SCION.SKILLS.list;
        data.tooltip = {
            title: U.Loc("scion.path.tooltip.title", {path: `scion.path.${this.item.data.data.type}`}),
            content: U.Loc(`scion.path.tooltip.content.${this.item.data.data.type}`),
        };

        const allPathSkills = this.actor.paths.map((path) => path.data.data.skills).flat();
        data.pathSkillsCount = U.KeyMapObj(SCION.SKILLS.list, (label, skill) =>
            allPathSkills.reduce((count, pathSkill) => (pathSkill === skill ? count + 1 : count), 0)
        );

        data.conditions = {
            suspension: this.suspensionCondition,
            revocation: this.revocationCondition,
        };
        U.LOG(
            U.IsDebug() && {
                "this PathItemSheet": this,
                "... .getData() [Sheet Context]": data,
                "... .$data": data.data,
                "... .actor": this.actor,
                "... .conditions": data.conditions,
            },
            this.item.name,
            "PathItemSheet: getData()",
            {groupStyle: "l2"}
        );

        return data;
    }

    get suspensionCondition() {
        this._suspensionCondition = this._suspensionCondition ?? game.item.get(this.$data.conditions.pathSuspension)
        return this.item.getActorItems("condition").find((item) => item.$subtype === "pathSuspension" && item.$data.linkedItem === this.item.id);
    }

    get revocationCondition() {
        return this.item.getActorItems("condition").find((item) => item.$subtype === "pathRevocation" && item.$data.linkedItem === this.item.id);
    }

    activateListeners(html) {
        super.activateListeners(html);

        const actorData = this.actor.data.data;
        const pathData = this.getData().data;

        // #region DRAGULA: PATH SKILLS
        const addPathSkill = async (skillElement) => {
            await this.item.update({"data.skills": [...pathData.skills, skillElement.dataset.skill]});
        };
        const remPathSkill = async (skillElement) => {
            await this.item.update({"data.skills": _.without(pathData.skills, skillElement.dataset.skill)});
        };

        const skillSource = html.find("#pathSkillSource");
        const [skillMirror] = html.find("#pathSkillMirror");
        const skillDrops = html.find(".skillDrop");
        const pathSkillDragger = dragula({
            containers: [...skillSource, ...skillDrops],
            moves: (element, source) =>
                !element.classList.contains("invalid") &&
                !element.classList.contains("pantheon") &&
                (source.classList.contains("skillDrop") ||
                    (_.compact(pathData.skills).length < 3 && !pathData.skills.includes(element.dataset.skill))),
            accepts: (element, target) =>
                target.classList.contains("pathSkills") && _.compact(pathData.skills).length < 3 && !pathData.skills.includes(element.dataset.skill),
            direction: "horizontal",
            copy: true,
            removeOnSpill: true,
            mirrorContainer: skillMirror,
            sheetElement: this.sheetElem,
        });
        pathSkillDragger.on("cancel", (element, container, source) => {
            if (source.classList.contains("pathSkills")) {
                remPathSkill(element);
            }
        });
        pathSkillDragger.on("drop", (element) => addPathSkill(element));

        if (game.scion.debug.isDebuggingDragula) {
            pathSkillDragger.on("drag", (el, source) => {
                U.LOG(U.IsDebug() && {el, source}, "on DRAG", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("dragend", (el) => {
                U.LOG(U.IsDebug() && {el}, "on DRAGEND", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("drop", (el, target, source, sibling) => {
                U.LOG(U.IsDebug() && {el, target, source, sibling}, "on DROP", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("cancel", (el, container, source) => {
                U.LOG(U.IsDebug() && {el, container, source}, "on CANCEL", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("remove", (el, container, source) => {
                U.LOG(U.IsDebug() && {el, container, source}, "on REMOVE", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("shadow", (el, container, source) => {
                U.LOG(U.IsDebug() && {el, container, source}, "on SHADOW", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("over", (el, container, source) => {
                U.LOG(U.IsDebug() && {el, container, source}, "on OVER", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("out", (el, container, source) => {
                U.LOG(U.IsDebug() && {el, container, source}, "on OUT", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
            pathSkillDragger.on("cloned", (clone, original, type) => {
                U.LOG(U.IsDebug() && {clone, original, type}, "on CLONED", "PathItemSheet: DRAGULA", {groupStyle: "l4"});
            });
        }

        // #endregion

        // #endregion
    }
}
