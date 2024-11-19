export function getInitialBoosts(actor: ActorPF2e): number {
    return getAncestryBoosts(actor) + getIntelligenceBoostAtLevel(actor, 1) + getClassBoosts(actor) + getBackgroundBoosts(actor);
}

function getAncestryBoosts(actor: ActorPF2e): number {
    const ancestry = actor.items.find((i) => i.type === "ancestry") as AncestryPF2e;

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

function getIntelligenceBoostAtLevel(actor: ActorPF2e, level: number): number {
    const boosts = actor.system.build.attributes.boosts;
    let totalBoosts = 0;

    totalBoosts += boosts[level].includes("int") ? 1 : 0;

    return totalBoosts;
}

function getClassBoosts(actor: ActorPF2e): number {
    const classItem = actor.items.find((i) => i.type === "class") as ClassPF2e;

    if (!classItem) {
        return 0;
    }

    let availableSkillBoosts = classItem.system.trainedSkills.additional;

    if (classItem.system.keyAbility.value.length == 1) {
        availableSkillBoosts += classItem.system.keyAbility.value[0] == "int" ? 1 : 0;
    } else {
        availableSkillBoosts += classItem.system.keyAbility.selected == "int" ? 1 : 0;
    }

    return availableSkillBoosts;
}

export function getBackgroundBoosts(actor: ActorPF2e): number {
    const background = actor.items.find((i) => i.type === "background") as BackgroundPF2e;

    if (!background) {
        return 0;
    }

    let totalBoosts = 0;

    for (const level in background.system.boosts) {
        totalBoosts += background.system.boosts[level].selected == "int" ? 1 : 0;
    }

    return totalBoosts;
}

export function getSkillIncreaseLevels(actor: ActorPF2e): number[] {
    const classItem = actor.class;

    if (!classItem) {
        return [];
    }

    return classItem.system.skillIncreaseLevels.value;
}

export function getLevel(actor: ActorPF2e): number {
    return actor.system.details.level.value;
}
