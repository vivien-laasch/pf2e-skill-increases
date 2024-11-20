function getInitialSkillBoosts(actor: ActorPF2e): number {
    return getLevelOneIntMod(actor) + getClassSkillBoosts(actor);
}

function getLevelOneIntMod(actor: ActorPF2e): number {
    return getAncestryIntMod(actor) + getClassIntMod(actor.class) + getBackgroundIntMod(actor) + getIntBoostAtLevel(actor, 1);
}

function getAncestryIntMod(actor: ActorPF2e): number {
    const ancestry = actor.ancestry;

    if (!ancestry) {
        return 0;
    }

    let totalBoosts = 0;

    for (const level in ancestry.system.boosts) {
        totalBoosts += ancestry.system.boosts[level].selected == "int" ? 1 : 0;
    }

    for (const level in ancestry.system.flaws) {
        totalBoosts -= ancestry.system.flaws[level].value.includes("int") ? 1 : 0;
    }

    return totalBoosts;
}

function getBackgroundIntMod(actor: ActorPF2e): number {
    const background = actor.background as BackgroundPF2e;

    if (!background) {
        return 0;
    }

    let totalBoosts = 0;

    for (const level in background.system.boosts) {
        totalBoosts += background.system.boosts[level].selected == "int" ? 1 : 0;
    }

    return totalBoosts;
}

function getClassIntMod(classItem: ClassPF2e): number {
    if (!classItem) {
        return 0;
    }

    if (classItem.system.keyAbility.value.length == 1) {
        return classItem.system.keyAbility.value[0] == "int" ? 1 : 0;
    } else {
        return classItem.system.keyAbility.selected == "int" ? 1 : 0;
    }
}

function getIntBoostAtLevel(actor: ActorPF2e, level: number): number {
    const attributeBoosts = actor.system.build.attributes.boosts;
    return attributeBoosts[level].includes("int") ? 1 : 0;
}

function getClassSkillBoosts(actor: ActorPF2e): number {
    const classItem = actor.class;

    if (!classItem) {
        return 0;
    }

    return getClassIntMod(classItem);
}

export function getSkillIncreaseLevels(actor: ActorPF2e): number[] {
    const classItem = actor.class;

    if (!classItem) {
        return [];
    }

    const levels = classItem.system.skillIncreaseLevels.value;
    const additional = calculateAdditionalSkillIncreases(actor);

    return Array.from(new Set(levels.concat(additional))).sort((a, b) => a - b);
}

export function getLevel(actor: ActorPF2e): number {
    return actor.system.details.level.value;
}

export function getAvailableSkillBoostsAtLevel(actor: ActorPF2e, level: number): number {
    if (level == 1) {
        return getInitialSkillBoosts(actor);
    }

    return calculateAdditionalSkillIncreases(actor).includes(level) ? 2 : 1;
}

function calculateAdditionalSkillIncreases(actor: ActorPF2e): number[] {
    const levels = [1];
    let intMod = getLevelOneIntMod(actor);
    let countNextBoost = intMod < 4;

    [5, 10, 15, 20].forEach((level) => {
        if (getIntBoostAtLevel(actor, level) != 0) {
            if (intMod < 4 || countNextBoost) {
                intMod++;
                levels.push(level);
            }
            if (intMod >= 4) {
                countNextBoost = !countNextBoost;
            }
        }
    });

    return levels;
}

export function maxProficiencyAtLevel(level: number): number {
    if (level < 7) {
        return 2;
    } else if (level < 15) {
        return 3;
    } else {
        return 4;
    }
}
