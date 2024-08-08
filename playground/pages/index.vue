<template>
    <div>
        editor!
        <ClientOnly>
            <DragonEditor />
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "#imports";

const test = ref<MyModuleNitroRulesss>({});
</script>
