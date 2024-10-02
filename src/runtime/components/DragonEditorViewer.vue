<template>
    <div class="dragon-editor-viewer">
        <template v-for="item in props.content">
            <p v-if="item.type === 'text'" class="de-block de-text-block" :class="item.classList" v-html="item.textContent"></p>

            <template v-if="item.type === 'heading'">
                <h1 v-if="item.level === 1" class="de-block de-heading-block" :class="item.classList" :data-level="item.level" v-html="item.textContent"></h1>
                <h2 v-if="item.level === 2" class="de-block de-heading-block" :class="item.classList" :data-level="item.level" v-html="item.textContent"></h2>
                <h3 v-if="item.level === 3" class="de-block de-heading-block" :class="item.classList" :data-level="item.level" v-html="item.textContent"></h3>
            </template>

            <template v-if="item.type === 'list'">
                <ul v-if="item.element === 'ul'" class="de-block de-list-block" :data-style="item.style">
                    <li v-for="li in item.child" class="de-item" :class="li.classList" v-html="li.textContent"></li>
                </ul>

                <ol v-if="item.element === 'ol'" class="de-block de-list-block" :data-style="item.style">
                    <li v-for="li in item.child" class="de-item" :class="li.classList" v-html="li.textContent"></li>
                </ol>
            </template>

            <div v-if="item.type === 'image'" class="de-block de-image-block" :class="item.classList">
                <div class="de-image-area" :data-maxwidth="item.maxWidth">
                    <img :src="props.imageHostURL === undefined ? item.src : props.imageHostURL + item.src" alt="" class="de-img" :width="item.width" :height="item.height" loading="lazy" />
                </div>

                <p v-if="item.caption" class="de-caption">{{ item.caption }}</p>
            </div>

            <div v-if="item.type === 'code'" class="de-block de-code-block" :data-theme="item.theme">
                <p class="de-filename">{{ item.filename }}</p>
                <p class="de-language">{{ item.language }}</p>
                <pre class="de-pre"><code class="de-code-content" v-html="item.textContent"></code></pre>
            </div>

            <div v-if="item.type === 'custom'" class="de-block de-custom-block" :class="item.classList" v-html="item.textContent"></div>
        </template>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    content: DEContentData;
    imageHostURL?: string;
}>();
</script>

<style lang="scss">
@import "../scss/viewer.scss";
</style>
