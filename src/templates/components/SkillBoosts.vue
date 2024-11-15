<script setup lang="ts">
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
</script>
<template>
  <div class="skill-list">
    <div v-for="skill in availableSkills" :key="skill" class="skill">
      <div class="skill-bonus">+53</div>
      <div class="skill-name">{{ skill }}</div>
      <ProficiencyIndicator :skill="skill"></ProficiencyIndicator>
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
  margin-right: 0.75rem;
}

.skill-name {
  text-align: left;
  text-transform: capitalize;
  flex: 1;
}

.skill-bonus {
  margin-right: 0.5rem;
}
</style>
