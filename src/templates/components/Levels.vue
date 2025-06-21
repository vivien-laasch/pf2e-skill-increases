<script setup lang="ts">
import { computed } from "vue";
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";
import { MODULE_ID } from "../../module/constants";

const store = useSkillManagerStore();
const levels = computed(() => store.skillBoosts.getLevels());
const actorLevel = store.getActor.level;

function getTooltip(level: number): string {
    if (store.skillBoosts.isIllegal(level)) {
        return localize(`${MODULE_ID}.illegalLevel`);
    } else if (available(level)) {
        return localize(`${MODULE_ID}.availableLevel`);
    }
    return "";
}

function available(level: number) {
    return store.skillBoosts.getTotal(level) > 0 && level <= actorLevel;
}
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
                available: available(level),
                illegal: store.skillBoosts.isIllegal(level),
            }"
            :data-tooltip="getTooltip(level)"
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
  line-height: 0;
  padding: 1rem 1.5rem;
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
