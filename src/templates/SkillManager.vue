<script setup lang="ts">
import LevelTabs from "./components/LevelTabs.vue";
import SkillBoosts from "./components/SkillBoosts.vue";
</script>
<template>
    <div class="skill-manager">
        <LevelTabs></LevelTabs>
        <SkillBoosts></SkillBoosts>
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
