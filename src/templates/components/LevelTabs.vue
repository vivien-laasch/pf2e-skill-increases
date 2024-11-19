<script setup lang="ts">
import { computed, defineEmits, PropType } from "vue";
import { skillManagerStore } from "../../module/stores/SkillManagerStore";
import { getSkillIncreaseLevels } from "../../module/util/actorUtils";

const store = skillManagerStore();
const levelsWithIncreases = computed(() => getSkillIncreaseLevels(store.getActor()));
const actorLevel = computed(() => store.getActor().system.details.level.value);

function selectLevel(level: number) {
    store.selectedLevel = level;
}
</script>
<template>
    <div class="accordion">
        <button
            v-for="level of levelsWithIncreases"
            :key="level"
            class="level"
            :class="{
                disabled: level > actorLevel!,
                selected: level === store.selectedLevel,
            }"
            :disabled="level > actorLevel!"
            @click="selectLevel(level)"
        >
            Level {{ level }}
        </button>
    </div>
</template>
<style scoped>
.accordion {
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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
