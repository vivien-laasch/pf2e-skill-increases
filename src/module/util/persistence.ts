import { CharacterPF2e, CharacterSkill } from "foundry-pf2e";
import { MODULE_ID } from "../constants";
import { Level, SkillBoost } from "../model/SkillBoosts";

export async function persistData(actor: CharacterPF2e, skillBoosts: Map<number, Level>): Promise<void> {
    const serializedSkills = Object.fromEntries(
        [...skillBoosts]
            .filter(([level]) => level <= actor.level)
            .map(([level, boosts]) => {
                const selected = Object.fromEntries(Object.entries(boosts.selected).filter(([, boost]) => !boost.locked));
                return [level, { selected }];
            }),
    );
    await actor.unsetFlag(MODULE_ID, "selectedSkills");
    actor.setFlag(MODULE_ID, "selectedSkills", serializedSkills);
    applyBonuses(actor, skillBoosts);
}

export function getPersistedData(actor: CharacterPF2e): Map<number, Level> {
    const serializedSkills = actor.getFlag(MODULE_ID, "selectedSkills") as Record<string, { selected: Record<string, SkillBoost> }>;
    if (!serializedSkills) return new Map();

    return new Map(Object.entries(serializedSkills).map(([level, { selected }]) => [parseInt(level), new Level({ selected: selected })]));
}

async function applyBonuses(actor: CharacterPF2e, skillBoosts: Map<number, Level>): Promise<void> {
    const updates: Record<string, number> = {};

    for (const skill of Object.values(actor.skills)) {
        const maxRank = upgradeProficiency(skill, skillBoosts, actor);
        updates[`system.skills.${skill.slug}.rank`] = maxRank;
    }

    await actor.update(updates);
}

function upgradeProficiency(skill: CharacterSkill<CharacterPF2e>, skillBoosts: Map<number, Level>, actor: CharacterPF2e): number {
    let maxRank = 0;

    for (const [level, boosts] of skillBoosts) {
        if (level > actor.level) continue;
        if (boosts.selected[skill.slug]) {
            maxRank = Math.max(maxRank, boosts.selected[skill.slug].rank);
        }
    }

    return maxRank;
}
