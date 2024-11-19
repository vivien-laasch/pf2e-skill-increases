<script setup lang="ts">
import { computed } from "vue";
import { skillManagerStore } from "../../module/stores/SkillManagerStore";
import { isFunctionLike } from "typescript";

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
        console.log(proficiencyRank.value);
    } else {
        store.addProficiency(skill);
        console.log(proficiencyRank.value);
    }
}

function selectedThisLevel(index: number): boolean {
    return store.isSkillSelected(props.skill) && index === proficiencyRank.value;
}

function disabled(index: number): boolean {
    return index < proficiencyRank.value && !selectedThisLevel(index);
}
</script>

<template>
    <div class="proficiency">
        <div class="indicator" v-for="(rank, index) in ranks" :key="rank">
            <div class="rank">{{ rank }}</div>
            <button
                @click="updateProficiency(index)"
                class="background"
                :class="{ proficient: index < proficiencyRank, selected: selectedThisLevel(index) }"
                :disabled="disabled(index)"
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
  background-color: color-mix(in srgb, var(--button-hover-background-color) 50, transparent 50);
  border-color: var(--button-border-color);
}

button.selected.proficient {
  background-color: var(--button-hover-background-color);
}
</style>
