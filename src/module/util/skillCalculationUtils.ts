import { computeAttributeProgression } from "./attributeCalculationUtils";

function getClassSkillBoosts(actor: ActorPF2e): number {
    const classItem = actor.class;

    if (!classItem) {
        return 0;
    }

    return classItem.system.trainedSkills.additional;
}

export function computeSkillProgression(actor: ActorPF2e): Map<number, number> {
    const classItem = actor.class;
    const boosts = new Map<number, number>();

    if (!classItem) {
        return boosts;
    }
    const baseLevels = classItem.system.skillIncreaseLevels.value;
    const intProgression = computeAttributeProgression(actor, "int", getLevel(actor));
    const boostLevels = Array.from(new Set([...baseLevels, ...intProgression.keys()])).sort((a, b) => a - b);

    for (const level of boostLevels) {
        boosts.set(level, intProgression.has(level) ? 2 : 1);
    }

    boosts.set(1, (intProgression.get(1) || 0) + getClassSkillBoosts(actor));
    return boosts;
}

export function getLevel(actor: ActorPF2e): number {
    return actor.system.details.level.value;
}

export function maxProficiencyAtLevel(level: number): number {
    if (level == 1) {
        return 1;
    } else if (level < 7) {
        return 2;
    } else if (level < 15) {
        return 3;
    } else {
        return 4;
    }
}