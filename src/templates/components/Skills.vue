<script setup lang="ts">
import { computed } from "vue";
import Proficiency from "./Proficiency.vue";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";
import { computeAttributeProgression } from "../../module/util/attributeCalculationUtils";

const store = useSkillManagerStore();
const availableSkills = computed(() => store.getActor.skills);
const proficiencyPerRank = [0, 2, 4, 6, 8];
const manager = computed(() => store.manager);
const selectedLevel = computed(() => manager.value.selectedLevel);

function getTotalBonus(skill: SkillPF2e): number {
    return getProficiencyBonus(skill) + getAttributeBonus(skill);
}

function getProficiencyBonus(skill: SkillPF2e): number {
    const proficiency = proficiencyPerRank[manager.value.getRankAtSelectedLevel(skill.slug)] ?? 0;
    return proficiency !== 0 ? proficiency + manager.value.selectedLevel : 0;
}

function getAttributeBonus(skill: SkillPF2e): number {
    const progression = computeAttributeProgression(store.getActor, skill.attribute, manager.value.selectedLevel);
    const lastLevelKey = Array.from(progression.keys()).pop() ?? 1;

    return progression.get(lastLevelKey) || 0;
}

function formatBonus(bonus: number): string {
    return bonus >= 0 ? `+ ${bonus}` : `- ${Math.abs(bonus)}`;
}
</script>
<template>
    <div class="skill-list">
        <div v-for="skill in availableSkills" :key="skill.slug" class="skill">
            <div class="skill-bonus">{{ formatBonus(getTotalBonus(skill)) }}</div>
            <div class="skill-name">{{ skill.label }}</div>
            <Proficiency :skill="skill.slug"></Proficiency>
        </div>
    </div>
</template>
<style scoped lang="css">
.skill-list {
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-right: 0.75rem;
}

.skill {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: var(--background);
}

.skill-name {
  text-align: left;
  text-transform: capitalize;
  flex: 1;
}

.skill-bonus {
  margin-right: 0.5rem;
  width: 2rem;
}
</style>
