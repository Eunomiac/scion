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
            const currentSkills = panthPath.data.data.skills;
            const newSkills = Object.assign([], panthPath.data.data.skills, SCION.PANTHEONS[pantheon].assetSkills);
            await panthPath.update({"data.skills": newSkills});
            this.updateSkills();
        }
    }

    async updateSkills() {
        const derivedSkills = duplicate(this.derivedSkillVals);
        const purchasedSkills = duplicate(this.purchasedSkillVals);
        let spilloverDots = 0;
        for (const [skill, value] of Object.entries(derivedSkills))
            if (value > 5) {
                spilloverDots += value - 5;
                derivedSkills[skill] = 5;
                purchasedSkills[skill] -= value - 5;
            }
        const updateVals = Object.assign(
            U.KeyMapObj(
                diffObject(this.realSkillVals, derivedSkills),
                (k) => `data.skills.list.${k}.value`,
                (v) => v
            ),
            U.KeyMapObj(
                diffObject(this.purchasedSkillVals, purchasedSkills),
                (k) => `data.skills.list.${k}.purchased`,
                (v) => v
            )
        );
        if (spilloverDots)
            updateVals["data.skills.unspentDots"] = this.data.data.skills.unspentDots + spilloverDots;
        U.GLOG({
            actorSkills: this.skills,
            actorSkillVals: this.realSkillVals,
            pathSkills: this.pathSkills,
            derivedSkillVals: this.derivedSkillVals,
            spilloverDots,
            updateVals
        }, `Updating Actor Skills: ${this.name}`, "updateSkills()");
        await this.update(updateVals);
    }

    get skills() { return this.data.data.skills.list }
    get paths() { return this.items.filter((item) => item.type === "path") }
    get pathPriorities() { return this.data.data.pathPriorities }
    get pathSkills() { return U.KeyMapObj(_.indexBy(this.paths, (item) => item.data.data.type), (item) => item.data.data.skills) }
    get pathSkillVals() {
        const pathSkillVals = U.KeyMapObj(SCION.SKILLS, () => 0);
        duplicate(this.pathPriorities).reverse().forEach((pathType, i) => {
            this.pathSkills[pathType].forEach((skill) => {
                pathSkillVals[skill] += i + 1;
            });
        });
        return pathSkillVals;
    }
    get purchasedSkillVals() { return U.KeyMapObj(SCION.SKILLS, (v, k) => this.skills[k].purchased) }
    get derivedSkillVals() {
        const skillVals = {};
        for (const skill of Object.keys(this.skills))
            skillVals[skill] = this.pathSkillVals[skill] + this.purchasedSkillVals[skill];
        return skillVals;
    }
    get realSkillVals() { return U.KeyMapObj(this.skills, (v) => v.value) }
}