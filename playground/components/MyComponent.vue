<template>
    <div class="my-component"> 연산 테스트 {{ test }} </div>
</template>

<script setup lang="ts">
import { computed } from "#imports";

const props = defineProps<{
    a: number;
    b: number;
}>();

const test = computed(() => {
    return props.a + props.b;
});
</script>
