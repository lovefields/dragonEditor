<template>
    <div class="dragon-editor-viewer">
        <template v-for="(row, count) in props.content">
            <p class="d-text-block" v-if="row.type === 'text'" :class="row.classList" v-html="row.content"></p>

            <template v-if="row.type === 'image'">
                <template v-if="row.webp"> </template>
                <template v-else>
                    <div class="d-image-block" :class="row.classList">
                        <div class="d-image-area">
                            <img class="d-img" :src="row.src" :width="row.width" :height="row.height" :alt="row.caption" loading="lazy">
                        </div>
                        <p class="d-caption" v-if="row.caption" v-html="row.caption"></p>
                    </div>
                </template>
            </template>
        </template>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    content: any[];
}>();
</script>

<style>
@import "../../core/style/viewer.css";
</style>
