import { AttributeString, CharacterPF2e } from "foundry-pf2e";

function hasKeyAttribute(actor: CharacterPF2e, attribute: AttributeString): boolean {
    return actor.keyAttribute === attribute;
}

function hasAncestryBoosts(actor: CharacterPF2e, attribute: AttributeString): boolean {
    const ancestry = actor.ancestry;

    if (!ancestry) {
        return false;
    }

    if (ancestry.system.alternateAncestryBoosts) {
        return Object.values(ancestry.system.alternateAncestryBoosts).includes(attribute);
    }

    return Object.values(ancestry.system.boosts).some((boost) => boost.selected === attribute);
}

function hasFlaw(actor: CharacterPF2e, attribute: AttributeString): boolean {
    const flaws = actor.system.build.attributes.flaws;

    if (!flaws) {
        return false;
    }

    return Object.values(flaws).some((flaw) => flaw.includes(attribute));
}

function hasBackgroundBoost(actor: CharacterPF2e, attribute: AttributeString): boolean {
    const background = actor.background;

    if (!background) {
        return false;
    }

    return Object.values(background.system.boosts).some((boost) => boost.selected === attribute);
}

function hasAttributeBoostAtLevel(actor: CharacterPF2e, attribute: AttributeString, level: number): boolean {
    const attributeBoosts = actor.system.build.attributes.boosts;
    return attributeBoosts[level as keyof typeof attributeBoosts]?.includes(attribute) || false;
}

function getLevelOneAttributeMod(actor: CharacterPF2e, attribute: AttributeString): number {
    return (
        [
            hasBackgroundBoost(actor, attribute),
            hasAncestryBoosts(actor, attribute),
            hasKeyAttribute(actor, attribute),
            hasAttributeBoostAtLevel(actor, attribute, 1),
        ].filter(Boolean).length - (hasFlaw(actor, attribute) ? 1 : 0)
    );
}

export function computeAttributeProgression(actor: CharacterPF2e, attribute: AttributeString, levelLimit: number): Map<number, number> {
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
