import { MODULE_ID } from "../constants";

export async function persistData(actor: ActorPF2e, selectedSkills: Map<number, string[]>): Promise<void> {
    await actor.setFlag(MODULE_ID, "selectedSkills", selectedSkills);
    const flags = actor.getFlag(MODULE_ID, "selectedSkills") as Map<number, string[]>;
    console.log(flags);
}

export async function loadData(actor: ActorPF2e): Promise<Map<number, string[]>> {
    return actor.getFlag(MODULE_ID, "selectedSkills") as Map<number, string[]>;
}