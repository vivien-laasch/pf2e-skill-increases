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
<style lang="css">
#app-pf2e-skill-increases [data-application-part="app"] {
    height: 100%;
}

#app-pf2e-skill-increases .skill-manager {
  display: flex;
  gap: 1rem;
  width: 100%;
  height: 100%;
}
</style>
