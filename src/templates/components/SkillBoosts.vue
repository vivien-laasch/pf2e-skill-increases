<script setup lang="ts">
import { computed } from "vue";
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
const bonus = computed(() => "+53");
</script>
<template>
    <div class="skill-list">
        <div v-for="skill in availableSkills" :key="skill" class="skill">
            <div class="skill-bonus">{{ bonus }}</div>
            <div class="skill-name">{{ skill }}</div>
            <ProficiencyIndicator :skill="skill"></ProficiencyIndicator>
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
  padding-right: 0.25rem;
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
  margin-right: 1.25rem;
}
</style>
