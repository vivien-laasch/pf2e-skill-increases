import { MODULE_ID } from "../constants";
import { SkillBoosts, SkillBoost } from "../model/SkillBoostManager";

export async function persistData(actor: ActorPF2e, skillBoosts: SkillBoosts): Promise<void> {
    const serializedSkills = Object.fromEntries(
        [...skillBoosts].map(([level, boosts]) => {
            const selected = Object.fromEntries(Object.entries(boosts.selected).filter(([, boost]) => !boost.locked));
            return [level, { selected }];
        }),
    );
    await actor.unsetFlag(MODULE_ID, "selectedSkills");
    actor.setFlag(MODULE_ID, "selectedSkills", serializedSkills);
    applyBonuses(actor, skillBoosts);
}

export function getPersistedData(actor: ActorPF2e): SkillBoosts {
    const serializedSkills = actor.getFlag(MODULE_ID, "selectedSkills") as Record<string, { selected: Record<string, SkillBoost> }>;
    if (!serializedSkills) return new Map();

    return new Map(Object.entries(serializedSkills).map(([level, { selected }]) => [parseInt(level), { available: 0, additional: 0, selected }]));
}

async function applyBonuses(actor: ActorPF2e, skillBoosts: SkillBoosts): Promise<void> {
    const updates: Record<string, number> = {};

    for (const skill of Object.values(actor.skills)) {
        const rank = upgradeProficiency(skill, skillBoosts);
        updates[`system.skills.${skill.slug}.rank`] = rank;
    }

    await actor.update(updates);
}

function upgradeProficiency(skill: SkillPF2e, skillBoosts: SkillBoosts): number {
    let maxRank = 0;

    for (const [, boosts] of skillBoosts) {
        if (boosts.selected[skill.slug]) {
            maxRank = Math.max(maxRank, boosts.selected[skill.slug].rank);
        }
    }

    return maxRank;
}
