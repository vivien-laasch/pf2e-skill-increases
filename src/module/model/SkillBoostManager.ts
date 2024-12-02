import { getPersistedData } from "../util/persistenceUtils";
import { resolvePreselectedSkills } from "../util/preselectedSkillsUtil";
import { computeSkillProgression, getMaxProficiencyAtLevel } from "../util/skillCalculationUtils";

type SkillBoosts = Map<
    number,
    {
        available: number;
        additional: number;
        selected: Record<string, SkillBoost>;
    }
>;

interface SkillBoost {
    rank: number;
    locked: boolean;
    additional?: boolean;
}

class SkillBoostManager {
    skillBoosts: SkillBoosts;
    selectedLevel: number = 1;

    constructor(initialData?: SkillBoosts) {
        this.skillBoosts = initialData || new Map();
    }

    getSkillBoostsAtSelectedLevel(): { available: number; additional: number; selected: Record<string, SkillBoost> } {
        return this.skillBoosts.get(this.selectedLevel) || { available: 0, additional: 0, selected: {} };
    }

    getRankAtSelectedLevel(skill: string): number {
        return this.getRankAtLevel(skill, this.selectedLevel);
    }

    getRankAtLevel(skill: string, level: number): number {
        let proficiencyRank = 0;

        for (const [skillBoostLevel, boosts] of this.skillBoosts) {
            if (skillBoostLevel <= level && boosts.selected[skill]) {
                proficiencyRank = Math.max(proficiencyRank, boosts.selected[skill].rank);
            }
        }

        return proficiencyRank;
    }

    addRank(skill: string): void {
        const levelBoosts = this.skillBoosts.get(this.selectedLevel) || { available: 0, additional: 0, selected: {} };
        if (levelBoosts.selected[skill]) {
            return;
        }
        if (this.getAdditionalSkillBoosts() > 0 && this.getRankAtSelectedLevel(skill) == 0) {
            levelBoosts.selected[skill] = { rank: 1, locked: false, additional: true };
        } else if (this.getAvailableSkillBoosts() > 0) {
            const rank = this.getRankAtSelectedLevel(skill) + 1;
            levelBoosts.selected[skill] = { rank, locked: false };
        }

        this.updateAdditionalSkills(skill);

        this.skillBoosts.set(this.selectedLevel, levelBoosts);
    }

    removeRank(skill: string): void {
        const levelBoosts = this.skillBoosts.get(this.selectedLevel);
        if (!levelBoosts || !levelBoosts.selected[skill]) return;

        delete levelBoosts.selected[skill];
    }

    initialize(actor: ActorPF2e): void {
        const persistedSkills = getPersistedData(actor);
        const preselectedSkills = resolvePreselectedSkills(actor);
        const skillProgression = computeSkillProgression(actor);

        preselectedSkills.forEach((skill, level) => {
            const levelBoosts = skillProgression.get(level) || { available: 0, additional: 0, selected: {} };
            levelBoosts.additional = skill.additional;
            levelBoosts.selected = skill.selected;
            skillProgression.set(level, levelBoosts);
        });

        persistedSkills.forEach((boosts, level) => {
            const levelBoosts = skillProgression.get(level) || { available: 0, additional: 0, selected: {} };
            for (const [skill, boost] of Object.entries(boosts.selected)) {
                if (!levelBoosts.selected[skill]) {
                    levelBoosts.selected[skill] = boost;
                }
                this.updateAdditionalSkills(skill);
            }
            skillProgression.set(level, levelBoosts);
        });

        this.skillBoosts = new Map([...skillProgression.entries()].sort((a, b) => a[0] - b[0]));
    }

    resetSelection(): void {
        const skillBoosts = new Map(this.skillBoosts);
        skillBoosts.forEach((levelBoosts) => {
            const unlockedSkills = Object.keys(levelBoosts.selected).filter((skill) => !levelBoosts.selected[skill].locked);
            unlockedSkills.forEach((skill) => delete levelBoosts.selected[skill]);
        });

        this.skillBoosts = skillBoosts;
    }

    getLevels(): number[] {
        return [...this.skillBoosts.entries()].filter(([, boosts]) => boosts.available > 0 || boosts.additional > 0).map(([level]) => level);
    }

    isSkillLocked(skill: string): boolean {
        return this.getSkillBoostsAtSelectedLevel().selected[skill]?.locked || false;
    }

    getTotalSkillBoostsAtLevel(): number {
        const levelBoosts = this.getSkillBoostsAtSelectedLevel();
        const selectedSkillsNotLocked = Object.values(levelBoosts.selected).filter((skill) => !skill.locked);
        return Math.max(levelBoosts.available + levelBoosts.additional - selectedSkillsNotLocked.length, 0);
    }

    isDisabled(skill: string, rank: number): boolean {
        if (rank > getMaxProficiencyAtLevel(this.selectedLevel)) {
            return true;
        }

        if (rank <= this.getRankAtLevel(skill, this.selectedLevel - 1)) {
            return true;
        }

        const skillSelection = this.getSkillBoostsAtSelectedLevel().selected[skill];

        if (skillSelection && skillSelection.locked) {
            return true;
        }

        if (skillSelection && skillSelection.rank == rank) {
            return false;
        }

        if (this.getAvailableSkillBoosts() > 0) {
            return false;
        }

        if (this.getAdditionalSkillBoosts() > 0 && rank == 1) {
            return false;
        }
        return true;
    }

    getAvailableSkillBoosts(): number {
        return Math.max(
            0,
            this.getSkillBoostsAtSelectedLevel().available -
                Object.values(this.getSkillBoostsAtSelectedLevel().selected).filter((skill) => !skill.locked && !skill.additional).length,
        );
    }

    getAdditionalSkillBoosts(): number {
        return Math.max(
            0,
            this.getSkillBoostsAtSelectedLevel().additional -
                Object.values(this.getSkillBoostsAtSelectedLevel().selected).filter((skill) => !skill.locked && skill.additional).length,
        );
    }

    updateAdditionalSkills(skill: string): void {
        //todo if a trained skill is later auto trained, grant additional skill on that level instead, remove if vice versa
    }
}

export { SkillBoost, SkillBoostManager, SkillBoosts };
