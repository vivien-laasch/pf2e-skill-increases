<script setup lang="ts">
import { ref } from "vue";
import LevelTabs from "./components/LevelTabs.vue";
import SkillBoosts from "./components/SkillBoosts.vue";

const levels = ref([1, 3, 5, 7, 9, 11, 13, 15, 17, 19]);
</script>

<template>
    <div class="skill-manager">
        <LevelTabs :actorLevel="4" :levelsWithIncreases="levels"></LevelTabs>
        <SkillBoosts></SkillBoosts>
    </div>
</template>
<style>
.skill-manager {
  display: flex;
    gap: 1rem;
    width: 100%;
    max-height: 500px
}
</style>
