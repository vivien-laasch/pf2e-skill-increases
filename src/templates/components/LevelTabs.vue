<script setup lang="ts">
import { skillManagerStore } from "../../module/store/SkillManagerStore";

const props = defineProps({
    actorLevel: Number,
    levelsWithIncreases: {
        type: Array<number>,
        required: true,
    },
});

const store = skillManagerStore();
const emit = defineEmits(["selectLevel"]);

function selectLevel(level: number) {
    store.selectedLevel = level;
    emit("selectLevel");
}
</script>
<template>
    <div class="accordion">
        <button
            v-for="level of props.levelsWithIncreases"
            :key="level"
            class="level"
            :class="{ disabled: level > props.actorLevel!, selected: level === store.selectedLevel }"
            :disabled="level > props.actorLevel!"
            @click="selectLevel(level)"
        >
            Level {{ level }}
        </button>
    </div>
</template>
<style scoped>
.accordion {
  gap: 0.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.75rem;
}

.level {
  padding: 0.25rem 1.5rem;
}

.selected {
  background-color:var(--button-hover-background-color);
}
</style>
