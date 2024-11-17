<script setup lang="ts">
import { computed, defineEmits } from "vue";
import { skillManagerStore } from "../../module/stores/SkillManagerStore";
import { getSkillIncreaseLevels } from "../../module/util/actorUtils";

const store = skillManagerStore();
const emit = defineEmits(["selectLevel"]);

const actor = computed (() => store.actor);
const levelsWithIncreases = computed(() => getSkillIncreaseLevels(actor.value));
const actorLevel = computed(() => actor.value.system.details.level.value);

function selectLevel(level: number) {
    store.selectedLevel = level;
    emit("selectLevel");
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
  overflow-x: hidden;
  padding-right: 0.75rem;
}

.level {
  padding: 0.25rem 1.5rem;
}

.selected {
  background-color: var(--button-hover-background-color);
}
</style>
