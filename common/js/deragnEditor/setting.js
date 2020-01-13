import { checkElement } from './selector';

export default class setting {
	constructor(wrap, options){
		this.startTextCursor = 0;
		this.endTextCursor = 0;
		this.activeElement;
		this.focusNode;
		this.baseNode;
		this.langStatus = 'ko';
		this.windowWidth = window.innerWidth;
		this.windowHeight = window.innerHeight;
		this.changePint = typeof options.changePint !== 'number' ? 1120 : options.changePint;
		this.maxImageWidth = typeof options.maxImageWidth !== 'number' ? 800 : options.maxImageWidth;
		this.maxCodepenHeight = typeof options.maxCodepenHeight !== 'number' ? 1000 : options.maxCodepenHeight;
		this.popOptionHeight = typeof options.popOptionHeight !== 'number' ? 30 : options.popOptionHeight;
		this.useWebp = true;
		this.loading = true;
		this.codepenTheme = typeof options.codepenTheme !== 'string' ? 'dark' : options.codepenTheme;
		this.multiUpload = typeof options.multiUpload !== 'boolean' ? false : options.multiUpload;
		this.mediaUploadURL = typeof options.mediaUploadURL !== 'string' ? '' : options.mediaUploadURL;
		this.mediaUpdateURL = typeof options.mediaUpdateURL !== 'string' ? '' : options.mediaUpdateURL;
		this.mediaDelURL = typeof options.mediaDelURL !== 'string' ? '' : options.mediaDelURL;
		this.linkBoxApi = typeof options.linkBoxApi !== 'string' ? '' : options.linkBoxApi;
		this.defaultLinkBoxImage = typeof options.defaultLinkBoxImage !== 'string' ? './common/img/img_cover.png' : options.defaultLinkBoxImage;
		
		this.makeLinkBoxType = typeof options.makeLinkBoxType !== 'self' ? 'self' : 'api';
		this.makeLinkBoxURL = typeof options.makeLinkBoxURL !== 'string' ? '' : options.makeLinkBoxURL;
		this.imageIconId = typeof options.imageIconId !== 'string' ? '#icon_image' : options.imageIconId;
		this.youtubeIconId = typeof options.youtubeIconId !== 'string' ? '#icon_youtube' : options.youtubeIconId;
		this.codepenIconId = typeof options.codepenIconId !== 'string' ? '#icon_codepen' : options.codepenIconId;

		this.contentAreaName = typeof options.contentArea !== 'string' ? '.content_area' : options.contentArea;
		this.popOptionsName = typeof options.popOptions !== 'string' ? '.pop_options' : options.popOptions;
		this.popLinkName = typeof options.popLink !== 'string' ? '.pop_link_box' : options.popLink;
		this.stickerListName = typeof options.stickerList !== 'string' ? '.pop_sticker' : options.stickerList;
		this.contentAddListName = typeof options.contentAddList !== 'string' ? '.pop_content_list' : options.contentAddList;
		this.addMediaListBtnName = typeof options.addMediaListBtn !== 'string' ? '.btn_add_media_list' : options.addMediaListBtn;

		this.wrap = checkElement(wrap, '.editor_area');
		this.editorSection = checkElement(options.editorSection, '.editor_section');
		this.contentArea = checkElement(options.contentArea, '.content_area');
		this.contentAddList = checkElement(options.contentAddList, '.pop_content_list');
		this.mediaList = checkElement(options.mediaList, '.pop_media .media_list');
		this.popMedia = checkElement(options.popMedia, '.pop_media');
		this.popLang = checkElement(options.popLang, '.pop_lang');
		this.popBgArea = checkElement(options.popBgArea, '.pop_bg');
		this.popOptions = checkElement(options.popOptions, '.pop_options');
		this.popLink = checkElement(options.popLink, '.pop_link_box');
		this.lodingArea = checkElement(options.lodingArea, '.pop_loding');
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
		this.HTMLBtn = '<div class="btn lastset" data-type="btn" data-value="[type]"><svg viewbox="0 0 50 50" class="icon"><use class="path" xlink:href="[icon_id]" href="[icon_id]" /></svg>[text]</div>';
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

		this.messageNotSelecCodepen = typeof options.messageNotSelecCodepen !== 'string' ? `You didn't select Codepen` : options.messageNotSelecCodepen;
		this.messageNotSelecImage = typeof options.messageNotSelecImage !== 'string' ? `You didn't select image` : options.messageNotSelecImage;
		this.messageWrongURL = typeof options.messageWrongURL !== 'string' ? `Please enter a valid URL.\nYou must enter http or https first.` : options.messageWrongURL;
		this.messageNotSelect = typeof options.messageNotSelect !== 'string' ? `No item selected Please try again.` : options.messageNotSelect;
		this.messageNoData = typeof options.messageNoData !== 'string' ? `Could not get data` : options.messageNoData;
		this.messageExceedSize = typeof options.messageExceedSize !== 'string' ? `Can't exceed [size]px` : options.messageExceedSize;
		this.messageWrongNode = typeof options.messageWrongNode !== 'string' ? 'Wrong cursor pointer' : options.messageWrongNode;
		this.messageNotAnchorTag = typeof options.messageNotAnchorTag !== 'string' ? 'Active item is not link' : options.messageNotAnchorTag;
		this.messageWrongValue = typeof options.messageWrongValue !== 'string' ? 'Wrong value' : options.messageWrongValue;
		this.messageWrongUrlType = typeof options.messageWrongUrlType !== 'string' ? 'Wrong URL type.' : options.messageWrongUrlType;
		this.messageDelImage = typeof options.messageDelImage !== 'string' ? 'All images of the document you area creating will also disappear.\nAre you sure you want to delete it?' : options.messageDelImage;
		this.messageDuplicateContent = typeof options.messageDuplicateContent !== 'string' ? 'This language not have content.\nDo you want duplicate to content?' : options.messageDuplicateContent;
		this.messageNotSetAjax = 'Didn\'t setting Ajax url.';

		this.linkBoxData = {};
		this.contentData = {
			'ko' : [],
			'en' : [],
			'es' : []
		};
		this.logData = [];
	}
}