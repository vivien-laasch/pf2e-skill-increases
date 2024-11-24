import { SkillBoosts } from "../model/SkillBoostManager";
import { computeAttributeProgression } from "./attributeCalculationUtils";

function getClassSkillBoosts(actor: ActorPF2e): number {
    const classItem = actor.class;

    if (!classItem) {
        return 0;
    }

    return classItem.system.trainedSkills.additional;
}

export function computeSkillProgression(actor: ActorPF2e): SkillBoosts {
    const classItem = actor.class;
    const boosts = new Map();

    if (!classItem) {
        return boosts;
    }
    const baseLevels = classItem.system.skillIncreaseLevels.value;
    const intProgression = computeAttributeProgression(actor, "int", getLevel(actor));
    const boostLevels = Array.from(new Set([...baseLevels, ...intProgression.keys()])).sort((a, b) => a - b);

    boostLevels.forEach((level) => {
        boosts.set(level, {
            available: baseLevels.includes(level) ? 1 : 0,
            additional: intProgression.has(level) ? 1 : 0,
            selected: {},
        });
    });

    boosts.set(1, { available: (intProgression.get(1) || 0) + getClassSkillBoosts(actor), additional: 0, selected: {} });
    return boosts;
}

export function getLevel(actor: ActorPF2e): number {
    return actor.system.details.level.value;
}

export function getMaxProficiencyAtLevel(level: number): number {
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
