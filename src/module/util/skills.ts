import { CharacterPF2e } from "foundry-pf2e";
import { Level } from "../model/SkillBoosts";
import { computeAttributeProgression } from "./attributes";

function getClassSkillBoosts(actor: CharacterPF2e): number {
    const classItem = actor.class;

    if (!classItem) {
        return 0;
    }

    return classItem.system.trainedSkills.additional;
}

export function computeSkillProgression(actor: CharacterPF2e): Map<number, Level> {
    const classItem = actor.class;
    const boosts = new Map();

    if (!classItem) {
        return boosts;
    }
    const baseLevels = classItem.system.skillIncreaseLevels.value;
    const intProgression = computeAttributeProgression(actor, "int", actor.level);
    const boostLevels = Array.from(new Set([...baseLevels, ...intProgression.keys()])).sort((a, b) => a - b);

    boostLevels.forEach((level) => {
        boosts.set(
            level,
            new Level({
                available: baseLevels.includes(level) ? 1 : 0,
                additional: intProgression.has(level) ? 1 : 0,
            }),
        );
    });

    boosts.set(1, new Level({ available: (intProgression.get(1) || 0) + getClassSkillBoosts(actor) }));
    return boosts;
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
