import { MODULE_ID } from "../constants";

export async function persistData(actor: ActorPF2e, selectedSkills: Map<number, string[]>): Promise<void> {
    const serializedSkills = Object.fromEntries(selectedSkills.entries());
    actor.setFlag(MODULE_ID, "selectedSkills", serializedSkills);
    applyBonuses(actor, selectedSkills);
}

export function getPersistedData(actor: ActorPF2e): Map<number, string[]> {
    const serializedSkills = actor.getFlag(MODULE_ID, "selectedSkills") as Record<string, string[]>;

    if (!serializedSkills) {
        return new Map();
    }
    return new Map(Object.entries(serializedSkills).map(([key, value]) => [Number(key), value]));
}

async function applyBonuses(actor: ActorPF2e, selectedSkills: Map<number, string[]>): Promise<void> {
    const updates: Record<string, number> = {};

    for (const skill of Object.values(actor.skills)) {
        const rank = upgradeProficiency(skill, selectedSkills);
        updates[`system.skills.${skill.slug}.rank`] = rank;
    }

    await actor.update(updates);
}

function upgradeProficiency(skill: SkillPF2e, selectedSkills: Map<number, string[]>): number {
    const rank = Array.from(selectedSkills.values()).reduce((acc, selections) => acc + (selections.includes(skill.slug) ? 1 : 0), 0);
    return rank;
}
