<script setup lang="ts">
import { MODULE_ID } from "../../module/constants";
import { computed, inject } from "vue";
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";

const onSubmit = inject("onSubmit") as (payload: Event) => void;
const store = useSkillManagerStore();
const skills = computed(() => store.manager.getSkillBoostsAtSelectedLevel());
</script>
<template>
    <form class="bottom-bar">
        <div class="submit">
            <button @click="onSubmit">{{ localize("PF2E.Actor.Character.AttributeBuilder.Complete") }}</button>
        </div>
        <div class="skill-counts">
            <div>{{ localize(`${MODULE_ID}.available`) + `: ${skills.available}` }}</div>
            <div>{{ localize(`${MODULE_ID}.additional`) + `: ${skills.additional}` }}</div>
        </div>
    </form>
</template>
<style scoped lang="css">
.skill-counts {
    display: flex;
    gap: 3rem;
    justify-content: center;
}

.bottom-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-bar button {
    padding: 0.25rem 1.5rem;
}

.submit {
    display: flex;
    justify-content: center;
    padding-right: 0.75rem;
}
</style>
