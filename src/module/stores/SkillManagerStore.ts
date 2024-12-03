import { defineStore } from "pinia";
import { SkillBoosts } from "../model/SkillBoosts";
import { CharacterPF2e } from "foundry-pf2e";

export const useSkillManagerStore = defineStore("skill-manager", {
    state: () => {
        return {
            actor: {} as unknown,
            selectedLevel: 1,
            skillBoosts: {} as SkillBoosts,
        };
    },
    getters: {
        getActor(): CharacterPF2e {
            return this.actor as CharacterPF2e;
        },
        getSkillBoosts(): SkillBoosts {
            return this.skillBoosts as SkillBoosts;
        },
    },
});
