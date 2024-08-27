<template>
    <div class="dragon-editor-viewer">
        <template v-for="item in props.content">
            <p v-if="item.type === 'text'" class="de-block de-text-block" :class="item.classList" v-html="item.textContent"></p>

            <template v-if="item.type === 'heading'">
                <h1 v-if="item.level === 1" class="de-block de-heading-block" :class="item.classList" :data-level="item.level" v-html="item.textContent"></h1>
                <h2 v-if="item.level === 2" class="de-block de-heading-block" :class="item.classList" :data-level="item.level" v-html="item.textContent"></h2>
                <h3 v-if="item.level === 3" class="de-block de-heading-block" :class="item.classList" :data-level="item.level" v-html="item.textContent"></h3>
            </template>

            <ul v-if="item.type === 'ul'" class="de-block de-list-block">
                <li v-for="li in item.child" class="de-item" :class="li.classList" v-html="li.textContent"></li>
            </ul>

            <ol v-if="item.type === 'ol'" class="de-block de-list-block" :type="item.pattern">
                <li v-for="li in item.child" class="de-item" :class="li.classList" v-html="li.textContent"></li>
            </ol>

            <div v-if="item.type === 'image'" class="de-block de-image-block" :class="item.classList">
                <div class="de-image-area" :data-maxwidth="item.maxWidth">
                    <img :src="item.src" alt="" class="de-img" :width="item.width" :height="item.height" loading="lazy" />
                </div>

                <p v-if="item.caption" class="de-caption">{{ item.caption }}</p>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    content: DEContentData;
}>();
</script>

<style lang="scss">
@import "../scss/viewer.scss";
</style>
