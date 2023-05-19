[![Github stars](https://img.shields.io/github/stars/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/stargazers)
[![Github issues](https://img.shields.io/github/issues/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/issues)
[![Github forks](https://img.shields.io/github/forks/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/network/members)
[![Github top language](https://img.shields.io/github/languages/top/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/)
[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Flovefields%2FdragonEditor&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

[KO](https://github.com/lovefields/dragonEditor/blob/main/README.md) &#47; [EN](https://github.com/lovefields/dragonEditor/blob/main/README_en.md)

# DragonEditor

드래곤 에디터는 그냥 블로그에 쓸 이지윅 에디터가 필요해서 만들었습니다.<br>커스터마이징이 가능하며 AMP 페이지를 지원합니다.

## 브라우저 지원
-   Chrome 55+
-   Safari 13+
-   Firefox 63+
-   Edge 79+
-   IOS 11+
-   Android 7+

IE 따위는 지원하지 않습니다.

## 플러그인

코드블럭을 사용하는 경우만 사용합니다.<br>
~~직접 만들려고 했는데 미친 짓인 것 같네요~~

-   `highlight.js` [(Link)](https://highlightjs.org/)

## 사용법

### 에디터 페이지
```html
<!-- 
* 코드 블럭을 사용한다면 구글 폰트(Inconsolata)를 불러옵니다.
* 에디터 CSS를 로드합니다.
-->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&amp;display=swap">
<link rel="stylesheet" href="[yourdir]/dragonEditor.css">

<!--
* editor-dragon 클레스를 지정합니다.
-->
<div class="editor-dragon"></div>

<!-- 
* 코드 블럭을 사용할 경우 플러그인을 불러오세요.
* 에디터 JS를 로드합니다.
-->
<script src="[yourdir]/highlight.pack.js"></script>
<script src="[yourdir]/dragonEditor.js"></script>
<script>
    const editor = new DragonEditor();
    // 위나 아래처럼 사용 가능합니다
    const editor = new DragonEditor({
        key: "value",
    });
</script>
```

### 뷰 페이지
```html
<!-- 
* 코드 블럭을 사용한다면 구글 폰트(Inconsolata)를 불러옵니다.
* 뷰페이지용 CSS를 로드합니다.
* [code] 값은 convertor를 사용한 결과값입니다.(view-convertor 폴더 참조)
-->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&amp;display=swap">
<link rel="stylesheet" href="[yourdir]/dragonEditorViewer.css">

<div class="editor-dragon-viewer">[code]</div>
```

## 데모 페이지
[Demo page](https://lovefields.github.io/dragonEditor/examples)

## 문서

-   [DragonEditor Document](https://lovefields.github.io/dragonEditor-doc/)




//////////////////
<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: My Module
- Package name: my-module
- Description: My new Nuxt module
-->

# My Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

My new Nuxt module for doing amazing things.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)
<!-- - [🏀 Online playground](https://stackblitz.com/github/your-org/my-module?file=playground%2Fapp.vue) -->
<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->
- ⛰ &nbsp;Foo
- 🚠 &nbsp;Bar
- 🌲 &nbsp;Baz

## Quick Setup

1. Add `my-module` dependency to your project

```bash
# Using pnpm
pnpm add -D my-module

# Using yarn
yarn add --dev my-module

# Using npm
npm install --save-dev my-module
```

2. Add `my-module` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    'my-module'
  ]
})
```

That's it! You can now use My Module in your Nuxt app ✨

## Development

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/my-module/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/my-module

[npm-downloads-src]: https://img.shields.io/npm/dm/my-module.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/my-module

[license-src]: https://img.shields.io/npm/l/my-module.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/my-module

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
