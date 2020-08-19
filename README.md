# dragonEditor

## Support browser

-   Chrome 53+
-   Safari 13+
-   Firefox 63+
-   Edge 18+ (44+)
-   IOS 11+
-   Android 7+

## Using Plugin

-   `highlight.js` [(Link)](https://highlightjs.org/)

## Using

```html
<!-- 
* css
* Load Google font(Inconsolata) if are you using code block.
-->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&amp;display=swap">
<link rel="stylesheet" href="[yourdri]/dragonEditor.css">

<!-- 
* html
* You must set svg icon pack. Default pack is in assets.
-->
<svg hidden>
    <defs>
        <g id="iconId">...</g>
        ...
    </defs>
</svg>
<div class=".editor-dragon"></div>

<!-- 
* js
* Load highlight plugin if are you using code block.
 -->
<script src="[yourdri]/highlight.pack.js"></script>
<script src="[yourdri]/dragonEditor.js"></script>
<script>
    const editor = dragonEditor.init();
    // OR
    const editor = dragonEditor.init(".class-name");
</script>
```

## Wiki

-   [DragonEditor wiki](https://github.com/lovefields/dragonEditor/wiki)
