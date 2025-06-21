<script setup lang="ts">
import { computed } from "vue";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";
import { getMaxProficiencyAtLevel } from "../../module/util/skills";

import { MODULE_ID } from "../../module/constants";
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";

const props = defineProps({
    skill: { type: String, required: true },
});

const store = useSkillManagerStore();
const skillBoosts = store.skillBoosts;

const ranks = [1, 2, 3, 4].map((rank) => localize(`PF2E.ProficiencyLevel${rank}`).charAt(0));
const proficiencyRank = computed(() => skillBoosts.getRankAtLevel(props.skill, store.selectedLevel));
const isLocked = computed(() => skillBoosts.isSkillLocked(props.skill, store.selectedLevel));
const maxProficiency = computed(() => getMaxProficiencyAtLevel(store.selectedLevel));

function toggleProficiency(index: number) {
    if (index < proficiencyRank.value) {
        skillBoosts.removeRank(props.skill, store.selectedLevel);
    } else {
        skillBoosts.addRank(props.skill, store.selectedLevel);
    }
}

function getMessage(index: number): string {
    if (!isDisabled(index)) {
        return "";
    }
    if (isLocked.value) {
        return localize(`${MODULE_ID}.proficiencyPreselected`);
    }
    if (index >= maxProficiency.value) {
        return localize(`${MODULE_ID}.levelTooLow`);
    }
    if (skillBoosts.getTotal(store.selectedLevel) == 0) {
        return localize(`${MODULE_ID}.skillsMaxIncreasesReached`);
    }
    if (skillBoosts.getRankAtLevel(props.skill, store.selectedLevel - 1) == index + 1) {
        return localize(`${MODULE_ID}.proficiencyDecreaseNotAllowed`);
    }
    return "";
}

function isDisabled(index: number): boolean {
    return skillBoosts.isDisabled(props.skill, index + 1, store.selectedLevel);
}
</script>
<template>
    <div class="proficiency">
        <div class="indicator" v-for="(rank, index) in ranks" :key="rank" :data-tooltip="getMessage(index)" data-tooltip-direction="DOWN">
            <div class="rank">{{ rank }}</div>
            <button
                @click="toggleProficiency(index)"
                class="proficiency-button"
                :class="{ proficient: index < proficiencyRank, preselected: isLocked }"
                :disabled="isDisabled(index)"
            ></button>
        </div>
    </div>
</template>

<style scoped lang="css">
.proficiency {
  display: flex;
  justify-content: space-around;
  gap: 0.5rem;
  list-style: none;
}

.indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rank {
  font-size: var(--font-size-9);
  text-align: center;
}

button {
    padding: 0;
    height: 16px;
    aspect-ratio: 1;
}

button.proficient:disabled {
    background-color: var(--button-focus-outline-color);
}

button.proficient {
  background-color: var(--button-hover-background-color);
}

button:disabled {
  border-color: color-mix(in srgb, var(--color-light-5), transparent 70%);
}

.skill-manager[data-theme] {

    button:hover:not(:disabled) {
        background-color: var(--accent-color);
    }

    button.proficient {
        background-color: var(--accent-color);
    }
}
</style>
