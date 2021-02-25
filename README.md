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

코드블럭을 사용하는 경우만 사용합니다.

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
* SVG아이콘 팩을 불러오거나(템플릿 엔진) 페이지에 직접 삽입하세요.
-->
<svg class="icon-pack">
    <defs>
        <g id="icon-id">...</g>
        ...
    </defs>
</svg>
<div class="editor-dragon"></div>

<!-- 
* 코드 블럭을 사용할 경우 플러그인을 불러오세요.
* 에디터 JS를 로드합니다.
-->
<script src="[yourdir]/highlight.pack.js"></script>
<script src="[yourdir]/dragonEditor.js"></script>
<script>
    const editor = new dragonEditor();
    // 위나 아래처럼 사용 가능합니다
    const editor = new dragonEditor({
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
[Demo page](https://lovefields.github.io/dragonEditor/demo)

## 문서

-   [DragonEditor Document](https://lovefields.github.io/dragonEditor-doc/)

## 라이선스
[LGPL 3.0](https://github.com/lovefields/dragonEditor/blob/main/License.txt)