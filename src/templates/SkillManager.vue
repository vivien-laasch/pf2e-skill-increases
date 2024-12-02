<script setup lang="ts">
import BottomBar from "./components/BottomBar.vue";
import Levels from "./components/Levels.vue";
import Skills from "./components/Skills.vue";
</script>
<template>
    <div class="root">
        <div class="grid">
            <Levels></Levels>
            <Skills></Skills>
        </div>
        <BottomBar class="grid"></BottomBar>
    </div>
</template>
<style lang="css">
.application.skill-manager [data-application-part="app"] {
  height: 100%;
}

.application.skill-manager .window-content {
  padding-bottom: 0;
}

.application.skill-manager .grid {
  display: inline-grid;
  grid-template-columns: 25% 75%;
  grid-gap: 0.5rem;
}

.application.skill-manager .root {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 90% 50px
}

.application.skill-manager button:disabled {
    opacity: 40%;
}

.application.skill-manager[data-theme] {
  --background: var(--app-background);
}
</style>
