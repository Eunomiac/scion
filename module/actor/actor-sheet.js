import {_, U, handlebarTemplates, MIX, ActorMixins as MIXINS} from "../modules.js";
import "../external/gl-matrix-min.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ScionActorSheet extends MIX(ActorSheet).with(MIXINS.EditableDivs) {
    static get defaultOptions() {
        /*  super.defaultOptions = {
                baseApplication: "ActorSheet",
                classes: ["sheet"],
                template: "templates/sheets/actor-sheet.html",
                id: "",
                title: "",
                top: null,
                left: null,
                height: 720,
                width: 800,
                editable: true,
                minimizable: true,
                popOut: true,
                resizable: true,
                submitOnChange: true,
                submitOnClose: true,
                closeOnSubmit: false,
                tabs: [],
                filters: [],
                scrollY: [],
                dragDrop: [
                    {
                        dragSelector: ".item-list .item",
                        dropSelector: null
                    }
                ],
                viewPermission: 1
            }; */
        return mergeObject(super.defaultOptions, {
            classes: ["scion", "sheet", "actor"]
        });
    }
    static RegisterSheet(label = "actor", types = [], makeDefault = true) {
        label = `scion.sheets.${label}Sheet`;
        Actors.registerSheet("scion", this, {makeDefault, types, label});
    }

    get template() {
        return `systems/scion/templates/actor/actor-${this.object.data.type}-sheet.hbs`;
    }
    getData() {
        const data = super.getData();
        data.config = CONFIG.scion;
        data.blocks = handlebarTemplates;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if (this.options.editable) {
            // #region CONTENT-EDITABLE ELEMENTS
            /* const _onEditKeyDown = (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    event.currentTarget.blur();
                }
            };
            const _onEditClickOn = (event) => {
                event.preventDefault();
                const element = event.currentTarget;
                element.setAttribute("contenteditable", true);
                if (element.classList.contains("placeholder")) {
                    element.innerHTML = "";
                    element.classList.remove("placeholder");
                }
                // Add an event listener for when the player hits the 'Enter' key.
                element.addEventListener("keydown", _onEditKeyDown.bind(this));
                // Focus the element, which will fire the _onEditFocus event to select all text.
                element.focus();
            };
            const _onEditFocus = () => { document.execCommand("selectAll") };
            const _onEditClickOff = (event) => {
                event.preventDefault();
                const element = event.currentTarget;
                const dataSet = element.dataset;
                element.setAttribute("contenteditable", false);
                element.removeEventListener("keydown", _onEditKeyDown);
                if ("path" in dataSet) {
                    if (dataSet.path.endsWith("divineTitle") && element.innerText)
                        element.innerHTML = `"${element.innerText.replace(/(^\s*"+|"+\s*$)/gu, "").trim()}"`;
                    if (dataSet.path.startsWith("actor"))
                        this.actor.update({[dataSet.path.slice(6)]: element.innerText.trim()});
                    else
                        this.actor.update({[dataSet.path]: element.innerText.trim()});
                }
                if (!element.innerText && "placeholder" in dataSet) {
                    U.DB([element.innerText, !element.innerText], "Inner Text Check");
                    element.classList.add("placeholder");
                    element.innerHTML = dataSet.placeholder;
                } else {
                    U.DB([element.innerText, !element.innerText], "Inner Text Check");
                    element.classList.remove("placeholder");
                    // element.innerHTML = "";
                }
            };
            html.find("div.contentEditable").each((i, element) => {
                const data = element.dataset;
                element.setAttribute("contenteditable", false);
                element.addEventListener("click", _onEditClickOn.bind(this));
                element.addEventListener("focus", _onEditFocus.bind(this));
                element.addEventListener("blur", _onEditClickOff.bind(this));

                // If dataset includes a path, fill the element with the current data:
                if ("path" in data) {
                    const actorVal = U.DigActor(this.actor, data.path);
                    if (actorVal)
                        element.innerHTML = actorVal.trim();
                    else
                        element.innerHTML = "";
                }

                // If element innerHTML is blank, populate with placeholder if one is available
                if (!element.innerText && "placeholder" in data) {
                    element.innerHTML = data.placeholder;
                    element.classList.add("placeholder");
                } else {
                    element.classList.remove("placeholder");
                }
            }); */
            // #endregion
            // #region OWNED ITEM POP-OUTS
            const _onOpenOwnedItem = (event) => {
                event.preventDefault();
                const element = event.currentTarget;
                const dataSet = element.dataset;
                const item = this.actor.items.get(dataSet.pathid);
                U.GLOG({
                    "Element.DataSet": dataSet,
                    "Actor.Items": this.actor.items,
                    item
                }, item.name, "Open Owned Item", {groupStyle: "info"});
                item.sheet.render(true, {
                    left: 100,
                    top: 100,
                    log: true
                });
            };
            html.find(".clickable.item-open").each((i, element) => {
                element.addEventListener("click", _onOpenOwnedItem.bind(this));
            });
            // #endregion
        }
    }
}
