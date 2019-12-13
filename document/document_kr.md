# Dragoneditor 문서

## 사용법
```js
const editor = new dragonEditor(wrap, {
   'options' : 'value'
});
```

#### `wrap`
- 값 : CSS Selector
- 기본값 : `.editor_area`
- `null`을 넣을 경우 기본값으로 작동합니다.

#### 필수 옵션
- [mediaUploadURL](#mediaUploadURL)
- [mediaUpdateURL](#mediaUpdateURL)
- [mediaDelURL](#mediaDelURL)

## Options

### changePint
- 값 : Number
- 기본값 : 1120
- 모바일과 데스크탑을 구분하는 기준점 입니다. 값보다 작을경우를 모바일, 값보다 큰경우를 데스크탑으로 인식합니다.

### mediaUploadURL



