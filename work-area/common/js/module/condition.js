const { typeCheckThrow, typeCheckBoolean } = require("./default");
const { checkElement } = require("./selector");
const { message } = require("./message");

export class condition {
    constructor(wrap, options) {
        this.wrap = checkElement(wrap, ".editor-dragon", false);

        this.setStatus(options);
    }

    setStatus(options) {
        this.log = [];
        this.linkBoxData = {};
        this.langCategory = ["en", "ko"];
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        this.enterCount = 0;
        this.startTextCursor = 0;
        this.endTextCursor = 0;
        this.activeItem;
        this.activeElement;
        this.focusNode;
        this.baseNode;

        this.changePint = typeCheckBoolean(options.changePint, "number") ? options.changePint : 800;
        this.maxImageWidth = typeCheckBoolean(options.maxImageWidth, "number") ? options.maxImageWidth : 800;
        this.maxCodepenHeight = typeCheckBoolean(options.maxCodepenHeight, "number") ? options.maxCodepenHeight : 1000;
        this.useWebp = typeCheckBoolean(options.useWebp, "boolean") ? options.useWebp : true;
        this.codepenTheme = typeCheckBoolean(options.codepenTheme, "string") ? options.codepenTheme : "dark";
        this.uploadURL = typeCheckBoolean(options.uploadURL, "string") ? options.uploadURL : "";
        this.blockName = typeCheckBoolean(options.blockName, Object) ? options.blockName : {};
        this.removeMenu = typeCheckBoolean(options.removeMenu, Array) ? options.removeMenu : [];
        this.addMenu = typeCheckBoolean(options.addMenu, Object) ? options.addMenu : {};
        this.addLang = typeCheckBoolean(options.addLang, Array) ? options.addLang : [];

        this.setLang(options.lang);
        this.setContentData();
        this.setBlockMenu();
        this.addLanguage();
    }

    setLang(lang) {
        if (typeCheckBoolean(lang, "undefined") == true) {
            this.lang = this.langCategory[0];
        } else {
            if (typeCheckBoolean(lang, "string") == true) {
                let index = this.langCategory.indexOf(lang);
                if (index > -1) {
                    this.lang = this.langCategory[index];
                } else {
                    this.langCategory.unshift(lang);
                    this.lang = this.langCategory[0];
                }
            } else {
                console.warn(message.wrongValue("lang"));
                this.lang = this.langCategory[0];
            }
        }
    }

    addLanguage() {
        let list = [];

        this.addLang.forEach((lang) => {
            if (typeCheckBoolean(lang, "string")) {
                if (lang.length == 2) {
                    list.push(lang);
                }
            }
        });

        this.langCategory = [...new Set(this.langCategory.concat(list))];
        delete this.addLang;
    }

    setContentData() {
        let data = {};

        this.langCategory.forEach((lang) => {
            data[lang] = [];
        });

        this.contentData = data;
    }

    setBlockMenu() {
        let defaultMenu = {
            textBlock: {
                text: typeCheckBoolean(this.blockName.textBlock, "string") ? this.blockName.textBlock : "Text",
                icon: "#icon-text-block",
            },
            imageBlock: {
                text: typeCheckBoolean(this.blockName.imageBlock, "string") ? this.blockName.imageBlock : "Image",
                icon: "#icon-image-block",
            },
            ulBlock: {
                text: typeCheckBoolean(this.blockName.ulBlock, "string") ? this.blockName.ulBlock : "Unnumbered list",
                icon: "#icon-ul-block",
            },
            olBlock: {
                text: typeCheckBoolean(this.blockName.olBlock, "string") ? this.blockName.olBlock : "Numbered list",
                icon: "#icon-ol-block",
            },
            quotaionBlock: {
                text: typeCheckBoolean(this.blockName.quotaionBlock, "string") ? this.blockName.quotaionBlock : "Quotaion",
                icon: "#icon-quotaion-block",
            },
            tableBlock: {
                text: typeCheckBoolean(this.blockName.tableBlock, "string") ? this.blockName.tableBlock : "Table",
                icon: "#icon-table-block",
            },
            linkboxBlock: {
                text: typeCheckBoolean(this.blockName.linkboxBlock, "string") ? this.blockName.linkboxBlock : "Link box",
                icon: "#icon-linkbox-block",
            },
            emoticonBlock: {
                text: typeCheckBoolean(this.blockName.emoticonBlock, "string") ? this.blockName.emoticonBlock : "Emoticon",
                icon: "#icon-emoticon-block",
            },
            youtubeBlock: {
                text: typeCheckBoolean(this.blockName.youtubeBlock, "string") ? this.blockName.youtubeBlock : "Youtube",
                icon: "#icon-youtube-block",
            },
            codepenBlock: {
                text: typeCheckBoolean(this.blockName.codepenBlock, "string") ? this.blockName.codepenBlock : "Codepen",
                icon: "#icon-codepen-block",
            },
            codeBlock: {
                text: typeCheckBoolean(this.blockName.codeBlock, "string") ? this.blockName.codeBlock : "Code",
                icon: "#icon-code-block",
            },
        };

        if (this.uploadURL == "") {
            delete defaultMenu.imageBlock;
        }

        this.removeMenu.forEach((item) => {
            delete defaultMenu[item];
        });

        for (const [key, value] of Object.entries(this.addMenu)) {
            defaultMenu[key] = {
                text: value.text,
                icon: value.icon,
            };
        }

        this.defaultMenu = defaultMenu;
    }

    setElement() {
        console.log("set Element");
    }

    /*
        

        this.multiUpload = typeof options.multiUpload !== 'boolean' ? false : options.multiUpload;
        this.mediaUploadURL = typeof options.mediaUploadURL !== 'string' ? '' : options.mediaUploadURL;
        this.mediaUpdateURL = typeof options.mediaUpdateURL !== 'string' ? '' : options.mediaUpdateURL;
        this.mediaDelURL = typeof options.mediaDelURL !== 'string' ? '' : options.mediaDelURL;
        this.linkBoxApi = typeof options.linkBoxApi !== 'string' ? '' : options.linkBoxApi;
        this.defaultLinkBoxImage = typeof options.defaultLinkBoxImage !== 'string' ? 'https://via.placeholder.com/600x300.png' : options.defaultLinkBoxImage;
        
        this.makeLinkBoxType = typeof options.makeLinkBoxType !== 'self' ? 'self' : 'api';
        this.makeLinkBoxURL = typeof options.makeLinkBoxURL !== 'string' ? '' : options.makeLinkBoxURL;
        this.imageIconId = typeof options.imageIconId !== 'string' ? '#icon_image' : options.imageIconId;
        this.youtubeIconId = typeof options.youtubeIconId !== 'string' ? '#icon_youtube' : options.youtubeIconId;
        this.codepenIconId = typeof options.codepenIconId !== 'string' ? '#icon_codepen' : options.codepenIconId;

        this.contentAreaName = typeof options.contentArea !== 'string' ? '.content_area' : options.contentArea;
        this.popOptionsName = typeof options.popOptions !== 'string' ? '.pop_options' : options.popOptions;
        this.popLinkName = typeof options.popLink !== 'string' ? '.pop_link_box' : options.popLink;
        this.stickerListName = typeof options.stickerList !== 'string' ? '.pop_sticker' : options.stickerList;
        this.addMediaListBtnName = typeof options.addMediaListBtn !== 'string' ? '.btn_add_media_list' : options.addMediaListBtn;

        
        this.contentArea = checkElement(options.contentArea, '.content_area');
        this.mediaList = checkElement(options.mediaList, '.pop_media .media_list');
        this.popMedia = checkElement(options.popMedia, '.pop_media');
        this.popLang = checkElement(options.popLang, '.pop_lang');
        if(this.loading === true){
            this.popBgArea = checkElement(options.popBgArea, '.pop_bg');
            this.lodingArea = checkElement(options.lodingArea, '.pop_loding');
        }
        this.popOptions = checkElement(options.popOptions, '.pop_options');
        this.popLink = checkElement(options.popLink, '.pop_link_box');
        this.fileInput = checkElement(options.fileInput, '.file_check');
        this.uploadForm = checkElement(options.uploadForm, '.file_uploader');
        this.contentAddBtn = checkElement(options.contentAddBtn, '.btn_add_content', 'multi');
        this.viewBtn = checkElement(options.viewBtn, '.btn_mod');
        this.popBtns = checkElement(options.popBtn, '.btn_pop', 'multi');
        this.popCloseBtns = checkElement(options.popCloseBtns, '.btn_pop_close', 'multi');
        this.fontSizeSelect = checkElement(options.fontSizeSelect, '.select_font_size');
        this.btnColorSelect = checkElement(options.colorSelect, '.select_color');
        this.btnColor = checkElement(options.colorSelect, '.btn_set_color', 'multi');
        this.textAlgin = checkElement(options.textAlgin, '.btn_text_algin', 'multi');
        this.listTypeSelect = checkElement(options.listTypeSelect, '.select_list_type');
        this.colSizeSelect = checkElement(options.colSizeSelect, '.select_col');
        this.themeSelect = checkElement(options.themeSelect, '.select_theme');
        this.languageSelect = checkElement(options.languageSelect, '.select_language');
        this.changeThBtn = checkElement(options.changeThBtn, '.btn_change_th');
        this.changeTdBtn = checkElement(options.changeTdBtn, '.btn_change_td');
        this.widthInput = checkElement(options.widthInput, '.options_width .value');
        this.heightInput = checkElement(options.heightInput, '.options_height .value');
        this.urlInput = checkElement(options.urlInput, '.options_url .value');
        this.changeUrlBtn = checkElement(options.changeUrlBtn, '.btn_url_change');
        this.addLinkBtn = checkElement(options.addLinkBtn, '.btn_url_link');
        this.unlinkBtn = checkElement(options.unlinkBtn, '.btn_url_unlink');
        this.boldBtn = checkElement(options.boldBtn, '.btn_bold');
        this.italicBtn = checkElement(options.italicBtn, '.btn_italic');
        this.underlineBtn = checkElement(options.underlineBtn, '.btn_underline');
        this.strikeBtn = checkElement(options.strikeBtn, '.btn_strike');
        this.wordblockBtn = checkElement(options.wordblockBtn, '.btn_wordblock');
        this.contentDelBtn = checkElement(options.contentDelBtn, '.btn_del_content');
        this.languageChangeBtn = checkElement(options.languageChangeBtn, '.btn_chang_lang', 'multi');
        this.addMediaListBtn = checkElement(options.addMediaListBtn, '.btn_add_media_list');

        this.HTMLTextBlock = '<p class="item item_text lastset" contenteditable="true" data-type="text">[content]</p>';
        this.HTMLBtn = '<div class="btn lastset" data-type="btn" data-value="[type]"><svg viewbox="[icon_size]" class="icon"><use class="path" xlink:href="[icon_id]" href="[icon_id]" /></svg>[text]</div>';
        this.HTMLList = '<[tag] [type] class="item item_list lastset" data-type="[dataType]">[child]</[tag]>';
        this.HTMLChildList = '<li contenteditable="true">[content]</li>';
        this.HTMLsticker = '<div class="item item_sticker lastset" data-type="sticker">[el]</div>';
        this.HTMLQuote = '<blockquote class="item item_quote lastset" data-type="quote"><p class="text" contenteditable="true"></p><p class="author" contenteditable="true"></p></blockquote>';
        this.HTMLTable = '<div class="item item_table_area" data-type="table"><div class="scroll"><table class="item_table"><caption contenteditable="true"></caption><colgroup><col class="size_100"><col class="size_100"><col class="size_100"><col class="size_100"></colgroup><tbody><tr><th contenteditable="true" data-x="0" data-y="0"></th><th contenteditable="true" data-x="1" data-y="0"></th><th contenteditable="true" data-x="2" data-y="0"></th><th contenteditable="true" data-x="3" data-y="0"></th></tr><tr><td contenteditable="true" data-x="0" data-y="1"></td><td contenteditable="true" data-x="1" data-y="1"></td><td contenteditable="true" data-x="2" data-y="1"></td><td contenteditable="true" data-x="3" data-y="1"></td></tr></tbody></table></div><button class="btn btn_col_add">Add col</button><button class="btn btn_col_del">Remove col</button><button class="btn btn_row_add">Add row</button><button class="btn btn_row_del">Remove row</button></div>';
        this.HTMLCodeBlock = '<pre class="item item_codeblock lastset" data-type="codeblock" data-theme="default" data-lang="text"><code class="nohighlight" contenteditable="true"></code></pre>';
        this.HTMLLinkBox = '<div class="item lastset" data-type="link_box"><a href="[url]" target="_blank" rel="nofollow" class="link_box clearfix" draggable="false"><div class="img_area"><img src="[imgSrc]" alt="미리보기 이미지" class="img" draggable="false"></div><div class="text_area"><p class="link_title ellipsis">[title]</p><p class="link_description ellipsis">[description]</p><p class="link_domain">[domain]</p></div></a></div>';
        this.HTMLOption = '<option value="[value]">[text]</option>';
        this.HTMLMediaRow = '<li class="btn_add_media" data-webp="[webp]" data-idx="[idx]"><div class="img_area"><img src="[src]" alt="[alt]" width="[width]" data-height="[height]" class="img"></div><p class="name">[name]</p><button class="btn_remove_media" data-idx="[idx]">삭제</button></li>';
        this.HTMLImageType01 = '<picture class="item item_image lastset" data-type="image">[source]<img src="[src]" width="[width]" alt="[alt]" class="img"></picture>';
        this.HTMLImageSource = '<source srcset="[webp]" type="image/webp">';
        this.HTMLImageType02 = '<div class="item item_image lastset" data-type="image"><img src="[src]" width="[width]" alt="[alt]" class="img"></div>';
        this.HTMLYoutube = '<div class="item item_video lastset" data-type="youtube"><iframe src="[src]" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="video"></iframe></div>';
        this.HTMLCodepen = '<div class="item item_codepen lastset" data-type="codepen"><iframe height="[height]" title="" src="[src]" allowfullscreen class="iframe"></iframe></div>';

        this.srcReg = new RegExp('(.*)\\.((jpg|png|gif|webp|bmp))', 'i');
        this.youtubeReg = new RegExp('www.youtube.com', 'g');
        this.youtubeCodeReg = new RegExp('((https:\\/\\/)?(www\\.)?youtu(be)?\\.(be|com)\\/(embed\\/|watch\\?v=)?)([^=\\/& :]*)(.*)', 'i');
        this.codepenReg = new RegExp('codepen.io', 'g');
        this.codepenCodeReg = new RegExp('(https:\\/\\/codepen\\.io\\/)(\\w*)\\/(pen|embed)\\/([A-Za-z]*)(.*)', 'i');
        this.urlReg = new RegExp('https?:\\/\\/(\\w*:\\w*@)?[-\\w.]+(:\\d+)?(\\/([\\w\\/_.]*(\\?\\S+)?)?)?', 'i');
        this.numberReg = new RegExp('[0-9]', 'g');
        this.classReg = {
            'color' : new RegExp('color_[a-z0-9_]*', 'i'),
            'size' : new RegExp('size_[0-9]*', 'i'),
            'align' : new RegExp('align_(left|center|right)*', 'i')
        };
        this.classList = ['color', 'size', 'align'];

        

        
        */
}
