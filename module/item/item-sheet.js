import {_, U} from "../data/utils.js";

export class ScionItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "item"],
            width: 520,
            height: 480,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
        });
    }
    /* get template() {
        return `systems/scion/templates/item/${this.object.data.type}-sheet.hbs`;
    } */

    get template() {
        const path = "systems/scion/templates/item";
        // Return a single sheet for all item types.
        // return `${path}/item-sheet.html`;

        // Alternatively, you could use the following return statement to do a
        // unique item sheet by type, like `weapon-sheet.html`.
        return `${path}/item-${this.item.data.type}-sheet.hbs`;
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData();
        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    setPosition(options = {}) {
        const position = super.setPosition(options);
        const sheetBody = this.element.find(".sheet-body");
        const bodyHeight = position.height - 192;
        sheetBody.css("height", bodyHeight);
        return position;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        // if (!this.options.editable)
        //    return;

    // Roll handlers, click handlers, etc. would go here.
    }
}

export class ScionPathSheet extends ScionItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "item", "path"],
            width: 520,
            height: 480,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "pathGen"
                }
            ]
        });
    }
}
