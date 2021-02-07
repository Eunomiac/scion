// import {THROW} from "../data/utils.js";
// import _$1 from "../external/underscore/underscore-esm-min";
import {_, U, SCION, MIX, MIXINS} from "../modules.js";

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export default class ScionActor extends MIX(Actor).with(MIXINS.Accessors, MIXINS.OwnedItemManager) {
    
    prepareData() {
        super.prepareData();
        if (this.data.type === "major") {
            this._prepareMajorCharData();
        }
    }

    async _prepareMajorCharData() {
        if (!this.isPreparingCharData && !CONFIG.isInitializing) {
            this.isPreparingCharData = true;
            if (!this.$data.wasPantheonUpdated) {
                await this.updatePantheon(true);
            }
            await this.updateTraits();
            this.isPreparingCharData = false;
            return true;
        }
        return false;
    }

    async updatePantheon(pantheon) {
        const updatePromises = [];
        if (pantheon === true || (pantheon && pantheon !== this.data.data.pantheon)) {
            pantheon = pantheon in SCION.PANTHEONS ? pantheon : this.data.data.pantheon;
            const panthPath = this.paths.find((path) => path.data.data.type === "pantheon");
            if (!panthPath) {
                return;
            }
            const newSkills = Object.assign([], panthPath.data.data.skills, SCION.PANTHEONS[pantheon].assetSkills);
            updatePromises.push(...[
                this.update({"data.wasPantheonUpdated": true}),
                panthPath.update({"data.skills": newSkills})
            ]);
            await Promise.all(updatePromises);
            await this.updateTraits();
        }
    }

    getSkillValsUpdate(newAssignedSkillVals = this.skillsCorrection) {
        return U.KeyMapObj(newAssignedSkillVals, (skill) => `data.skills.list.${skill}.assigned`, (value) => value);
    }
    getAttrValsUpdate(newAssignedAttrVals = this.attributesCorrection) {
        return U.KeyMapObj(newAssignedAttrVals, (attribute) => `data.attributes.list.${attribute}.assigned`, (value) => value);
    }

    async updateTraits() {
        const updateData = {
            ...this.getSkillValsUpdate(),
            ...this.getAttrValsUpdate()
        };
        await this.update(updateData);
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
    get paths() { return this.$items.filter((item) => item.$type === "path") }
    get skills() { return this.$data.skills.list }
    get attributes() { return this.$data.attributes.list }
    // get callings() { return this.$items.filter((item) => item.$type === "calling") }
    get callings() {
        return U.KeyMapObj(_.pick(this.$data.callings.list, (callingData) => (callingData?.name ?? "") in SCION.CALLINGS.list && Number.isInteger(callingData?.slot)), (calling, name) => (
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
    // get knacks() { return this.$items.filter((item) => item.$type === "knack") }
    get knacks() { return this.$data.knacks.list }
    get conditions() { return this.$items.filter((item) => item.type === "condition") }
    // #endregion

    // #region Paths
    get originPath() { return this.paths.find((item) => item.$subtype === "origin") }
    get originPathConditions() { return {pathSuspension: this.originPath.getSubItem("condition", "pathSuspension"), pathRevocation: this.originPath.getSubItem("condition", "pathRevocation")} }
    get rolePath() { return this.paths.find((item) => item.$subtype === "role") }
    get rolePathConditions() { return {pathSuspension: this.rolePath.getSubItem("condition", "pathSuspension"), pathRevocation: this.rolePath.getSubItem("condition", "pathRevocation")} }
    get pantheonPath() { return this.paths.find((item) => item.$subtype === "pantheon") }
    get pantheonPathConditions() { return {pathSuspension: this.pantheonPath.getSubItem("condition", "pathSuspension"), pathRevocation: this.pantheonPath.getSubItem("condition", "pathRevocation")} }
    get pathConditions() { return {origin: this.originPathConditions, role: this.rolePathConditions, pantheon: this.pantheonPathConditions} }
    get pathPriorities() { return this.$data.pathPriorities }
    get pathSkills() { return U.KeyMapObj(_.indexBy(this.paths, (item) => item.$subtype), (item) => item.$data.skills) }
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
    get assignableSkillDots() { return U.SumVals(this.$data.skills.assignableDots) }
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
    get favoredApproach() { return this.$data.attributes.favoredApproach }
    get favoredAttrs() { return this.favoredApproach ? SCION.ATTRIBUTES.approaches[this.favoredApproach] : [] }

    get baseAttrVals() { return U.KeyMapObj(SCION.ATTRIBUTES.list, (v, k) => (this.favoredAttrs.includes(k) ? 3 : 1)) }
    get assignedAttrVals() { return U.KeyMapObj(SCION.ATTRIBUTES.list, (v, k) => this.attributes[k].assigned) }
    get derivedAttrVals() { return U.KeyMapObj(SCION.ATTRIBUTES.list, (v, k) => this.baseAttrVals[k] + this.assignedAttrVals[k]) }
    get attrVals() { return U.KeyMapObj(this.derivedAttrVals, (v) => Math.max(SCION.ATTRIBUTES.min, Math.min(v, SCION.ATTRIBUTES.max))) }

    convertAttrGroup(groupRef) {
        if (Object.keys(SCION.ATTRIBUTES.arenas).includes(groupRef)) {return Object.keys(SCION.ATTRIBUTES.priorities)[this.$data.attributes.priorities.findIndex((arena) => arena === groupRef)]} else if (Object.keys(SCION.ATTRIBUTES.priorities).includes(groupRef)) {return this.$data.attributes.priorities[Object.keys(SCION.ATTRIBUTES.priorities).findIndex((priority) => priority === groupRef)]}
        return U.THROW(groupRef, "ERROR: Invalid Attribute Group Reference");
    }

    get totalAssignedDotsByArena() { return U.KeyMapObj(SCION.ATTRIBUTES.arenas, (attrs) => attrs.reduce((tot, attr) => tot + this.assignedAttrVals[attr], 0)) }
    get assignableArenaDots() { return U.KeyMapObj(this.$data.attributes.assignableArenaDots, (priority) => this.convertAttrGroup(priority), (v) => v) }
    get assignableGeneralAttrDots() { return U.SumVals(this.$data.attributes.assignableGeneralDots) }
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

    get assignableCallingDots() { return U.SumVals(this.$data.callings.assignableGeneralDots) }
    get unassignedCallingDots() { return Math.max(0, this.assignableCallingDots - Object.values(this.callings).reduce((tot, calling) => tot + calling.value - SCION.CALLINGS.min, 0)) }
    get assignableKnackDots() { 
        return {
            ...U.KeyMapObj(this.callings, (callingData) => callingData.value),
            extra: U.SumVals(this.$data.knacks.assignableExtraKnacks)
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
            ".*. $data": U.Clone(this.$data),
            ".*. items": U.Clone(this.data.items),
            ".*. paths": U.Clone(this.paths),
            ".*. conditions": U.Clone(this.conditions),
            "SKILL REPORT": this.fullSkillReport,
            "ATTRIBUTE REPORT": this.fullAttributeReport,
            "CALLINGS & KNACKS REPORT": this.fullCallingsKnacksReport
        });
    }
}