import setting from './setting';
import { setStorage, getContentJSON } from './content';
let storage;

class index {
	constructor(wrap = '.editor_area', options = {}){
		this.setting(wrap, options);
		this.bindingEvent();
		this.closeLoding();
	}

	setting(wrap, options){
		let $this = this;

		$this.startTextCursor = 0;
		$this.endTextCursor = 0;
		$this.activeElement;
		$this.focusNode;
		$this.baseNode;
		$this.langStatus = 'ko';
		$this.windowWidth = window.innerWidth;
		$this.windowHeight = window.innerHeight;
		$this.changePint = typeof options.changePint !== 'number' ? 1120 : options.changePint;
		$this.maxImageWidth = typeof options.maxImageWidth !== 'number' ? 800 : options.maxImageWidth;
		$this.maxCodepenHeight = typeof options.maxCodepenHeight !== 'number' ? 1000 : options.maxCodepenHeight;
		$this.clickCehck = false;
		$this.useWebp = true;
		$this.codepenTheme = typeof options.codepenTheme !== 'string' ? 'dark' : options.codepenTheme;
		$this.multiUpload = typeof options.multiUpload !== 'boolean' ? false : options.multiUpload;
		$this.mediaUploadURL = typeof options.mediaUploadURL !== 'string' ? '' : options.mediaUploadURL;
		$this.mediaUpdateURL = typeof options.mediaUpdateURL !== 'string' ? '' : options.mediaUpdateURL;
		$this.mediaDelURL = typeof options.mediaDelURL !== 'string' ? '' : options.mediaDelURL;
		
		$this.makeLinkBoxType = typeof options.makeLinkBoxType !== 'self' ? 'self' : 'api';
		$this.makeLinkBoxURL = typeof options.makeLinkBoxURL !== 'string' ? '' : options.makeLinkBoxURL;
		$this.imageIconId = typeof options.imageIconId !== 'string' ? '#icon_image' : options.imageIconId;
		$this.youtubeIconId = typeof options.youtubeIconId !== 'string' ? '#icon_youtube' : options.youtubeIconId;
		$this.codepenIconId = typeof options.codepenIconId !== 'string' ? '#icon_codepen' : options.codepenIconId;

		$this.contentAreaName = typeof options.contentArea !== 'string' ? '.content_area' : options.contentArea;
		$this.popOptionsName = typeof options.popOptions !== 'string' ? '.pop_options' : options.popOptions;
		$this.popLinkName = typeof options.popLink !== 'string' ? '.pop_link_box' : options.popLink;
		$this.stickerListName = typeof options.stickerList !== 'string' ? '.pop_sticker' : options.stickerList;
		$this.contentAddListName = typeof options.contentAddList !== 'string' ? '.pop_content_list' : options.contentAddList;
		$this.addMediaListBtnName = typeof options.addMediaListBtn !== 'string' ? '.btn_add_media_list' : options.addMediaListBtn;

		$this.wrap = $this.checkOptionElement(wrap, '.editor_area');
		$this.editorSection = $this.checkOptionElement(options.editorSection, '.editor_section');
		$this.contentArea = $this.checkOptionElement(options.contentArea, '.content_area');
		$this.contentAddList = $this.checkOptionElement(options.contentAddList, '.pop_content_list');
		$this.mediaList = $this.checkOptionElement(options.mediaList, '.pop_media .media_list');
		$this.popMedia = $this.checkOptionElement(options.popMedia, '.pop_media');
		$this.popLang = $this.checkOptionElement(options.popLang, '.pop_lang');
		$this.popBgArea = $this.checkOptionElement(options.popBgArea, '.pop_bg');
		$this.popOptions = $this.checkOptionElement(options.popOptions, '.pop_options');
		$this.popLink = $this.checkOptionElement(options.popLink, '.pop_link_box');
		$this.lodingArea = $this.checkOptionElement(options.lodingArea, '.pop_loding');
		$this.fileInput = $this.checkOptionElement(options.fileInput, '.file_check');
		$this.uploadForm = $this.checkOptionElement(options.uploadForm, '.file_uploader');
		$this.contentAddBtn = $this.checkOptionElement(options.contentAddBtn, '.btn_add_content', 'multi');
		$this.viewBtn = $this.checkOptionElement(options.viewBtn, '.btn_mod');
		$this.popBtns = $this.checkOptionElement(options.popBtn, '.btn_pop', 'multi');
		$this.popCloseBtns = $this.checkOptionElement(options.popCloseBtns, '.btn_pop_close', 'multi');
		$this.fontSizeSelect = $this.checkOptionElement(options.fontSizeSelect, '.select_font_size');
		$this.btnColorSelect = $this.checkOptionElement(options.colorSelect, '.select_color');
		$this.btnColor = $this.checkOptionElement(options.colorSelect, '.btn_set_color', 'multi');
		$this.textAlgin = $this.checkOptionElement(options.textAlgin, '.btn_text_algin', 'multi');
		$this.listTypeSelect = $this.checkOptionElement(options.listTypeSelect, '.select_list_type');
		$this.colSizeSelect = $this.checkOptionElement(options.colSizeSelect, '.select_col');
		$this.themeSelect = $this.checkOptionElement(options.themeSelect, '.select_theme');
		$this.languageSelect = $this.checkOptionElement(options.languageSelect, '.select_language');
		$this.changeThBtn = $this.checkOptionElement(options.changeThBtn, '.btn_change_th');
		$this.changeTdBtn = $this.checkOptionElement(options.changeTdBtn, '.btn_change_td');
		$this.widthInput = $this.checkOptionElement(options.widthInput, '.options_width .value');
		$this.heightInput = $this.checkOptionElement(options.heightInput, '.options_height .value');
		$this.urlInput = $this.checkOptionElement(options.urlInput, '.options_url .value');
		$this.changeUrlBtn = $this.checkOptionElement(options.changeUrlBtn, '.btn_url_change');
		$this.addLinkBtn = $this.checkOptionElement(options.addLinkBtn, '.btn_url_link');
		$this.unlinkBtn = $this.checkOptionElement(options.unlinkBtn, '.btn_url_unlink');
		$this.boldBtn = $this.checkOptionElement(options.boldBtn, '.btn_bold');
		$this.italicBtn = $this.checkOptionElement(options.italicBtn, '.btn_italic');
		$this.underlineBtn = $this.checkOptionElement(options.underlineBtn, '.btn_underline');
		$this.strikeBtn = $this.checkOptionElement(options.strikeBtn, '.btn_strike');
		$this.wordblockBtn = $this.checkOptionElement(options.wordblockBtn, '.btn_wordblock');
		$this.contentDelBtn = $this.checkOptionElement(options.contentDelBtn, '.btn_del_content');
		$this.languageChangeBtn = $this.checkOptionElement(options.languageChangeBtn, '.btn_chang_lang', 'multi');
		$this.addMediaListBtn = $this.checkOptionElement(options.addMediaListBtn, '.btn_add_media_list');

		$this.HTMLTextBlock = '<p class="item item_text lastset" contenteditable="true" data-type="text">[content]</p>';
		$this.HTMLBtn = '<div class="btn lastset" data-type="btn" data-value="[type]"><svg viewbox="0 0 50 50" class="icon"><use class="path" xlink:href="[icon_id]" href="[icon_id]" /></svg>[text]</div>';
		$this.HTMLList = '<[tag] [type] class="item item_list lastset" data-type="[dataType]">[child]</[tag]>';
		$this.HTMLChildList = '<li contenteditable="true">[content]</li>';
		$this.HTMLsticker = '<div class="item item_sticker lastset" data-type="sticker">[el]</div>';
		$this.HTMLQuote = '<blockquote class="item item_quote lastset" data-type="quote"><p class="text" contenteditable="true"></p><p class="author" contenteditable="true"></p></blockquote>';
		$this.HTMLTable = '<div class="item item_table_area" data-type="table"><div class="scroll"><table class="item_table"><caption contenteditable="true"></caption><colgroup><col class="size_100"><col class="size_100"><col class="size_100"><col class="size_100"></colgroup><tbody><tr><th contenteditable="true" data-x="0" data-y="0"></th><th contenteditable="true" data-x="1" data-y="0"></th><th contenteditable="true" data-x="2" data-y="0"></th><th contenteditable="true" data-x="3" data-y="0"></th></tr><tr><td contenteditable="true" data-x="0" data-y="1"></td><td contenteditable="true" data-x="1" data-y="1"></td><td contenteditable="true" data-x="2" data-y="1"></td><td contenteditable="true" data-x="3" data-y="1"></td></tr></tbody></table></div><button class="btn btn_col_add">Add col</button><button class="btn btn_col_del">Remove col</button><button class="btn btn_row_add">Add row</button><button class="btn btn_row_del">Remove row</button></div>';
		$this.HTMLCodeBlock = '<pre class="item item_codeblock lastset" data-type="codeblock" data-theme="default" data-lang="text"><code class="nohighlight" contenteditable="true"></code></pre>';
		$this.HTMLLinkBox = '<div class="item lastset" data-type="link_box"><a href="[url]" target="_blank" rel="nofollow" class="link_box clearfix" draggable="false"><div class="img_area"><img src="[imgSrc]" alt="미리보기 이미지" class="img" draggable="false"></div><div class="text_area"><p class="link_title ellipsis">[title]</p><p class="link_description ellipsis">[description]</p><p class="link_domain">[domain]</p></div></a></div>';
		$this.HTMLOption = '<option value="[value]">[text]</option>';
		//$this.HTMLPositionBar = '<div class="position_bar"></div>';
		$this.HTMLMediaRow = '<li class="btn_add_media" data-webp="[webp]" data-idx="[idx]"><div class="img_area"><img src="[src]" alt="[alt]" width="[width]" data-height="[height]" class="img"></div><p class="name">[name]</p><button class="btn_remove_media" data-idx="[idx]">삭제</button></li>';
		$this.HTMLImageType01 = '<picture class="item item_image lastset" data-type="image">[source]<img src="[src]" width="[width]" alt="[alt]" class="img"></picture>';
		$this.HTMLImageSource = '<source srcset="[webp]" type="image/webp">';
		$this.HTMLImageType02 = '<div class="item item_image lastset" data-type="image"><img src="[src]" width="[width]" alt="[alt]" class="img"></div>';
		$this.HTMLYoutube = '<div class="item item_video lastset" data-type="youtube"><iframe src="[src]" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="video"></iframe></div>';
		$this.HTMLCodepen = '<div class="item item_codepen lastset" data-type="codepen"><iframe height="[height]" title="" src="[src]" allowfullscreen class="iframe"></iframe></div>';

		$this.srcReg = new RegExp('(.*)\\.((jpg|png|gif|webp|bmp))', 'i');
		$this.youtubeReg = new RegExp('www.youtube.com', 'g');
		$this.youtubeCodeReg = new RegExp('((https:\\/\\/)?(www\\.)?youtu(be)?\\.(be|com)\\/(embed\\/|watch\\?v=)?)([^=\\/& :]*)(.*)', 'i');
		$this.codepenReg = new RegExp('codepen.io', 'g');
		$this.codepenCodeReg = new RegExp('(https:\\/\\/codepen\\.io\\/)(\\w*)\\/(pen|embed)\\/([A-Za-z]*)(.*)', 'i');
		$this.urlReg = new RegExp('https?:\\/\\/(\\w*:\\w*@)?[-\\w.]+(:\\d+)?(\\/([\\w\\/_.]*(\\?\\S+)?)?)?', 'i');
		$this.numberReg = new RegExp('[0-9]', 'g');
		$this.classReg = {
			'color' : new RegExp('color_[a-z0-9_]*', 'i'),
			'size' : new RegExp('size_[0-9]*', 'i'),
			'align' : new RegExp('align_(left|center|right)*', 'i')
		};
		$this.classList = ['color', 'size', 'align'];

		$this.messageNotSelecCodepen = typeof options.messageNotSelecCodepen !== 'string' ? `You didn't select Codepen` : options.messageNotSelecCodepen;
		$this.messageNotSelecImage = typeof options.messageNotSelecImage !== 'string' ? `You didn't select image` : options.messageNotSelecImage;
		$this.messageWrongURL = typeof options.messageWrongURL !== 'string' ? `Please enter a valid URL.\nYou must enter http or https first.` : options.messageWrongURL;
		$this.messageNotSelect = typeof options.messageNotSelect !== 'string' ? `No item selected Please try again.` : options.messageNotSelect;
		$this.messageNoData = typeof options.messageNoData !== 'string' ? `Could not get data` : options.messageNoData;
		$this.messageExceedSize = typeof options.messageExceedSize !== 'string' ? `Can't exceed [size]px` : options.messageExceedSize;
		$this.messageWrongNode = typeof options.messageWrongNode !== 'string' ? 'Wrong cursor pointer' : options.messageWrongNode;
		$this.messageNotAnchorTag = typeof options.messageNotAnchorTag !== 'string' ? 'Active item is not link' : options.messageNotAnchorTag;
		$this.messageWrongValue = typeof options.messageWrongValue !== 'string' ? 'Wrong value' : options.messageWrongValue;
		$this.messageWrongUrlType = typeof options.messageWrongUrlType !== 'string' ? 'Wrong URL type.' : options.messageWrongUrlType;
		$this.messageDelImage = typeof options.messageDelImage !== 'string' ? 'All images of the document you area creating will also disappear.\nAre you sure you want to delete it?' : options.messageDelImage;
		$this.messageDuplicateContent = typeof options.messageDuplicateContent !== 'string' ? 'This language not have content.\nDo you want duplicate to content?' : options.messageDuplicateContent;
		$this.messageNotSetAjax = 'Didn\'t setting Ajax url.';

		$this.linkBoxData = {};
		$this.contentData = {
			'ko' : {},
			'en' : {},
			'es' : {}
		};
		$this.logData = [];
	}

	bindingEvent(){
		let $this = this;
		if($this.mediaUploadURL === '' || $this.mediaUpdateURL === '' || $this.mediaDelURL === ''){
			console.warn($this.messageNotSetAjax);
			return;
		}
		$this.activeElement = $this.wrap;

		if($this.windowWidth > $this.changePint){
			$this.contentAddList.classList.add('act');
		}else if($this.windowWidth < $this.changePint){
			$this.contentAddList.classList.remove('act');
		}

		if($this.multiUpload === true){
			$this.fileInput.setAttribute('multiple', true);
		}

		let resizeFn;
		window.addEventListener('resize', function(){
			clearTimeout(resizeFn);
			resizeFn = setTimeout(() => {
				$this.windowWidth = window.innerWidth;
				$this.windowHeight = window.innerHeight;

				if($this.windowWidth > $this.changePint){
					$this.contentAddList.classList.add('act');
				}else if($this.windowWidth < $this.changePint){
					$this.contentAddList.classList.remove('act');
				}
				return;
			}, 250);
		});

		// right click block and content menu open
		document.addEventListener('contextmenu', function(e){
			e.preventDefault();
		});

		document.addEventListener('mouseup', function(e){
			if(typeof e === 'object'){
				let target = e.target;
				if(e.button === 0){
					let $pop = $this.findParent(target, 'pop');
					let $btnPop = $this.findParent(target, 'btn_pop');
					let $popEl = $this.getElList('.pop');

					$popEl.forEach(function(item){
						if($btnPop === false){
							item.classList.remove('act');
						}else{
							let name = $btnPop.dataset['target'];

							if(item !== $this.getEl(name)){
								item.classList.remove('act');
							}
						}

						if($this.windowWidth > $this.changePint){
							$this.contentAddList.classList.add('act');
						}
					});

					$this.popBtns.forEach(function(btn){
						if($btnPop !== btn && !btn.classList.contains('select_color')){
							btn.classList.remove('act');
						}
					});

					if($pop !== false){
						$pop.classList.add('act');
					}
				}
			}
		});

		document.addEventListener('keydown', function(e){
			let activeElName = document.activeElement.constructor.name;

			if(activeElName === 'HTMLBodyElement'){
				let ctrl;

				if(e.ctrlKey === true || e.metaKey === true){
					ctrl = true;
				}

				if(e.key === 'z'){
					if(ctrl === true){
						e.preventDefault();
						$this.actionPrev();
					}else if(ctrl === true && e.shiftKey === true){
						e.preventDefault();
						$this.actionNext();
					}
				}
			}
		});

		document.addEventListener('paste', function(e){
			console.log('paste', e);
		});

		document.addEventListener('copy', function(e){
			console.log('copy', e);
		});

		window.addEventListener('scroll', function(e){
			//if($this.windowWidth > $this.changePint){
			//	document.activeElement.blur();
			//	$this.popOptions.classList.remove('act');
			//}
		});

		let setDrag;
		const dragStartFn = function(e){
			let el = this;
			$this.dragStartEvent(e, el);
		};
		const dragOverFn = function(e){
			clearTimeout(setDrag);
			let el = this;
			setDrag = setTimeout(() => {
				$this.dragOverEvent(e, el);
			}, 10);
		};
		const dragEndFn = function(e){
			let el = this;
			$this.dragEndEvent(e, el);
		};

		let clickFn;
		$this.contentArea.addEventListener('click', function(e){
			clearTimeout(clickFn);
			clickFn = setTimeout(() => {
				if(e.button === 0 || e.isTrusted === false){
					$this.contentCheckByMouse(e.target, 'click');
					$this.checkOptionsValue(e.target);
					$this.tableConstrol(e.target);
				}
			}, 150);
		});

		let overFn;
		$this.contentArea.addEventListener('mouseover', function(e){
			clearTimeout(overFn);
			overFn = setTimeout(() => {
				if($this.windowWidth > $this.changePint){
					$this.contentCheckByMouse(e.target, 'mouseover');
					$this.checkOptionsValue(e.target);
				}
			}, 250);
		});

		// key event control
		$this.contentArea.addEventListener('keydown', function(e){
			$this.keybroadControl(e);
		});

		// content add event
		$this.contentAddBtn.forEach(function($btn){
			$btn.addEventListener('click', function(){
				let type = this.dataset['value'];
				let childCount = $this.contentArea.childElementCount;
				let $lastEl = $this.getEl('.lastset');
				let $target = $lastEl === false ? $this.contentArea.children[childCount - 1] : $lastEl

				switch(type){
					case 'text':
						$this.addTextBlock($target);
					break;
					case 'image':
						$this.addBtn($target, $this.imageIconId, 'image', 'Add on image');
						$this.fileInput.dataset['type'] = 'image';
						$this.fileInput.setAttribute('accept', 'image/*');
						$this.fileInput.click();
					break;
					case 'sticker':
						$this.addSticker($target, this);
					break;
					case 'youtube':
						$this.addBtn($target, $this.youtubeIconId, 'youtube', 'Add Youtube');
					break;
					case 'codepen':
						$this.addBtn($target, $this.codepenIconId, 'codepen', 'Add Codepen');
					break;
					case 'bulletedlist':
						$this.addList($target, 'ul');
					break;
					case 'numberedlist':
						$this.addList($target, 'ol', '1');
					break;
					case 'quote':
						$this.addQuote($target);
					break;
					case 'table':
						$this.addTable($target);
					break;
					case 'codeblock':
						$this.addCodeBlock($target);
					break;
					case 'link':
						$this.addLinkBox($target, $this.linkBoxData);
						$this.popLink.classList.remove('act');
						$this.popLink.querySelector('.url').value = '';
						$this.popLink.querySelector('.view').innerHTML = '';
						$this.popLink.querySelector('.btn_submit').setAttribute('disabled', 'true');
					break;
				}
			});
		});

		// change view size
		$this.viewBtn.addEventListener('click', function(){
			$this.editorSection.classList.toggle('mobile');
			this.classList.toggle('act');
		});

		// pop btns work
		$this.popBtns.forEach(function($btn){
			$btn.addEventListener('click', function(){
				let target = this.dataset['target'];
				let type = this.dataset['type'];
				let $el = $this.getEl(target);
				let btnOffset = this.getBoundingClientRect();
				let optionsOffset = $this.popOptions.getBoundingClientRect();

				$el.removeAttribute('style');
				$el.classList.toggle('act');
				if(type === 'position' && $this.windowWidth > $this.changePint){
					let x = Math.floor(btnOffset.left - optionsOffset.left);
					$el.style.cssText = `transform:translate(${x}px, 30px)`;
				}else{
					this.classList.toggle('act');
				}
			});
		});

		$this.popCloseBtns.forEach(function($btn){
			$btn.addEventListener('click', function(){
				let target = this.dataset['target'];
				let $el = $this.getEl(target);

				$el.removeAttribute('style');
				$el.classList.toggle('act');
			});
		});

		let $linkCheckBtn = $this.getEl($this.popLinkName + ' .btn_check');
		if($linkCheckBtn !== false){
			$linkCheckBtn.addEventListener('click', function(){
				let json = {};
				let $viewEl = $this.getEl($this.popLinkName + ' .view');
				let $submitBtn = $this.getEl($this.popLinkName + ' .btn_submit');
				let url = $this.getEl($this.popLinkName + ' .url').value;

				if($this.urlReg.test(url) === true){
					json.url = url;
					fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
					.then(response => {
						if (response.ok) return response.json();
						throw new Error('Network response was not ok.')
					})
					.then((data) => {
						let contents = data.contents;
						
						if(contents !== null){
							let regTitleCheck = new RegExp('property=\\"og:title\\"', 'g');
							let regTitle01 = new RegExp('([^])*\\<title>([^"]*)<\\/title>([^]*)', 'g');
							let regTitle02 = new RegExp('([^])*\\<meta property=\\"og:title\\" content=\\"([^"]*)"\\>([^]*)', 'g');
							let regImgCheck = new RegExp('property=\\"og:image\\"', 'g');
							let regImg01 = new RegExp('([^])*\\<meta name=\\"image\\" content=\\"([^"]*)"\\>([^]*)', 'g');
							let regImg02 = new RegExp('([^])*\\<meta property=\\"og:image\\" content=\\"([^"]*)"\\>([^]*)', 'g');
							let regDecripCheck = new RegExp('property=\\"og:description\\"', 'g');
							let regDecrip01 = new RegExp('([^])*\\<meta name=\\"description\\" content=\\"([^"]*)"\\>([^]*)', 'g');
							let regDecrip02 = new RegExp('([^])*\\<meta property=\\"og:description\\" content=\\"([^"]*)"\\>([^]*)', 'g');

							if(regTitleCheck.test(contents)){
								json.title = contents.replace(regTitle02, '$2');
							}else{
								json.title = contents.replace(regTitle01, '$2');
							}

							if(regImgCheck.test(contents)){
								json.img = contents.replace(regImg02, '$2');
							}else{
								let img = contents.replace(regImg01, '$2');

								if(img.length > 500){
									json.img = '';
								}else{
									json.img = img;
								}
							}

							if(regDecripCheck.test(contents)){
								json.description = contents.replace(regDecrip02, '$2');
							}else{
								let description = contents.replace(regDecrip01, '$2');

								if(description.length > 500){
									json.description = '';
								}else{
									json.description = description;
								}
							}

							if(url.indexOf("://") > -1){
								json.domain = url.split('/')[2];
							}else{
								json.domain = url.split('/')[0];
							}
						
							json.domain = json.domain.split(':')[0];

							$this.linkBoxData = json;
							$submitBtn.removeAttribute('disabled');
							$this.addLinkBox($viewEl, json, 'afterbegin');
						}else{
							$submitBtn.setAttribute('disabled', 'true');
							$viewEl.innerHTML = $this.messageNoData;
						}
					});
				}else{
					alert($this.messageWrongURL);
				}
			});
		}else{
			console.warn('We need link check button from ' + $this.popLinkName);
		}

		// delete content
		$this.contentDelBtn.addEventListener('click', function(){
			let $target = $this.getEl('.lastset');

			if($target !== null){
				$target.remove();
				$this.popOptions.classList.remove('act');
				let count = $this.contentArea.childElementCount;

				if(count === 1){
					$this.addTextBlock($this.contentArea, '', 'beforeend');
				}
			}else{
				alert($this.messageNotSelect);
			}
		});

		// font size
		$this.fontSizeSelect.addEventListener('change', function(){
			let value = this.value;
			let $target = $this.activeElement;
			let $el = $this.findContenteditable($target);
			let className = $this.getClassName($el.classList.value, 'size');

			if(value === 'default'){
				if(className !== ''){
					$el.classList.remove(className);
				}
			}else{
				if(className !== ''){
					$el.classList.remove(className);
				}
				$el.classList.add(value);
			}
		});

		// color
		$this.btnColor.forEach(function($btn){
			$btn.addEventListener('click', function(){
				let value = this.dataset['class'];
				let list = ['I', 'B', 'S', 'U', 'A', 'SPAN'];
				let $activeEl = $this.activeElement;
				let tagName = $activeEl.tagName;
				let $target = $this.findContenteditable($activeEl);

				if(window.getSelection().focusNode === window.getSelection().baseNode){
					if(list.indexOf(tagName) > 0){
						let className = $this.getClassName($activeEl.classList.value, 'color');

						if(className !== ''){
							$activeEl.classList.remove(className);
						}
						if(value !== 'default'){
							$activeEl.classList.add(value);
						}else{
							if(tagName === 'SPAN'){
								let text = $activeEl.textContent;

								$activeEl.insertAdjacentText('afterend', text);
								$activeEl.remove();
								$target.innerHTML = $target.innerHTML;
								$this.activeElement = $this.wrap;
							}
						}
						$this.btnColorSelect.dataset['class'] = value;
					}else{
						let className = $this.getClassName($target.classList.value, 'color');

						if($this.startTextCursor === $this.endTextCursor){
							if(className !== ''){
								$target.classList.remove(className);
							}
							if(value !== 'default'){
								$target.classList.add(value);
							}
							$this.btnColorSelect.dataset['class'] = value;
						}else{
							$this.wrapElement('color', null, value);
						}
					}
				}else{
					alert($this.messageWrongNode);
				}
			});
		});

		// 텍스트 링크 추가
		$this.addLinkBtn.addEventListener('click', function(){
			let url = $this.urlInput.value;

			if($this.urlReg.test(url) === true){
				let isSameNode = $this.checkSameNode();

				if(isSameNode === true){
					$this.wrapElement('link', url);
				}else{
					alert($this.messageWrongNode);
				}
			}else{
				alert($this.messageWrongURL);
			}
		});

		// remove link
		$this.unlinkBtn.addEventListener('click', function(){
			let $target = $this.activeElement;
			let $el = $this.findContenteditable($target);
			if($target.constructor.name === 'HTMLAnchorElement'){
				let text = $target.textContent;

				$target.insertAdjacentText('afterend', text);
				$target.remove();
				$el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
			}else{
				alrt($this.messageNotAnchorTag);
			}
		});

		// bold
		$this.boldBtn.addEventListener('click', function(){
			$this.makeTextDecoration('b', 'B', 'bold');
		});

		$this.italicBtn.addEventListener('click', function(){
			$this.makeTextDecoration('i', 'I', 'italic');
		});

		$this.underlineBtn.addEventListener('click', function(){
			$this.makeTextDecoration('u', 'U', 'underline');
		});

		$this.strikeBtn.addEventListener('click', function(){
			$this.makeTextDecoration('s', 'S', 'strike');
		});

		$this.wordblockBtn.addEventListener('click', function(){
			if(window.getSelection().focusNode === window.getSelection().baseNode){
				let $target = $this.activeElement;
				let elName = $target.tagName;
				let $el = $this.findContenteditable($target);
				let text = $target.textContent;

				if(elName === 'CODE'){
					$target.insertAdjacentText('afterend', text);
					$target.remove();
					$el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
					$this.activeElement = $this.wrap;
				}else{
					$this.wrapElement('wordblock');
				}
			}else{
				alert($this.messageWrongNode);
			}
		});


		// image width
		$this.widthInput.addEventListener('keyup', function(e){
			if(e.key === 'Enter'){
				let value = this.value;
				let $el = $this.getEl('.lastset .img');
				let massage = $this.messageExceedSize.replace('[size]', $this.maxImageWidth);

				if($el !== false){
					if($this.numberReg.test(value)){
						if(value <= $this.maxImageWidth){
							$el.setAttribute('width', value);
						}else{
							alert(massage);
							this.value = $this.maxImageWidth;
							$el.setAttribute('width', $this.maxImageWidth);
						}
						let offset = $this.getEl('.lastset').getBoundingClientRect();
						$this.openOptionPop(offset, 'img');
					}else{
						alert($this.messageWrongValue);
					}
				}else{
					alert($this.messageNotSelecImage);
				}
			}
		});

		// codepen height
		$this.heightInput.addEventListener('keyup', function(e){
			if(e.key === 'Enter'){
				let value = this.value;
				let $el = $this.getEl('.lastset .iframe');
				let massage = $this.messageExceedSize.replace('[size]', $this.maxCodepenHeight);
				
				if($el !== false){
					if($this.numberReg.test(value)){
						if(value <= $this.maxCodepenHeight){
							$el.setAttribute('height', value);
						}else{
							alert(massage);
							this.value = $this.maxCodepenHeight;
							$el.setAttribute('height', $this.maxCodepenHeight);
						}
						let offset = $this.getEl('.lastset').getBoundingClientRect();
						$this.openOptionPop(offset, 'codepen');
					}else{
						alert($this.messageWrongValue);
					}
				}else{
					alert($this.messageNotSelecCodepen);
				}
			}
		});

		// list type
		$this.listTypeSelect.addEventListener('change', function(){
			let value = this.value;
			let $el = $this.getEl('.lastset');

			if($el !== false){
				$el.setAttribute('type', value);
			}
		});

		// col size
		$this.colSizeSelect.addEventListener('change', function(){
			let value = this.value;
			let elName = $this.activeElement.constructor.name
			let $el = $this.getEl('.lastset');

			if((elName === 'HTMLTableCellElement' || elName === 'HTMLTableCaptionElement') && $el !== false){
				let x = parseInt($this.activeElement.dataset['x']) +1
				let col = $el.querySelector(`col:nth-child(${x})`);
				let className = $this.getClassName(col.classList.value, 'size');

				col.classList.remove(className);
				col.classList.add(value);
			}
		});

		// codeblock theme
		$this.themeSelect.addEventListener('change', function(){
			let value = this.value;
			let $el = $this.getEl('.lastset');

			if($el !== false){
				$el.dataset['theme'] = value;
			}
		});

		// codeblock language
		$this.languageSelect.addEventListener('change', function(){
			let value = this.value;
			let $el = $this.getEl('.lastset');

			if($el !== false){
				let code = $el.childNodes[0];

				$el.dataset['lang'] = value;
				code.classList.value = '';
				code.classList.add(value);
				hljs.highlightBlock(code);
			}
		});

		// ctable td / th change
		$this.changeThBtn.addEventListener('click', function(){
			$this.changeCell('th');
		});

		$this.changeTdBtn.addEventListener('click', function(){
			$this.changeCell('td');
		});

		// text align
		$this.textAlgin.forEach(function(item){
			item.addEventListener('click', function(){
				let type = this.dataset['value'];
				let $target = $this.findContenteditable($this.activeElement) === false ? $this.findParent($this.activeElement, 'item') : $this.findContenteditable($this.activeElement);
				let className = $this.getClassName($target.classList.value, 'align');

				if(className !== ''){
					$target.classList.remove(className);
				}
				$target.classList.add(type);
			});
		});

		// url change
		$this.changeUrlBtn.addEventListener('click', function(){
			let url = $this.urlInput.value;
			let $el = $this.getEl('.lastset');
			let type = $el.dataset['type'];

			switch(true){ // not default
				case $this.urlReg.test(url) === false :
					alert($this.messageWrongURL);
				break;
				case $el === undefined :
					alert($this.messageNotSelect);
				break;
				case type === 'youtube' :
					if($this.youtubeReg.test(url)){
						let video = $el.querySelector('.video');
						video.setAttribute('src', url);
					}else{
						alert($this.messageWrongUrlType);
					}
				break;
				case type === 'codepen' :
					if($this.codepenReg.test(url)){
						let iframe = $el.querySelector('.iframe');
						iframe.setAttribute('src', url);
					}else{
						alert($this.messageWrongUrlType);
					}
				break;
				case type === 'btn' :
					let btnValue = $el.dataset['value'];

					if(btnValue === 'youtube'){
						$this.addYoutube($el, url);
						$el.remove();
						$this.activeElement = $this.contentArea;
					}else if(btnValue === 'codepen'){
						$this.addCodepen($el, url);
						$el.remove();
						$this.activeElement = $this.contentArea;
					}
				break;
			}
		});

		// 파일 업로드
		$this.fileInput.addEventListener('change', function(){
			let contentArea = $this.contentArea;
			let file = this.files;
			let form = new FormData();
			let type = this.dataset['type'];
			let article_idx = contentArea.dataset['idx'];
			let temp_idx = contentArea.dataset['tempIdx'];

			form.append('request_ype', 'upload');
			form.append('file_type', type);
			for(let item of file){
				form.append('file[]', item);
			}
			form.append('article_idx', article_idx);
			form.append('temp_idx', temp_idx);

			// ajax
			$this.ajax('post', $this.mediaUploadURL, form, 'form', (result) => {
				if(result['result'] === true){
					let $el = $this.getEl('.lastset') === false ? $this.getEl(`${$this.contentAreaName} > *:nth-last-child(1)`) : $this.getEl('.lastset');
					let imgList = result['list'];
					let html = '';

					for(let item of imgList){
						let webp = item['webp'] === 'y' ? true : false;
						html += $this.HTMLMediaRow.replace(/\[idx\]/g, item['idx'])
							.replace('[webp]', webp)
							.replace('[height]', item['height'])
							.replace('[width]', item['width'])
							.replace('[src]', `${item['src']}${item['name']}.${item['format']}`)
							.replace('[alt]', item['alt'])
							.replace('[name]', item['alt']);

						$this.addImage($el, {
							'idx' : item['idx'],
							'src' : `${item['src']}${item['name']}`,
							'webp' : webp,
							'format' : item['format'],
							'alt' : item['alt'],
							'width' : item['width'],
							'height' : item['height']
						});
					}

					if($el.classList.contains('btn')){
						$el.remove();
					}
					$this.mediaList.insertAdjacentHTML('beforeend', html);
					$this.popMedia.classList.add('act');
					this.value = '';
				}else{
					alert(result['message']);
				}
			});
		});

		// add media
		$this.addMediaListBtn.addEventListener('click', function(){
			$this.fileInput.dataset['type'] = 'image';
			$this.fileInput.setAttribute('accept', 'image/*');
			$this.fileInput.click();
		});

		// media content
		$this.popMedia.addEventListener('click', function(e){
			let $target = e.target;
			let row = $this.findParent($target, 'btn_add_media');
			let $p = this.querySelector('*[contenteditable]');
			let data;
			
			switch($target.tagName){
				case 'IMG' : 
					let src = $target.getAttribute('src');
					let $el = $this.getEl('.lastset') === false ? $this.getEl(`${$this.contentAreaName} > *:nth-last-child(1)`) : $this.getEl('.lastset');

					data = {
						'width' : $target.getAttribute('width'),
						'height' : $target.dataset['height'],
						'webp' : row.dataset['webp'],
						'alt' : row.querySelector('.name').textContent,
						'src' : src.replace($this.srcReg, '$1'),
						'format' : src.replace($this.srcReg, '$2')
					}

					$this.addImage($el, data);
				break;
				case 'P' : 
					if($p !== null){
						row = $this.findParent($p, 'btn_add_media');
						$p.removeAttribute('contenteditable');
						data = {
							'idx' : row.dataset['idx'],
							'textContent' : $p.textContent
						};

						//ajax
						$this.ajax('post', $this.mediaUpdateURL, data, 'json', function(result){
							if(result['result'] === true){
								let src = row.querySelector('.img').getAttribute('src');
								$this.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
									item.setAttribute('alt', $p.textContent);
								});
							}else{
								alert(result['message']);
							}
						});
					}

					$target.setAttribute('contenteditable', true);
					$target.focus();
				break;
				case 'BUTTON' : 
					if($target.classList.contains($this.addMediaListBtnName.substring(1)) === false){
						let idx = row.dataset['idx'];
						let message = confirm($this.messageDelImage);
						//'작성중인 내용 안의 이미지도 전부 삭제됩니다.\n정말로 삭제하시겠습니까?'

						if(message === true){
							//ajax
							$this.ajax('delete', `${$this.mediaDelURL}/${idx}`, [], 'form', function(result){
								if(result['result'] === true){
									let src = row.querySelector('.img').getAttribute('src');
									$this.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
										item.remove();
										row.remove();
									});
								}else{
									alert(result['message']);
								}
							});
						}
					}
				break;
				default :
					if($p !== null){
						row = $this.findParent($p, 'btn_add_media');
						data = {
							'idx' : row.dataset['idx'],
							'textContent' : $p.textContent
						};
						$p.removeAttribute('contenteditable');

						//ajax
						$this.ajax('post', $this.mediaUpdateURL, data, 'json', function(result){
							if(result['result'] === true){
								let src = row.querySelector('.img').getAttribute('src');
								$this.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
									item.setAttribute('alt', $p.textContent);
								});
							}else{
								alert(result['message']);
							}
						});
					}
			}
		});

		$this.popMedia.addEventListener('keydown', function(e){
			if(e.key === 'Enter'){
				e.preventDefault();
				let row = $this.findParent(e.target, 'btn_add_media');
				let textContent = e.target.textContent;
				let data = {
					'idx' : row.dataset['idx'],
					'textContent' : textContent
				};

				//ajax
				$this.ajax('post', $this.mediaUpdateURL, data, 'json', function(result){
					if(result['result'] === true){
						let src = row.querySelector('.img').getAttribute('src');
						$this.contentArea.querySelectorAll(`*[src="${src}"]`).forEach(function(item){
							item.setAttribute('alt', $p.textContent);
						});
					}else{
						alert(result['message']);
					}
				});
				e.target.removeAttribute('contenteditable');
			}
		});

		$this.languageChangeBtn.forEach(function(btn){
			btn.addEventListener('click', function(){
				let prevLang = $this.langStatus;
				let contentData = $this.getJsonData();
				let lang = this.dataset['value'];
				let jsonData = $this.contentData[lang];
				$this.langStatus = lang;

				$this.languageChangeBtn.forEach(function(btn){
					btn.classList.remove('act');
				});
				this.classList.add('act');

				if(jsonData.length > 0){
					$this.setContent(jsonData);
				}else{
					let message = confirm($this.messageDuplicateContent);

					if(message === true){
						$this.setContent(contentData[prevLang]);
					}else{
						$this.setContent([
							{
								"type" : "title",
								"class" : ["title"],
								"textContent" : ""
							},
							{
								"type" : "text",
								"class" : ["item"],
								"textContent" : ""
							}
						]);
					}
				}
			});
		});

















	}

	changeCell(changeTagName){
		let $target = this.activeElement;
		let tagName = $target.tagName;

		if(tagName !== changeTagName.toUpperCase()){
			let x = $target.dataset['x'];
			let y = $target.dataset['y'];

			$target.insertAdjacentHTML('afterend', `<${changeTagName} contenteditable="true" data-x="${x}" data-y="${y}"></${changeTagName}>`);
			this.activeElement = $target.nextElementSibling;
			$target.nextElementSibling.focus();
			$target.remove();
		}
	}

	checkOptionElement(name, defaultName, type = 'single'){
		let $item;
		if(type ===  'single'){
			$item = typeof name !== 'string' ? this.getEl(defaultName) : this.getEl(name);
		}else{
			$item = typeof name !== 'string' ? this.getElList(defaultName) : this.getElList(name);
		}

		if($item === false){
			console.error('Can not find Element : ' + name);
		}else{
			return $item;
		}
	}

	getEl(name){
		let $el = document.querySelector(name);

		if($el === null){
			return false;
		}else{
			return $el;
		}
	}

	getElList(name){
		let $el = document.querySelectorAll(name);

		if($el.length < 1){
			return false;
		}else{
			return $el;
		}
	}

	findParent($el, name){
		if($el.constructor.name !== 'HTMLBodyElement' && $el.constructor.name !== 'HTMLHtmlElement'){
			let check = $el.classList.contains(name);

			if(check === true){
				return $el;
			}else{
				return this.findParent($el.parentElement, name);
			}
		}else{
			return false;
		}
	}

	findContenteditable(node){
		let constructorName = node.constructor.name;
		let target;

		if(constructorName !== 'HTMLBodyElement'){
			if(constructorName === 'Text'){
				target = node.parentElement;
			}else{
				target = node;
			}

			let hasAttr = target.getAttribute('contenteditable');
			if(hasAttr === 'true'){
				return target;
			}else{
				return this.findContenteditable(target.parentElement);
			}
		}else{
			return false;
		}
	}

	closeLoding(){
		this.popBgArea.classList.remove('act');
		this.lodingArea.classList.remove('act');
	}

	removeLastsetClass($target){
		if($target.classList.contains('lastset') === true){
			$target.classList.remove('lastset');
		}
	}

	addTextBlock($target, content = '', position = 'afterend'){
		this.removeLastsetClass($target);

		let html = this.HTMLTextBlock.replace('[content]', content);

		$target.insertAdjacentHTML(position, html);
		$target.nextElementSibling.focus();
	}

	addBtn($target, icon, type, text){
		this.removeLastsetClass($target);
		let html = this.HTMLBtn.replace(/\[icon_id\]/g, icon)
					.replace(/\[type\]/g, type)
					.replace(/\[text\]/g, text);

		$target.insertAdjacentHTML('afterend', html);
	}

	addSticker($target, sticker){
		this.removeLastsetClass($target);
		let html = this.HTMLsticker.replace('[el]', sticker.innerHTML);
		$target.insertAdjacentHTML('afterend', html);
	}

	addList($target, tag, type = null, content = ''){
		this.removeLastsetClass($target);
		let dataType;
		if(tag === 'ol'){
			dataType = 'list_o';
		}else{
			dataType = 'list_u';
		}
		let attribute = type === null ? '' : 'type="'+ type +'"';
		let child = this.HTMLChildList.replace(/\[content\]/g, content);
		let html = this.HTMLList.replace(/\[tag\]/g, tag)
					.replace('[dataType]', dataType)
					.replace('[type]', attribute)
					.replace('[child]', child);

		$target.insertAdjacentHTML('afterend', html);
		$target.nextElementSibling.children[0].focus();
	}

	addQuote($target){
		this.removeLastsetClass($target);
		$target.insertAdjacentHTML('afterend', this.HTMLQuote);
		$target.nextElementSibling.children[0].focus();
	}

	addTable($target){
		this.removeLastsetClass($target);
		$target.insertAdjacentHTML('afterend', this.HTMLTable);
		$target.nextElementSibling.querySelector('caption').focus();
	}

	addCodeBlock($target){
		this.removeLastsetClass($target);
		$target.insertAdjacentHTML('afterend', this.HTMLCodeBlock);
		$target.nextElementSibling.children[0].focus();
	}

	addLinkBox($target, data, position = 'afterend'){
		this.removeLastsetClass($target);
		if(data.img === ''){
			data.img = './common/img/img_cover.png';
		}
		let html = this.HTMLLinkBox.replace('[url]', data.url)
					.replace('[imgSrc]', data.img)
					.replace('[title]', data.title)
					.replace('[description]', data.description)
					.replace('[domain]', data.domain);

		$target.insertAdjacentHTML(position, html);
	}

	addImage($target, data, position = 'afterend'){
		this.removeLastsetClass($target);
		let html;
		let width;

		if(((100 / data.width) * data.height) > 100){
			width = 300;
		}else{
			width = data.width;
		}

		if(width > this.maxImageWidth){
			width = this.maxImageWidth;
		}

		if(this.useWebp === true == true){
			html = this.HTMLImageType01.replace('[src]', `${data.src}.${data.format}`)
					.replace('[alt]', data.alt)
					.replace('[width]', width);

			if(data.webp === true){
				let source = this.HTMLImageSource.replace('[webp]', `${data.src}.webp`);
				html = html.replace('[source]', source);
			}else{
				html = html.replace('[source]', '');
			}
		}else{
			html = this.HTMLImageType02.replace('[src]', `${data.src}.${data.format}`)
				.replace('[alt]', data.alt)
				.replace('[width]', width);
		}

		$target.insertAdjacentHTML(position, html);
	}

	addYoutube($target, src, position = 'afterend'){
		this.removeLastsetClass($target);
		let code = src.replace(this.youtubeCodeReg, '$7');
		let html = this.HTMLYoutube.replace('[src]', `https://www.youtube.com/embed/${code}`);
		$target.insertAdjacentHTML(position, html);
	}

	addCodepen($target, src, position = 'afterend', height = 300){
		this.removeLastsetClass($target);
		let nickname = src.replace(this.codepenCodeReg, '$2');
		let code = src.replace(this.codepenCodeReg, '$4');
		let html = this.HTMLCodepen.replace('[src]', `https://codepen.io/${nickname}/embed/${code}?height=${height}&theme-id=${this.codepenTheme}&default-tab=result`).replace('[height]', height);
		$target.insertAdjacentHTML(position, html);
	}

	getLastSetOrFocus($target){
		let $activeEl = document.activeElement;
		let $item, $btn = false;

		if($activeEl.constructor.name !== 'HTMLBodyElement'){
			switch(this.activeElement.constructor.name){
				case 'HTMLSpanElement' :
					$item = this.activeElement;
				break;
				case 'HTMLElement' :
					$item = this.activeElement;
				break;
				case 'HTMLAnchorElement' :
					$item = this.activeElement;
				break;
				case 'Text' :
					$item = this.findParent(this.activeElement.parentElement, 'item');
				break;
				default :
					$item = this.findParent(this.activeElement, 'item');
			}
		}else{
			$item = this.findParent($target, 'item');
			$btn = $item === false ? this.findParent($target, 'btn') : $item;
		}
		let $el = $item === false ? $btn : $item;
		return $el;
	}

	setLastElement($target, children){
		let $item = this.findParent($target, 'item') === false ? this.findParent($target, 'btn') : this.findParent($target, 'item');
		children.forEach(function($child){
			$child.classList.remove('lastset');
		});
		$item.classList.add('lastset');
	}

	openOptionPop(offset, type){
		let y = Math.floor(offset.top + offset.height);
		let $child = this.popOptions.querySelectorAll('.col');
		let typeReg = new RegExp(type, 'i');

		if($child !== null){
			$child.forEach(function($col){
				let type = $col.dataset['group'];

				switch(true){
					case type === 'all' :
						$col.classList.add('act');
					break;
					case typeReg.test(type) === true :
						$col.classList.add('act');
					break;
					case typeReg.test(type) === false :
						$col.classList.remove('act');
					break;
				}
			})
		}

		this.popOptions.classList.add('act');
		this.popOptions.querySelector('.pop').classList.remove('act');
		let x =  Math.floor((this.windowWidth - this.popOptions.getBoundingClientRect().width) / 2);
		if(this.windowWidth > this.changePint){
			this.popOptions.style.cssText = 'transform:translate('+ x +'px, '+ y +'px)';
		}else{
			this.popOptions.removeAttribute('style');
		}
	}

	contentCheckByMouse(target, eventType){
		if(eventType === 'click'){
			this.activeElement = target;
		}
		let $target = this.getLastSetOrFocus(target);
		let base = window.getSelection().baseOffset;
		let extent = window.getSelection().extentOffset;

		if($target !== false){
			let offset = $target.getBoundingClientRect();
			let type = $target.dataset['type'];
			let $children = this.getElList(this.contentAreaName + ' > *');
			let isBtn = $target.classList.contains('btn');

			switch(true){
				case $target.tagName === 'CODE' && $target.parentElement.tagName === 'PRE' :
					type = 'codeblock';
				break;
				case $target.constructor.name === 'HTMLElement' && $target.classList.contains('wordblock') :
					type = 'wordblock';
				break;
				case $target.constructor.name === 'HTMLAnchorElement' :
					type = 'link';
				break;
				case isBtn === true && eventType === 'click' :
					if(typeof $target.dataset['value'] !== 'undefined'){
						let value = $target.dataset['value'];
						if(value === 'image'){
							this.fileInput.dataset['type'] = 'image';
							this.fileInput.setAttribute('accept', 'image/*');
							this.fileInput.click();
						}else{
							type = value;
						}
					}
				break;
				case window.getSelection().focusNode !== window.getSelection().baseNode :
					type = 'text';
				break;
				case base !== extent :
					if($target.tagName !== 'BLOCKQUOTE'){
						this.focusNode = window.getSelection().focusNode;
						this.baseNode = window.getSelection().baseNode;
						this.startTextCursor = base;
						this.endTextCursor = extent;
						type = 'word';
					}
				break;
				case type === undefined :
					type = 'all';
				break;
				default : 
					type = type;
			}

			if(eventType === 'click'){
				this.setLastElement($target, $children);
				this.openOptionPop(offset, type);
			}else if(eventType === 'mouseover' && (type === 'youtube' || type === 'codepen')){
				this.setLastElement($target, $children);
				this.openOptionPop(offset, type);
			}
		}
	}

	checkOptionsValue($el){
		let $target = this.findParent($el, 'item');
			$target = $target === false ? this.findParent($el, 'btn') : $target;
		let $activeEl = this.activeElement;

		if($target !== false){
			let type = $target.dataset['type'];
			let activeElName = $activeEl.constructor.name;
			let targetClassList = $target.classList.value;
			let activeClassList = $activeEl.classList.value;

			this.urlInput.value = '';
			switch(type){ // not default
				case 'text' :
					let colorClass = this.getClassName(targetClassList, 'color');
					let sizeClass = this.getClassName(targetClassList, 'size');

					if(colorClass !== ''){
						this.btnColorSelect.dataset['class'] = colorClass;
					}else{
						this.btnColorSelect.dataset['class'] = 'default';
					}

					if(sizeClass !== ''){
						this.fontSizeSelect.value = sizeClass;
					}else{
						this.fontSizeSelect.value = 'default';
					}
				break;
				case 'image' :
					let size = $target.querySelector('.img').getAttribute('width');
					this.widthInput.value = size;
				break;
				case 'youtube' :
					if($target.classList.contains('btn') === false){
						let src = $target.querySelector('.video').getAttribute('src');
						this.urlInput.value = src;
					}else{
						this.urlInput.value = '';
					}
				break;
				case 'codepen' :
					if($target.classList.contains('btn') === false){
						let $el = $target.querySelector('.iframe');
						let src = $el.getAttribute('src');
						let height = $el.getAttribute('height');
						this.urlInput.value = src;
						this.heightInput.value = height;
					}else{
						this.urlInput.value = '';
						this.heightInput.value = '';
					}
				break;
				case 'list_o' :
					let listType = $target.getAttribute('type');
					this.listTypeSelect.value = listType;
				break;
				case 'codeblock' :
					let theme = $target.dataset['theme'];
					let lang = $target.dataset['lang'];
					let codeSizeClass = this.getClassName(targetClassList, 'size');

					if(codeSizeClass !== ''){
						this.fontSizeSelect.value = codeSizeClass;
					}else{
						this.fontSizeSelect.value = 'default';
					}

					this.themeSelect.value = theme;
					this.languageSelect.value = lang;
				break;
			}

			switch(true){
				case activeElName === 'HTMLAnchorElement' :
					let url = $activeEl.getAttribute('href');
					this.urlInput.value = url;
				break;
				case (activeElName === 'HTMLTableCellElement' || activeElName === 'HTMLTableCaptionElement') && $target.dataset['type'] === 'table':
					if(activeElName === 'HTMLTableCellElement'){
						let colNumber = parseInt($activeEl.dataset['x']) + 1;
						let tableClass = $target.querySelector('col:nth-child('+ colNumber +')').classList.value;
						this.colSizeSelect.value = this.getClassName(tableClass, 'size');
					}

					let cellColor = this.getClassName(activeClassList, 'color');
					let cellFront = this.getClassName(activeClassList, 'size');

					if(cellColor !== ''){
						this.btnColorSelect.dataset['class'] = cellColor;
					}else{
						this.btnColorSelect.dataset['class'] = 'default';
					}

					if(cellFront !== ''){
						this.fontSizeSelect.value = cellFront;
					}else{
						this.fontSizeSelect.value = 'default';
					}
				break;
				case activeElName === 'HTMLSpanElement' || activeElName === 'HTMLElement':
					let className = this.getClassName(activeClassList, 'color');

					if(className !== ''){
						this.btnColorSelect.dataset['class'] = className;
					}else{
						this.btnColorSelect.dataset['class'] = 'default';
					}
				break;
				case activeElName === 'HTMLLIElement' :
					let colorClass = this.getClassName(activeClassList, 'color');
					let sizeClass = this.getClassName(activeClassList, 'size');

					if(colorClass !== ''){
						this.btnColorSelect.dataset['class'] = colorClass;
					}else{
						this.btnColorSelect.dataset['class'] = 'default';
					}

					if(sizeClass !== ''){
						this.fontSizeSelect.value = sizeClass;
					}else{
						this.fontSizeSelect.value = 'default';
					}
				break;
			}
			//console.log($target, $activeEl);
		}
	}

	getClassName(text, type){
		if(this.classList.indexOf(type) >= 0){
			let value = text.match(this.classReg[type]);

			if(text !== '' && value !== null){
				return value[0];
			}else{
				return '';
			}
		}else{
			console.warn(`You send wrong type name : [${type}]`);
		}
	}

	checkSameNode(){
		if(this.focusNode === this.baseNode){
			return true;
		}else{
			return false;
		}
	}

	wrapElement(type, url = null, className = null){
		let text = this.focusNode.textContent;
		let $el = this.findContenteditable(this.focusNode);
		$el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
		let child = $el.childNodes;
		let count = child.length;
		let number, firstCursor, endCursor, code;
		let html = '';

		// 노드 순서 구하기
		for(let i = 0;i < count;i += 1){
			if(child[i].constructor.name === 'Text'){
				if(text === child[i].textContent){
					number = i;
					break;
				}
			}
		}

		if(this.startTextCursor > this.endTextCursor){
			firstCursor = this.endTextCursor;
			endCursor = this.startTextCursor;
		}else{
			firstCursor = this.startTextCursor;
			endCursor = this.endTextCursor;
		}

		switch(type){
			case 'link' :
				code = `${text.substring(0, firstCursor)}<a href="${url}" rel="nofollow">${text.substring(firstCursor, endCursor)}</a>${text.substring(endCursor)}`;
			break;
			case 'bold' :
				code = `${text.substring(0, firstCursor)}<b>${text.substring(firstCursor, endCursor)}</b>${text.substring(endCursor)}`;
			break;
			case 'italic' :
				code = `${text.substring(0, firstCursor)}<i>${text.substring(firstCursor, endCursor)}</i>${text.substring(endCursor)}`;
			break;
			case 'underline' :
				code = `${text.substring(0, firstCursor)}<u>${text.substring(firstCursor, endCursor)}</u>${text.substring(endCursor)}`;
			break;
			case 'strike' :
				code = `${text.substring(0, firstCursor)}<s>${text.substring(firstCursor, endCursor)}</s>${text.substring(endCursor)}`;
			break;
			case 'wordblock' :
				code = `${text.substring(0, firstCursor)}<code class="wordblock">${text.substring(firstCursor, endCursor)}</code>${text.substring(endCursor)}`;
			break;
			case 'color' :
				code = `${text.substring(0, firstCursor)}<span class="${className}">${text.substring(firstCursor, endCursor)}</span>${text.substring(endCursor)}`;
			break;
		}

		for(let j = 0;j < count;j += 1){
			if(j !== number){
				if(child[j].constructor.name === 'Text'){
					html += child[j].textContent;
				}else{
					html += child[j].outerHTML;
				}
			}else{
				html += code;
			}
		}

		$el.innerHTML = html;
	}

	makeTextDecoration(tag, tagName, className){
		if(this.focusNode === this.baseNode){
			let $target = this.activeElement;
			let elName = $target.constructor.name;
			let $el = this.findContenteditable($target);
			console.log($el, $target);

			if(elName === 'HTMLAnchorElement' || elName === 'HTMLSpanElement' || elName === 'HTMLElement'){
				let classList = $target.classList;
				let count = classList.length;
				let text = $target.textContent;

				if($target.tagName === tagName){
					if(count > 0){
						$target.insertAdjacentHTML('afterend', `<span class="${classList.value}">${text}</span>`);
						this.activeElement = $target.nextElementSibling;
						$target.remove();
					}else{
						$target.insertAdjacentText('afterend', text);
						$target.remove();
						$el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
						this.activeElement = this.wrap;
					}
				}else if($target.tagName === 'SPAN'){
					if(count > 0){
						$target.insertAdjacentHTML('afterend', `<${tag} class="${classList.value}">${text}</${tag}>`);
						this.activeElement = $target.nextElementSibling;
						$target.remove();
					}else{
						$target.insertAdjacentHTML('afterend', `<${tag}>${text}</${tag}>`);
						this.activeElement = $target.nextElementSibling;
						$target.remove();
					}
				}else{
					if($target.classList.contains(className) === true){
						$target.classList.remove(className);
					}else{
						$target.classList.add(className);
					}
				}
			}else{
				if(window.getSelection().focusOffset !== window.getSelection().baseOffset){
					this.wrapElement(className);
				}else{
					if($target.classList.contains(className) === true){
						$target.classList.remove(className);
					}else{
						$target.classList.add(className);
					}
				}
			}
		}else{
			alert(this.messageWrongNode);
		}
	}

	tableConstrol($target){
		let name = $target.constructor.name;
		let classList = $target.classList;

		if(name === 'HTMLButtonElement'){
			let table = document.querySelector('.lastset .item_table');
			let colgroup = table.querySelector('colgroup');
			let colCount = table.querySelectorAll('col').length;
			let row = table.querySelectorAll('tr');
			let tbody = table.querySelector('tbody');

			switch(true){
				case classList.contains('btn_col_add') :
					row.forEach(function(item){
						let y = item.querySelector('*:nth-child(1)').dataset['y'];

						item.insertAdjacentHTML('beforeend', `<td contenteditable="true" data-x="${colCount}" data-y="${y}"></td>`);
					});
					colgroup.insertAdjacentHTML('beforeend', '<col class="size_100">');
				break;
				case classList.contains('btn_col_del') :
					if(colCount > 1){
						let lastCol = colgroup.querySelector('*:last-child');

						row.forEach(function(item){
							let lastChild = item.querySelector('*:last-child');

							lastChild.remove();
						});
						lastCol.remove();
					}
				break;
				case classList.contains('btn_row_add') :
					let html = '<tr>';

					for(let i = 0;i < colCount;i += 1){
						html += `<td contenteditable="true" data-x="${i}" data-y="${row.length}"></td>`;
					}
					html += '</tr>';

					tbody.insertAdjacentHTML('beforeend', html);
				break;
				case classList.contains('btn_row_del') :
					if(row.length > 1){
						tbody.querySelector('tr:last-child').remove();
					}
				break;
			}
		}
	}

	keybroadControl(event){
		let key = event.key;
		let shift = event.shiftKey;
		let $activeEl = document.activeElement.constructor.name === 'HTMLBodyElement' ? false : document.activeElement;
		let $item = this.findParent($activeEl, 'item');

		if($activeEl !== false){
			this.activeElement = document.activeElement;
		}

		switch(true){
			case key === 'Enter' && $activeEl !== false :
				let tagName = $activeEl.tagName;

				if(shift !== true){
					if(tagName === 'LI'){
						event.preventDefault();

						let text = $activeEl.textContent;

						if(text === ''){
							let count = $item.querySelectorAll('li').length;

							this.addTextBlock($item);
							if(count > 1){
								$activeEl.remove();
							}
						}else{
							$activeEl.insertAdjacentHTML('afterend', this.HTMLChildList.replace('[content]', ''));
							$activeEl.nextElementSibling.focus();
						}
					}else{
						event.preventDefault();
						this.addTextBlock($item);
					}
				}
			break;
			case key === 'Tab' && $activeEl !== false:
				if(shift === true){
					if($activeEl.classList.contains('title') === true){
						event.preventDefault();
					}
				}else{
					let $lastItem = this.contentArea.querySelector('.item:nth-last-child(1)');
					if($lastItem === $item){
						event.preventDefault();
					}
				}
			break;
		}
	}

	saveAction(){

	}

	actionPrev(){

	}

	actionNext(){

	}

	dragStartEvent(e, el){ // event function
		el.insertAdjacentHTML('afterend', this.HTMLPositionBar);
	}

	dragOverEvent(e, el){ // event function
		let $bar = this.getElList('.position_bar');
		let $target = this.findParent(e.target, 'item');
			$target = $target === false ? this.findParent(e.target, 'btn') : $target;

		if($bar !== false){
			$bar.forEach(function($item){
				$item.remove();
			});
		}
		if($target !== false){
			$target.insertAdjacentHTML('afterend', this.HTMLPositionBar);
		}
		console.log('move');
	}

	dragEndEvent(e, el){ // event function
		let event = document.createEvent('HTMLEvents');
			event.initEvent('mouseup', true, true);
			event.eventName = 'mouseup';
		let $bar = this.getEl('.position_bar');
		let HTML = el.outerHTML;


		if($bar !== false){
			$bar.insertAdjacentHTML('afterend', HTML);
			$bar.remove();
			el.remove();
		}
		el.removeAttribute('draggable');
		this.contentArea.dispatchEvent(event);
	}

	ajax(method,url,data,type,fn){
		let formData = new FormData();
		let xmlhttp = new XMLHttpRequest();
	
		if(type === 'json'){
			for(let key in data){
				formData.append(key, data[key]);
			}
	
			data = formData;
		}
	
		xmlhttp.open(method, url);
	
		xmlhttp.onreadystatechange = function(){
			if(xmlhttp.readyState == XMLHttpRequest.DONE && xmlhttp.status === 200){
				let httpData = xmlhttp.responseText;
				let item = JSON.parse(httpData);
				fn(item);
			}
		}
	
		xmlhttp.send(data);
	}

	getJsonData(){
		let childNodes = this.getElList(`${this.contentAreaName} > *`);
		let arr = [];

		childNodes.forEach((item) => {
			let type = item.dataset['type'];

			switch(true){
				case type === 'title' :
					arr.push({
						'type' : 'title',
						'class' : [...item.classList],
						'textContent' : item.textContent
					});
				break;
				case type === 'text' :
					arr.push({
						'type' : 'text',
						'class' : [...item.classList],
						'textContent' : item.innerHTML
					});
				break;
				case type === 'image' :
					let hasWebp = item.tagName === 'PICTURE' ? true : false;
					let img = item.querySelector('.img');
					let link = img.getAttribute('src');

					arr.push({
						'type' : 'image',
						'class' : [...item.classList],
						'hasWebp' : hasWebp,
						'size' : img.getAttribute('width'),
						'alt' : img.getAttribute('alt'),
						'src' : link.replace(this.srcReg, '$1'),
						'defaultFormat' : link.replace(this.srcReg, '$2')
					});
				break;
				case type === 'youtube' :
					let video = item.querySelector('.video');

					arr.push({
						'type' : 'youtube',
						'class' : [...item.classList],
						'src' : video.getAttribute('src'),
						'allow' : video.getAttribute('allow')
					});
				break;
				case type === 'codepen' :
					let iframe = item.querySelector('.iframe');

					arr.push({
						'type' : 'codepen',
						'class' : [...item.classList],
						'src' : iframe.getAttribute('src'),
						'height' : iframe.getAttribute('height'),
						'title' : iframe.getAttribute('title')
					});
				break;
				case type === 'list_u' || type ===  'list_o' :
					let childEl = item.querySelectorAll('li');
					let child = [];

					childEl.forEach(function(el){
						child.push({
							'class' : [...el.classList],
							'textContent' : el.textContent
						});
					});

					arr.push({
						'type' : 'list',
						'class' : [...item.classList],
						'tag' : item.tagName.toLowerCase(),
						'listType' : item.getAttribute('type'),
						'child' : child
					});
				break;
				case type === 'quote' :
					let text = item.querySelector('.text').textContent;
					let author = item.querySelector('.author').textContent;

					arr.push({
						'type' : 'quote',
						'class' : [...item.classList],
						'text' : text,
						'author' : author
					});
				break;
				case type === 'table' :
					let colgroup = [];
					let tbody = [];
					let caption = item.querySelector('caption').textContent;
					let colList = item.querySelectorAll('col');
					let trList = item.querySelectorAll('tr');

					colList.forEach(function(col){
						colgroup.push(col.classList.value);
					});

					trList.forEach(function(tr){
						let cellList = [];
						let count = tr.childElementCount;
						let children = tr.children;

						for(let i = 0;i < count;i += 1){
							cellList.push({
								'tag' : children[i].tagName.toLowerCase(),
								'class' : [...children[i].classList],
								'textContent' : children[i].textContent
							});
						}

						tbody.push(cellList);
					});

					arr.push({
						'type' : 'table',
						'class' : [...item.classList],
						'caption' : caption,
						'colgroup' : colgroup,
						'child' : tbody
					});
				break;
				case type === 'codeblock' :
					let theme = item.dataset['theme'];
					let lang = item.dataset['lang'];
					let code = item.querySelector('code');

					arr.push({
						'type' : 'codeblock',
						'class' : [...item.classList],
						'theme' : theme,
						'lang' : lang,
						'code' : {
							'class' : [...code.classList],
							'innerHTML' : code.innerHTML
						}
					});
				break;
				case type === 'link_box' :
					let url = item.querySelector('.link_box').getAttribute('href');
					let imgSrc = item.querySelector('.img').getAttribute('src');
					let title = item.querySelector('.link_title').textContent;
					let description = item.querySelector('.link_description').textContent;
					let domain = item.querySelector('.link_domain').textContent;

					arr.push({
						'type' : 'link_box',
						'class' : [...item.classList],
						'url' : url,
						'imgSrc' : imgSrc,
						"title" : title,
						"description" : description,
						"domain" : domain,
					});
				break;
				case type === 'btn' :
					let icon = item.querySelector('.icon');
					let iconTagName = icon.tagName.toLowerCase();
					let iconUrl;

					if(iconTagName === 'svg'){
						iconUrl = icon.querySelector('use').getAttribute('href');
					}else{
						iconUrl = icon.getAttribute('src');
					}

					arr.push({
						'type' : 'btn',
						'value' : item.dataset['value'],
						'textContent' : item.textContent,
						'icon' : {
							"type" : iconTagName,
							"viewBox" : icon.getAttribute('viewBox'),
							"class" : [...icon.classList],
							"url" : iconUrl
						}
					});
				break;
				default : 
					arr.push({
						'other' : item.outerHTML
					});
			}
		});

		this.contentData[this.langStatus] = arr;
		return this.contentData;
	}

	setContent(jsonArr){
		let html = '';

		jsonArr.forEach(function(item){
			switch(item.type){
				case 'title' :
					html += `<h1 class="${item.class.join(' ')}" contenteditable="true" data-type="${item.type}">${item.textContent}</h1>`;
				break;
				case 'text' :
					html += `<p class="${item.class.join(' ')}" contenteditable="true" data-type="${item.type}">${item.textContent}</p>`;
				break;
				case 'image' :
					if(item.useWebp === true){
						html += `<picture class="${item.class.join(' ')}" data-type="${item.type}">`;
						if(item.hasWebp === true){
							html += `<source srcset="${item.src}.webp" type="image/webp">`;
						}
						html += `<img src="${item.src}.${item.defaultFormat}" width="${item.size}" alt="${item.alt}" class="img"></picture>`;
					}else{
						html += `<div class="${item.class.join(' ')}" data-type="image"><img src="${item.src}.${item.defaultFormat}" width="${item.size}" alt="${item.alt}" class="img"></div>`;
					}
				break;
				case 'btn' :
					if(item.value === 'image'){
						html += `<div class="btn" data-type="${item.type}" data-value="${item.value}">`;
						if(item.icon.type === 'svg'){
							html += `<svg viewBox="${item.icon.viewBox}" class="${item.icon.class.join(' ')}"><use class="path" xlink:href="${item.icon.url}" href="${item.icon.url}"></use></svg>`;
						}else{
							html += `<img src="${item.icon.url}" alt="image icon" class="">`;
						}
						html += `${item.textContent.replace(/\n/i, '').replace(/^\s*/i, '').replace(/\s*$/i, '')}</div>`;
					}else if(item.value === 'youtube'){
						html += `<div class="btn" data-type="${item.type}" data-value="${item.value}">`;
						if(item.icon.type === 'svg'){
							html += `<svg viewBox="${item.icon.viewBox}" class="${item.icon.class.join(' ')}"><use class="path" xlink:href="${item.icon.url}" href="${item.icon.url}"></use></svg>`;
						}else{
							html += `<img src="${item.icon.url}" alt="youtube icon" class="">`;
						}
						html += `${item.textContent.replace(/\n/i, '').replace(/^\s*/i, '').replace(/\s*$/i, '')}</div>`;
					}else if(item.value === 'codepen'){
						html += `<div class="btn" data-type="${item.type}" data-value="${item.value}">`;
						if(item.icon.type === 'svg'){
							html += `<svg viewBox="${item.icon.viewBox}" class="${item.icon.class.join(' ')}"><use class="path" xlink:href="${item.icon.url}" href="${item.icon.url}"></use></svg>`;
						}else{
							html += `<img src="${item.icon.url}" alt="codepen icon" class="">`;
						}
						html += `${item.textContent.replace(/\n/i, '').replace(/^\s*/i, '').replace(/\s*$/i, '')}</div>`;
					}
				break;
				case 'youtube' :
					html += `<div class="${item.class.join(' ')}" data-type="${item.type}"><iframe src="${item.src}" allow="${item.allow}" allowfullscreen="" class="video"></iframe></div>`;
				break;
				case 'codepen' :
					html += `<div class="${item.class.join(' ')}" data-type="${item.type}"><iframe height="${item.height}" title="" src="${item.src}" allowfullscreen="" class="iframe"></iframe></div>`;
				break;
				case 'list' :
					if(item.listType === null){
						html += `<${item.tag} class="${item.class.join(' ')}" data-type="${item.type}">`;
					}else{
						html += `<${item.tag} type="${item.listType}" class="${item.class.join(' ')}" data-type="${item.type}">`;
					}
					item.child.forEach(function(row){
						if(row.class.length > 0){
							html += `<li class="${row.class.join(' ')}" contenteditable="true">${row.textContent}</li>`;
						}else{
							html += `<li contenteditable="true">${row.textContent}</li>`;
						}
					});
					html += `</${item.tag}>`;
				break;
				case 'quote' :
					html += `<blockquote class="${item.class.join(' ')}" data-type="${item.type}"><p class="text" contenteditable="true">${item.text}</p><p class="author" contenteditable="true">${item.author}</p></blockquote>`;
				break;
				case 'table' :
					let rowNum = 0;
					html += `<div class="${item.class.join(' ')}" data-type="${item.type}"><div class="scroll"><table class="item_table"><caption contenteditable="true">${item.caption}</caption><colgroup>`;
					item.colgroup.forEach(function(col){
						html += `<col class="${col}">`;
					});
					html += '</colgroup><tbody>';
					item.child.forEach(function(tr){
						let cellNum = 0;
						html += '<tr>';
						tr.forEach(function(cell){
							if(cell.class.length > 0){
								html += `<${cell.tag} class="${cell.class.join(' ')}" contenteditable="true" data-x="${cellNum}" data-y="${rowNum}">${cell.textContent}</${cell.tag}>`;
							}else{
								html += `<${cell.tag} contenteditable="true" data-x="${cellNum}" data-y="${rowNum}">${cell.textContent}</${cell.tag}>`;
							}
							cellNum += 1;
						});
						html += '</tr>';
						rowNum += 1;
					});
					html += '</tbody></table></div><button class="btn btn_col_add">Add col</button><button class="btn btn_col_del">Remove col</button><button class="btn btn_row_add">Add row</button><button class="btn btn_row_del">Remove row</button></div>';
				break;
				case 'codeblock' :
					html += `<pre class="${item.class.join(' ')}" data-type="${item.type}" data-theme="${item.theme}" data-lang="${item.lang}"><code class="${item.code.class.join(' ')}" contenteditable="true">${item.code.innerHTML}</code></pre>`;
				break;
				case 'link_box' :
					html += `<div class="${item.class.join(' ')}" data-type="${item.type}"><a href="${item.url}" target="_blank" class="link_box clearfix" draggable="false"><div class="img_area"><img src="${item.imgSrc}" alt="미리보기 이미지" class="img" draggable="false"></div><div class="text_area"><p class="link_title ellipsis">${item.title}</p><p class="link_description ellipsis">${item.description}</p><p class="link_domain">${item.domain}</p></div></a></div>`;
				break;
				default :
					html += item.other;
			}
		});

		this.contentArea.innerHTML = html;
	}

	addkustomContent(html){
		let $el = this.getEl('.lastset') === false ? this.getEl(`${this.contentAreaName} > *:nth-last-child(1)`) : this.getEl('.lastset');
		$el.insertAdjacentHTML('afterend', html);
		$el.nextElementSibling.classList.add('lastset');
		$el.classList.remove('lastset');
	}
}

export function init(wrap, options = {}){
	wrap = wrap === null ? '.editor_area' : wrap;
	storage = new setting(wrap, options);

	if(storage.mediaUploadURL === '' || storage.mediaUpdateURL === '' || storage.mediaDelURL === ''){
		console.warn(storage.messageNotSetAjax);
		return;
	}else{
		storage.activeElement = storage.wrap;

		if(storage.multiUpload === true){
			storage.fileInput.setAttribute('multiple', true);
		}

		if(storage.loading === true){
			storage.popBgArea.classList.remove('act');
			storage.lodingArea.classList.remove('act');
		}
		setStorage(storage);
		return this;
	}
};

export function getOptionValue(name){
	if(storage[name] === undefined){
		console.error(`Optins name "${name}" is didn't have.`);
		return false;
	}else{
		return storage[name];
	}
}

export function getContentData(){
	let json = getContentJSON();
	storage.contentData[storage.langStatus] = json;
	return storage.contentData;
}

export function getStorage(){
	return storage;
}

export function setOptionValue(name, value){
	if(storage[name] === undefined){
		console.error('Can not set other option name.');
		return false;
	}else{
		storage[name] = value;
		return storage[name];
	}
}