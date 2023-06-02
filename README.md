[![Github stars](https://img.shields.io/github/stars/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/stargazers)
[![Github issues](https://img.shields.io/github/issues/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/issues)
[![Github forks](https://img.shields.io/github/forks/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/network/members)
[![Github top language](https://img.shields.io/github/languages/top/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/)
[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Flovefields%2FdragonEditor&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)
[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

[KO](https://github.com/lovefields/dragonEditor/blob/main/README.md) &#47; [EN](https://github.com/lovefields/dragonEditor/blob/main/README_en.md)

# DragonEditor

드래곤 에디터는 그냥 블로그에 쓸 이지윅 에디터가 필요해서 만들었습니다.<br>
커스터마이징이 가능하며 AMP 페이지를 지원합니다.<br>
2.0 기점으로 Nuxt.js만 지원합니다.

## 사용법

### 에디터

### 코멘트

```vue
<tempalte>
  <DragonEditorComment v-model="commentData" ref="editor" />
</tempalte>

<script setup lang="ts">
const editor = ref();
const commentData = ref({
    type: "comment",
    classList: [],
    content: ""
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

- `alignLeft` : 왼쪽 정렬
- `alignCenter` : 가운데 정렬
- `alignRight` : 오른쪽 정렬
- `decorationBold` : 볼드
- `decorationItalic` : 이텔릭
- `decorationUnderline` : 밑줄
- `decorationStrikethrough` : 취소선

### 뷰어



## 데모 페이지
[Demo page](https://lovefields.github.io/dragonEditor/examples)

## 문서

-   [DragonEditor Document](https://lovefields.github.io/dragonEditor-doc/)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://www.npmjs.com/package/dragon-edito

[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://www.npmjs.com/package/dragon-edito

[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://www.npmjs.com/package/dragon-edito

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
