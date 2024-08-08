<template>
    <div class="dragon-editor">
        <div v-if="props.useMenuBar === true" class="de-menu-area">menu bar!</div>
        <div class="de-body" ref="$body">
            
        </div>
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
const $body = ref<HTMLDivElement>();

onMounted(() => {
    console.log("$body", $body.value);
});
</script>

<style lang="scss">
@import "../scss/editor.scss";
</style>
