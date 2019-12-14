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
값 : Number<br>
기본값 : 1120<br>
모바일과 데스크탑을 구분하는 기준점 입니다. 값보다 작을경우를 모바일, 값보다 큰경우를 데스크탑으로 인식합니다.

### maxImageWidth
값 : Number<br>
기본값 : 800<br>
이미지의 최대 사이즈를 지정합니다. 이미지 사이즈 조절시 해당 값보다 크게 지정할 수 없습니다.

### maxCodepenHeight
값 : Number<br>
기본값 : 800<br>
코드팬 Embed의 최대 높이를 지정합니다. 코드팬 높이 조절시 해당 값보다 크게 지정할 수 없습니다.

### useWebp
값 : Boolean<br>
기본값 : true<br>
이미지 삽입시 webp포멧을 지원하는지에 대한 유무입니다.

### multiUpload
값 : Boolean<br>
기본값 : false<br>
미디어 업로드시 다중 업로드 지원에 대한 유무입니다.

### mediaUploadURL *
값 : String::URL<br>
기본값 : 없음<br>
미디어 업로드를 위한 URL 값입니다, 설정하지 않을경우 에디터가 동작하지 않습니다.<br>
서버에서 다음과 같은 포멧을 반환 해야 합니다.
```json
{
   "idx" : "Number",
   "src" : "String",
   "webp" : "Boolean",
   "format" : "String",
   "alt" : "String",
   "width" : "Number",
   "height" : "Number"
}
```

### mediaUpdateURL *
값 : String::URL<br>
기본값 : 없음<br>
미디어 업데이트를 위한 URL 값입니다, 설정하지 않을경우 에디터가 동작하지 않습니다.<br>
서버에 다음과 같은 포멧을 전송합니다.
```json
{
   "idx" : "Number",
   "src" : "String",
   "webp" : "Boolean",
   "format" : "String",
   "alt" : "String",
   "width" : "Number",
   "height" : "Number"
}
```

### mediaDelURL *
값 : String::URL<br>
기본값 : 없음<br>
미디어 삭제를 위한 URL 값입니다, 설정하지 않을경우 에디터가 동작하지 않습니다.<br>
`DELETE`메서드를 사용해 `URL + image_idx` 값을 전송합니다.

### makeLinkBoxType
값 : Boolean::[self|api]<br>
기본값 : api<br>
링크박스를 구성하는 방식을 정합니다.<br>
self일 경우 `makeLinkBoxURL`값이 필수입니다.








