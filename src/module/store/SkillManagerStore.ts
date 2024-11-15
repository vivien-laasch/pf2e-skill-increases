import { defineStore } from "pinia";

export const skillManagerStore = defineStore("skill-manager", {
    state: () => {
        return {
            selectedLevel: 1,
            selectedSkills: new Map<number, string[]>(),
        };
    },
});
