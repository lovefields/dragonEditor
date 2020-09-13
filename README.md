# DragonEditor
I made DragonEditor because I needed an WYSIWYG editor to use in my blog. And I wanted to make every design acceptable.
So DragonEditor is an WYSIWYG editor and can be customized.

## Support browser

-   Chrome 55+
-   Safari 13+
-   Firefox 63+
-   Edge 79+
-   IOS 11+
-   Android 7+

We never ever support IE.

## Plugin

-   `highlight.js` [(Link)](https://highlightjs.org/)

## Using

```html
<!-- 
* Load Google font(Inconsolata) if you using code block.
* Load DragonEditor CSS
-->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&amp;display=swap">
<link rel="stylesheet" href="[yourdir]/dragonEditor.css">

<!-- 
* html
* You must set svg icon pack. Default pack is in assets.
-->
<svg class="icon-pack">
    <defs>
        <g id="icon-id">...</g>
        ...
    </defs>
</svg>
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
    const editor = new dragonEditor("selector", {
        key: "value",
    });
</script>
```

## Document

-   [DragonEditor Document](https://lovefields.github.io/dragonEditor/)
