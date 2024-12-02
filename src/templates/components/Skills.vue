<script setup lang="ts">
import { CharacterPF2e, CharacterSkill } from "foundry-pf2e";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";
import { computeAttributeProgression } from "../../module/util/attributeCalculationUtils";
import Proficiency from "./Proficiency.vue";

const store = useSkillManagerStore();
const availableSkills = Object.values(store.getActor.skills).filter((skill) => !skill.lore);
const proficiencyPerRank = [0, 2, 4, 6, 8];
const manager = store.manager;

function getTotalBonus(skill: CharacterSkill<CharacterPF2e>): number {
    return getProficiencyBonus(skill) + getAttributeBonus(skill);
}

function getProficiencyBonus(skill: CharacterSkill<CharacterPF2e>): number {
    const proficiency = proficiencyPerRank[manager.getRankAtSelectedLevel(skill.slug)] ?? 0;
    return proficiency !== 0 ? proficiency + manager.selectedLevel : 0;
}

function getAttributeBonus(skill: CharacterSkill<CharacterPF2e>): number {
    if (!skill.attribute) {
        return 0;
    }
    const progression = computeAttributeProgression(store.getActor, skill.attribute, manager.selectedLevel);
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
