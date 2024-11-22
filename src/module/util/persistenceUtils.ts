import { MODULE_ID } from "../constants";

export async function persistData(actor: ActorPF2e, selectedSkills: Map<number, string[]>, preselectedSkills: Map<number, PreselectedSkills>): Promise<void> {
    const serializedSkills = Object.fromEntries(selectedSkills.entries());
    actor.setFlag(MODULE_ID, "selectedSkills", serializedSkills);
    applyBonuses(actor, selectedSkills, preselectedSkills);
}

export function getPersistedData(actor: ActorPF2e): Map<number, string[]> {
    const serializedSkills = actor.getFlag(MODULE_ID, "selectedSkills") as Record<string, string[]>;

    if (!serializedSkills) {
        return new Map();
    }
    return new Map(Object.entries(serializedSkills).map(([key, value]) => [Number(key), value]));
}

async function applyBonuses(actor: ActorPF2e, selectedSkills: Map<number, string[]>, preselectedSkills: Map<number, PreselectedSkills>): Promise<void> {
    const updates: Record<string, number> = {};

    for (const skill of Object.values(actor.skills)) {
        const rank = upgradeProficiency(skill, selectedSkills, preselectedSkills);
        updates[`system.skills.${skill.slug}.rank`] = rank;
    }

    await actor.update(updates);
}

function upgradeProficiency(skill: SkillPF2e, selectedSkills: Map<number, string[]>, preselectedSkills: Map<number, PreselectedSkills>): number {
    const selectedRank = Array.from(selectedSkills.values()).reduce((rank, selections) => 
        rank + (selections.includes(skill.slug) ? 1 : 0), 0);

    const preselectedRank = Array.from(preselectedSkills.values()).reduce((rank, selections) => 
        rank + (selections.preselectedSkills.includes(skill.slug) ? 1 : 0), 0);

    return selectedRank + preselectedRank;
}