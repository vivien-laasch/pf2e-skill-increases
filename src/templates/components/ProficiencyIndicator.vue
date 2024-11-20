<script setup lang="ts">
import { computed } from "vue";
import { skillManagerStore } from "../../module/stores/SkillManagerStore";
import { getAvailableSkillBoostsAtLevel, maxProficiencyAtLevel } from "../../module/util/actorUtils";

const props = defineProps({
    skill: { type: String, required: true },
});

const ranks = ["T", "E", "M", "L"];
const store = skillManagerStore();
const proficiencyRank = computed(() => store.getProficiencyAtSelectedLevel(props.skill));

function updateProficiency(index: number) {
    const skill = props.skill;
    if (proficiencyRank.value > index) {
        store.removeProficiency(skill);
    } else {
        store.addProficiency(skill);
    }
}

function decreaseAllowed(index: number): boolean {
    const currentProficiency = store.getProficiencyAtSelectedLevel(props.skill);
    const allowDecrease = store.isSkillSelected(props.skill) && currentProficiency - 1 == index;
    return index >= currentProficiency || allowDecrease;
}

function exceeded(index: number): boolean {
    const currentProficiency = store.getProficiencyAtSelectedLevel(props.skill);
    const allowDecrease = store.isSkillSelected(props.skill) && currentProficiency - 1 == index;
    const maxAmountExceeded =
        getAvailableSkillBoostsAtLevel(store.getActor(), store.selectedLevel) <= (store.selectedSkills.get(store.selectedLevel)?.length ?? 0);
    return (maxProficiencyAtLevel(store.selectedLevel) <= index || maxAmountExceeded) && !allowDecrease;
}
</script>

<template>
    <div class="proficiency">
        <div class="indicator" v-for="(rank, index) in ranks" :key="rank">
            <div class="rank">{{ rank }}</div>
            <button
                @click="updateProficiency(index)"
                class="background"
                :class="{ proficient: index < proficiencyRank, exceeded: exceeded(index) }"
                :disabled="!decreaseAllowed(index) || exceeded(index)"
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
  background-color: color-mix(in srgb, var(--button-hover-background-color), transparent 25%);
  border-color: var(--color-light-5)
}

button.proficient {
  background-color: var(--button-hover-background-color);
}

button.exceeded:disabled {
  border-color: color-mix(in srgb, var(--color-light-5), transparent 70%);
}
</style>
