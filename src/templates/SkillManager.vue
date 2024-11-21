<script setup lang="ts">
import Levels from "./components/Levels.vue";
import Skills from "./components/Skills.vue";
</script>
<template>
    <div class="skill-manager">
        <Levels></Levels>
        <Skills></Skills>
    </div>
</template>
<style lang="css">
.application.skill-manager [data-application-part="app"] {
    height: 100%;
}

.application.skill-manager .skill-manager {
  display: flex;
  gap: 1rem;
  width: 100%;
  height: 100%;
}
</style>
