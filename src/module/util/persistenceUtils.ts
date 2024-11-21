import { MODULE_ID } from "../constants";

export async function persistData(actor: ActorPF2e, selectedSkills: Map<number, string[]>): Promise<void> {
    const serializedSkills = Object.fromEntries(selectedSkills.entries());
    await actor.setFlag(MODULE_ID, "selectedSkills", serializedSkills);
}

export function getPersistedData(actor: ActorPF2e): Map<number, string[]> {
    const serializedSkills = actor.getFlag(MODULE_ID, "selectedSkills") as Record<string, string[]>;

    if (!serializedSkills) {
        return new Map();
    }
    return new Map(Object.entries(serializedSkills).map(([key, value]) => [Number(key), value]));
}