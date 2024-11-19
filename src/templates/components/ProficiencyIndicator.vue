<script setup lang="ts">
import { computed } from "vue";
import { skillManagerStore } from "../../module/stores/SkillManagerStore";

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

function disabled(index: number): boolean {
    const totalProficiency = store.getProficiencyAtSelectedLevel(props.skill);
    const allowDeselect = store.isSkillSelected(props.skill) && totalProficiency - 1 == index;
    return index < totalProficiency && !allowDeselect;
}
</script>

<template>
    <div class="proficiency">
        <div class="indicator" v-for="(rank, index) in ranks" :key="rank">
            <div class="rank">{{ rank }}</div>
            <button @click="updateProficiency(index)" class="background" :class="{ proficient: index < proficiencyRank }" :disabled="disabled(index)"></button>
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
  background-color: color-mix(in srgb, var(--button-hover-background-color), transparent 20%);
  border-color: var(--button-border-color);
}

button.proficient {
  background-color: var(--button-hover-background-color);
}
</style>
