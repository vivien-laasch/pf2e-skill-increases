<script setup lang="ts">
import { computed } from "vue";
import { skillManagerStore } from "../../module/store/SkillManagerStore";
import ProficiencyIndicator from "./ProficiencyIndicator.vue";

const availableSkills = [
    "acrobatics",
    "arcana",
    "athletics",
    "crafting",
    "deception",
    "diplomacy",
    "intimidation",
    "medicine",
    "nature",
    "occultism",
    "performance",
    "religion",
    "society",
    "stealth",
    "survival",
    "thievery",
];

const store = skillManagerStore();
const skills = computed(() => store.selectedSkills);
const selectedSkills = computed(() => skills.value.get(store.selectedLevel) || []);

const selectSkill = (skill: string) => {
    const selectedSkillSet = skills.value.get(store.selectedLevel) || [];
    if (!selectedSkillSet.includes(skill)) {
        store.selectedSkills.set(store.selectedLevel, [...selectedSkillSet, skill]);
    }
};
</script>
<template>
    <div class="skill-list">
        <div v-for="skill in availableSkills" :key="skill" @click="selectSkill(skill)" class="skill">
            <div class="skill-name">{{ skill }}</div>
            <ProficiencyIndicator :skill="skill" :isProficient="selectedSkills.includes(skill)"></ProficiencyIndicator>
        </div>
    </div>
</template>
<style lang="css">
.skill-list {
  gap: 0.5rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
}

.skill {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
    border-radius: var(--border-radius);
    background: var(--background);
    margin-right: 0.5rem;
}

.skill-name {
  text-align: left;
  text-transform: capitalize;
  flex: 1;
}
</style>
