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

    private getRankAtLevel(skill: string, level: number): number {
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
        const rank = this.getRankAtSelectedLevel(skill) + 1;
        levelBoosts.selected[skill] = { rank, locked: false };

        this.skillBoosts.set(this.selectedLevel, levelBoosts);
    }

    removeRank(skill: string): void {
        const levelBoosts = this.skillBoosts.get(this.selectedLevel);
        if (!levelBoosts || !levelBoosts.selected[skill]) return;

        delete levelBoosts.selected[skill];
    }

    preloadSkills(actor: ActorPF2e): void {
        //todo: refactor this to use the new data model
        const persistedSkills = getPersistedData(actor);
        const preselectedSkills = resolvePreselectedSkills(actor);
        const skillProgression = computeSkillProgression(actor);

        preselectedSkills.forEach((skill, level) => {
            const levelBoosts = skillProgression.get(level) || { available: 0, additional: 0, selected: {} };
            levelBoosts.additional = skill.additional;
            levelBoosts.selected = skill.selected;
            if (skill.additional > 0) {
                skillProgression.set(level, levelBoosts);
            }
        });

        this.skillBoosts = new Map([...skillProgression.entries()].sort((a, b) => a[0] - b[0]));
    }

    getLevels(): number[] {
        return Array.from(this.skillBoosts.keys());
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

        if (skillSelection) {
            return false;
        }

        return this.getTotalSkillBoostsAtLevel() <= 0;
    }
}

export { SkillBoost, SkillBoostManager, SkillBoosts };
