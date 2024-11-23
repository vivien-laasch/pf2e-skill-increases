import { defineStore } from "pinia";
import { getPersistedData } from "../util/persistenceUtils";
import { resolvePreselectedSkills } from "../util/preselectedSkillsUtil";

export const useSkillManagerStore = defineStore("skill-manager", {
    state: () => {
        return {
            selectedLevel: 1,
            selectedSkills: new Map<number, string[]>(),
            preselectedSKills: new Map() as Map<number, PreselectedSkills>,
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
            for (const [key, value] of this.preselectedSKills) {
                if (key <= this.selectedLevel && value.preselectedSkills.includes(skill)) {
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
        preloadSkills(actor: ActorPF2e) {
            const persistedSkills = getPersistedData(actor);
            this.selectedSkills = persistedSkills;
            this.preselectedSKills = resolvePreselectedSkills(actor);
        },
    },
    getters: {
        getActor(): ActorPF2e {
            return this.actor as ActorPF2e;
        },
    },
});
