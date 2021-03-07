import {MIX, ItemMixins as MIXINS, U, handlebarTemplates, SCION} from "../modules.js";

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export default class ScionItemSheet extends MIX(ItemSheet).with(MIXINS.Accessors, 
                                                                MIXINS.ClampText,
                                                                MIXINS.EditableDivs,
                                                                MIXINS.PopoutControl,
                                                                MIXINS.CloseButton,
                                                                MIXINS.ToolTips) {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            "classes": ["scion", "sheet", "item"],
            "width": 520,
            "height": 480
        });
    }

    static RegisterSheet(label = "item", types = [], makeDefault = true) {
        label = `scion.sheet.${label}Sheet`;
        Items.registerSheet("scion", this, {makeDefault, types, label});
        U.LOG(U.IsDebug() && {"Sheet Registered": this.name,
                              types,
                              "defaultOptions": this.defaultOptions}, `${U.TCase(U.Loc(label))} Sheet Registered`, "ScionItemSheet");
    }

    get template() { return `systems/scion/templates/item/item-${this.object.data.type}-sheet.hbs`; }

    getData() {
        const data = super.getData();
        data.blocks = handlebarTemplates;
        data.actorID = this.$actor?._id;
        data.openPopouts = data.openPopouts || {};
        data.tooltips = data.tooltips ?? {};
        data.tooltips.paths = data.tooltips.paths ?? U.KeyMapObj(
            SCION.PATHS.list,
            (i, pathType) => pathType,
            (pathType) => ({
                title: U.Loc(`scion.path.tooltips.${pathType}.title`),
                full: U.Loc(`scion.path.tooltips.${pathType}.full`),
                short: false
            })
        );
        data.tooltips.attributes = data.tooltips.attributes ?? U.KeyMapObj(
            SCION.ATTRIBUTES.list,
            false,
            (l, attribute) => ({
                title: U.Loc(`scion.attribute.${attribute}.tooltips.title`),
                full: U.Loc(`scion.attribute.${attribute}.tooltips.full`),
                short: U.Loc(`scion.attribute.${attribute}.tooltips.short`)
            })
        );
        data.tooltips.skills = data.tooltips.skills ?? U.KeyMapObj(
            SCION.SKILLS.list,
            false,
            (l, skill) => ({
                title: U.Loc(`scion.skill.${skill}.tooltips.title`),
                full: U.Loc(`scion.skill.${skill}.tooltips.full`),
                short: U.Loc(`scion.skill.${skill}.tooltips.short`)
            })
        );
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (this.options.editable) {
            new Draggable(this, html, html.find("h1.title")[0], false);
        }
    }
}
