<template>
    <div>
        editor!
        <div class="editor-area">
            <ClientOnly>
                <DragonEditor />
            </ClientOnly>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "#imports";

const test = ref<MyModuleNitroRulesss>({});
</script>

<style lang="scss">
.editor-area {
    max-width: 800px;
    margin: 0 auto;
}
</style>
