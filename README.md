[stars-src]: https://img.shields.io/github/stars/lovefields/dragonEditor
[stars-href]: https://github.com/lovefields/dragonEditor/stargazers
[issues-src]: https://img.shields.io/github/issues/lovefields/dragonEditor
[issues-href]: https://github.com/lovefields/dragonEditor/issues
[forks-src]: https://img.shields.io/github/forks/lovefields/dragonEditor
[forks-href]: https://github.com/lovefields/dragonEditor/network/members
[language-src]: https://img.shields.io/github/languages/top/lovefields/dragonEditor
[language-href]: https://github.com/lovefields/dragonEditor/
[hits-src]: https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Flovefields%2FdragonEditor&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false
[hits-href]: https://hits.seeyoufarm.com
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://www.npmjs.com/package/dragon-editor
[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://www.npmjs.com/package/dragon-editor
[license-src]: https://img.shields.io/npm/l/dragon-editor

[![Github stars][stars-src]](stars-href)
[![Github issues][issues-src]](issues-href)
[![Github forks][forks-src]](forks-href)
[![Github top language][language-src]](language-href)
[![Hits][hits-src]](hits-href)
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
![NPM][license-src]

# DragonEditor

I just made the DragonEditor because I needed the WYSIWYG Editor to write on my blog.

## Install

## Using


### 에디터

```vue
<tempalte>
  <DragonEditor v-model="contentData" :option="option" ref="editor" />
</tempalte>

<script setup lang="ts">
const editor = ref();
const contentData = ref([]);
const option = ref({}); // 선택사항
</script>
```

#### 컴포넌트 명령어

1. 이미지 삽입

```typescript
editor.value.addImageBlock({
    src: string;
    width: number;
    height: number;
    webp: boolean;
});
```

2. 저장

```typescript
editor.value.updateBlockData();
// do save
```

### 코멘트

```vue
<tempalte>
  <DragonEditorComment v-model="commentData" ref="editor" />
</tempalte>

<script setup lang="ts">
const editor = ref();
const commentData = ref({
    classList: [],
    content: "",
});
</script>
```

#### 컴포넌트 명령어

1. 스타일 설정

스타일의 경우 컴포넌트에서 다음과 같이 명령어를 사용할 수 있습니다.<br>
해당되는 스타일이 존재하지 않을 경우 클레스에 값을 부여합니다.

```typescript
editor.value.setStyles("decorationBold");
```

2. 스타일 리스트

-   `alignLeft` : 왼쪽 정렬
-   `alignCenter` : 가운데 정렬
-   `alignRight` : 오른쪽 정렬
-   `decorationBold` : 볼드
-   `decorationItalic` : 이텔릭
-   `decorationUnderline` : 밑줄
-   `decorationStrikethrough` : 취소선

2. 저장

```typescript
editor.value.updateBlockData();
// do save
```

3. 포커스

```typescript
editor.value.focus();
```

### Viewer

```vue
<tempalte>
  <DragonEditorViewer :content="contentData"/>
</tempalte>

<script setup lang="ts">
const contentData = ref([]); // Save Data for Editor
</script>
```

#### Props

- content : This props is must be Array in Editor data.
- mediaURL (Option) : This props is pre URL in Media.


<!-- ## 데모 페이지

[Demo page](https://lovefields.github.io/dragonEditor/examples)

## 문서

-   [DragonEditor Document](https://lovefields.github.io/dragonEditor-doc/) -->
