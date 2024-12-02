<script setup lang="ts">
import { MODULE_ID } from "../../module/constants";
import { computed, inject } from "vue";
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";

const submit = inject("onSubmit") as (payload: Event) => void;
const store = useSkillManagerStore();
const manager = computed(() => store.manager);
</script>
<template>
    <div class="bottom-bar">
        <form class="container">
            <button class="submit" type="submit" @click="submit">{{ localize("PF2E.Actor.Character.AttributeBuilder.Complete") }}</button>
        </form>
        <div class="skill-counts container">
            <div class="count">{{ localize(`${MODULE_ID}.available`) + `: ${manager.getAvailableSkillBoosts()}` }}</div>
            <div class="count">{{ localize(`${MODULE_ID}.additional`) + `: ${manager.getAdditionalSkillBoosts()}` }}</div>
            <button class="reset" @click="manager.resetSelection()" :title="localize(`${MODULE_ID}.reset`)"><i class="fa-solid fa-rotate-right"></i></button>
        </div>
    </div>
</template>
<style scoped lang="css">
.container {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0.25rem;
}

.skill-counts {
    justify-content: space-between;
    padding-right: 1rem;
}

.submit {
    width: 100%;
    padding: 0.25rem 1.5rem;
}

.reset {
    padding: 0.5rem;
    width: fit-content;
}

.reset i {
    margin-right: 0;
}
.count {
    display: flex;
    align-items: center;
}
</style>
