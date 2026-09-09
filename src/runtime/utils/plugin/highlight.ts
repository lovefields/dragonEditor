import hljs from "highlight.js/lib/core";

import csharp from "highlight.js/lib/languages/csharp";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import go from "highlight.js/lib/languages/go";
import xml from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import kotlin from "highlight.js/lib/languages/kotlin";
import lua from "highlight.js/lib/languages/lua";
import markdown from "highlight.js/lib/languages/markdown";
import nginx from "highlight.js/lib/languages/nginx";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import scss from "highlight.js/lib/languages/scss";
import sql from "highlight.js/lib/languages/sql";
import shell from "highlight.js/lib/languages/shell";
import swift from "highlight.js/lib/languages/swift";
import yaml from "highlight.js/lib/languages/yaml";

hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("c", c);
hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("css", css);
hljs.registerLanguage("dockerfile", dockerfile);
hljs.registerLanguage("go", go);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("json", json);
hljs.registerLanguage("java", java);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("kotlin", kotlin);
hljs.registerLanguage("lua", lua);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("nginx", nginx);
hljs.registerLanguage("php", php);
hljs.registerLanguage("python", python);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("scss", scss);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("shell", shell);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("yaml", yaml);

hljs.registerAliases("html", { languageName: "xml" });
hljs.registerAliases("vue", { languageName: "xml" });
hljs.registerAliases("jsx", { languageName: "javascript" });
hljs.registerAliases("tsx", { languageName: "typescript" });
hljs.registerAliases("shellscript", { languageName: "shell" });

export function _highlightCode(code: string, language: string): string {
    if (hljs.getLanguage(language) === undefined) {
        return code;
    }

    return hljs.highlight(code, { language }).value;
}
