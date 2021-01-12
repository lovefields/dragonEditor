<?php 

function dragonEditorViewConvertor($data, $useWebp = false, $amp = false, $codepenTheme = "dark")
{
    $html = '';
    $option = "";

    foreach($data as $item)
    {
        switch($item['type'])
        {
            case "text":
                foreach ($item['option'] as $key => $value) {
                    if ($value != "") {
                        $option .= ' data-' . $key . '="' . $value . '"';
                    }
                }

                $html .= '<p class="editor-item"' . $option . ' data-type="' . $item['type'] .'">' . $item['textContent'] . '</p>';
                $option = "";
            break;
            case "image":
                foreach ($item['option'] as $key => $value) {
                    if ($value != "") {
                        $option .= ' data-' . $key . '="' . $value . '"';
                    }
                }

                $html .= '<div class="editor-item" data-type="' . $item['type'] . '" data-webp="' . $item['hasWebp'] . '" ' . $option . '>';
                $html .= '<div class="editor-size" data-width="' . $item['itemWidth'] . '">';

                $option = "";

                if ($amp == true){
                    if ($useWebp == true){
                        if ($item['hasWebp'] == true) {
                            $html .= '<amp-img src="' . IMG_URL . $item['src'] . '.webp" width="' . $item['width'] . '" height="' . $item['height'] . '" alt="' . $item['alt'] . '" layout="responsive">';
                            $html .= '<amp-img fallback src="' . IMG_URL . $item['src'] . '.' . $item['defaultFormat'] . '" width="' . $item['width'] . '" height="' . $item['height'] . '" alt="' . $item['alt'] . '" layout="responsive"></amp-img>';
                            $html .= '</amp-img>';
                        } else {
                            $html .= '<amp-img src="' . IMG_URL . $item['src'] . '.' . $item['defaultFormat'] . '" width="' . $item['width'] . '" height="' . $item['height'] . '" alt="' . $item['alt'] . '" layout="responsive"></amp-img>';
                        }
                    } else {
                        $html .= '<amp-img src="' . IMG_URL . $item['src'] . '.' . $item['defaultFormat'] . '" width="' . $item['width'] . '" height="' . $item['height'] . '" alt="' . $item['alt'] . '" layout="responsive"></amp-img>';
                    }
                } else {
                    if ($useWebp == true) {
                        $html .= '<picture>';
                        if ($item['hasWebp'] == true) {
                            $html .= '<source srcset="' . IMG_URL . $item['src'] . '.webp" type="image/webp">';
                        }
                        $html .= '<img src="' . IMG_URL . $item['src'] . '.' . $item['defaultFormat'] . '" width="' . $item['width'] . '" data-height="' . $item['height'] . '" alt="' . $item['alt'] . '" class="editor-img" draggable="false"></picture>';
                    } else {
                        $html .= '<img src="' . IMG_URL . $item['src'] . '.' . $item['defaultFormat'] . '" width="' . $item['width'] . '" data-height="' . $item['height'] . '" alt="' . $item['alt'] . '" class="editor-img" draggable="false">';
                    }
                }

                foreach ($item['caption']['option'] as $key => $value) {
                    if ($value != "") {
                        $option .= ' data-' . $key . '="' . $value . '"';
                    }
                }

                $html .= '</div>';
                $html .= '<p class="editor-caption" ' . $option . '>' . $item['caption']['textContent'] . '</p>';
                $html .= '</div>';
                $option = "";
            break;
            case "ul":
                $ulChild = "";

                foreach ($item['child'] as $child) {
                    foreach ($child['option'] as $key => $value) {
                        if ($value != "") {
                            $option .= ' data-' . $key . '="' . $value . '"';
                        }
                    }

                    $ulChild .= '<li ' . $option . '>' . $child['textContent'] . '</li>';
                    $option = "";
                }

                $html .= '<ul class="editor-item" data-type="' . $item['type'] . '">' . $ulChild . '</ul>';
            break;
            case "ol":
                $olChild = "";

                foreach ($item['child'] as $child) {
                    foreach ($child['option'] as $key => $value) {
                        if ($value != "") {
                            $option .= ' data-' . $key . '="' . $value . '"';
                        }
                    }

                    $olChild .= '<li ' . $option . '>' . $child['textContent'] . '</li>';
                    $option = "";
                }

                $html .= '<ol class="editor-item" data-style="' . $item['style'] . '" data-type="' . $item['type'] . '">' . $olChild . '</ol>';
            break;
            case "quote":
                $html .= '<blockquote class="editor-item" data-type="' . $item['type'] . '" data-style="' . $item['style'] . '"><p class="editor-text" >' . $item['text'] . '</p><p class="editor-author" >' . $item['author'] . '</p></blockquote>';
            break;
            case "table":
                foreach ($item['caption']['option'] as $key => $value) {
                    if ($value != "") {
                        $option .= ' data-' . $key . '="' . $value . '"';
                    }
                }

                $html .= '
                    <div class="editor-item" data-type="' . $item['type'] . '">
                        <div class="editor-scroll">
                            <table class="editor-table">
                                <caption ' . $option . '>' . $item['caption']['textContent'] . '</caption>
                                <colgroup>';

                $option = "";

                foreach($item['colgroup'] as $col) {
                    $html .= '<col data-size="' . $col . '">';
                }

                $html .= "</colgroup><tbody>";

                foreach($item['body'] as $tr) {
                    $html .= "<tr>";

                    foreach($tr as $cell) {
                        foreach ($cell['option'] as $key => $value) {
                            if ($value != "") {
                                $option .= ' data-' . $key . '="' . $value . '"';
                            }
                        }

                        $html .= '<' . $cell['tag'] . ' ' . $option . '>' . $cell['textContent'] . '</' . $cell['tag'] . '>';
                        $option = "";
                    }

                    $html .= "</tr>";
                }
                $html .= "</tbody></table></div></div>";
            break;
            case "linkbox":
                $html .= '
                    <div class="editor-item" data-type="' . $item['type'] . '">
                        <a href="' . $item['url'] . '" target="_blank" rel="nofollow" class="editor-linkbox editor-clearfix" draggable="false">
                            <div class="editor-linkbox-img">
                                <img src="' . $item['imgSrc'] . '" alt="preview image" class="editor-img" draggable="false">
                            </div>

                            <div class="editor-linkbox-text">
                                <p class="editor-title">' . $item['title'] . '</p>
                                <p class="editor-description">' . $item['description'] . '</p>
                                <p class="editor-domain">' . $item['domain'] . '</p>
                            </div>
                        </a>
                    </div>
                ';
            break;
            case "emoticon":
                $html .= '<div class="editor-item" data-type="' . $item['type'] . '">' . $item['code'] . '</div>';
            break;

            case "youtube":
                $html .= '
                    <div class="editor-item" data-type="' . $item['type'] . '">
                        <iframe src="https://www.youtube.com/embed/' . $item['code'] . '" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="editor-iframe"></iframe>
                    </div>
                ';
            break;
            case "codepen":
                $html .= '
                    <div class="editor-item" data-type="' . $item['type'] . '">
                        <iframe height="' . $item['height'] . '" title="" src="https://codepen.io/' . $item['nickname'] . '/embed/' . $item['code'] . '?height=' . $item['height'] . '&theme-id=' . $codepenTheme . '&default-tab=result" allowfullscreen class="editor-iframe"></iframe>
                    </div>
                ';
                break;
            case "codeblock":
                $html .= '<pre class="editor-item" data-type="' . $item['type'] . '" data-theme="' . $item['theme'] . '" data-lang="' . $item['lang'] . '"><code>' . $item['code']['textContent'] . '</code></pre>';
                break;
            default:
                $html .= '<div class="editor-item" data-type="' . $item['type'] . '">' . $item['other'] . '</div>';
        }
    }

    return $html;
}