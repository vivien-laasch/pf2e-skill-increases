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
  padding: 0;
  backdrop-filter: blur(5px);
}

.application.skill-manager .grid {
  display: inline-grid;
  grid-template-columns: 25% 75%;
  padding: 0.5rem;
}

.application.skill-manager .root {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 90% 10%;
}

.application.skill-manager button:disabled {
  opacity: 25%;
}

.application.skill-manager[data-theme] {
  --background: var(--app-background);
}

#open-skill-manager {
  font: 500 var(--font-size-13) var(--serif);
  margin-bottom: 0.5rem;
}
</style>
