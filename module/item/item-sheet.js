import {_, U, MIX, ItemMixins as MIXINS} from "../modules.js";

export class ScionItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "item"],
            width: 520,
            height: 480,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
        });
    }
    static RegisterDefault() {
        Items.registerSheet("scion", this, {
            types: this.types,
            makeDefault: true,
            label: `scion.sheets.${this?.sheetLabel ?? this.types[0]}`
        });
        console.log(`Item Sheet Registered | Registered ${this.name}`);
    }

    constructor(...args) {
        super(...args);
        this._templateRootPath = "systems/scion/templates/item";
        this._templateSubPath = null;
        this._templateFilename = "item-sheet.hbs";
    }

    get template() { return _.compact([this._templateRootPath, this._templateSubPath, this._templateFilename]).join("/") }

    getData() {
        const data = super.getData();
        return data;
    }

    setPosition(options = {}) {
        const position = super.setPosition(options);
        const sheetBody = this.element.find(".sheet-body");
        const bodyHeight = position.height - 192;
        sheetBody.css("height", bodyHeight);
        return position;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}
export class PathSheet extends ScionItemSheet {

    static get types() { return ["path"] }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "item", "path"],
            width: 500,
            height: 500
        });
    }

    constructor(...args) {
        super(...args);
        this._templateFilename = "item-path-sheet.hbs";
    }

    getData() {
        const data = super.getData();
        /* data.title ??= "";
        data.isEditable = {
            title: true
        };
        return data; */
    }
}
