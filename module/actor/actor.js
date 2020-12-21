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
            this._prepareMajorCharData();
    }

    async _prepareMajorCharData() {
        if (!this.isPreparingCharData) {
            this.isPreparingCharData = true;

            // #region PREPARE BASE OWNED ITEMS
            const itemCreationData = [];

            // Find the first Path Item of each type, if it exists;
            // ... if it doesn't exist, add its creation data to pathData
            // ... if it does exist, increment data.pathSkillCount accordingly

            ["origin", "role", "pantheon"].forEach((pathType) => {
                if (!this.ownedItems.find((item) => item.data.type === pathType))
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
            });

            if (itemCreationData.length) {
                U.LOG({itemCreationData, "ACTOR": this.fullLogReport}, "Item Creation Data Found: Creating Items", this.name);
                await this.createOwnedItem(itemCreationData);
                itemCreationData.length = 0;
                U.LOG({items: this.ownedItems, "ACTOR": this.fullLogReport}, "... Items Created; Updating Path Links ...", this.name);
                await this.updatePathConditionLinks();
                U.LOG({items: this.ownedItems, "ACTOR": this.fullLogReport}, "... Path Links Updated; Updating Pantheon ...", this.name);
                await this.updatePantheon(true);
                U.LOG({"aData.pantheon": this.data.data.pantheon, "ACTOR": this.fullLogReport}, "... Pantheon Updated: DONE!", this.name);
            } else if (!this.aData.wasPantheonUpdated) {
                U.LOG({
                    "aData.pantheon": this.data.data.pantheon,
                    "this.aData.wasPantheonUpdated": this.data.data.wasPantheonUpdated,
                    "ACTOR": this.fullLogReport
                }, "Pantheon NOT Updated: Updating Pantheon...", this.name);
                await this.updatePantheon(true);
                await this.update({["data.wasPantheonUpdated"]: true});
                U.LOG({
                    "aData.pantheon": this.data.data.pantheon,
                    "this.aData.wasPantheonUpdated": this.aData.wasPantheonUpdated,
                    "ACTOR": this.fullLogReport
                }, "... Pantheon Updated: DONE!", this.name);
            }
            this.isPreparingCharData = false;
            return true;
        }
        return false;
    }

    async updatePathConditionLinks() {
        for (const pathType of ["origin", "role", "pantheon"]) {
            const pathUpdateData = {};
            const pathItem = this[`${pathType}Path`];
            for (const conditionType of ["pathSuspension", "pathRevocation"]) {
                const conditionItem = this.conditions.find((item) => item.iData.type === conditionType && item.iData.linkedItem === pathType);
                if (conditionItem) {
                    U.LOG({conditionItem, "ACTOR": this.fullLogReport}, `... ... [updateConditionLinks: ${pathType}] Linking ${conditionType} Condition ...`, this.name);
                    await conditionItem.update({"data.linkedItem": pathItem.id});
                    pathUpdateData[`data.conditions.${conditionType}`] = conditionItem.id;
                }
            }
            U.LOG({pathUpdateData, "ACTOR": this.fullLogReport}, `... ... [updateConditionLinks: ${pathType}] Conditions Linked! Updating ${U.TCase(pathType)} Path Data ...`, this.name);
            await pathItem.update(pathUpdateData);
            U.LOG({pathUpdateData, "ACTOR": this.fullLogReport}, `... ... [updateConditionLinks: ${pathType}] Path Updated!`, this.name);
        }
    }

    async updatePantheon(pantheon) {
        if (pantheon === true || (pantheon && pantheon !== this.data.data.pantheon)) {
            const updateData = {};
            pantheon = (pantheon && pantheon in SCION.PANTHEONS) ? pantheon : this.data.data.pantheon;
            const panthPath = this.paths.find((path) => path.data.data.type === "pantheon");
            const newSkills = Object.assign([], panthPath.data.data.skills, SCION.PANTHEONS[pantheon].assetSkills);
            updateData["data.skills"] = newSkills;
            U.LOG({pantheon, panthPath, updateData, "ACTOR": this.fullLogReport}, "... ... [updatePantheon] Updating Pantheon Path Skills ...", this.name);
            await panthPath.update(updateData);
            U.LOG({pantheon, panthPath, updateData, "ACTOR": this.fullLogReport}, "... ... [updatePantheon] Pantheon Path Updated, Proceeding to Update Skills ...", this.name);
            await this.updateSkills();
        }
    }

    async updateSkills() {
        const derivedSkills = U.Clone(this.derivedSkillVals);
        const purchasedSkills = duplicate(this.purchasedSkillVals);
        let spilloverDots = 0;
        for (const [skill, value] of Object.entries(derivedSkills))
            if (value > 5) {
                spilloverDots += value - 5;
                derivedSkills[skill] = 5;
                purchasedSkills[skill] -= value - 5;
            }
        const updateValsParts = [
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
        ];
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
            updateValsParts,
            updateVals,
            "ACTOR": this.fullLogReport
        }, "... ... ... [updateSkills] Updating Actor Skills ...", this.name);
        await this.update(updateVals);
        U.LOG({
            actorSkills: this.skills,
            actorSkillVals: this.realSkillVals,
            pathSkills: this.pathSkills,
            derivedSkillVals: this.derivedSkillVals,
            spilloverDots,
            updateVals,
            "ACTOR": this.fullLogReport
        }, "... ... ... [updateSkills] Skills Updated! DONE!", this.name);
    }

    get skills() { return this.data.data.skills.list }
    get paths() { return this.items.filter((item) => item.type === "path") }
    get conditions() { return this.items.filter((item) => item.type === "condition") }
    get originPath() { return this.paths.find((item) => item.data.data.type === "origin") }
    get originPathConditions() { return U.KeyMapObj(this.originPath.iData.conditions, (id) => this.conditions.find((condition) => condition.id === id)) }
    get rolePath() { return this.paths.find((item) => item.data.data.type === "role") }
    get rolePathConditions() { return U.KeyMapObj(this.rolePath.iData.conditions, (id) => this.conditions.find((condition) => condition.id === id)) }
    get pantheonPath() { return this.paths.find((item) => item.data.data.type === "pantheon") }
    get pantheonPathConditions() { return U.KeyMapObj(this.pantheonPath.iData.conditions, (id) => this.conditions.find((condition) => condition.id === id)) }
    get pathConditions() { return {origin: this.originPathConditions, role: this.rolePathConditions, pantheon: this.pantheonPathConditions} }
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

    get fullLogReport() {
        return U.Clone({
            "this ScionActor": this,
            "... data": this.data,
            ".*. aData": U.Clone(this.aData),
            ".*. items": U.Clone(this.data.items),
            ".*. skills": U.Clone(this.skills),
            ".*. paths": U.Clone(this.paths),
            ".*. conditions": U.Clone(this.conditions)
        });
    }
}