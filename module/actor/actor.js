import {_, U, SCION} from "../modules.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ScionActor extends Actor {
    prepareData() {
        super.prepareData();
        if (this.data.type === "major")
            this._prepareMajorCharData();
        U.GLOG({
            "this ScionActor": this,
            "... .data": this.data,
            "... ... .data": this.data.data,
            "... ... .items": this.data.items
        }, this.name, "ScionActor: prepareData()", {groupStyle: "l1"});
    }

    _prepareMajorCharData() {
        const ownedItems = Array.from(this.data.items);

        // #region PREPARE BASE OWNED ITEMS
        const itemCreationData = {};

        // Find the first Path Item of each type, if it exists;
        // ... if it doesn't exist, add its creation data to pathData
        // ... if it does exist, increment data.pathSkillCount accordingly

        ["origin", "role", "pantheon"].forEach((pathType) => {
            if (!ownedItems.find((xx) => xx.data.type === pathType))
                itemCreationData[pathType] = {
                    name: U.Loc(`scion.paths.${pathType}`),
                    type: "path",
                    data: {
                        type: pathType,
                        title: null,
                        skills: [],
                        condition: null
                    }
                };
        });
        delete this.data.data.pathData;

        (async () => {
            if (!isObjectEmpty(itemCreationData))
                await this.createEmbeddedEntity("OwnedItem", Object.values(itemCreationData));
            if (!this._wasPantheonUpdated) {
                this.updatePantheon(true);
                this._wasPantheonUpdated = true;
            }
        })();

        // #endregion
    }

    async updatePantheon(pantheon) {
        if (pantheon === true || (pantheon && pantheon !== this.data.data.pantheon)) {
            U.GLOG({onActor: this.data.data.pantheon, onEvent: pantheon}, `Pantheon Check ${this.name}`, "updatePantheon");
            pantheon = (pantheon && pantheon in SCION.PANTHEONS) ? pantheon : this.data.data.pantheon;
            const panthPath = this.paths.find((path) => path.data.data.type === "pantheon");
            await panthPath.update({"data.skills": SCION.PANTHEONS[pantheon].assetSkills});
            this.updateSkills();
        }
    }

    async updateSkills() {
        const actorSkills = this.data.data.skills.list;
        const pathSkills = U.KeyMapObj(_.indexBy(this.paths, (item) => item.data.data.type), (item) => item.data.data.skills);
        const skillVals = U.KeyMapObj(SCION.SKILLS, (v, k) => actorSkills[k].purchased);
        duplicate(this.data.data.pathPriorities).reverse().forEach((pathType, i) => {
            pathSkills[pathType].forEach((skill) => {
                skillVals[skill] += i + 1;
            });
        });
        U.GLOG({actorSkills, pathSkills, skillVals, updateVals: U.KeyMapObj(
            _.omit(skillVals, (v, k) => v === actorSkills[k].value),
            (k) => `data.skills.list.${k}.value`,
            (v, k) => Math.min(actorSkills[k].max, v)
        )}, `Updating Actor Skills: ${this.name}`, "updateSkills()");
        await this.update(U.KeyMapObj(
            _.omit(skillVals, (v, k) => v === actorSkills[k].value),
            (k) => `data.skills.list.${k}.value`,
            (v, k) => Math.min(actorSkills[k].max, v)
        ));
    }

    get paths() { return this.items.filter((item) => item.type === "path") }
}