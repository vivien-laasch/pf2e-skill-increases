<script setup lang="ts">
import { computed } from "vue";
import Proficiency from "./Proficiency.vue";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";
import { computeAttributeProgression } from "../../module/util/attributeCalculationUtils";

const store = useSkillManagerStore();
const availableSkills = computed(() => store.getActor.skills);
const proficiencyPerRank = [0, 2, 4, 6, 8];

function getBonus(skill: SkillPF2e): string {
    const proficiency = proficiencyPerRank[store.getProficiencyAtSelectedLevel(skill.slug)] ?? 0;
    const progression = computeAttributeProgression(store.getActor, skill.attribute, store.selectedLevel);
    const lastLevelKey = Array.from(progression.keys()).pop() ?? 1;

    const proficiencyBonus = proficiency !== 0 ? proficiency + store.selectedLevel : 0;
    const attributeBonus = progression.get(lastLevelKey) || 0;
    const totalBonus = proficiencyBonus + attributeBonus;

    return totalBonus >= 0 ? `+${totalBonus}` : `${totalBonus}`;
}

</script>
<template>
    <div class="skill-list">
        <div v-for="skill in availableSkills" :key="skill.slug" class="skill">
            <div class="skill-bonus">{{ getBonus(skill) }}</div>
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
  flex: 1;
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
