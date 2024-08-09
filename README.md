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
[npm-version-src]: https://img.shields.io/npm/v/dragon-editor/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://www.npmjs.com/package/dragon-editor
[npm-downloads-src]: https://img.shields.io/npm/dm/dragon-editor.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://www.npmjs.com/package/dragon-editor
[license-src]: https://img.shields.io/npm/l/dragon-editor

[![stars-src]](stars-href)
[![forks-src]](forks-href)
[![language-src]](language-href)
[![hits-src]](hits-href)
[![issues-src]](issues-href)
[![npm-version-src]][npm-version-href]
[![npm-downloads-src]][npm-downloads-href]
![NPM][license-src]

# DragonEditor

I just made the DragonEditor because I needed the WYSIWYG Editor to write on my [blog](https://dico.me).

This module support Nuxt3 only.

## Install

```shell
mpm i dragon-edtior
# or
yarn add dragon-editor
# or
bun add dragon-editor
```

## Using

First. Set module

```typescript
export default defineNuxtConfig({
    modules: ["dragon-editor"],
});
```

Second. Use Component

```html
<template>
    <div class="editor-area">
        <ClientOnly>
            <DragonEditor ref="$editor" />
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
const $editor = ref<any>();
</script>
```

Done! More information is here [Document](123)