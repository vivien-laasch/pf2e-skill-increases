<script setup lang="ts">
const props = defineProps({
    skill: String,
    isProficient: Boolean,
});

const ranks = ["T", "E", "M", "L"];
</script>

<template>
    <div class="proficiency">
        <div class="indicator" v-for="rank in ranks" :key="rank">
            <div class="rank">{{ rank }}</div>
            <button class="background" :class="{ proficient: props.isProficient }"></button>
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
  background-color : var(--button-hover-background-color);
  }
</style>
