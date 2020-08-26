const { typeCheckThrow, typeCheckBoolean } = require("./default");
const { getElement, checkElement } = require("./selector");
const { message } = require("./message");

export class condition {
    constructor(wrap, options) {
        this.wrap = checkElement(wrap, ".editor-dragon", false);

        this.setStatus(options);
        this.setMessage(options.message);
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

        this.multiLang = typeCheckBoolean(options.multiLang, "boolean") ? options.multiLang : true;
        this.changePint = typeCheckBoolean(options.changePint, "number") ? options.changePint : 800;
        this.maxImageWidth = typeCheckBoolean(options.maxImageWidth, "number") ? options.maxImageWidth : 800;
        this.maxCodepenHeight = typeCheckBoolean(options.maxCodepenHeight, "number") ? options.maxCodepenHeight : 1000;
        this.useWebp = typeCheckBoolean(options.useWebp, "boolean") ? options.useWebp : true;
        this.codepenTheme = typeCheckBoolean(options.codepenTheme, "string") ? options.codepenTheme : "dark";
        this.blockName = typeCheckBoolean(options.blockName, Object) ? options.blockName : {};
        this.removeMenu = typeCheckBoolean(options.removeMenu, Array) ? options.removeMenu : [];
        this.addMenu = typeCheckBoolean(options.addMenu, Object) ? options.addMenu : {};
        this.addLang = typeCheckBoolean(options.addLang, Array) ? options.addLang : [];
        this.triggerLangChange = typeCheckBoolean(options.triggerLangChange, "function") ? options.triggerLangChange : () => {};
        this.multiUpload = typeCheckBoolean(options.multiUpload, "boolean") ? false : options.multiUpload;

        this.setUploadURL(options.uploadURL);
        this.setLang(options.lang);
        this.setContentData();
        this.setBlockMenu();
        this.addLanguage();
    }

    setUploadURL(url) {
        if (typeCheckBoolean(url, "string") == true) {

        } else {
            this.uploadURL = "";
        }
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
                text: "Text",
                icon: "#icon-text-block",
            },
            imageBlock: {
                text: "Image",
                icon: "#icon-image-block",
            },
            ulBlock: {
                text: "Unnumbered list",
                icon: "#icon-ul-block",
            },
            olBlock: {
                text: "Numbered list",
                icon: "#icon-ol-block",
            },
            quotaionBlock: {
                text: "Quotaion",
                icon: "#icon-quotaion-block",
            },
            tableBlock: {
                text: "Table",
                icon: "#icon-table-block",
            },
            linkboxBlock: {
                text: "Link box",
                icon: "#icon-linkbox-block",
            },
            emoticonBlock: {
                text: "Emoticon",
                icon: "#icon-emoticon-block",
            },
            youtubeBlock: {
                text: "Youtube",
                icon: "#icon-youtube-block",
            },
            codepenBlock: {
                text: "Codepen",
                icon: "#icon-codepen-block",
            },
            codeBlock: {
                text: "Code",
                icon: "#icon-code-block",
            },
        };

        for (const [key, value] of Object.entries(this.blockName)) {
            if(typeCheckBoolean(value, "string") == true){
                defaultMenu[key].text = value;
            }
        }
        delete this.blockName;

        if (this.uploadURL == "") {
            delete defaultMenu.imageBlock;
        }

        this.removeMenu.forEach((item) => {
            delete defaultMenu[item];
        });
        delete this.removeMenu;

        for (const [key, value] of Object.entries(this.addMenu)) {
            defaultMenu[key] = {
                text: value.text,
                icon: value.icon,
                fn: value.fn,
            };
        }
        delete this.addMenu;

        this.defaultMenu = defaultMenu;
    }

    setElement(data) {
        this.btnToggleTarget = getElement(".djs-toggle-target");
        this.btnOpenTarget = getElement(".djs-open-target");
        this.uploadForm = getElement(".djs-uploader", false);
        this.uploadInput = getElement(".djs-uploader .djs-file", false);

        this.areaContent = checkElement(data.contentArea, ".djs-content", false);

        this.btnAddBlock = checkElement(data.btnAddBlock, ".djs-add-block");
        this.btnSwitchDevice = checkElement(data.btnSwitchDevice, ".djs-switch-device", false);
        this.btnChangeLang = checkElement(data.btnChangeLang, ".djs-change-lang");

        this.popEmoticon = checkElement(data.popEmoticon, ".djs-emoticon-pop");
        this.popFolder = checkElement(data.popFolder, ".djs-folder-pop");

        // this.mediaList = checkElement(options.mediaList, '.pop_media .media_list');
        // this.popMedia = checkElement(options.popMedia, '.pop_media');
        // this.popLang = checkElement(options.popLang, '.pop_lang');
        // this.popBgArea = checkElement(options.popBgArea, '.pop_bg');
        // this.lodingArea = checkElement(options.lodingArea, '.pop_loding');
        // this.popOptions = checkElement(options.popOptions, '.pop_options');
        // this.popLink = checkElement(options.popLink, '.pop_link_box');
        // this.fileInput = checkElement(options.fileInput, '.file_check');
        // this.uploadForm = checkElement(options.uploadForm, '.file_uploader');
        // this.contentAddBtn = checkElement(options.contentAddBtn, '.btn_add_content', 'multi');
        // this.viewBtn = checkElement(options.viewBtn, '.btn_mod');
        // this.popBtns = checkElement(options.popBtn, '.btn_pop', 'multi');
        // this.popCloseBtns = checkElement(options.popCloseBtns, '.btn_pop_close', 'multi');
        // this.fontSizeSelect = checkElement(options.fontSizeSelect, '.select_font_size');
        // this.btnColorSelect = checkElement(options.colorSelect, '.select_color');
        // this.btnColor = checkElement(options.colorSelect, '.btn_set_color', 'multi');
        // this.textAlgin = checkElement(options.textAlgin, '.btn_text_algin', 'multi');
        // this.listTypeSelect = checkElement(options.listTypeSelect, '.select_list_type');
        // this.colSizeSelect = checkElement(options.colSizeSelect, '.select_col');
        // this.themeSelect = checkElement(options.themeSelect, '.select_theme');
        // this.languageSelect = checkElement(options.languageSelect, '.select_language');
        // this.changeThBtn = checkElement(options.changeThBtn, '.btn_change_th');
        // this.changeTdBtn = checkElement(options.changeTdBtn, '.btn_change_td');
        // this.widthInput = checkElement(options.widthInput, '.options_width .value');
        // this.heightInput = checkElement(options.heightInput, '.options_height .value');
        // this.urlInput = checkElement(options.urlInput, '.options_url .value');
        // this.changeUrlBtn = checkElement(options.changeUrlBtn, '.btn_url_change');
        // this.addLinkBtn = checkElement(options.addLinkBtn, '.btn_url_link');
        // this.unlinkBtn = checkElement(options.unlinkBtn, '.btn_url_unlink');
        // this.boldBtn = checkElement(options.boldBtn, '.btn_bold');
        // this.italicBtn = checkElement(options.italicBtn, '.btn_italic');
        // this.underlineBtn = checkElement(options.underlineBtn, '.btn_underline');
        // this.strikeBtn = checkElement(options.strikeBtn, '.btn_strike');
        // this.wordblockBtn = checkElement(options.wordblockBtn, '.btn_wordblock');
        // this.contentDelBtn = checkElement(options.contentDelBtn, '.btn_del_content');
        // this.languageChangeBtn = checkElement(options.languageChangeBtn, '.btn_chang_lang', 'multi');
        // this.addMediaListBtn = checkElement(options.addMediaListBtn, '.btn_add_media_list');

        console.log("set Element");
    }

    setMessage(message){

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
