<script setup lang="ts">
import { computed } from "vue";
import ProficiencyIndicator from "./Proficiency.vue";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";

const store = useSkillManagerStore();

const availableSkills = computed(() => store.getActor.skills);

function getBonus(skill: SkillPF2e): string {
    const prof = store.getProficiencyAtSelectedLevel(skill.slug);
    const attribute = skill.attribute;
    return "+ 12";
}
</script>
<template>
    <div class="skill-list">
        <div v-for="skill in availableSkills" :key="skill.slug" class="skill">
            <div class="skill-bonus">{{ getBonus(skill) }}</div>
            <div class="skill-name">{{ skill.label }}</div>
            <ProficiencyIndicator :skill="skill.slug"></ProficiencyIndicator>
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
  margin-right: 1.5rem;
}
</style>
