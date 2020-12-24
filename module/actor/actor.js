import { THROW } from "../data/utils.js";
import {_, U, SCION} from "../modules.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ScionActor extends Actor {
    // Getters: Data Retrieval
    get aData() { return this.data.data }
    get eData() { return this.aData }
    get subtype() { return this.aData.type }
    get ownedItems() { return this.data.items }

    prepareData() {
        super.prepareData();
        if (this.data.type === "major")
            setTimeout(() => this._prepareMajorCharData(), 100);
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
                if (Array.isArray(this.aData.callings)) {
                    itemCreationData.length = 0;
                    itemCreationData.push(...this.aData.callings);
                    await this.update({["data.callings"]: {}});
                }
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
        return true;
        const baseSkillVals = U.Clone(this.baseSkillVals);
        const assignedSkills = duplicate(this.assignedSkillVals);
        let spilloverDots = 0;
        for (const [skill, value] of Object.entries(baseSkillVals))
            if (value > 5) {
                spilloverDots += value - 5;
                baseSkillVals[skill] = 5;
                assignedSkills[skill] -= value - 5;
            }
        const updateValsParts = [
            U.KeyMapObj(
                diffObject(this.realSkillVals, baseSkillVals),
                (k) => `data.skills.list.${k}.value`,
                (v) => v
            ),
            U.KeyMapObj(
                diffObject(this.assignedSkillVals, assignedSkills),
                (k) => `data.skills.list.${k}.assigned`,
                (v) => v
            )
        ];
        const updateVals = Object.assign(
            U.KeyMapObj(
                diffObject(this.realSkillVals, baseSkillVals),
                (k) => `data.skills.list.${k}.value`,
                (v) => v
            ),
            U.KeyMapObj(
                diffObject(this.assignedSkillVals, assignedSkills),
                (k) => `data.skills.list.${k}.assigned`,
                (v) => v
            )
        );
        if (spilloverDots)
            updateVals["data.skills.unspentDots"] = this.data.data.skills.unspentDots + spilloverDots;
        U.LOG({
            actorSkills: this.skills,
            actorSkillVals: this.realSkillVals,
            pathSkills: this.pathSkills,
            derivedSkillVals: this.baseSkillVals,
            assignedSkills,
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
            derivedSkillVals: this.baseSkillVals,
            spilloverDots,
            updateVals,
            "ACTOR": this.fullLogReport
        }, "... ... ... [updateSkills] Skills Updated! DONE!", this.name);
    }

    getNewAttrs(attrChanges) { return U.KeyMapObj(this.realAttrVals, (v, k) => v + (attrChanges[k] ?? 0)) }

    checkAttributes() {
        return {unspentGeneralDots: 4, unspentArenaDots: {}, newAttrVals: {}};
        // 1) Sum ASSIGNED Dots for each Arena (if favored Approach has been chosen, subtract 2 here: will handle FA separately)
        // 2) For each Arena, subtract total from unspentDots of that arena FIRST, THEN from general dots.
        // 3) If General Dots is a negative number, must flag dots that are invalid
        //      Get overflow totals separately from each arena
        //      Mark HIGHEST dot attributes as invalid first, until overflow total accounted for
        //          Watch for Favored Approach here: Consider Favored Approach attributes to be two lower than they are for this comparison

        const convertGroupRef = (groupRef) => {
            if (["physical", "social", "mental"].includes(groupRef))
                return ["primary", "secondary", "tertiary"][this.aData.attributes.priorities.findIndex((v) => v === groupRef)];
            else if (["primary", "secondary", "tertiary"].includes(groupRef))
                return this.aData.attributes.priorities[{primary: 0, secondary: 1, tertiary: 2}[groupRef]];
            return U.THROW(groupRef, "ERROR: Invalid Attribute Group Reference");
        };
        const baseArenaDots = U.KeyMapObj(
            ["physical", "social", "mental"],
            (k, v) => v,
            (v) => SCION.ATTRIBUTES.priorities[convertGroupRef(v)].startingDots
        );
        const baseAttrDots = U.KeyMapObj(
            SCION.ATTRIBUTES.list,
            (v) => this.favoredAttrs.includes(v) ? 3 : 1
        );
        const assignedArenaDots = U.KeyMapObj(
            ["physical", "social", "mental"],
            (k, v) => v,
            (v) => SCION.ATTRIBUTES.arenas[v].reduce((tot, attr) => tot + Math.max(1, this.realAttrVals[attr] - (this.favoredAttrs.includes(attr) ? 2 : 0)) - 1, 0)
        );
        const assignedAttrDots = U.KeyMapObj(
            SCION.ATTRIBUTES.list,
            (v) => this.realAttrVals[v] - baseAttrDots[v]
        );
        const arenaDotsDelta = U.KeyMapObj(
            ["physical", "social", "mental"],
            (k, v) => v,
            (v) => baseArenaDots[v] - assignedArenaDots[v]
        );
        const totalGeneralDots = 2; // Object.values(this.aData.attributes.assignableGeneralDots).reduce((tot, val) => tot + val, 0);
        let unspentGeneralDots = totalGeneralDots;

        const getInvalidArena = () => _.sortBy(Object.keys(arenaDotsDelta).filter((v) => arenaDotsDelta[v] < 0), (v) => arenaDotsDelta[v])[0];

        const attrChanges = {};
        const unValidatedDots = U.Clone(assignedAttrDots);
        const iterLog = [];
        let invalidArena = getInvalidArena();
        while (invalidArena) {
            const subAttr = _.sortBy(Object.keys(_.pick(unValidatedDots, (v, k) => v > 0 && SCION.ATTRIBUTES.arenas[invalidArena].includes(k))), (v) => -1 * unValidatedDots[v] - (this.favoredAttrs.includes(v) ? 0.5 : 0))[0];
            unValidatedDots[subAttr]--;
            arenaDotsDelta[invalidArena]++;
            if (unspentGeneralDots > 0) {
                unspentGeneralDots--;
                iterLog.push(`- ${invalidArena}:${subAttr}. General Flex Dots ${unspentGeneralDots + 1} -> ${unspentGeneralDots}`);
            } else {
                attrChanges[subAttr] = (attrChanges[subAttr] || 0) - 1;
                iterLog.push(`- ${invalidArena}:${subAttr}. Invalidating Attribute Dot.`);
            }
            invalidArena = getInvalidArena();
        }
        const newAttrVals = this.getNewAttrs(attrChanges);
        const unspentArenaDots = _.pick(arenaDotsDelta, (v) => v > 0);
        U.LOG({
            totalGeneralDots,
            unspentGeneralDots,
            unspentArenaDots,
            attrChanges,
            newAttrVals,
            favApproach: this.favoredApproach,
            iterLog,
            returnVal: {unspentGeneralDots, unspentArenaDots, newAttrVals}
        }, "Update Attributes", this.name);
        return {unspentGeneralDots, unspentArenaDots, newAttrVals};
    }

    async updateAttributes(newAttrVals) {
        const attrDeltas = _.pick(newAttrVals, (v, k) => this.realAttrVals[k] !== v);
        if (isObjectEmpty(attrDeltas))
            return false;
        await this.update(U.KeyMapObj(
            attrDeltas,
            (k) => `data.attributes.list.${k}.value`,
            (v) => v
        ));
        return true;
    }

    /* #region GETTERS */
    // Basic Data Retrieval
    get paths() { return this.items.filter((item) => item.type === "path") }
    get skills() { return this.data.data.skills.list }
    get attributes() { return this.aData.attributes.list }
    get conditions() { return this.items.filter((item) => item.type === "condition") }

    /* #region Paths */
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
        const pathSkillVals = U.KeyMapObj(SCION.SKILLS.list, () => 0);
        duplicate(this.pathPriorities).reverse().forEach((pathType, i) => {
            this.pathSkills[pathType]?.forEach((skill) => {
                pathSkillVals[skill] += i + 1;
            });
        });
        return pathSkillVals;
    }
    /* #endregion */

    /* #region Skills & Specialties */
    get baseSkillVals() { return U.KeyMapObj(SCION.SKILLS.list, (v, k) => this.pathSkillVals[k]) }
    get assignedSkillVals() { return U.KeyMapObj(SCION.SKILLS.list, (v, k) => this.skills[k].assigned) }
    get derivedSkillVals() { return U.KeyMapObj(SCION.SKILLS.list, (v, k) => this.baseSkillVals[k] + this.assignedSkillVals[k]) }
    get skillVals() { return U.KeyMapObj(this.derivedSkillVals, (v) => Math.max(SCION.SKILLS.min, Math.min(v, SCION.SKILLS.max))) }
    get nonZeroSkillVals() { return _.pick(this.skillVals, (v) => v !== 0) }
    get skillValsCorrection() { return _.pick(U.KeyMapObj(this.skillVals, (v, k) => v - this.derivedSkillVals[k]), (v) => v !== 0) }
    get assignableSkillDots() { return Object.values(this.aData.skills.assignableDots).reduce((tot, val) => tot + val, 0) }
    get unassignedSkillDots() { return this.assignableSkillDots - Object.values(this.assignedSkillVals).reduce((tot, val) => tot + val, 0) }
    get specialties() {
        return U.KeyMapObj(this.skills, (data, skill) => {
            const theseSpecs = Object.values(data.specialties.list);
            const numSpecs = data.specialties.assigned + (this.skillVals[skill] >= 3 ? 1 : 0);
            while (theseSpecs.length < numSpecs)
                theseSpecs.push("");
            theseSpecs.length = numSpecs;
            return theseSpecs;
        });
    }
    get fullSkillReport() {
        return U.Clone({
            ".*. baseSkillVals": U.Clone(this.baseSkillVals),
            ".*. assignedSkillVals": U.Clone(this.assignedSkillVals),
            ".*. derivedSkillVals": U.Clone(this.derivedSkillVals),
            ".*. skillVals": U.Clone(this.skillVals),
            ".*. nonZeroSkillVals": U.Clone(this.nonZeroSkillVals),
            ".*. skillValsCorrection": U.Clone(this.skillValsCorrection),
            ".*. assignableSkillDots": U.Clone(this.assignableSkillDots),
            ".*. unassignedSkillDots": U.Clone(this.unassignedSkillDots),
            ".*. specialties": U.Clone(this.specialties)
        });
    }
    /* #endregion */

    /* #region Attributes */
    get favoredApproach() { return this.aData.attributes.favoredApproach }
    get favoredAttrs() { return this.favoredApproach ? SCION.ATTRIBUTES.approaches[this.favoredApproach] : [] }

    get baseAttrVals() { return U.KeyMapObj(SCION.ATTRIBUTES.list, (v, k) => this.favoredAttrs.includes(k) ? 3 : 1) }
    get assignedAttrVals() { return U.KeyMapObj(SCION.ATTRIBUTES.list, (v, k) => this.attributes[k].assigned) }
    get derivedAttrVals() { return U.KeyMapObj(SCION.ATTRIBUTES.list, (v, k) => this.baseAttrVals[k] + this.assignedAttrVals[k]) }
    get attrVals() { return U.KeyMapObj(this.derivedAttrVals, (v) => Math.max(SCION.ATTRIBUTES.min, Math.min(v, SCION.ATTRIBUTES.max))) }
    get attrValsCorrection() { return _.pick(U.KeyMapObj(this.attrVals, (v, k) => v - this.derivedAttrVals[k]), (v) => v !== 0) }

    get baseArenaDots() { return U.KeyMapObj(Object.values(SCION.ATTRIBUTES.priorities), (k) => this.aData.attributes.priorities[k], (v) => v.startingDots) }
    get assignableArenaAttrDots() { return U.KeyMapObj(Object.values(this.aData.attributes.assignableArenaDots), (k) => this.aData.attributes.priorities[k], (v) => v) }
    get assignedAttrDotsByArena() { return U.KeyMapObj(SCION.ATTRIBUTES.arenas, (attrs) => attrs.reduce((tot, attr) => tot + this.assignedAttrVals[attr], 0)) }
    get assignedArenaAttrDots() { return U.KeyMapObj(this.assignedAttrDotsByArena, (val, arena) => Math.min(val, this.assignableArenaAttrDots[arena])) }
    get unassignedArenaAttrDots() { return U.KeyMapObj(this.assignableArenaAttrDots, (val, arena) => val - this.assignedArenaAttrDots[arena]) }
    get assignableGeneralAttrDots() { return Object.values(this.aData.attributes.assignableGeneralDots).reduce((tot, val) => tot + val, 0) }
    get assignedGeneralAttrDots() { return Math.max(0, Object.values(this.assignedAttrVals).reduce((tot, val) => val + tot, 0) - Object.values(this.assignableArenaAttrDots).reduce((tot, val) => val + tot, 0)) }
    get unassignedGeneralAttrDots() { return this.assignableGeneralAttrDots - this.assignedGeneralAttrDots }

    get fullAttributeReport() {
        return U.Clone({
            ".*. favoredApproach": U.Clone(this.favoredApproach),
            ".*. favoredAttrs": U.Clone(this.favoredAttrs),
            ".*. baseAttrVals": U.Clone(this.baseAttrVals),
            ".*. assignedAttrVals": U.Clone(this.assignedAttrVals),
            ".*. derivedAttrVals": U.Clone(this.derivedAttrVals),
            ".*. attrVals": U.Clone(this.attrVals),
            ".*. attrValsCorrection": U.Clone(this.attrValsCorrection),
            ".*. baseArenaDots": U.Clone(this.baseArenaDots),
            ".*. assignableArenaAttrDots": U.Clone(this.assignableArenaAttrDots),
            ".*. assignedAttrDotsByArena": U.Clone(this.assignedAttrDotsByArena),
            ".*. assignedArenaAttrDots": U.Clone(this.assignedArenaAttrDots),
            ".*. unassignedArenaAttrDots": U.Clone(this.unassignedArenaAttrDots),
            ".*. assignableGeneralAttrDots": U.Clone(this.assignableGeneralAttrDots),
            ".*. assignedGeneralAttrDots": U.Clone(this.assignedGeneralAttrDots),
            ".*. unassignedGeneralAttrDots": U.Clone(this.unassignedGeneralAttrDots)
        });
    }
    /* #endregion */
    /* #endregion */

    get fullLogReport() {
        return U.Clone({
            "this ScionActor": this,
            "... data": this.data,
            ".*. aData": U.Clone(this.aData),
            ".*. items": U.Clone(this.data.items),
            ".*. paths": U.Clone(this.paths),
            ".*. conditions": U.Clone(this.conditions),
            "SKILL REPORT": this.fullSkillReport,
            "ATTRIBUTE REPORT": this.fullAttributeReport
        });
    }
}