<script setup lang="ts">
import { inject } from "vue";
import { MODULE_ID } from "../../module/constants";
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";
import { useSkillManagerStore } from "../../module/stores/SkillManagerStore";

const submit = inject("onSubmit") as (payload: Event) => void;
const store = useSkillManagerStore();
const skillBoosts = store.skillBoosts;
</script>
<template>
    <div class="bottom-bar">
        <form class="container">
            <button class="submit" type="submit" @click="submit">{{ localize("PF2E.Actor.Character.AttributeBuilder.Complete") }}</button>
        </form>
        <div class="skill-counts container">
            <div class="count">{{ localize(`${MODULE_ID}.available`) + `: ${skillBoosts.getAvailable(store.selectedLevel)}` }}</div>
            <div class="count">{{ localize(`${MODULE_ID}.additional`) + `: ${skillBoosts.getAdditional(store.selectedLevel)}` }}</div>
            <button class="reset" @click="skillBoosts.resetSelection()" :title="localize(`${MODULE_ID}.reset`)"><i class="fa-solid fa-rotate-right"></i></button>
        </div>
    </div>
</template>
<style scoped lang="css">

.bottom-bar {
    border-top: 1px solid var(--color-border);
}

.container {
    display: flex;
    height: 100%;
    align-items: center;
}

.skill-counts {
    justify-content: space-between;
    padding: 0 0.5rem;
}

.submit {
    padding: 0.25rem 1.5rem;
    margin: 0 0.25rem;
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
