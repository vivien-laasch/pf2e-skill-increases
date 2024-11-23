function hasKeyAttribute(classItem: ClassPF2e, attribute: string): boolean {
    if (!classItem) {
        return false;
    }

    if (classItem.system.keyAbility.value.length == 1) {
        return classItem.system.keyAbility.value[0] === attribute;
    } else {
        return classItem.system.keyAbility.selected === attribute;
    }
}

function hasAncestryBoosts(actor: ActorPF2e, attribute: string): boolean {
    const ancestry = actor.ancestry;

    if (!ancestry) {
        return false;
    }

    return Object.values(ancestry.system.boosts).some((boost) => boost.selected === attribute);
}

function hasAncestryFlaw(actor: ActorPF2e, attribute: string): boolean {
    const ancestry = actor.ancestry;

    if (!ancestry) {
        return false;
    }

    return Object.values(ancestry.system.flaws).some((flaw) => flaw.value.includes(attribute));
}

function hasBackgroundBoost(actor: ActorPF2e, attribute: string): boolean {
    const background = actor.background;

    if (!background) {
        return false;
    }

    return Object.values(background.system.boosts).some((boost) => boost.selected === attribute);
}

function hasAttributeBoostAtLevel(actor: ActorPF2e, attribute: string, level: number): boolean {
    const attributeBoosts = actor.system.build.attributes.boosts;
    return attributeBoosts[level].includes(attribute);
}

function getLevelOneAttributeMod(actor: ActorPF2e, attribute: string): number {
    return (
        [
            hasBackgroundBoost(actor, attribute),
            hasAncestryBoosts(actor, attribute),
            hasKeyAttribute(actor.class, attribute),
            hasAttributeBoostAtLevel(actor, attribute, 1),
        ].filter(Boolean).length -
        //todo fix this
        (hasAncestryFlaw(actor, attribute) ? 1 : 0)
    );
}

export function computeAttributeProgression(actor: ActorPF2e, attribute: string, levelLimit: number): Map<number, number> {
    let modifier = getLevelOneAttributeMod(actor, attribute);
    let countNextBoost = modifier < 4;
    const boosts = new Map<number, number>();
    boosts.set(1, modifier);

    const applicableLevels = [5, 10, 15, 20].filter((l) => l <= levelLimit);

    applicableLevels.forEach((level) => {
        if (hasAttributeBoostAtLevel(actor, attribute, level)) {
            if (modifier < 4 || countNextBoost) {
                modifier++;
                boosts.set(level, modifier);
            }
            if (modifier >= 4) {
                countNextBoost = !countNextBoost;
            }
        }
    });

    return boosts;
}
