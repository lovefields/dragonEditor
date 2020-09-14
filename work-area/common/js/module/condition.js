const { typeCheckThrow, typeCheckBoolean } = require("./default");
const { getElement, checkElement } = require("./selector");
const { message } = require("./message");

export class storage {
    constructor(wrap, options) {
        this.wrap = checkElement(wrap, ".editor-dragon", false);

        this.setMessage(options.message);
        this.setStatus(options);
    }

    setMessage(data = {}, _0 = typeCheckThrow(data, Object)) {
        let check = ["apiNotWorking"];

        for (const [key, value] of Object.entries(data)) {
            if (check.indexOf(key) > -1) {
                message[key] = value;
            } else {
                console.warn(message.wrongKey("message", key));
            }
        }
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
        this.focusOffset;
        this.baseOffset;
        this.regList = {
            defaultURL: new RegExp("https?:\\/\\/(\\w*:\\w*@)?[-\\w.]+(:\\d+)?(\\/([\\w\\/_.]*(\\?\\S+)?)?)?", "i"),
            youtubeURL: new RegExp("(https:\\/\\/)?(www\\.)?youtu(be)?\\.(be|com)?", "i"),
            youtubeCode: new RegExp("((https:\\/\\/)?(www\\.)?youtu(be)?\\.(be|com)\\/(embed\\/|watch\\?v=)?)([^=\\/& :]*)(.*)", "i"),
            codepenURL: new RegExp("codepen.io", "g"),
            codepenCode: new RegExp("(https:\\/\\/codepen\\.io\\/)(\\w*)\\/(pen|embed)\\/([A-Za-z]*)(.*)", "i"),
        };
        this.mode = typeCheckBoolean(options.mode, "string") ? options.mode : "editor";
        this.multiLang = typeCheckBoolean(options.multiLang, "boolean") ? options.multiLang : true;
        this.changePint = typeCheckBoolean(options.changePint, "number") ? options.changePint : 800;
        this.maxImageWidth = typeCheckBoolean(options.maxImageWidth, "number") ? options.maxImageWidth : 700;
        this.maxCodepenHeight = typeCheckBoolean(options.maxCodepenHeight, "number") ? options.maxCodepenHeight : 1000;
        this.useWebp = typeCheckBoolean(options.useWebp, "boolean") ? options.useWebp : true;
        this.codepenTheme = typeCheckBoolean(options.codepenTheme, "string") ? options.codepenTheme : "dark";
        this.blockName = typeCheckBoolean(options.blockName, Object) ? options.blockName : {};
        this.removeMenu = typeCheckBoolean(options.removeMenu, Array) ? options.removeMenu : [];
        this.frontSize = typeCheckBoolean(options.frontSize, Array) ? options.frontSize : [12, 14, 16, 18, 20, 24, 28, 30, 34, 38];
        this.codeTheme = typeCheckBoolean(options.codeTheme, Array) ? options.codeTheme : ["default", "vs2015", "androidstudio", "monokai"];
        this.codeLang = typeCheckBoolean(options.codeLang, Array) ? options.codeLang : ["text", "css", "html", "xml", "json", "java", "javascript", "markdown", "objective-c", "php", "python", "sql", "shell", "kotlin", "swift"];
        this.colorList = typeCheckBoolean(options.colorList, Array)
            ? options.colorList
            : [
                  "#fff",
                  "#efefef",
                  "#ccc",
                  "#999",
                  "#777",
                  "#555",
                  "#333",
                  "#e6b8af",
                  "#dd7e6b",
                  "#cc4125",
                  "#980000",
                  "#a61c00",
                  "#85200c",
                  "#5b0f00",
                  "#f4cccc",
                  "#ea9999",
                  "#e06666",
                  "#ff0000",
                  "#cc0000",
                  "#990000",
                  "#660000",
                  "#fce5cd",
                  "#f9cb9c",
                  "#f6b36b",
                  "#ff9900",
                  "#e69138",
                  "#b45f06",
                  "#783f04",
                  "#fff2cc",
                  "#ffe599",
                  "#ffd966",
                  "#ffff00",
                  "#f1c232",
                  "#bf9000",
                  "#7f6000",
                  "#d9ead3",
                  "#b6d7a8",
                  "#93c47d",
                  "#00ff00",
                  "#6aa84f",
                  "#38761d",
                  "#274e13",
                  "#d0e0e3",
                  "#a2c4c9",
                  "#76a5af",
                  "#00ffff",
                  "#45818e",
                  "#134f5c",
                  "#0c343d",
                  "#c9daf8",
                  "#a4c2f4",
                  "#6d9eeb",
                  "#4a87e8",
                  "#3c78d8",
                  "#1156cc",
                  "#1c4587",
                  "#cfe2f3",
                  "#9fc5e8",
                  "#6fa8dc",
                  "#0000ff",
                  "#3d85c6",
                  "#0b5394",
                  "#073763",
                  "#d9d2e9",
                  "#b4a7d6",
                  "#8e7cc3",
                  "#9900ff",
                  "#674ea7",
                  "#351c75",
                  "#20124d",
                  "#ead1dc",
                  "#d5a6bd",
                  "#c27ba0",
                  "#ff00ff",
                  "#a64d79",
                  "#741b47",
                  "#4c1130",
              ];
        this.addMenu = typeCheckBoolean(options.addMenu, Object) ? options.addMenu : {};
        this.addLang = typeCheckBoolean(options.addLang, Array) ? options.addLang : [];
        this.emoticonData = typeCheckBoolean(options.emoticonData, Array) ? options.emoticonData : [];
        this.triggerLangChange = typeCheckBoolean(options.triggerLangChange, "function") ? options.triggerLangChange : () => {};
        this.multiUpload = typeCheckBoolean(options.multiUpload, "boolean") ? options.multiUpload : false;
        this.defaultLinkBoxImage = typeCheckBoolean(options.defaultLinkBoxImage, "string") ? options.defaultLinkBoxImage : "https://via.placeholder.com/600x300.png";
        this.linkBoxApi = typeCheckBoolean(options.linkBoxApi, "string") ? options.linkBoxApi : "";

        this.setUploadURL(options.uploadURL);
        this.setLang(options.lang);
        this.setContentData();
        this.setBlockMenu();
        this.addLanguage();
    }

    setUploadURL(url = "") {
        if (url == "") {
            this.uploadURL = "";
            return;
        }

        if (typeCheckBoolean(url, "string") == true) {
            if (this.regList["defaultURL"].test(url) == true || url.substr(0, 1) == "/") {
                this.uploadURL = url;
            } else {
                console.warn(message.wrongURL("uploadURL", url));
                this.uploadURL = "";
            }
        } else {
            console.warn(message.wrongURL("uploadURL", url));
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
                type: "block",
            },
            imageBlock: {
                text: "Image",
                icon: "#icon-image-block",
                type: "file",
            },
            ulBlock: {
                text: "Unnumbered list",
                icon: "#icon-ul-block",
                type: "block",
            },
            olBlock: {
                text: "Numbered list",
                icon: "#icon-ol-block",
                type: "block",
            },
            quotaionBlock: {
                text: "Quotaion",
                icon: "#icon-quotaion-block",
                type: "block",
            },
            tableBlock: {
                text: "Table",
                icon: "#icon-table-block",
                type: "block",
            },
            linkboxBlock: {
                text: "Link box",
                icon: "#icon-linkbox-block",
                type: "pop",
            },
            emoticonBlock: {
                text: "Emoticon",
                icon: "#icon-emoticon-block",
                type: "pop",
            },
            youtubeBlock: {
                text: "Youtube",
                icon: "#icon-youtube-block",
                type: "pop",
            },
            codepenBlock: {
                text: "Codepen",
                icon: "#icon-codepen-block",
                type: "pop",
            },
            codeBlock: {
                text: "Code",
                icon: "#icon-code-block",
                type: "block",
            },
        };

        for (const [key, value] of Object.entries(this.blockName)) {
            if (typeCheckBoolean(value, "string") == true) {
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

    setElement(data) {
        this.scrollArea = getElement(".djs-scroll");
        this.btnToggleTarget = getElement(".djs-toggle-target");
        this.btnAddBlock = getElement(".djs-add-block");
        this.areaContent = getElement(".djs-content", false);
        this.uploadForm = getElement(".djs-uploader", false);
        this.uploadInput = getElement(".djs-uploader .djs-file", false);
        this.popEmoticon = getElement(".djs-emoticon-pop", false);
        this.popFolder = getElement(".djs-folder-pop", false);
        this.popLinkbox = getElement(".djs-linkbox-pop", false);
        this.btnLinkbox = getElement(".djs-linkbox-pop .djs-btn", false);
        this.listEmoticon = getElement(".djs-list-emoticon", false);
        this.listMedia = getElement(".djs-list-media", false);
        this.popOption = getElement(".djs-option-pop", false);
        this.btnSwitchDevice = checkElement(data.btnSwitchDevice, ".djs-switch-device", false);
        this.btnChangeLang = checkElement(data.btnChangeLang, ".djs-change-lang");
    }
}
