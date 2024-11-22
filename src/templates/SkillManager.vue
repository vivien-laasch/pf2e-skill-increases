<script setup lang="ts">
import BottomBar from "./components/BottomBar.vue";
import Levels from "./components/Levels.vue";
import Skills from "./components/Skills.vue";
</script>
<template>
    <div class="root">
        <div class="skill-manager">
            <Levels></Levels>
            <Skills></Skills>
        </div>
        <BottomBar></BottomBar>
    </div>
</template>
<style lang="css">
.application.skill-manager [data-application-part="app"] {
  height: 100%;
}

.application.skill-manager .window-content {
padding-bottom: 0;
}

.application.skill-manager .skill-manager {
  display: flex;
  gap: 1rem;
}

.application.skill-manager .root {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 90% 50px
}
</style>
