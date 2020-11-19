// import * as _ from "../external/underscore/underscore-esm-min.js";
import * as U from "../data/utils.js";
import "../external/dragula.min.js";
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
        return `systems/scion/templates/actor/${this.object.data.type}-sheet.hbs`;
    }
    getData() {
        const data = super.getData();

        data.config = CONFIG.scion;
        const actorData = data.data;
        const panthData = CONFIG.scion.PANTHEONS;
        const godData = CONFIG.scion.GODS;

        actorData.charGen = actorData.charGen || {charGenStep: "1"};
        data.blocks = {
            chargen: {
                class: "charGen",
                template: () => `systems/scion/templates/actor/actor-chargen-step${actorData.charGen.charGenStep || 1}.hbs`
            }
        };

        // Update Patronage Subheader
        const {genesis, pantheon, patron} = actorData;
        actorData.patronageLine = "";
        if (pantheon && patron && panthData[pantheon].members.includes(patron)) {
            if (genesis)
                actorData.patronageLine = U.Loc(
                    `scion.geneses.${genesis}Line`,
                    {
                        divinePatronName: U.Loc(CONFIG.scion.GODS[patron].label),
                        divinePatronMantle: CONFIG.scion.GODS[patron].mantle ? `, ${CONFIG.scion.GODS[patron].mantle}` : ""
                    }
                );
        } else {
            actorData.patron.name = "";
        }

        // Update Patrons List
        if (pantheon)
            actorData.charGen.patronList = U.MakeDict(
                panthData[pantheon].members,
                (v) => U.Loc(`scion.gods.${v}`),
                (k, v) => v
            );

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (!this.options.editable)
            return;

        // #region CONTENT-EDITABLE ELEMENTS
        html.find(".contentEditable").each((i, element) => {
            const data = element.dataset;
            element.setAttribute("contenteditable", false);
            element.addEventListener("click", (event) => this._onEditClickOn(event), false);
            element.addEventListener("blur", (event) => this._onEditClickOff(event), false);

            // If dataset includes a path, fill the element with the current data:
            if ("path" in data) {
                const actorVal = U.DigData(this, data.path);
                if (actorVal)
                    element.innerHTML = actorVal.trim();
                else
                    element.innerHTML = "";
            }

            // If element innerHTML is blank, populate with placeholder if one is available
            let isDisplayingPlaceholderText = false;
            if (!element.innerText)
                if ("placeholder" in data) {
                    element.innerHTML = data.placeholder;
                    isDisplayingPlaceholderText = true;
                } else {
                    element.innerHTML = "";
                }

            // Apply placeholder class if necessary:
            if (isDisplayingPlaceholderText)
                element.classList.add("placeholder");
            else
                element.classList.remove("placeholder");
        });
        // #endregion

        // #region SPECIALIZED ON-CHANGE FUNCTIONS
        const getCharGenStep = () => {
            const actorData = this.getData().data;
            const charGenStepReqs = {
                10: {
                    ["data.finishingBonusOn"]: (x) => Boolean(x)
                },
                7: {
                    ["data.purviews"]: (x) => x.innate && x.pantheon && (x.other.length - 2) === x.fromBirthrights
                },
                6: {
                    ["data.birthrights"]: (x) => x.unspentDots === 0 && Object.values(x.list).length
                },
                5: {
                    ["data.callings"]: (x) => Object.keys(x).filter((xx) => x[xx].value >= 1).length === 3
                                        && Object.values(x).reduce((tot, xx) => tot + xx.value, 0) === 5,
                    ["data.knacks"]: (x) => Object.values(x).reduce((tot, xx) => ({heroic: 1, immortal: 2}[xx.knackType] * xx.value + tot), 0)
                },
                4: {
                    ["data.attributes"]: (x) => Object.values(x.priorities).filter((xx) => Boolean(xx)).length === 3
                                            && Boolean(x.favoredApproach),
                    ["data.skills"]: (x) => true
                },
                3: {
                    ["data.paths"]: (x) => x.length === 3
                },
                2: {
                    ["data.patron"]: (x) => actorData.pantheon && x.name && CONFIG.scion.PANTHEONS[actorData.pantheon].members.includes(x.name),
                    ["data.genesis"]: (x) => Boolean(x),
                    ["data.concept"]: (x) => Boolean(x)/* ,
                    ["data.deeds"]: (x) => x.shortTerm.length && x.longTerm.length */
                }
            };
            const reportLines = [];
            for (const [step, tests] of Object.entries(charGenStepReqs)) {
                reportLines.push(`@@@ STEP: ${step} @@@`);
                let isStepOK = true;
                const testResults = [];
                for (const [path, testFunc] of Object.entries(tests)) {
                    isStepOK = isStepOK && testFunc(U.DigData(actorData, path));
                    testResults.push([path, U.DigData(actorData, path), isStepOK]);
                    if (!isStepOK)
                        break;
                }
                reportLines.push(testResults);
                if (isStepOK) {
                    console.log({
                        ["!!! RETURNING A STEP !!!"]: U.Int(step),
                        [">> REPORT >>"]: reportLines
                    });
                    return U.Int(step);
                }
            }
            console.log({
                ["XXX RETURNING ONE XXX"]: 1,
                [">> REPORT >>"]: reportLines
            });
            return 1;
        };
        const setCharGenToggles = (element) => {
            const actorData = this.getData().data;
            const elementStep = U.Int(element.dataset.chargenstep);
            const charGenStep = U.Int(getCharGenStep());
            const toggleClasses = ["hide", "noGlow", "halfGlow", "activeGlow"];
            const classArray = Array.from(element.classList).filter((x) => !toggleClasses.includes(x));
            if (charGenStep < (elementStep - 1))
                classArray.push("hide");
            else if (charGenStep < elementStep)
                classArray.push("noGlow");
            else if (charGenStep === elementStep)
                classArray.push("activeGlow");
            else if (charGenStep > elementStep)
                classArray.push("halfGlow");
            element.className = classArray.join(" ");
            console.log({
                ["@@ ELEMENT @@"]: element,
                ["@@ ELEMENT STEP @@"]: elementStep,
                ["actorData.charGen.charGenStep"]: actorData.charGen.charGenStep,
                ["charGenStep"]: charGenStep
            });
        };
        html.find(".charGenToggle").each((i, element) => {
            setCharGenToggles.bind(this)(element);
            element.addEventListener("change", (event) => {
                setCharGenToggles.bind(this)(event.currentTarget);
            });
        });
        // #endregion

        // > Dragula: Sort Attribute Priorities

        /* FOR SORTING ON A GRID
            1) Assign each grid a number, moving in an s-formation so all cells move on a track.
            2) Be able to get closest grid of dragged element (that's where mirror snaps to)
            3) Figure out which grids have to move to make room
            4) Animate all moving cells
        */

        const priorityContainer = html.find("#prioritySort")[0];
        const drake = dragula(
            [priorityContainer],
            {
                direction: "horizontal",
                mirrorContainer: html.find(".sortStorer")[0]
            }
        );
        drake.on("drop", () => {
            console.log({["@@ DRAKE DROP @@"]: this});
            const prioritiesContainer = html.find("#prioritySort")[0];
            const children = Array.from(prioritiesContainer.children).map((x) => ["mental", "physical", "social"].find((xx) => Array.from(x.classList).includes(xx)));
            const updateData = {};
            children.forEach((x, i) => {
                updateData[`data.priorities.${Object.keys(CONFIG.scion.ATTRIBUTES.priorities)[i]}.arena`] = x;
            });
            console.log(updateData);
            this.actor.update(updateData);
            // this._updateChargen();
        });
        // #endregion
    }

    _onEditClickOn(event) {
        event.preventDefault();
        const element = event.currentTarget;
        console.log({"@@ CLICK ON @@": element});
        element.setAttribute("contenteditable", true);
        if (element.classList.contains("placeholder")) {
            element.innerHTML = "";
            element.classList.remove("placeholder");
        }
    }
    _onEditClickOff(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const data = element.dataset;
        console.log({"@@ CLICK OFF @@": element});
        element.setAttribute("contenteditable", false);
        if ("path" in data) {
            if (data.path.endsWith("divineTitle") && element.innerText)
                element.innerHTML = `"${element.innerText.replace(/(^\s*"+|"+\s*$)/gu, "").trim()}"`;
            if (data.path.startsWith("actor"))
                this.actor.update({[data.path.slice(6)]: element.innerText.trim()});
            else
                this.actor.update({[data.path]: element.innerText.trim()});
            let isDisplayingPlaceholderText = false;
            if (!element.innerText)
                if ("placeholder" in data) {
                    element.innerHTML = data.placeholder;
                    isDisplayingPlaceholderText = true;
                } else {
                    element.innerHTML = "";
                }

            // Apply placeholder class if necessary:
            if (isDisplayingPlaceholderText)
                element.classList.add("placeholder");
            else
                element.classList.remove("placeholder");
        }
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
    }

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
    } */
}
