<script setup lang="ts">
import { computed } from "vue";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";
import { getMaxProficiencyAtLevel } from "../../module/util/skillCalculationUtils";

import { MODULE_ID } from "../../module/constants";
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";

const props = defineProps({
    skill: { type: String, required: true },
});

const store = useSkillManagerStore();
const manager = store.manager;

const ranks = [1, 2, 3, 4].map((rank) => localize(`PF2E.ProficiencyLevel${rank}`).charAt(0));
const proficiencyRank = computed(() => manager.getRankAtSelectedLevel(props.skill));
const isLocked = computed(() => manager.isSkillLocked(props.skill));
const maxProficiency = computed(() => getMaxProficiencyAtLevel(manager.selectedLevel));

function toggleProficiency(index: number) {
    if (index < proficiencyRank.value) {
        manager.removeRank(props.skill);
    } else {
        manager.addRank(props.skill);
    }
}

// Tooltip message for each rank
function getMessage(index: number): string {
    if (isLocked.value) {
        return localize(`${MODULE_ID}.proficiencyPreselected`);
    }
    if (index >= maxProficiency.value) {
        return localize(`${MODULE_ID}.levelTooLow`);
    }
    if (manager.getTotalSkillBoostsAtLevel() == 0) {
        return localize(`${MODULE_ID}.skillsMaxIncreasesReached`);
    }
    if (manager.getRankAtLevel(props.skill, manager.selectedLevel - 1) == index + 1) {
        return localize(`${MODULE_ID}.proficiencyDecreaseNotAllowed`);
    }
    return "";
}

function isDisabled(index: number): boolean {
    return manager.isDisabled(props.skill, index + 1);
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
  width: 12px;
  aspect-ratio: 1;
}

button.proficient:disabled {
  background-color: color-mix(in srgb, var(--button-hover-background-color), transparent 50%);
}

button.proficient {
  background-color: var(--button-hover-background-color);
}

button:disabled {
  border-color: color-mix(in srgb, var(--color-light-5), transparent 70%);
}
</style>
