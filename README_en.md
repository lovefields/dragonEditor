[![Github stars](https://img.shields.io/github/stars/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/stargazers)
[![Github issues](https://img.shields.io/github/issues/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/issues)
[![Github forks](https://img.shields.io/github/forks/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/network/members)
[![Github top language](https://img.shields.io/github/languages/top/lovefields/dragonEditor)](https://github.com/lovefields/dragonEditor/)
[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Flovefields%2FdragonEditor&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

[KO](https://github.com/lovefields/dragonEditor/blob/main/README.md) &#47; [EN](https://github.com/lovefields/dragonEditor/blob/main/README_en.md)

# DragonEditor

I made WYSIWYG DragonEditor because just i needed an WYSIWYG editor to use in my blog.<br>Well DragonEditor has any customized option and support AMP page.

## Support browser
-   Chrome 55+
-   Safari 13+
-   Firefox 63+
-   Edge 79+
-   IOS 11+
-   Android 7+

We never ever support IE.

## Plugin

If you using `codeblock`, import this plugin.

-   `highlight.js` [(Link)](https://highlightjs.org/)

## Using

# editor
```html
<!-- 
* Load Google font(Inconsolata) if you using code block.
* Load DragonEditor CSS
-->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&amp;display=swap">
<link rel="stylesheet" href="[yourdir]/dragonEditor.css">

<!-- 
* You must include icon pack(template engine) or directly to html page.
-->
<svg class="icon-pack">
    <defs>
        <g id="icon-id">...</g>
        ...
    </defs>
</svg>
<!--
* Set editor-dragon class element.
-->
<div class="editor-dragon"></div>

<!-- 
* Load highlight plugin if you using code block.
* Load dragonEditor js
-->
<script src="[yourdir]/highlight.pack.js"></script>
<script src="[yourdir]/dragonEditor.js"></script>
<script>
    const editor = new dragonEditor();
    // OR
    const editor = new dragonEditor({
        key: "value",
    });
</script>
```

# viewer
```html
<!-- 
* Load Google font(Inconsolata) if you using code block.
* Load DragonEditorViewer CSS
* The [code] value is the result with converter (see view-convertor folder).
-->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&amp;display=swap">
<link rel="stylesheet" href="[yourdir]/dragonEditorViewer.css">

<div class="editor-dragon-viewer">[code]</div>
```

## Demo
[Demo page](https://lovefields.github.io/dragonEditor/demo)

## Document

-   [DragonEditor Document](https://lovefields.github.io/dragonEditor-doc/)

## License
[LGPL 3.0](https://github.com/lovefields/dragonEditor/blob/main/License.txt)