import {_, U, SCION} from "../modules.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ScionActor extends Actor {
    get aData() { return this.data.data }
    get ownedItems() { return this.data.items }

    prepareData() {
        super.prepareData();
        if (this.data.type === "major")
            this._prepareMajorCharData().then(() => U.LOG({
                "this ScionActor": this,
                "... .data": this.data,
                "... ... .data": this.aData,
                "... ... .items": this.data.items
            }, this.name, "ScionActor: prepareData()", {groupStyle: "l1"}));
    }

    async _prepareMajorCharData() {
        // const ownedItems = Array.from(this.data.items);

        // #region PREPARE BASE OWNED ITEMS
        const itemCreationData = [];

        // Find the first Path Item of each type, if it exists;
        // ... if it doesn't exist, add its creation data to pathData
        // ... if it does exist, increment data.pathSkillCount accordingly

        ["origin", "role", "pantheon"].forEach((pathType) => {
            if (!this.ownedItems.find((item) => item.data.type === pathType)) {
                U.LOG(`Creating ${pathType} for ${this.name}`);
                itemCreationData.push(...[
                    {
                        name: U.Loc(`scion.path.${pathType}`),
                        type: "path",
                        data: {
                            type: pathType,
                            title: null,
                            skills: [],
                            connections: [],
                            conditions: {
                                pathSuspension: null,
                                pathRevocation: null
                            }
                        }
                    },
                    ...["pathSuspension", "pathRevocation"].map((conditionType) => (
                        {
                            name: U.Loc(`scion.condition.${conditionType}`),
                            type: "condition",
                            data: {
                                type: conditionType,
                                title: null,
                                effects: [],
                                isPersistent: true,
                                resolution: "",
                                linkedItem: pathType
                            }
                        }
                    ))
                ]);
            }
        });
        delete this.data.data.pathData;

        if (itemCreationData.length) {
            U.LOG({itemCreationData}, `Item Creation for ${this.name}`);
            this.createEmbeddedEntity("OwnedItem", itemCreationData)
                .then(this.updatePathConditionLinks.bind(this))
                .then(() => (this.updatePantheon.bind(this))(true));
        } else if (!this._wasPantheonUpdated) {
            this.updatePantheon(true);
        }

        // (async () => {
        // })();

        // #endregion
    }

    async updatePathConditionLinks() {
        for (const pathType of ["origin", "role", "pantheon"]) {
            const pathUpdateData = {};
            const pathItem = this[`${pathType}Path`];
            for (const conditionType of ["pathSuspension", "pathRevocation"]) {
                const conditionItem = this.conditions.find((item) => item.iData.type === conditionType && item.iData.linkedItem === pathType);
                if (conditionItem) {
                    await conditionItem.update({"data.linkedItem": pathItem.id});
                    pathUpdateData[`data.conditions.${conditionType}`] = conditionItem.id;
                    U.LOG({pathUpdateData}, "UpdatING Path Data...", "updatePathConditionLinks");
                }
            }
            await pathItem.update(pathUpdateData);
            U.LOG({pathItem, pathUpdateData}, "UpdatED Path Data...", "updatePathConditionLinks");
        }
    }

    async updatePantheon(pantheon) {
        if (pantheon === true || (pantheon && pantheon !== this.data.data.pantheon)) {
            U.LOG({onActor: this.data.data.pantheon, onEvent: pantheon}, `Pantheon Check ${this.name}`, "updatePantheon");
            pantheon = (pantheon && pantheon in SCION.PANTHEONS) ? pantheon : this.data.data.pantheon;
            const panthPath = this.paths.find((path) => path.data.data.type === "pantheon");
            const currentSkills = panthPath.data.data.skills;
            const newSkills = Object.assign([], panthPath.data.data.skills, SCION.PANTHEONS[pantheon].assetSkills);
            await panthPath.update({"data.skills": newSkills});
            this.updateSkills();
            this._wasPantheonUpdated = true;
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
        U.LOG({
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
    get conditions() { return this.items.filter((item) => item.type === "condition") }
    get originPath() { return this.paths.find((item) => item.data.data.type === "origin") }
    get rolePath() { return this.paths.find((item) => item.data.data.type === "role") }
    get pantheonPath() { return this.paths.find((item) => item.data.data.type === "pantheon") }
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