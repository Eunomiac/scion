// import {THROW} from "../data/utils.js";
// import _$1 from "../external/underscore/underscore-esm-min.js";
import {_, U, SCION, MIX, MIXINS} from "../modules.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ScionActor extends Actor {
    // Getters: Data Retrieval
    get ent() { return typeof this.entity === "string" ? this : this.entity }
    get sht() { return this.ent.sheet }
    get eID() { return this.ent._id }
    get eData() { return this.ent.data.data }
    get subtype() { return this.eData.type }
    get sheetElem() {
        this._sheet = this._sheet ?? $(`[id$='${this.eID}']`)[0];
        return this._sheet;
    }
    get ownedItems() { return this.ent.data.items }
    get actor() { return super.actor ?? this }

    // get eData() { return this.data.data }
    // get subtype() { return this.eData.type }
    // get ownedItems() { return this.data.items }

    prepareData() {
        super.prepareData();
        // console.log({"ACTOR: THIS.ACTOR": this.actor});
        if (this.data.type === "major") {
            this._prepareMajorCharData();
        }
    }

    async _prepareMajorCharData() {
        if (!this.isPreparingCharData) {
            this.isPreparingCharData = true;
            // #region PREPARE BASE OWNED ITEMS
            const itemCreationData = [];

            /*
             * Find the first Path Item of each type, if it exists;
             * ... if it doesn't exist, add its creation data to pathData
             * ... if it does exist, increment data.pathSkillCount accordingly
             */

            ["origin", "role", "pantheon"].forEach((pathType) => {
                if (!this.ownedItems.find((item) => item.data.type === pathType)) {
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

            if (itemCreationData.length) {
                if (this.eData.testItemCreateData?.length) {
                    itemCreationData.length = 0;
                    itemCreationData.push(...this.eData.testItemCreateData);
                }
                U.LOG(U.IsDebug() && {itemCreationData, "ACTOR": this.fullLogReport}, "Item Creation Data Found: Creating Items", this.name);
                await this.createOwnedItem(itemCreationData);
                itemCreationData.length = 0;
                U.LOG(U.IsDebug() && {items: this.ownedItems, "ACTOR": this.fullLogReport}, "... Items Created; Updating Path Links ...", this.name);
                await this.updatePathConditionLinks();
                U.LOG(U.IsDebug() && {items: this.ownedItems, "ACTOR": this.fullLogReport}, "... Path Links Updated; Updating Pantheon ...", this.name);
                await this.updatePantheon(true);
                await this.update({["data.wasPantheonUpdated"]: true});
                U.LOG(U.IsDebug() && {"eData.pantheon": this.data.data.pantheon, "ACTOR": this.fullLogReport}, "... Pantheon Updated: DONE!", this.name);
            } else if (!this.eData.wasPantheonUpdated) {
                U.LOG(U.IsDebug() && {
                    "eData.pantheon": this.data.data.pantheon,
                    "this.eData.wasPantheonUpdated": this.data.data.wasPantheonUpdated,
                    "ACTOR": this.fullLogReport
                }, "Pantheon NOT Updated: Updating Pantheon...", this.name);
                await this.updatePantheon(true);
                await this.update({["data.wasPantheonUpdated"]: true});
                U.LOG(U.IsDebug() && {
                    "eData.pantheon": this.data.data.pantheon,
                    "this.eData.wasPantheonUpdated": this.eData.wasPantheonUpdated,
                    "ACTOR": this.fullLogReport
                }, "... Pantheon Updated: DONE!", this.name);
            }
            await this.updateTraits();
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
                const conditionItem = this.conditions.find((item) => item.eData.type === conditionType && item.eData.linkedItem === pathType);
                if (conditionItem) {
                    U.LOG(U.IsDebug() && {conditionItem, "ACTOR": this.fullLogReport}, `... ... [updateConditionLinks: ${pathType}] Linking ${conditionType} Condition ...`, this.name);
                    await conditionItem.update({"data.linkedItem": pathItem.id});
                    pathUpdateData[`data.conditions.${conditionType}`] = conditionItem.id;
                }
            }
            U.LOG(U.IsDebug() && {pathUpdateData, "ACTOR": this.fullLogReport}, `... ... [updateConditionLinks: ${pathType}] Conditions Linked! Updating ${U.TCase(pathType)} Path Data ...`, this.name);
            await pathItem.update(pathUpdateData);
            U.LOG(U.IsDebug() && {pathUpdateData, "ACTOR": this.fullLogReport}, `... ... [updateConditionLinks: ${pathType}] Path Updated!`, this.name);
        }
    }

    async updatePantheon(pantheon) {
        if (pantheon === true || (pantheon && pantheon !== this.data.data.pantheon)) {
            const updateData = {};
            pantheon = pantheon && pantheon in SCION.PANTHEONS ? pantheon : this.data.data.pantheon;
            const panthPath = this.paths.find((path) => path.data.data.type === "pantheon");
            const newSkills = Object.assign([], panthPath.data.data.skills, SCION.PANTHEONS[pantheon].assetSkills);
            updateData["data.skills"] = newSkills;
            U.LOG(U.IsDebug() && {pantheon, panthPath, updateData, "ACTOR": this.fullLogReport}, "... ... [updatePantheon] Updating Pantheon Path Skills ...", this.name);
            await panthPath.update(updateData);
            U.LOG(U.IsDebug() && {pantheon, panthPath, updateData, "ACTOR": this.fullLogReport}, "... ... [updatePantheon] Pantheon Path Updated, Proceeding to Update Skills ...", this.name);
            await this.updateTraits();
        }
    }

    async writeUpdates() {
        const data = U.Clone(this.eData);
        await this.update({data});
        return true;
    }

    queueSkillValsUpdate(newAssignedSkillVals = this.skillsCorrection) {
        for (const [skill, value] of Object.entries(newAssignedSkillVals)) {
            this.eData.skills.list[skill].assigned = value;
        }
        // this.queueUpdateData(U.KeyMapObj(
        //     newAssignedSkillVals,
        //     (skill) => `data.skills.list.${skill}.assigned`,
        //     (val) => val
        // ));
    }
    queueAttrValsUpdate(newAssignedAttrVals = this.attributesCorrection) {
        for (const [attribute, value] of Object.entries(newAssignedAttrVals)) {
            this.eData.attributes.list[attribute].assigned = value;
        }
        // this.queueUpdateData(U.KeyMapObj(
        //     newAssignedAttrVals,
        //     (attribute) => `data.attributes.list.${attribute}.assigned`,
        //     (val) => val
        // ));
    }

    async updateTraits() {
        this.queueSkillValsUpdate();
        this.queueAttrValsUpdate();
        await this.writeUpdates();
        // await this.processUpdateQueue();
        return true;
    }

    getKnacksValue(knacks) { return knacks.reduce((tot, knack) => tot + (knack.tier === "immortal" ? 2 : 1), 0) }
    getAvailableCallingKnacks(calling) {
        return _.groupBy(
            Object.keys(SCION.KNACKS.list).
                filter((knack) => SCION.KNACKS.list[knack].calling === calling),
            (knack) => SCION.KNACKS.list[knack].tier
        );
    }
    getAssignedCallingKnacks(calling) { return this.knacks.filter((knack) => knack.assignment === calling) }
    
    /* #region GETTERS */
    // #region Basic Data Retrieval
    get paths() { return this.items.filter((item) => item.type === "path") }
    get skills() { return this.data.data.skills.list }
    get attributes() { return this.eData.attributes.list }
    get callings() {
        return U.KeyMapObj(_.pick(this.eData.callings.list, (callingData) => (callingData?.name ?? "") in SCION.CALLINGS.list && Number.isInteger(callingData?.slot)), (calling, name) => (
            {
                ...calling,
                knacks: this.getAssignedCallingKnacks(calling.name),
                availableKnacks: this.getAvailableCallingKnacks(name),
                keywords: U.Loc(`scion.calling.${name}.keywords`).split(/, /gu),
                areKnacksFull: this.getKnacksValue(this.getAssignedCallingKnacks(calling.name)) >= calling.value,
                areKeywordsFull: calling.keywordsChosen.length >= calling.value
            }
        ));
    }
    get knacks() { return this.eData.knacks.list }
    get conditions() { return this.items.filter((item) => item.type === "condition") }
    // #endregion

    // #region Paths
    get originPath() { return this.paths.find((item) => item.data.data.type === "origin") }
    get originPathConditions() { return U.KeyMapObj(this.originPath.eData.conditions, (id) => this.conditions.find((condition) => condition.id === id)) }
    get rolePath() { return this.paths.find((item) => item.data.data.type === "role") }
    get rolePathConditions() { return U.KeyMapObj(this.rolePath.eData.conditions, (id) => this.conditions.find((condition) => condition.id === id)) }
    get pantheonPath() { return this.paths.find((item) => item.data.data.type === "pantheon") }
    get pantheonPathConditions() { return U.KeyMapObj(this.pantheonPath.eData.conditions, (id) => this.conditions.find((condition) => condition.id === id)) }
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
    // #endregion

    // #region Skills & Specialties
    get baseSkillVals() { return U.KeyMapObj(SCION.SKILLS.list, (v, k) => this.pathSkillVals[k]) }
    get assignedSkillVals() { return U.KeyMapObj(SCION.SKILLS.list, (v, k) => this.skills[k].assigned) }
    get derivedSkillVals() { return U.KeyMapObj(SCION.SKILLS.list, (v, k) => this.baseSkillVals[k] + this.assignedSkillVals[k]) }
    get skillVals() { return U.KeyMapObj(this.derivedSkillVals, (v) => Math.max(SCION.SKILLS.min, Math.min(v, SCION.SKILLS.max))) }
    get nonZeroSkillVals() { return _.pick(this.skillVals, (v) => v !== 0) }
    get assignableSkillDots() { return U.SumVals(this.eData.skills.assignableDots) }
    get unassignedSkillDots() { return Math.max(0, this.assignableSkillDots - U.SumVals(this.assignedSkillVals)) }
    get specialties() {
        return U.KeyMapObj(this.skills, (data, skill) => {
            const theseSpecs = Object.values(data.specialties.list);
            const numSpecs = data.specialties.assigned + (this.skillVals[skill] >= 3 ? 1 : 0);
            while (theseSpecs.length < numSpecs) {theseSpecs.push("")}
            theseSpecs.length = numSpecs;
            return theseSpecs;
        });
    }

    get skillsCorrection() {
        const skillValsAboveMaxCorrection = U.KeyMapObj(this.derivedSkillVals, (val, skill) => val - this.skillVals[skill]);
        const clampedAssignedSkillVals = U.KeyMapObj(this.assignedSkillVals, (val, skill) => val - skillValsAboveMaxCorrection[skill]);
        const logClampedAssignedSkillVals = U.Clone(clampedAssignedSkillVals);
        let totalDotCorrection = Math.max(0, this.assignedSkillVals - this.assignableSkillDots - U.SumVals(skillValsAboveMaxCorrection));
        const iterLog = [];
        if (totalDotCorrection > 0) {
            do {
                const [[skill]] = _.sortBy(Object.entries(clampedAssignedSkillVals), (v) => -v[1] - (0.1 * this.skillVals[v[0]]));
                clampedAssignedSkillVals[skill]--;
                totalDotCorrection--;
                iterLog.push(`- ${skill} --> Reducing Assignment from ${clampedAssignedSkillVals[skill] + 1} to ${clampedAssignedSkillVals[skill]}`);
            } while (totalDotCorrection);
        }

        /*
         * U.LOG(U.IsDebug() && {
         *     skillVals: this.skillVals,
         *     skillValsAboveMaxCorrection,
         *     assignedSkillVals: this.assignedSkillVals,
         *     clampedAssignedSkillVals: logClampedAssignedSkillVals,
         *     newAssignedSkillVals: clampedAssignedSkillVals,
         *     iterLog
         * }, "Overassigned Skills Correction Log", this.name);
         */
        return clampedAssignedSkillVals;
    }
    get fullSkillReport() {
        return U.Clone({
            ".*. baseSkillVals": U.Clone(this.baseSkillVals),
            ".*. assignedSkillVals": U.Clone(this.assignedSkillVals),
            ".*. derivedSkillVals": U.Clone(this.derivedSkillVals),
            ".*. skillVals": U.Clone(this.skillVals),
            ".*. nonZeroSkillVals": U.Clone(this.nonZeroSkillVals),
            ".*. assignableSkillDots": U.Clone(this.assignableSkillDots),
            ".*. unassignedSkillDots": U.Clone(this.unassignedSkillDots),
            ".*. skillsCorrection": U.Clone(this.skillsCorrection),
            ".*. specialties": U.Clone(this.specialties)
        });
    }
    // #endregion

    // #region Attributes
    get favoredApproach() { return this.eData.attributes.favoredApproach }
    get favoredAttrs() { return this.favoredApproach ? SCION.ATTRIBUTES.approaches[this.favoredApproach] : [] }

    get baseAttrVals() { return U.KeyMapObj(SCION.ATTRIBUTES.list, (v, k) => (this.favoredAttrs.includes(k) ? 3 : 1)) }
    get assignedAttrVals() { return U.KeyMapObj(SCION.ATTRIBUTES.list, (v, k) => this.attributes[k].assigned) }
    get derivedAttrVals() { return U.KeyMapObj(SCION.ATTRIBUTES.list, (v, k) => this.baseAttrVals[k] + this.assignedAttrVals[k]) }
    get attrVals() { return U.KeyMapObj(this.derivedAttrVals, (v) => Math.max(SCION.ATTRIBUTES.min, Math.min(v, SCION.ATTRIBUTES.max))) }

    convertAttrGroup(groupRef) {
        if (Object.keys(SCION.ATTRIBUTES.arenas).includes(groupRef)) {return Object.keys(SCION.ATTRIBUTES.priorities)[this.eData.attributes.priorities.findIndex((arena) => arena === groupRef)]} else if (Object.keys(SCION.ATTRIBUTES.priorities).includes(groupRef)) {return this.eData.attributes.priorities[Object.keys(SCION.ATTRIBUTES.priorities).findIndex((priority) => priority === groupRef)]}
        return U.THROW(groupRef, "ERROR: Invalid Attribute Group Reference");
    }

    get totalAssignedDotsByArena() { return U.KeyMapObj(SCION.ATTRIBUTES.arenas, (attrs) => attrs.reduce((tot, attr) => tot + this.assignedAttrVals[attr], 0)) }
    get assignableArenaDots() { return U.KeyMapObj(this.eData.attributes.assignableArenaDots, (priority) => this.convertAttrGroup(priority), (v) => v) }
    get assignableGeneralAttrDots() { return U.SumVals(this.eData.attributes.assignableGeneralDots) }
    get assignedArenaAttrDots() { return U.KeyMapObj(this.totalAssignedDotsByArena, (val, arena) => Math.min(this.assignableArenaDots[arena], val)) }
    get assignedGeneralDotsByArena() { return U.KeyMapObj(this.totalAssignedDotsByArena, (val, arena) => Math.max(0, val - this.assignedArenaAttrDots[arena])) }
    get assignedGeneralAttrDots() { return U.SumVals(this.assignedGeneralDotsByArena) }
    get unassignedArenaAttrDots() { return U.KeyMapObj(this.assignableArenaDots, (val, arena) => Math.max(0, val - this.assignedArenaAttrDots[arena])) }
    get unassignedGeneralAttrDots() { return Math.max(0, this.assignableGeneralAttrDots - this.assignedGeneralAttrDots) }

    get attributesCorrection() {
        const attrValsAboveMaxCorrection = U.KeyMapObj(this.derivedAttrVals, (val, attribute) => val - this.attrVals[attribute]);
        const clampedAssignedAttrVals = U.KeyMapObj(this.assignedAttrVals, (val, attribute) => val - attrValsAboveMaxCorrection[attribute]);
        const arenaAssignedAttrVals = _.mapObject(_.groupBy(Object.entries(clampedAssignedAttrVals), (attrVal) => _.findKey(SCION.ATTRIBUTES.arenas, (arenaAttrs) => arenaAttrs.includes(attrVal[0]))), (v) => _.object(v));
        const logArenaAssignedAttrVals = U.Clone(arenaAssignedAttrVals);
        let totalDotCorrection = Math.max(0, this.assignedGeneralAttrDots - this.assignableGeneralAttrDots - U.SumVals(attrValsAboveMaxCorrection));
        const iterLog = [];
        if (totalDotCorrection > 0) {
            const getInvalidArena = () => _.sortBy(Object.entries(_.pick(_.mapObject(arenaAssignedAttrVals, (v) => U.SumVals(v)), (v) => v > 0)), (v) => -v[1])?.[0]?.[0] ?? false;
            do {
                const invalidArena = getInvalidArena();
                const [[attribute]] = _.sortBy(Object.entries(arenaAssignedAttrVals[invalidArena]), (v) => -v[1] - (this.favoredAttrs.includes(v[0]) ? 0.5 : 0));
                arenaAssignedAttrVals[invalidArena][attribute]--;
                totalDotCorrection--;
                iterLog.push(`- ${invalidArena}:${attribute} --> Reducing Assignment from ${arenaAssignedAttrVals[invalidArena][attribute] + 1} to ${arenaAssignedAttrVals[invalidArena][attribute]}`);
            } while (totalDotCorrection && getInvalidArena());
        }
        return Object.values(arenaAssignedAttrVals).reduce((obj, val) => Object.assign(obj, val), {});
    }

    get fullAttributeReport() {
        return U.Clone({
            ".*. favoredApproach": U.Clone(this.favoredApproach),
            ".*. favoredAttrs": U.Clone(this.favoredAttrs),
            ".*. baseAttrVals": U.Clone(this.baseAttrVals),
            ".*. assignedAttrVals": U.Clone(this.assignedAttrVals),
            ".*. derivedAttrVals": U.Clone(this.derivedAttrVals),
            ".*. attrVals": U.Clone(this.attrVals),
            ".*. totalAssignedDotsByArena": U.Clone(this.totalAssignedDotsByArena),
            ".*. assignableArenaDots": U.Clone(this.assignableArenaDots),
            ".*. assignableGeneralAttrDots": U.Clone(this.assignableGeneralAttrDots),
            ".*. assignedArenaAttrDots": U.Clone(this.assignedArenaAttrDots),
            ".*. assignedGeneralDotsByArena ": U.Clone(this.assignedGeneralDotsByArena ),
            ".*. assignedGeneralAttrDots": U.Clone(this.assignedGeneralAttrDots),
            ".*. unassignedArenaAttrDots": U.Clone(this.unassignedArenaAttrDots),
            ".*. unassignedGeneralAttrDots": U.Clone(this.unassignedGeneralAttrDots),
            ".*. overassignedAttrsCorrection": U.Clone(this.overassignedAttrsCorrection)
        });
    }
    // #endregion
    
    // #region Callings & Knacks
    get orderedCallings() {
        const callingsList = [null, null, null];
        for (const callingData of Object.values(this.callings)) {
            if (Number.isInteger(callingData.slot)) {
                callingsList[U.Int(callingData.slot)] = callingData.name;
            }
        }
        return callingsList;
    }
    get knackVals() { return U.KeyMapObj(this.knacks, (i, knack) => knack.name, (knack) => (SCION.KNACKS.list[knack.name].tier === "immortal" ? 2 : 1)) }
    get assignedKnacks() { return this.knacks.filter((knack) => Boolean(knack.assignment)) }
    get unassignedKnacks() { return this.knacks.filter((knack) => !knack.assignment) }
    get heroicKnacks() { return this.knacks.filter((knack) => SCION.KNACKS.list[knack.name].tier === "heroic") }
    get immortalKnacks() { return this.knacks.filter((knack) => SCION.KNACKS.list[knack.name].tier === "immortal") }
    get genericKnacks() { return this.knacks.filter((knack) => SCION.KNACKS.list[knack.name].calling === "any") }

    get assignableCallingDots() { return U.SumVals(this.eData.callings.assignableGeneralDots) }
    get unassignedCallingDots() { return Math.max(0, this.assignableCallingDots - Object.values(this.callings).reduce((tot, calling) => tot + calling.value - SCION.CALLINGS.min, 0)) }
    get assignableKnackDots() { 
        return {
            ...U.KeyMapObj(this.callings, (callingData) => callingData.value),
            extra: U.SumVals(this.eData.knacks.assignableExtraKnacks)
        };
    }
    get unassignedKnackDots() {
        return {
            ...U.KeyMapObj(this.callings, (callingData, calling) => Math.max(0, this.assignableKnackDots[calling] - callingData.knacks.reduce((tot, knack) => tot + this.knackVals[knack.name], 0)) ),
            extra: Math.max(0, this.assignableKnackDots.extra - this.unassignedKnacks.reduce((tot, knack) => tot + this.knackVals[knack.name], 0))
        };
    }

    get fullCallingsKnacksReport() {
        return U.Clone({
            ".*. callings": U.Clone(this.callings),
            ".*. knacks": U.Clone(this.knacks),
            ".*. knackVals": U.Clone(this.knackVals),
            ".*. orderedCallings": U.Clone(this.orderedCallings),
            ".*. assignedKnacks": U.Clone(this.assignedKnacks),
            ".*. unassignedKnacks": U.Clone(this.unassignedKnacks),
            ".*. heroicKnacks": U.Clone(this.heroicKnacks),
            ".*. immortalKnacks": U.Clone(this.immortalKnacks),
            ".*. genericKnacks": U.Clone(this.genericKnacks),
            ".*. assignableCallingDots": U.Clone(this.assignableCallingDots),
            ".*. unassignedCallingDots": U.Clone(this.unassignedCallingDots),
            ".*. assignableKnackDots": U.Clone(this.assignableKnackDots ),
            ".*. unassignedKnackDots": U.Clone(this.unassignedKnackDots)
        });
    }
    // #endregion
    
    
    /* #endregion */

    get fullLogReport() {
        return U.Clone({
            "this ScionActor": this,
            "... data": this.data,
            ".*. eData": U.Clone(this.eData),
            ".*. items": U.Clone(this.data.items),
            ".*. paths": U.Clone(this.paths),
            ".*. conditions": U.Clone(this.conditions),
            "SKILL REPORT": this.fullSkillReport,
            "ATTRIBUTE REPORT": this.fullAttributeReport,
            "CALLINGS & KNACKS REPORT": this.fullCallingsKnacksReport
        });
    }
}