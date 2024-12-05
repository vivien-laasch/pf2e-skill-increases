<script setup lang="ts">
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";

const store = useSkillManagerStore();
const levels = store.skillBoosts.getLevels();
const actorLevel = store.getActor.level;
</script>
<template>
    <div class="accordion">
        <button
            v-for="level of levels"
            :key="level"
            class="level"
            type="button"
            :class="{
                disabled: level > actorLevel!,
                selected: level === store.selectedLevel,
                available: store.skillBoosts.getTotal(level) > 0 && level <= actorLevel!,
                illegal: store.skillBoosts.isIllegal(level),
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
  padding: 0.25rem;
}

.level {
  padding: 0.25rem 1.5rem;
  width: auto;
}

.selected {
  background: var(--button-hover-background-color);
}

.available {
  --box-shadow: 0 0 2px 2px #ffb351;
}

.illegal {
  --box-shadow: 0 0 2px 2px #df2100;
}
</style>
