/**
 * 블럭구조
 */

// 블럭 기본 구조
interface DEditorDefaultBlockStructure {
    type: string;
    key: string;
    classList: string[];
}

// 텍스트 블럭 구조
interface DEditorTextBlock extends DEditorDefaultBlockStructure {
    textContent: string;
}

// 내부용 데이터 구조
type DEditorDataType = DEditorTextBlock;

/**
 * 기타
 */

// emit 함수
interface Emit {
    (event: "update:modelValue", value: DEditorModelValue[]): void;
}
