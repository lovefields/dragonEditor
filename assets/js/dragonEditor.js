!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.dragonEditor=e():t.dragonEditor=e()}(window,(function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=2)}([function(t,e,n){"use strict";function o(t,e){if("string"==typeof e){if(typeof t!=e)throw`DRAGON EDITOR - invalid type ${t} : ${e}`}else if(!(t instanceof e))throw`DRAGON EDITOR - invalid type ${t} : ${e}`;return t}function i(t,e){if("string"==typeof e){if(typeof t!=e)return!1}else if(!(t instanceof e))return!1;return!0}function s(t,e,n,i=!1,s=o(t,"object"),c=o(e,"string"),a=o(n,"function"),l=o(i,"boolean")){t.length>0?t.forEach(t=>{t.addEventListener(e,n,i)}):t.addEventListener(e,n,i)}function c(t,e,n,i=o(t,"object"),s=o(e,"string"),c=o(n,"function")){t.length>0?t.forEach(t=>{t.removeEventListener(e,n,!0)}):t.removeEventListener(e,n,!0)}function a(t,e,n,i=o(t,"object"),s=o(e,"string"),c=o(n,"string")){t.length>0?t.forEach(t=>{"add"==e?t.classList.add(n):"remove"==e?t.classList.remove(n):"toggle"==e&&t.classList.toggle(n)}):"add"==e?t.classList.add(n):"remove"==e?t.classList.remove(n):"toggle"==e&&t.classList.toggle(n)}function l(t,e,n=o(t,Node),i=o(e,"string")){let s=!1;return e.split(".").some(e=>{if(""!==e)return s=!!t.classList.contains(e),0==s}),s}function r(t,e={},n="form",i=o(t,"string"),s=o(e,"object"),c=o(n,"string")){let a=new FormData;if("json"===n){for(let t in e.body)a.append(t,e.body[t]);e.body=a}return fetch(t,e).then(t=>t.json()).catch(t=>({respon:!1,error:t}))}function d(t,e=o(t,"string")){return t.charAt(0).toUpperCase()+t.slice(1)}n.r(e),n.d(e,"typeCheckThrow",(function(){return o})),n.d(e,"typeCheckBoolean",(function(){return i})),n.d(e,"eventBinding",(function(){return s})),n.d(e,"removeEvent",(function(){return c})),n.d(e,"classControl",(function(){return a})),n.d(e,"hasClass",(function(){return l})),n.d(e,"fetchURL",(function(){return r})),n.d(e,"upperFirstChar",(function(){return d}))},function(t,e,n){"use strict";n.r(e),n.d(e,"getElement",(function(){return i})),n.d(e,"getChild",(function(){return s})),n.d(e,"checkElement",(function(){return c})),n.d(e,"findParentByClass",(function(){return a})),n.d(e,"getActiveElement",(function(){return l}));const{typeCheckThrow:o}=n(0);function i(t,e=!0,n=o(t,"string"),i=o(e,"boolean")){return 1==e?document.querySelectorAll(t):document.querySelector(t)}function s(t,e,n=!0,i=o(t,Node),s=o(e,"string"),c=o(n,"boolean")){return 1==n?t.querySelectorAll(e):t.querySelector(e)}function c(t="",e,n=!0,s=o(t,"string"),c=o(e,"string"),a=o(n,"boolean")){return i(0==(""!=t&&function(t,e=o(t,"string")){return null!==document.querySelector(t)}(t))?e:t,n)}function a(t,e,n=o(t,Node),i=o(e,"string")){if("HTMLBodyElement"!==t.constructor.name&&"HTMLHtmlElement"!==t.constructor.name){return!0===t.classList.contains(e)?t:a(t.parentElement,e)}return null}function l(){let t=condition.areaContent.childElementCount,e=i(".djs-content > *");return null==condition.activeItem?e[t-1]:condition.activeItem}},function(t,e,n){t.exports=n(3)},function(t,e,n){(function(e){const{typeCheckThrow:o}=n(0),{storage:i}=n(5),{makeView:s,setEmoticonList:c,setMediaList:a}=n(7),{refreshScroll:l}=n(9),{setEvent:r,setEmoticonBtnEvent:d}=n(8);t.exports=class{constructor(t="",n={},c=o(t,"string"),a=o(n,"object")){return e.condition=new i(t,n),s(),condition.setElement(n),r(),this}setEmoticon(t,e=o(t,Array)){c(t),l(),d()}setMedia(t,e=o(t,Array)){a(t),l()}}}).call(this,n(4))},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";n.r(e),n.d(e,"storage",(function(){return l}));const{typeCheckThrow:o,typeCheckBoolean:i}=n(0),{getElement:s,checkElement:c}=n(1),{message:a}=n(6);class l{constructor(t,e){this.wrap=c(t,".editor-dragon",!1),this.setMessage(e.message),this.setStatus(e)}setMessage(t={},e=o(t,Object)){let n=["apiNotWorking"];for(const[e,o]of Object.entries(t))n.indexOf(e)>-1?a[e]=o:console.warn(a.wrongKey("message",e))}setStatus(t){this.log=[],this.linkBoxData={},this.langCategory=["en","ko"],this.windowWidth=window.innerWidth,this.windowHeight=window.innerHeight,this.enterCount=0,this.startTextCursor=0,this.endTextCursor=0,this.activeItem,this.activeElement,this.focusNode,this.baseNode,this.regList={defaultURL:new RegExp("https?:\\/\\/(\\w*:\\w*@)?[-\\w.]+(:\\d+)?(\\/([\\w\\/_.]*(\\?\\S+)?)?)?","i"),youtubeURL:new RegExp("(https:\\/\\/)?(www\\.)?youtu(be)?\\.(be|com)?","i"),youtubeCode:new RegExp("((https:\\/\\/)?(www\\.)?youtu(be)?\\.(be|com)\\/(embed\\/|watch\\?v=)?)([^=\\/& :]*)(.*)","i"),codepenURL:new RegExp("codepen.io","g"),codepenCode:new RegExp("(https:\\/\\/codepen\\.io\\/)(\\w*)\\/(pen|embed)\\/([A-Za-z]*)(.*)","i")},this.mode=i(t.mode,"string")?t.mode:"editor",this.multiLang=!i(t.multiLang,"boolean")||t.multiLang,this.changePint=i(t.changePint,"number")?t.changePint:800,this.maxImageWidth=i(t.maxImageWidth,"number")?t.maxImageWidth:700,this.maxCodepenHeight=i(t.maxCodepenHeight,"number")?t.maxCodepenHeight:1e3,this.useWebp=!i(t.useWebp,"boolean")||t.useWebp,this.codepenTheme=i(t.codepenTheme,"string")?t.codepenTheme:"dark",this.blockName=i(t.blockName,Object)?t.blockName:{},this.removeMenu=i(t.removeMenu,Array)?t.removeMenu:[],this.frontSize=i(t.frontSize,Array)?t.frontSize:[12,14,16,18,20,24,28,30,34,38],this.codeTheme=i(t.codeTheme,Array)?t.codeTheme:["default","vs2015","androidstudio","monokai"],this.codeLang=i(t.codeLang,Array)?t.codeLang:["text","css","html","xml","json","java","javascript","markdown","objective-c","php","python","sql","shell","kotlin","swift"],this.colorList=i(t.colorList,Array)?t.colorList:["#fff","#efefef","#ccc","#999","#777","#555","#333","#e6b8af","#dd7e6b","#cc4125","#980000","#a61c00","#85200c","#5b0f00","#f4cccc","#ea9999","#e06666","#ff0000","#cc0000","#990000","#660000","#fce5cd","#f9cb9c","#f6b36b","#ff9900","#e69138","#b45f06","#783f04","#fff2cc","#ffe599","#ffd966","#ffff00","#f1c232","#bf9000","#7f6000","#d9ead3","#b6d7a8","#93c47d","#00ff00","#6aa84f","#38761d","#274e13","#d0e0e3","#a2c4c9","#76a5af","#00ffff","#45818e","#134f5c","#0c343d","#c9daf8","#a4c2f4","#6d9eeb","#4a87e8","#3c78d8","#1156cc","#1c4587","#cfe2f3","#9fc5e8","#6fa8dc","#0000ff","#3d85c6","#0b5394","#073763","#d9d2e9","#b4a7d6","#8e7cc3","#9900ff","#674ea7","#351c75","#20124d","#ead1dc","#d5a6bd","#c27ba0","#ff00ff","#a64d79","#741b47","#4c1130"],this.addMenu=i(t.addMenu,Object)?t.addMenu:{},this.addLang=i(t.addLang,Array)?t.addLang:[],this.emoticonData=i(t.emoticonData,Array)?t.emoticonData:[],this.triggerLangChange=i(t.triggerLangChange,"function")?t.triggerLangChange:()=>{},this.multiUpload=!!i(t.multiUpload,"boolean")&&t.multiUpload,this.defaultLinkBoxImage=i(t.defaultLinkBoxImage,"string")?t.defaultLinkBoxImage:"https://via.placeholder.com/600x300.png",this.linkBoxApi=i(t.linkBoxApi,"string")?t.linkBoxApi:"",this.setUploadURL(t.uploadURL),this.setLang(t.lang),this.setContentData(),this.setBlockMenu(),this.addLanguage()}setUploadURL(t=""){""!=t?1==i(t,"string")&&(1==this.regList.defaultURL.test(t)||"/"==t.substr(0,1))?this.uploadURL=t:(console.warn(a.wrongURL("uploadURL",t)),this.uploadURL=""):this.uploadURL=""}setLang(t){if(1==i(t,"undefined"))this.lang=this.langCategory[0];else if(1==i(t,"string")){let e=this.langCategory.indexOf(t);e>-1?this.lang=this.langCategory[e]:(this.langCategory.unshift(t),this.lang=this.langCategory[0])}else console.warn(a.wrongValue("lang")),this.lang=this.langCategory[0]}setContentData(){let t={};this.langCategory.forEach(e=>{t[e]=[]}),this.contentData=t}setBlockMenu(){let t={textBlock:{text:"Text",icon:"#icon-text-block",type:"block"},imageBlock:{text:"Image",icon:"#icon-image-block",type:"file"},ulBlock:{text:"Unnumbered list",icon:"#icon-ul-block",type:"block"},olBlock:{text:"Numbered list",icon:"#icon-ol-block",type:"block"},quotaionBlock:{text:"Quotaion",icon:"#icon-quotaion-block",type:"block"},tableBlock:{text:"Table",icon:"#icon-table-block",type:"block"},linkboxBlock:{text:"Link box",icon:"#icon-linkbox-block",type:"pop"},emoticonBlock:{text:"Emoticon",icon:"#icon-emoticon-block",type:"pop"},youtubeBlock:{text:"Youtube",icon:"#icon-youtube-block",type:"pop"},codepenBlock:{text:"Codepen",icon:"#icon-codepen-block",type:"pop"},codeBlock:{text:"Code",icon:"#icon-code-block",type:"block"}};for(const[e,n]of Object.entries(this.blockName))1==i(n,"string")&&(t[e].text=n);delete this.blockName,""==this.uploadURL&&delete t.imageBlock,this.removeMenu.forEach(e=>{delete t[e]}),delete this.removeMenu;for(const[e,n]of Object.entries(this.addMenu))t[e]={text:n.text,icon:n.icon,fn:n.fn};delete this.addMenu,this.defaultMenu=t}addLanguage(){let t=[];this.addLang.forEach(e=>{i(e,"string")&&2==e.length&&t.push(e)}),this.langCategory=[...new Set(this.langCategory.concat(t))],delete this.addLang}setElement(t){this.scrollArea=s(".djs-scroll"),this.btnToggleTarget=s(".djs-toggle-target"),this.btnAddBlock=s(".djs-add-block"),this.areaContent=s(".djs-content",!1),this.uploadForm=s(".djs-uploader",!1),this.uploadInput=s(".djs-uploader .djs-file",!1),this.popEmoticon=s(".djs-emoticon-pop",!1),this.popFolder=s(".djs-folder-pop",!1),this.popLinkbox=s(".djs-linkbox-pop",!1),this.btnLinkbox=s(".djs-linkbox-pop .djs-btn",!1),this.listEmoticon=s(".djs-list-emoticon",!1),this.listMedia=s(".djs-list-media",!1),this.popOption=s(".djs-option-pop",!1),this.btnSwitchDevice=c(t.btnSwitchDevice,".djs-switch-device",!1),this.btnChangeLang=c(t.btnChangeLang,".djs-change-lang")}}},function(t,e,n){"use strict";n.r(e),n.d(e,"message",(function(){return o}));const o={wrongValue:t=>`DRAGON EDITOR - Wrong type value in "${t}".`,wrongURL:(t,e)=>`DRAGON EDITOR - Wrong URL value { ${t} : "${e}" }`,wrongKey:(t,e)=>`DRAGON EDITOR - Wrong key set "${t}" : { "${e}" : ... }`,apiNotWorking:"API server is not responding."}},function(t,e,n){"use strict";n.r(e),n.d(e,"makeView",(function(){return s})),n.d(e,"scrollButtonHTML",(function(){return c})),n.d(e,"getDefaultBlockHTML",(function(){return a})),n.d(e,"getEmoticonBlockHTML",(function(){return l})),n.d(e,"getYoutubeBlock",(function(){return r})),n.d(e,"getCodepenBlock",(function(){return d})),n.d(e,"getLinkboxBlock",(function(){return u})),n.d(e,"setEmoticonList",(function(){return g})),n.d(e,"setMediaList",(function(){return p}));const{typeCheckThrow:o,upperFirstChar:i}=n(0);function s(){let t="";t+=`<div class="editor-content djs-content" data-lang="${condition.lang}"><p class="editor-item djs-item" contenteditable="true" data-type="text"></p></div>`,t+='<div class="editor-menu-block">',t+=function(t){let e="";for(const[n,o]of Object.entries(t))"block"===o.type?e+=`\n                <button class="editor-btn djs-add-block" title="${o.text}" data-value="${n}" data-type="${o.type}">\n                    <svg viewbox="0 0 64 64" class="editor-icon">\n                        <use class="path" xlink:href="${o.icon}" href="${o.icon}"></use>\n                    </svg>\n                    ${o.text}\n                </button>\n            `:"pop"===o.type?"emoticonBlock"===n?(e+=`\n                    <div class="editor-relative">\n                        <button class="editor-btn djs-add-block djs-btn-ignore" title="${o.text}" data-value="${n}" data-type="${o.type}">\n                            <svg viewbox="0 0 64 64" class="editor-icon">\n                                <use class="path" xlink:href="${o.icon}" href="${o.icon}"></use>\n                            </svg>\n                            ${o.text}\n                        </button>\n                `,e+='\n        <div class="editor-list-pop editor-pop-emoticon editor-scroll djs-emoticon-pop djs-trigger djs-scroll">\n            <div class="editor-scroll-content djs-scroll-content">\n                <div class="editor-list-emoticon djs-list-emoticon editor-clearfix"></div>\n            </div>\n        </div>\n    ',e+="</div>"):e+=`\n                    <button class="editor-btn djs-add-block djs-btn-ignore" title="${o.text}" data-value="${n}" data-type="${o.type}">\n                        <svg viewbox="0 0 64 64" class="editor-icon">\n                            <use class="path" xlink:href="${o.icon}" href="${o.icon}"></use>\n                        </svg>\n                        ${o.text}\n                    </button>\n                `:"file"===o.type&&(e+=`\n                <button class="editor-btn djs-add-block" title="${o.text}" data-value="${n}" data-type="${o.type}">\n                    <svg viewbox="0 0 64 64" class="editor-icon">\n                        <use class="path" xlink:href="${o.icon}" href="${o.icon}"></use>\n                    </svg>\n                    ${o.text}\n                </button>\n            `);return e}(condition.defaultMenu),t+="</div>",t+='<div class="editor-menu-bottom">',t+=function(){let t="";""!==condition.uploadURL&&(t+='\n            <button class="editor-btn djs-toggle-target djs-btn-ignore" data-target=".editor-pop-folder">\n                <svg viewbox="0 0 64 64" class="editor-icon">\n                    <use class="path" xlink:href="#icon-folder" href="#icon-folder"></use>\n                </svg>\n                Media\n            </button>\n        ');1==condition.multiLang&&(t+='\n            <button class="editor-btn djs-toggle-target djs-btn-ignore" data-target=".editor-pop-lang">\n                <svg viewbox="0 0 64 64" class="editor-icon">\n                    <use class="path" xlink:href="#icon-lang" href="#icon-lang"></use>\n                </svg>\n                Change language\n            </button>\n        ');return t+='\n        <button class="editor-btn editor-switch-device djs-switch-device">\n            <svg class="icon" viewbox="0 0 64 64">\n                <use class="path editor-pc" xlink:href="#icon-pc" href="#icon-pc"></use>\n                <use class="path editor-mobile" xlink:href="#icon_mobile" href="#icon-mobile"></use>\n            </svg>\n            Change view\n        </button>\n    ',t}(),1==condition.multiLang&&(t+=function(){let t=`<div class="editor-pop-lang djs-trigger" data-length="${condition.langCategory.length}">`;return condition.langCategory.forEach(e=>{e==condition.lang?t+=`<button class="editor-btn-lang djs-change-lang --act" data-value="${e}">${e.toUpperCase()}</button>`:t+=`<button class="editor-btn-lang djs-change-lang" data-value="${e}">${e.toUpperCase()}</button>`}),t+="</div>",t}()),t+='\n        <div class="editor-list-pop editor-pop-folder editor-scroll djs-folder-pop djs-trigger djs-scroll">\n            <div class="editor-scroll-content djs-scroll-content">\n                <div class="editor-list-media djs-list-media"></div>\n            </div>\n        </div>\n    ',t+="</div>",""!==condition.uploadURL&&(t+=function(){let t='<form enctype="multipart/form-data" method="post" class="editor-uploader djs-uploader">';1==condition.multiUpload?t+='<input type="file" multiple class="djs-file">':t+='<input type="file" class="djs-file">';return t+="</form>",t}()),t+='\n        <div class="editor-pop-linkbox djs-linkbox-pop editor-clearfix djs-trigger" data-type="new">\n            <input type="url" class="editor-input djs-input --new" placeholder="https://dico.me">\n            <a href="" class="editor-link --del djs-link"></a>\n            <button class="editor-btn djs-btn" data-value="">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path --del" xlink:href="#icon-delete-link" href="#icon-delete-link"></use>\n                    <use class="path --new" xlink:href="#icon-btn-accept" href="#icon-btn-accept"></use>\n                </svg>\n            </button>\n        </div>\n    ',t+=function(){let t='<div class="editor-pop-option djs-option-pop">';return t+='\n        <div class="editor-scroll-wrap">\n            <div class="editor-col" data-group="text,li,table,codeblock,word">\n                <button class="editor-select djs-fontisze djs-toggle-target djs-btn-ignore" data-target=".editor-list-fontsize">\n                    <span class="editor-text djs-text">16</span>\n\n                    <svg class="icon" viewbox="0 0 64 64">\n                        <use class="path" xlink:href="#icon-arrow-bottom" href="#icon-arrow-bottom"></use>\n                    </svg>\n                </button>\n\n                <div class="editor-list-fontsize editor-scroll djs-scroll djs-trigger">\n                    <div class="editor-scroll-content djs-scroll-content">\n    ',condition.frontSize.forEach(e=>{t+=`<button class="editor-btn djs-change-fontsize" data-value="${e}">${e}</button>`}),t+="\n                    </div>\n                </div>\n            </div>\n    ",t+='\n        <div class="editor-col" data-group="text,li,table,codeblock,word">\n            <button class="editor-color djs-color djs-toggle-target djs-btn-ignore" data-target=".editor-list-color" data-value="#333"></button>\n            <div class="editor-list-color djs-trigger">\n    ',condition.colorList.forEach(e=>{t+=`<button class="editor-btn djs-change-color" data-value="${e}">${e}</button>`}),t+="\n            </div>\n        </div>\n    ",t+='\n        <div class="editor-col editor-btn-area" data-group="text,li,table,image,sticker">\n            <button class="editor-btn djs-change-align" data-value="left">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-align-left" href="#icon-align-left"></use>\n                </svg>\n\n                align left\n            </button>\n\n            <button class="editor-btn djs-change-align" data-value="center">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-align-center" href="#icon-align-center"></use>\n                </svg>\n\n                align center\n            </button>\n\n            <button class="editor-btn djs-change-align" data-value="right">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-align-right" href="#icon-align-right"></use>\n                </svg>\n\n                align right\n            </button>\n        </div>\n\n        <div class="editor-col editor-btn-area" data-group="text,li,table,word,link">\n            <button class="editor-btn djs-toggle-bold">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-bold" href="#icon-bold"></use>\n                </svg>\n\n                bold\n            </button>\n\n            <button class="editor-btn djs-toggle-italic">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-italic" href="#icon-italic"></use>\n                </svg>\n\n                italic\n            </button>\n\n            <button class="editor-btn djs-toggle-underline">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-underline" href="#icon-underline"></use>\n                </svg>\n\n                underline\n            </button>\n\n            <button class="editor-btn djs-toggle-strikethrough">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-strikethrough" href="#icon-strikethrough"></use>\n                </svg>\n\n                strikethrough\n            </button>\n        </div>\n\n        <div class="editor-col editor-btn-area" data-group="td">\n            <button class="editor-btn djs-table-header">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-table-header" href="#icon-table-header"></use>\n                </svg>\n\n                change to table header\n            </button>\n        </div>\n\n        <div class="editor-col editor-btn-area" data-group="td">\n            <button class="editor-btn djs-table-body">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-table-body" href="#icon-table-body"></use>\n                </svg>\n\n                change to table body\n            </button>\n        </div>\n\n        <div class="editor-col editor-btn-area" data-group="word,link">\n            <button class="editor-btn djs-open-linkbox">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-link" href="#icon-link"></use>\n                </svg>\n\n                open linkbox pop\n            </button>\n        </div>\n\n        <div class="editor-col editor-btn-area" data-group="codeblock">\n            <button class="editor-btn djs-toggle-target djs-btn-ignore" data-target=".editor-list-theme">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-theme" href="#icon-theme"></use>\n                </svg>\n\n                open theme pop\n            </button>\n\n            <div class="editor-list-select editor-list-theme djs-trigger">\n    ',condition.codeTheme.forEach(e=>{t+=`<button class="editor-btn djs-set-theme" data-value="${e}">${i(e)}</button>`}),t+="\n            </div>\n        </div>\n    ",t+='\n        <div class="editor-col" data-group="codeblock">\n            <button class="editor-select djs-toggle-target djs-btn-ignore" data-target=".editor-list-lang">\n                <span class="editor-text djs-text">Text</span>\n\n                <svg class="icon" viewbox="0 0 64 64">\n                    <use class="path" xlink:href="#icon-arrow-bottom" href="#icon-arrow-bottom"></use>\n                </svg>\n            </button>\n\n            <div class="editor-list-select editor-list-lang djs-trigger">\n    ',condition.codeLang.forEach(e=>{t+=`<button class="editor-btn djs-set-lang" data-value="${e}">${i(e)}</button>`}),t+="\n            </div>\n        </div>\n    ",t+='\n        <div class="editor-col" data-group="ol">\n            <button class="editor-select djs-toggle-target djs-btn-ignore" data-target=".editor-list-type">\n                <span class="editor-text djs-text">1 - Numbered</span>\n\n                <svg class="icon" viewbox="0 0 64 64">\n                    <use class="path" xlink:href="#icon-arrow-bottom" href="#icon-arrow-bottom"></use>\n                </svg>\n            </button>\n\n            <div class="editor-list-select editor-list-type djs-trigger">\n                <button class="editor-btn djs-set-type" data-value="1">1 - Numbered</button>\n                <button class="editor-btn djs-set-type" data-value="I">I - Upper-roman</button>\n                <button class="editor-btn djs-set-type" data-value="i">i - Lower-roman</button>\n                <button class="editor-btn djs-set-type" data-value="A">A - Upper-alpha</button>\n                <button class="editor-btn djs-set-type" data-value="a">a - Lower-alpha</button>\n            </div>\n        </div>\n    ',t+='\n        <div class="editor-col editor-btn-area" data-group="all">\n            <button class="editor-btn">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-arrow-up" href="#icon-arrow-up"></use>\n                </svg>\n\n                move up block\n            </button>\n        </div>\n    ',t+='\n        <div class="editor-col editor-btn-area" data-group="all">\n            <button class="editor-btn">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-arrow-down" href="#icon-arrow-down"></use>\n                </svg>\n\n                move down block\n            </button>\n        </div>\n    ',t+='\n        <div class="editor-col editor-btn-area" data-group="word">\n            <button class="editor-btn">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path" xlink:href="#icon-word-block" href="#icon-word-block"></use>\n                </svg>\n\n                make word block\n            </button>\n        </div>\n    ',t+='\n        <div class="editor-col editor-btn-area --noline" data-group="all">\n            <button class="editor-btn djs-delete-block">\n                <svg viewBox="0 0 64 64" class="icon">\n                    <use class="path --red" xlink:href="#icon-delete-block" href="#icon-delete-block"></use>\n                </svg>\n\n                delete block\n            </button>\n        </div>\n    ',t+="</div>",t}(),condition.wrap.insertAdjacentHTML("afterend",t)}function c(){return'<button class="scroll-bar djs-scroll-bar" style="transform:translateY(0)"></button>'}function a(t,e=o(t,"string")){let n;switch(t){case"textBlock":n=function(t="",e=o(t,"string")){return`<p class="editor-item djs-item --djs-selected" contenteditable="true" data-type="text">${t}</p>`}();break;case"ulBlock":n=function(t=[""],e=o(t,Array)){let n='<ul class="editor-item djs-item --djs-selected" data-type="ul">';return t.forEach(t=>{n+=`<li contenteditable="true">${t}</li>`}),n+="</ul>",n}();break;case"olBlock":n=function(t=[""],e=o(t,Array)){let n='<ol type="1" class="editor-item djs-item --djs-selected" data-type="ol">';return t.forEach(t=>{n+=`<li contenteditable="true">${t}</li>`}),n+="</ol>",n}();break;case"quotaionBlock":n='<blockquote class="editor-item djs-item --djs-selected" data-type="quote"><p class="text" contenteditable="true"></p><p class="author" contenteditable="true"></p></blockquote>';break;case"tableBlock":n='\n        <div class="editor-item djs-item --djs-selected" data-type="table">\n            <div class="scroll">\n                <table class="table">\n                    <caption contenteditable="true"></caption>\n                    <colgroup>\n                        <col data-size="100">\n                        <col data-size="100">\n                        <col data-size="100">\n                        <col data-size="100">\n                    </colgroup>\n                    <tbody>\n                        <tr>\n                            <th contenteditable="true" data-x="0" data-y="0"></th>\n                            <th contenteditable="true" data-x="1" data-y="0"></th>\n                            <th contenteditable="true" data-x="2" data-y="0"></th>\n                            <th contenteditable="true" data-x="3" data-y="0"></th>\n                        </tr>\n                        <tr>\n                            <td contenteditable="true" data-x="0" data-y="1"></td>\n                            <td contenteditable="true" data-x="1" data-y="1"></td>\n                            <td contenteditable="true" data-x="2" data-y="1"></td>\n                            <td contenteditable="true" data-x="3" data-y="1"></td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n        </div>\n    ';break;case"codeBlock":n='\n        <pre class="editor-item djs-item --djs-selected" data-type="codeblock" data-theme="default" data-lang="text"><code class="nohighlight editor-code" contenteditable="true"></code></pre>\n    ';break;default:n=""}return n}function l(t,e=o(t,"string")){return`<div class="editor-item djs-item --djs-selected" data-type="emoticon">${t}</div>`}function r(t,e=o(t,"string")){return`\n        <div class="editor-item djs-item --djs-selected" data-type="youtube">\n            <iframe src="https://www.youtube.com/embed/${t}" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="editor-iframe"></iframe>\n        </div>\n    `}function d(t,e,n=300,i=o(t,"string"),s=o(e,"string"),c=o(n,"number")){return`\n        <div class="editor-item djs-item --djs-selected" data-type="codepen">\n            <iframe height="${n}" title="" src="https://codepen.io/${t}/embed/${e}?height=${n}&theme-id=${condition.codepenTheme}&default-tab=result" allowfullscreen class="editor-iframe"></iframe>\n            <button class="editor-btn-resize djs-resize-height">Resize height</button>\n        </div>\n    `}function u(t,e=o(t,"object")){return`\n        <div class="editor-item djs-item --djs-selected" data-type="linkbox">\n            <a href="${t.url}" target="_blank" rel="nofollow" class="editor-linkbox editor-clearfix" draggable="false">\n                <div class="editor-linkbox-img">\n                    <img src="${t.img}" alt="미리보기 이미지" class="editor-img" draggable="false">\n                </div>\n\n                <div class="editor-linkbox-text">\n                    <p class="editor-title">${t.title}</p>\n                    <p class="editor-description">${t.description}</p>\n                    <p class="editor-domain">${t.domain}</p>\n                </div>\n            </a>\n        </div>\n    `}function g(t){let e="";t.forEach(t=>{"image"==t.type?e+=`\n                <button class="editor-emoticon djs-add-emoticon">\n                    <img src="${t.value}" alt="${t.caption}" class="img">\n                </button>\n            `:"svg"==t.type&&(e+=`\n                <button class="editor-emoticon djs-add-emoticon">\n                    ${t.value}\n                </button>\n            `)}),condition.listEmoticon.insertAdjacentHTML("beforeend",e)}function p(t){condition.listMedia.insertAdjacentHTML("beforeend","")}},function(t,e,n){"use strict";n.r(e),n.d(e,"setEvent",(function(){return y})),n.d(e,"bindingScrollEvent",(function(){return w})),n.d(e,"setEmoticonBtnEvent",(function(){return L}));const{typeCheckThrow:o,eventBinding:i,classControl:s,hasClass:c,fetchURL:a}=n(0),{getElement:l,findParentByClass:r,getChild:d,getActiveElement:u}=n(1),{setScroll:g,getScrollInfo:p}=n(9),{getDefaultBlockHTML:b,getYoutubeBlock:f,getCodepenBlock:h,getLinkboxBlock:m,getEmoticonBlockHTML:v}=n(7),{setCursor:k}=n(10),{openPop:x}=n(11),{message:j}=n(6);function y(){!function(){let t;i(window,"resize",(function(e){clearTimeout(t),t=setTimeout(()=>{condition.windowWidth=window.innerWidth,condition.windowHeight=window.innerHeight},250)})),i(document,"click",(function(t){let e=t.target,n=l(".djs-trigger"),o=null!=r(e,"djs-trigger");0==(null!=r(e,"djs-btn-ignore"))&&0==o&&n.length>0&&s(n,"remove","--act")})),i(condition.btnToggleTarget,"click",(function(t){let e=this.dataset.target,n=l(e,!1),o=l(".djs-trigger"),i=c(n,".djs-scroll");o.forEach(t=>{if(t!==n&&(s(t,"remove","--act"),1==i)){n.querySelector(".djs-scroll-content").scrollTo(0,0)}}),s(n,"toggle","--act")}))}(),i(condition.btnChangeLang,"click",(function(){let t=this.dataset.value;s(condition.btnChangeLang,"remove","--act"),s(this,"add","--act"),console.log(condition.lang),condition.triggerLangChange(t)})),i(condition.btnSwitchDevice,"click",(function(){s(condition.areaContent,"toggle","--mobile"),s(this,"toggle","--act")})),i(condition.btnAddBlock,"click",(function(){let t=this.dataset.type,e=this.dataset.value;if("block"===t){let t=u(),n=b(e),o=l(".--djs-selected");t.insertAdjacentHTML("afterend",n),k(t.nextElementSibling,0),o.length>0&&s(o,"remove","--djs-selected"),condition.activeItem=t.nextElementSibling}else"pop"===t?x(e,this):"file"===t&&openFile(e)})),i(condition.btnLinkbox,"click",(async function(){let t,e=u(),n=l(".--djs-selected"),o=d(condition.popLinkbox,".djs-input",!1),i=o.value,c=this.dataset.value,r=!1;if("linkbox"==c){let e={};if(condition.regList.defaultURL.test(i)){if(s(this,"add","--ing"),""===condition.linkBoxApi){let n=await a("https://api.allorigins.win/get?url="+i);if(!1!==n.respon){let o=n.contents,s=new RegExp('property=\\"og:title\\"',"g"),c=new RegExp('([^])*\\<title>([^"]*)<\\/title>([^]*)',"g"),a=new RegExp('([^]*)\\<meta property=\\"og:title\\" content=\\"([^"]*)(?=\\")"([^]*)',"g"),l=new RegExp('property=\\"og:image\\"',"g"),d=new RegExp('([^])*\\<meta name=\\"image\\" content=\\"([^"]*)"\\>([^]*)',"g"),u=new RegExp('([^])*\\<meta property=\\"og:image\\" content=\\"([^"]*)(?=\\")([^]*)',"g"),g=new RegExp('property=\\"og:description\\"',"g"),p=new RegExp('([^])*\\<meta name=\\"description\\" content=\\"([^"]*)(?=\\")([^]*)',"g"),b=new RegExp('([^])*\\<meta property=\\"og:description\\" content=\\"([^"]*)(?=\\")([^]*)',"g");if(1==s.test(o)?e.title=o.replace(a,"$2"):e.title=o.replace(c,"$2"),1==l.test(o))e.img=o.replace(u,"$2");else{let t=o.replace(d,"$2");t.length>500?e.img="":e.img=t}if(1==g.test(o))e.description=o.replace(b,"$2");else{let t=o.replace(p,"$2");t.length>500?e.description="":e.description=t}i.indexOf("://")>-1?e.domain=i.split("/")[2]:e.domain=i.split("/")[0],e.domain=e.domain.split(":")[0],e.url=i,t=m(e),r=!0}else console.error(n.error),alert(j.apiNotWorking)}else console.log("self!");s(this,"remove","--ing")}}else if("youtube"==c){if(condition.regList.youtubeURL.test(i)){let e=i.replace(condition.regList.youtubeCode,"$7");t=f(e),r=!0}}else if("codepen"==c){if(condition.regList.codepenURL.test(i)){let e=i.replace(condition.regList.codepenCode,"$2"),n=i.replace(condition.regList.codepenCode,"$4");t=h(e,n),r=!0}}else"word"==c&&console.log("word");1==r?(e.insertAdjacentHTML("afterend",t),k(e.nextElementSibling,0),n.length>0&&s(n,"remove","--djs-selected"),condition.activeItem=e.nextElementSibling,o.value="",s(condition.popLinkbox,"remove","--act")):(s(condition.popLinkbox,"add","--wrong"),o.focus(),setTimeout(()=>{s(condition.popLinkbox,"remove","--wrong")},1e3))})),i(d(condition.popLinkbox,".djs-input",!1),"keydown",(function(t){if("Enter"==t.code){let t=document.createEvent("HTMLEvents");t.initEvent("click",!0,!1),condition.btnLinkbox.dispatchEvent(t)}})),g(),console.log("set content event")}function w(t,e=o(t,Node)){let n=d(t,".djs-scroll-content",!1),s=d(t,".djs-scroll-bar",!1),c=p(t),a={activity:!1,mouseY:0,scrollY:0};i(n,"scroll",(function(){let t=this.scrollTop,e=Math.floor(100/c.maxScrollTop*t),n=Math.floor(e/100*c.maxBarTop);s.style.transform=`translateY(${n}px)`})),i(t,"mousemove",(function(t){if(1==a.activity){let e=-(a.mouseY-t.clientY),o=a.scrollY+e;n.scrollTo(0,o)}})),i(s,"mousedown",(function(t){a.activity=!0,a.mouseY=t.clientY,a.scrollY=n.scrollTop})),i(t,"mouseup",(function(){a.activity=!1}))}function L(){condition.btnEmoticon=d(condition.listEmoticon,".djs-add-emoticon"),i(condition.btnEmoticon,"click",(function(){let t=this.innerHTML.trim(),e=v(t),n=u(),o=l(".--djs-selected");n.insertAdjacentHTML("afterend",e),o.length>0&&s(o,"remove","--djs-selected"),condition.activeItem=n.nextElementSibling}))}},function(t,e,n){"use strict";n.r(e),n.d(e,"setScroll",(function(){return a})),n.d(e,"refreshScroll",(function(){return r})),n.d(e,"getScrollInfo",(function(){return d}));const{typeCheckThrow:o}=n(0),{getChild:i}=n(1),{scrollButtonHTML:s}=n(7),{bindingScrollEvent:c}=n(8);function a(){condition.scrollArea.forEach(t=>{t.insertAdjacentHTML("beforeend",s()),l(t),c(t)})}function l(t,e=o(t,Node)){let n=i(t,".djs-scroll-bar",!1),s=d(t);n.style.height=s.scrollHeight+"px"}function r(){condition.scrollArea.forEach(t=>{l(t),c(t)})}function d(t,e=o(t,Node)){let n,s,c,a,l=i(t,".djs-scroll-content",!1),r=t.getBoundingClientRect(),d=l.getBoundingClientRect(),u=i(t,".djs-scroll-content > *"),g=r.height-10,p=0;return u.forEach(t=>{p+=t.getBoundingClientRect().height}),p<g&&(p=g),n=100/p*g,s=Math.floor(n/100*g),c=p-d.height,a=d.height-8-s,s==g&&(s=0),{scrollHeight:s,contentHeight:p,maxScrollTop:c,maxBarTop:a}}},function(t,e,n){"use strict";n.r(e),n.d(e,"setCursor",(function(){return i}));const{typeCheckThrow:o}=n(0);function i(t,e,n=o(t,Node),i=o(e,"number")){let s=Boolean(t.contentEditable),c=window.getSelection(),a=document.createRange();!0!==s&&(t=t.querySelector('*[contentEditable="true"]')),a.setStart(t,e),a.collapse(!0),c.removeAllRanges(),c.addRange(a)}},function(t,e,n){"use strict";n.r(e),n.d(e,"openPop",(function(){return a}));const{typeCheckThrow:o,classControl:i}=n(0),{getElement:s,getChild:c}=n(1);function a(t,e,n=o(t,"string"),c=o(e,Node)){let a=s(".djs-trigger"),r=e.getBoundingClientRect();switch(i(a,"remove","--act"),t){case"linkboxBlock":l("linkbox",r);break;case"emoticonBlock":i(condition.popEmoticon,"toggle","--act");break;case"youtubeBlock":l("youtube",r);break;case"codepenBlock":l("codepen",r)}}function l(t,e={},n=o(t,"string"),s=o(e,"object")){let a=c(condition.popLinkbox,".djs-input",!1),l=c(condition.popLinkbox,".djs-btn",!1),r=condition.windowWidth-e.right+(e.width+10);"word"==t?(l.dataset.value=t,condition.popLinkbox.dataset.type=e.type,l.dataset.type=e.type):(l.dataset.value=t,a.value="",condition.popLinkbox.style.top=e.top+"px",condition.popLinkbox.style.right=r+"px"),i(condition.popLinkbox,"toggle","--act")}}])}));