import { MODULE_ID } from "../constants";
import { SkillBoosts } from "../model/SkillBoostManager";

export async function persistData(actor: ActorPF2e, skillBoosts: SkillBoosts): Promise<void> {
    const serializedSkills = Object.fromEntries(skillBoosts);
    actor.setFlag(MODULE_ID, "selectedSkills", serializedSkills);
    applyBonuses(actor, skillBoosts);
}

export function getPersistedData(actor: ActorPF2e): Map<number, string[]> {
    const serializedSkills = actor.getFlag(MODULE_ID, "selectedSkills") as Record<string, string[]>;

    if (!serializedSkills) {
        return new Map();
    }
    return new Map(Object.entries(serializedSkills).map(([key, value]) => [Number(key), value]));
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
