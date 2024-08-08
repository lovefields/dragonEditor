<template>
    <div class="dragon-editor">
        <div v-if="props.useMenuBar === true" class="d-menu-area">menu bar!</div>
        <div class="d-body"> </div>
    </div>
</template>

<script setup lang="ts">
import { ref, unref, onMounted } from "#imports";

const props = defineProps({
    useMenuBar: {
        type: Boolean,
        requiard: false,
        default: () => true,
    },
});

console.log(props.useMenuBar);
</script>

<style lang="scss">
@import "../scss/editor.scss";
</style>
