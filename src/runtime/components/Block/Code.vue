<template>
    <div
        class="de-block de-code-block"
        @click="setEdit"
    >
        <p
            v-memo="memoData"
            v-html="props.data.filename"
            class="de-filename"
            :contenteditable="props.isEdit === true"
            ref="$fileName"
            @focus="setEdit"
            @keydown="fileNameKeydownEvent"
            @input="updateFilename"
            @paste="_normalPasteEvent($event, setEdit, abortEdit)"
        ></p>

        <p
            v-if="props.isEdit === false"
            class="de-language"
            >{{ editorStore.codeBlockLnaguageList[props.data.language] }}</p
        >

        <div
            v-else
            class="de-language"
        >
            <button
                class="de-btn-language"
                @click="isLanguageListActive = !isLanguageListActive"
                ref="$btnLanguageList"
                >{{ editorStore.codeBlockLnaguageList[props.data.language] }}</button
            >

            <div
                class="de-list-language"
                :class="{ '--active': isLanguageListActive === true }"
                ref="$languageList"
            >
                <button
                    v-for="[name, value] in Object.entries(editorStore.codeBlockLnaguageList)"
                    class="de-lang"
                    @click="setLanguageEvent(name)"
                >
                    {{ value }}
                </button>
            </div>
        </div>

        <div class="de-pre-wrap">
            <div class="de-number">
                <p
                    v-for="i in lineNumber"
                    class="de-number-item"
                >
                    {{ i }}
                </p>
            </div>

            <pre class="de-pre"><code v-memo="memoData" v-html="props.data.textContent" class="de-code-content" :contenteditable="props.isEdit === true" ref="$content" @focus="setEdit" @keydown="contentKeydownEvent" @input="updateContent" @blur="setStyleEvent" @paste="_normalPasteEvent($event,setEdit,abortEdit)"></code></pre>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from "../../store/editor";
import { ref, computed, nextTick, onMounted } from "vue";
import { onClickOutside } from "@vueuse/core";
import { _moveCodeBlockEvent, _codeBlockShiftEnterEvent, _codeBlockTabEvent, _normalPasteEvent } from "../../utils/event";
import type { DECodeBlock } from "../../type.d.mts";

const editorStore = useEditorStore();
const props = defineProps<{ data: DECodeBlock; isEdit: boolean; index: number }>();
const emit = defineEmits<{
    (e: "update", data: DECodeBlock): void;
}>();
const isLanguageListActive = ref<boolean>(false);
const $fileName = ref<HTMLParagraphElement | null>(null);
const $content = ref<HTMLDivElement | null>(null);
const $languageList = ref<HTMLDivElement | null>(null);
const $btnLanguageList = ref<HTMLButtonElement | null>(null);
const lineNumber = computed<number>(() => {
    const match = props.data.textContent.match(/\n/g);
    const matchEmptyLast = props.data.textContent.match(/\n\n$/g);
    let number = match === null ? 1 : match.length + 1;

    if (matchEmptyLast !== null) {
        number -= 1;
    }

    return number;
});
const memoData = computed<any[]>(() => {
    const isFrozen = props.isEdit === true && editorStore.selectedBlockId === props.data.id;
    const memoKey = isFrozen ? "frozen" : JSON.stringify(props.data);

    return [memoKey];
});

function setEdit() {
    editorStore.selectedBlockId = props.data.id;
    editorStore.selectedBlockIndex = props.index;
}

function abortEdit() {
    editorStore.selectedBlockId = "";
    editorStore.selectedBlockIndex = -1;
}

function updateFilename(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DECodeBlock;

    newData.filename = (event.target as HTMLParagraphElement).innerHTML;

    emit("update", newData);
}

function fileNameKeydownEvent(event: KeyboardEvent): void {
    if ($content.value !== null) {
        if (event.isComposing === false) {
            switch (event.key) {
                case "Enter":
                    _moveCodeBlockEvent(event, "down", "filename", $content.value);
                    break;

                case "Tab":
                    _moveCodeBlockEvent(event, "down", "filename", $content.value);
                    break;

                case "ArrowUp":
                    _moveCodeBlockEvent(event, "up", "filename", $content.value);
                    break;

                case "ArrowDown":
                    _moveCodeBlockEvent(event, "down", "filename", $content.value);
                    break;
            }
        }
    } else {
        event.preventDefault();
    }
}

function updateContent(event: Event): void {
    const newData = JSON.parse(JSON.stringify(props.data)) as DECodeBlock;

    newData.textContent = (event.target as HTMLParagraphElement).innerHTML;

    emit("update", newData);
}

function contentKeydownEvent(event: KeyboardEvent): void {
    if ($fileName.value !== null) {
        if (event.isComposing === false) {
            switch (event.key) {
                case "Enter":
                    if (event.shiftKey === true) {
                        _codeBlockShiftEnterEvent(event, props.index);
                    }
                    break;

                case "Tab":
                    _codeBlockTabEvent(event);
                    break;

                case "ArrowUp":
                    _moveCodeBlockEvent(event, "up", "content", $fileName.value);
                    break;

                case "ArrowDown":
                    _moveCodeBlockEvent(event, "down", "content", $fileName.value);
                    break;
            }
        } else {
            event.preventDefault();
        }
    }
}

// 언어 설정
async function setLanguageEvent(lang: string): Promise<void> {
    if ($content.value !== null) {
        const textContent = $content.value.textContent;
        // @ts-ignore : 망할 하이라이팅 로드 이슈
        const highlights = hljs.highlight(textContent, { language: lang });
        const newData = JSON.parse(JSON.stringify(props.data)) as DECodeBlock;

        isLanguageListActive.value = false;
        abortEdit();
        newData.language = lang;
        newData.textContent = highlights.value;
        emit("update", newData);
        await nextTick();
        setEdit();
    }
}

// 블러시 스타일 셋
function setStyleEvent(): void {
    if ($content.value !== null) {
        const textContent = $content.value.textContent;
        // @ts-ignore : 망할 하이라이팅 로드 이슈
        const highlights = hljs.highlight(textContent, { language: props.data.language });
        const newData = JSON.parse(JSON.stringify(props.data)) as DECodeBlock;

        newData.textContent = highlights.value;
        emit("update", newData);
    }
}

onClickOutside(
    $languageList,
    () => {
        isLanguageListActive.value = false;
    },
    {
        ignore: [$btnLanguageList],
    }
);

onMounted(() => {
    // @ts-ignore : 망할 하이라이팅 로드 이슈
    if (window.hljs === undefined) {
        const script = document.createElement("script");

        script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js";
        script.async = true;
        document.head.appendChild(script);
    }
});
</script>
