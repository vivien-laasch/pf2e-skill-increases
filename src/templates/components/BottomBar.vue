<script setup lang="ts">
import { MODULE_ID } from "../../module/constants";
import { computed, inject } from "vue";
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";

const onSubmit = inject("onSubmit") as (payload: Event) => void;
const store = useSkillManagerStore();
const manager = computed(() => store.manager);
</script>
<template>
    <div class="bottom-bar">
        <form class="submit">
            <button @click="onSubmit">{{ localize("PF2E.Actor.Character.AttributeBuilder.Complete") }}</button>
        </form>
        <div class="skill-counts">
            <div class="count">{{ localize(`${MODULE_ID}.available`) + `: ${manager.getAvailableSkillBoosts()}` }}</div>
            <div class="count">{{ localize(`${MODULE_ID}.additional`) + `: ${manager.getAdditionalSkillBoosts()}` }}</div>
            <button class="reset" @click="manager.resetSelection()"><i class="fa-solid fa-rotate-right"></i></button>
        </div>
    </div>
</template>
<style scoped lang="css">
.skill-counts {
    display: flex;
    justify-content: space-between;
    padding: 0 0.5rem;
    height: 100%;
    align-items: center;
}

.bottom-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

button {
    padding: 0.25rem 1.5rem;
    width: fit-content;
}

.submit {
    display: flex;
    justify-content: center;
    padding-right: 0.25rem;
}

.reset {
    padding: 0.5rem;
}

.reset i {
    margin-right: 0;
}
.count {
    display: flex;
    align-items: center;
}
</style>
