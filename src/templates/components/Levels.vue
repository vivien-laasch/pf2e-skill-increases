<script setup lang="ts">
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";

const store = useSkillManagerStore();
const levels = store.manager.getLevels();
const actorLevel = store.actor.system.details.level.value;
const manager = store.manager;
</script>
<template>
    <div class="accordion">
        <button
            v-for="level of levels"
            :key="level"
            class="level"
            :class="{
                disabled: level > actorLevel!,
                selected: level === manager.selectedLevel,
            }"
            :disabled="level > actorLevel!"
            @click="manager.selectedLevel = level"
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
