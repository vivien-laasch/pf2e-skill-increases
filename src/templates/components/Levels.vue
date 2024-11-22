<script setup lang="ts">
import { computed } from "vue";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";
import { computeSkillProgression } from "../../module/util/skillCalculationUtils";
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";

const store = useSkillManagerStore();
const levelsWithIncreases = computed(() => computeSkillProgression(store.getActor));
const levelsWithAdditionalIncreases = computed(() => store.preselectedSKills);
const actorLevel = computed(() => store.actor.system.details.level.value);

function totalLevels(): number[] {
    return Array.from(new Set([...levelsWithIncreases.value.keys(), ...levelsWithAdditionalIncreases.value.keys()])).sort((a, b) => a - b);
}
</script>
<template>
    <div class="accordion">
        <button
            v-for="level of totalLevels()"
            :key="level"
            class="level"
            :class="{
                disabled: level > actorLevel!,
                selected: level === store.selectedLevel,
            }"
            :disabled="level > actorLevel!"
            @click="store.selectedLevel = level"
        >
            {{ `${localize("PF2E.LevelLabel")}  ${level}` }}
        </button>
    </div>
</template>
<style scoped>
.accordion {
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 0.35;
  padding-right: 0.75rem;
}

.level {
  padding: 0.25rem 1.5rem;
  width: auto;
}

.selected {
  background-color: var(--button-hover-background-color);
}
</style>
