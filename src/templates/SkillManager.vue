<script setup lang="ts">
import { PropType, ref } from "vue";
import LevelTabs from "./components/LevelTabs.vue";
import SkillBoosts from "./components/SkillBoosts.vue";
import { getSkillIncreaseLevels, getLevel } from "../module/util/actorUtils";

const props = defineProps({
  actor: {
    type: Object as PropType<ActorPF2e>,
    required: true,
  },
});

const levels = ref(getSkillIncreaseLevels(props.actor));
</script>

<template>
  <div class="skill-manager">
    <LevelTabs
      :actorLevel="getLevel(props.actor)"
      :levelsWithIncreases="levels"
    ></LevelTabs>
    <SkillBoosts :actor="props.actor"></SkillBoosts>
  </div>
</template>
<style>
.skill-manager {
  display: flex;
  gap: 1rem;
  width: 100%;
  max-height: 500px;
}
</style>
