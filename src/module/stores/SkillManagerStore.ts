import { defineStore } from "pinia";
import { SkillBoostManager } from "../model/SkillBoostManager";
import { CharacterPF2e } from "foundry-pf2e";

export const useSkillManagerStore = defineStore("skill-manager", {
    state: () => {
        return {
            manager: new SkillBoostManager(),
            actor: new Object() as CharacterPF2e,
        };
    },
    getters: {
        getActor(): CharacterPF2e {
            return this.actor as CharacterPF2e;
        },
    },
});
