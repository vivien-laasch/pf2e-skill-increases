import { defineStore } from "pinia";
import { getPersistedData } from "../util/persistenceUtils";

export const useSkillManagerStore = defineStore("skill-manager", {
    state: () => {
        return {
            selectedLevel: 1,
            selectedSkills: new Map<number, string[]>(),
            actor: new Object() as ActorPF2e,
        };
    },
    actions: {
        getProficiencyAtSelectedLevel(skill: string) {
            let proficiencyRank = 0;
            for (const [key, value] of this.selectedSkills) {
                if (key <= this.selectedLevel && value.includes(skill)) {
                    proficiencyRank++;
                }
            }
            return proficiencyRank;
        },
        addProficiency(skill: string) {
            const skills = this.selectedSkills.get(this.selectedLevel) || [];
            if (!skills.includes(skill)) {
                skills.push(skill);
            }
            this.selectedSkills.set(this.selectedLevel, skills);
        },
        removeProficiency(skill: string) {
            const skills = this.selectedSkills.get(this.selectedLevel) || [];
            const index = skills.indexOf(skill);
            if (index > -1) {
                skills.splice(index, 1);
            }
            this.selectedSkills.set(this.selectedLevel, skills);
        },
        isSkillSelected(skill: string): boolean {
            return this.selectedSkills.get(this.selectedLevel)?.includes(skill) || false;
        },
        loadPersistedSkills() {
            const persistedSkills = getPersistedData(this.actor as ActorPF2e);
            this.selectedSkills = persistedSkills;
        },
    },
    getters: {
        getActor(): ActorPF2e {
            return this.actor as ActorPF2e;
        },
    },
});
