<script setup lang="ts">
import { computed } from "vue";
import { skillManagerStore } from "../../module/stores/SkillManagerStore";

const props = defineProps({
  skill: { type: String, required: true },
});

const ranks = ["T", "E", "M", "L"];
const store = skillManagerStore();
const proficiencyRank = computed(() =>
  store.getProficiencyAtSelectedLevel(props.skill)
);

const updateProficiency = (index: number) => {
  const skill = props.skill;
  console.log(proficiencyRank.value);
  if (proficiencyRank.value > index) {
    store.removeProficiency(skill);
    console.log(proficiencyRank.value);
  } else {
    store.addProficiency(skill);
    console.log(proficiencyRank.value);
  }
};
</script>

<template>
  <div class="proficiency">
    <div class="indicator" v-for="(rank, index) in ranks" :key="rank">
      <div class="rank">{{ rank }}</div>
      <button
        @click="updateProficiency(index)"
        class="background"
        :class="{ proficient: index < proficiencyRank }"
      ></button>
    </div>
  </div>
</template>
<style lang="css">
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

.background {
  width: 12px;
  aspect-ratio: 1;
  border-radius: 25%;
  border: 1px solid black;
}

.background.proficient {
  background-color: var(--button-hover-background-color);
}
</style>
