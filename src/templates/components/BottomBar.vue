<script setup lang="ts">
import { FormHTMLAttributes, inject } from "vue";
import { localize } from "../../module/fvtt-vue/VueHelpers.mjs";

const onSubmit = inject("onSubmit") as (payload: Event) => void;
</script>
<template>
    <form class="bottom-bar">
        <button @click="onSubmit">{{ localize("PF2E.Actor.Character.AttributeBuilder.Complete") }}</button>
    </form>
</template>
<style scoped lang="css">
.bottom-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-bar button {
    width: fit-content;
    padding: 0 1.25rem;
}
</style>
