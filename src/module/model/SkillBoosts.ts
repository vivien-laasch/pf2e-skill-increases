import { CharacterPF2e } from "foundry-pf2e";
import { getPersistedData } from "../util/persistence";
import { resolvePreselectedSkills } from "../util/preselected";
import { computeSkillProgression, getMaxProficiencyAtLevel } from "../util/skills";

interface SkillBoost {
    rank: number;
    locked: boolean;
    additional?: boolean;
}

class SkillBoosts {
    skillBoosts: Map<number, Level>;

    constructor(actor: CharacterPF2e) {
        const persistedSkills = getPersistedData(actor);
        const preselectedSkills = resolvePreselectedSkills(actor);
        const skillProgression = computeSkillProgression(actor);

        this.skillBoosts = new Map();

        const levels = Array.from(new Set([...preselectedSkills.keys(), ...skillProgression.keys()])).sort((a: number, b: number) => a - b);

        levels.forEach((level) => {
            const levelBoosts = new Level();

            const persisted = persistedSkills.get(level) || new Level();
            levelBoosts.selected = persisted.selected;

            const preselected = preselectedSkills.get(level) || new Level();
            levelBoosts.available += preselected.available;
            levelBoosts.additional += preselected.additional;
            for (const [skill, boost] of Object.entries(preselected.selected)) {
                levelBoosts.selected[skill] = boost;
                this.handleInitialSkillCollision(skill, levelBoosts, level);
            }

            const progression = skillProgression.get(level) || new Level();
            levelBoosts.available += progression.available;
            levelBoosts.additional += progression.additional;

            this.skillBoosts.set(level, levelBoosts);
        });
    }

    getLevel(level: number): Level {
        const test = this.skillBoosts.get(level) || new Level();
        return test;
    }

    getRankAtLevel(skill: string, level: number): number {
        let proficiencyRank = 0;

        for (const [skillBoostLevel, levelBoosts] of this.skillBoosts) {
            if (skillBoostLevel <= level && levelBoosts.selected[skill]) {
                proficiencyRank = Math.max(proficiencyRank, levelBoosts.selected[skill].rank);
            }
        }

        return proficiencyRank;
    }

    addRank(skill: string, level: number): void {
        const levelBoosts = this.getLevel(level) || new Level();
        if (levelBoosts.selected[skill]) {
            return;
        }
        if (this.getAdditional(level) > 0 && this.getRankAtLevel(skill, level) == 0) {
            levelBoosts.selected[skill] = { rank: 1, locked: false, additional: true };
        } else if (this.getAvailable(level) > 0) {
            const rank = this.getRankAtLevel(skill, level) + 1;
            levelBoosts.selected[skill] = { rank, locked: false };
        }

        this.skillBoosts.set(level, levelBoosts);
        this.handleSkillCollision(skill, levelBoosts, level);
    }

    removeRank(skill: string, level: number): void {
        const levelBoosts = this.getLevel(level);
        if (!levelBoosts || !levelBoosts.selected[skill]) return;

        this.handleSkillCollision(skill, levelBoosts, level, true);
        delete levelBoosts.selected[skill];
    }

    resetSelection(): void {
        this.skillBoosts.forEach((levelBoosts) => {
            const unlockedSkills = Object.keys(levelBoosts.selected).filter((skill) => !levelBoosts.selected[skill].locked);
            unlockedSkills.forEach((skill) => delete levelBoosts.selected[skill]);
        });
    }

    getLevels(): number[] {
        return [...this.skillBoosts.entries()].filter(([, boosts]) => boosts.available > 0 || boosts.additional > 0).map(([level]) => level);
    }

    isSkillLocked(skill: string, level: number): boolean {
        return this.getLevel(level).selected[skill]?.locked || false;
    }

    isDisabled(skill: string, rank: number, level: number): boolean {
        if (rank > getMaxProficiencyAtLevel(level)) {
            return true;
        }

        if (rank <= this.getRankAtLevel(skill, level - 1)) {
            return true;
        }

        const skillSelection = this.getLevel(level).selected[skill];

        if (skillSelection && skillSelection.locked) {
            return true;
        }

        if (skillSelection && skillSelection.rank == rank) {
            return false;
        }

        if (this.getAvailable(level) > 0) {
            return false;
        }

        if (this.getAdditional(level) > 0 && rank == 1) {
            return false;
        }
        return true;
    }

    getTotal(level: number): number {
        const levelBoosts = this.getLevel(level);
        const selected = Object.values(levelBoosts.selected).filter((skill) => !skill.locked);
        return Math.max(levelBoosts.available + levelBoosts.additional - selected.length, 0);
    }

    getAvailable(level: number): number {
        return this.getLevel(level).getAvailable();
    }

    getAdditional(level: number): number {
        return this.getLevel(level).getAdditional();
    }

    isIllegal(level: number): boolean {
        const levelBoosts = this.getLevel(level);
        return levelBoosts.getSkillBoosts().filter((skill) => !skill.locked).length > levelBoosts.available + levelBoosts.additional;
    }

    private handleInitialSkillCollision(skill: string, levelBoosts: Level, level: number): void {
        for (const [prevLevel, prevBoosts] of this.skillBoosts) {
            if (prevLevel < level && prevBoosts.selected[skill] && prevBoosts.selected[skill].rank === levelBoosts.selected[skill].rank) {
                levelBoosts.additional += 1;
                break;
            }
        }
    }

    private handleSkillCollision(skill: string, currentLevelBoosts: Level, currentLevel: number, subtract?: boolean): void {
        for (const [level, boosts] of this.skillBoosts) {
            const skillBoost = boosts.selected[skill];
            if (skillBoost && level > currentLevel && skillBoost.rank === currentLevelBoosts.selected[skill].rank && skillBoost.locked) {
                if (subtract) {
                    boosts.additional = Math.max(0, boosts.additional - 1);
                    if (boosts.additional === 0) {
                        this.clearAdditional(boosts);
                    }
                } else {
                    boosts.additional += 1;
                }
                this.skillBoosts.set(level, boosts);
                break;
            }
        }
    }

    private clearAdditional(level: Level): void {
        for (const [skill, boost] of Object.entries(level.selected)) {
            if (boost.additional) {
                delete level.selected[skill];
            }
        }
    }
}

class Level {
    available = 0;
    additional = 0;
    selected = {} as Record<string, SkillBoost>;

    constructor({ available = 0, additional = 0, selected = {} }: { available?: number; additional?: number; selected?: Record<string, SkillBoost> } = {}) {
        this.available = available;
        this.additional = additional;
        this.selected = selected;
    }

    getAdditional(): number {
        return Math.max(0, this.additional - Object.values(this.selected).filter((skill) => !skill.locked && skill.additional).length);
    }

    getAvailable(): number {
        return Math.max(0, this.available - Object.values(this.selected).filter((skill) => !skill.locked && !skill.additional).length);
    }

    getSkillBoosts(): SkillBoost[] {
        return Object.values(this.selected);
    }
}

export { SkillBoost, SkillBoosts, Level };
