import { defineStore } from "pinia";
import { SkillBoostManager } from "../model/SkillBoostManager";

export const useSkillManagerStore = defineStore("skill-manager", {
    state: () => {
        return {
            manager: new SkillBoostManager(),
            actor: new Object() as ActorPF2e,
        };
    },
    getters: {
        getActor(): ActorPF2e {
            return this.actor as ActorPF2e;
        },
    },
});
