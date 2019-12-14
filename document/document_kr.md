# Dragoneditor 문서
`*` : 필수값

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
값 : Number
기본값 : 1120
모바일과 데스크탑을 구분하는 기준점 입니다. 값보다 작을경우를 모바일, 값보다 큰경우를 데스크탑으로 인식합니다.

### maxImageWidth
값 : Number
기본값 : 800
이미지의 최대 사이즈를 지정합니다. 이미지 사이즈 조절시 해당 값보다 크게 지정할 수 없습니다.

### maxCodepenHeight
값 : Number
기본값 : 800
코드팬 Embed의 최대 높이를 지정합니다. 코드팬 높이 조절시 해당 값보다 크게 지정할 수 없습니다.

### useWebp
값 : Boolean
기본값 : true
이미지 삽입시 webp포멧을 지원하는지에 대한 유무입니다.

### multiUpload
값 : Boolean
기본값 : false
미디어 업로드시 다중 업로드 지원에 대한 유무입니다.

### mediaUploadURL *
값 : String::URL
기본값 : 없음

### mediaUpdateURL
### mediaDelURL






### mediaUploadURL



