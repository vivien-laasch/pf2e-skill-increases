import { defineStore } from "pinia";

export const skillManagerStore = defineStore("skill-manager", {
    state: () => {
        return {
            selectedLevel: 1,
            selectedSkills: new Map<number, string[]>(),
            actor: null as ActorPF2e | null,
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
            let skills = this.selectedSkills.get(this.selectedLevel) || [];
            console.log(skills);
            if (!skills.includes(skill)) {
                skills.push(skill);
            }
            this.selectedSkills.set(this.selectedLevel, skills);
        },
        removeProficiency(skill: string) {
            let skills = this.selectedSkills.get(this.selectedLevel) || [];
            console.log(skills);
            const index = skills.indexOf(skill);
            if (index > -1) {
                skills.splice(index, 1);
            }
            this.selectedSkills.set(this.selectedLevel, skills);
        },
        isSkillSelected(skill: string): boolean {
          return this.selectedSkills.get(this.selectedLevel)?.includes(skill) || false;
      },
    },
});
