class dragonEditor{
	constructor(wrap = '.editor_area', options = {}){
		this.setting(wrap, options);
		console.log(this.wrap);
		this.bindingEvent();
		this.closeLoding();
	}

	setting(wrap, options){
		let $this = this;

		$this.selection = window.getSelection();
		$this.startTextCursor = 0;
		$this.endTextCursor = 0;
		$this.activeElement;
		$this.focusNode;
		$this.langStatus = 'ko';
		$this.windowWidth = window.innerWidth;
		$this.windowHeight = window.innerHeight;
		$this.changePint = typeof options.changePint !== 'number' ? 1120 : options.changePint;
		$this.maxImageWidth = typeof options.maxImageWidth !== 'number' ? 800 : options.maxImageWidth;
		$this.clickCehck = false;

		$this.mackLinkBoxType = typeof options.mackLinkBoxType !== 'self' ? 'self' : 'api';
		$this.stickerType = options.stickerType === 'image' ? 'image' : 'svg';
		$this.stickerSize = typeof options.stickerSize !== 'string' ? '0 0 100 100' : options.stickerSize;
		$this.imageIconId = typeof options.imageIconId !== 'string' ? '#icon_image' : options.imageIconId;
		$this.youtubeIconId = typeof options.youtubeIconId !== 'string' ? '#icon_youtube' : options.youtubeIconId;
		$this.codepenIconId = typeof options.codepenIconId !== 'string' ? '#icon_codepen' : options.codepenIconId;

		$this.contentAreaName = typeof options.contentArea !== 'string' ? '.content_area' : options.contentArea;
		$this.popOptionsName = typeof options.popOptions !== 'string' ? '.pop_options' : options.popOptions;
		$this.popLinkName = typeof options.popLink !== 'string' ? '.pop_link_box' : options.popLink;
		$this.stickerListName = typeof options.stickerList !== 'string' ? '.pop_sticker' : options.stickerList;
		$this.contentAddListName = typeof options.contentAddList !== 'string' ? '.pop_content_list' : options.contentAddList;

		$this.wrap = $this.checkOptionElement(wrap, '.editor_area');
		$this.editorSection = $this.checkOptionElement(options.editorSection, '.editor_section');
		$this.contentArea = $this.checkOptionElement(options.contentArea, '.content_area');
		$this.contentAddList = $this.checkOptionElement(options.contentAddList, '.pop_content_list');
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
		$this.changeAreaBtn = $this.checkOptionElement(options.changeAreaBtn, '.btn_change_area');
		$this.fontSizeSelect = $this.checkOptionElement(options.fontSizeSelect, '.select_font_size');
		$this.colorSelect = $this.checkOptionElement(options.colorSelect, '.select_color');
		$this.alignSelect = $this.checkOptionElement(options.alignSelect, '.select_font_align');
		$this.listTypeSelect = $this.checkOptionElement(options.listTypeSelect, '.select_list_type');
		$this.colSizeSelect = $this.checkOptionElement(options.colSizeSelect, '.select_col');
		$this.themeSelect = $this.checkOptionElement(options.themeSelect, '.select_theme');
		$this.languageSelect = $this.checkOptionElement(options.languageSelect, '.select_language');
		$this.changeThBtn = $this.checkOptionElement(options.changeThBtn, '.btn_change_th');
		$this.changeTdBtn = $this.checkOptionElement(options.changeTdBtn, '.btn_change_td');
		$this.sizeInput = $this.checkOptionElement(options.sizeInput, '.options_size .value');
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

		$this.HTMLTextBlock = '<p class="item item_text lastset" contenteditable="true" data-type="text">[content]</p>';
		$this.HTMLBtn = '<div class="btn lastset" data-type="btn" data-value="[type]"><svg viewbox="0 0 50 50" class="icon"><use class="path" xlink:href="[icon_id]" href="[icon_id]" /></svg>[text]</div>';
		$this.HTMLSvgSticker = '<svg viewbox="[size]" class="item item_sticker lastset" data-type="sticker"><use class="path" xlink:href="[url]" href="[url]" /></svg>';
		$this.HTMLList = '<[tag] [type] class="item item_list lastset" data-type="[dataType]">[child]</[tag]>';
		$this.HTMLChildList = '<li contenteditable="true">[content]</li>';
		$this.HTMLQuote = '<blockquote class="item item_quote lastset" data-type="quote"><p class="text" contenteditable="true"></p><p class="author" contenteditable="true"></p></blockquote>';
		$this.HTMLTable = '<div class="item item_table_area" data-type="table"><table class="item_table"><caption contenteditable="true"></caption><colgroup><col class="size_100"><col class="size_100"><col class="size_100"><col class="size_100"></colgroup><tbody><tr><th contenteditable="true" data-x="0" data-y="0"></th><th contenteditable="true" data-x="1" data-y="0"></th><th contenteditable="true" data-x="2" data-y="0"></th><th contenteditable="true" data-x="3" data-y="0"></th></tr><tr><td contenteditable="true" data-x="0" data-y="1"></td><td contenteditable="true" data-x="1" data-y="1"></td><td contenteditable="true" data-x="2" data-y="1"></td><td contenteditable="true" data-x="3" data-y="1"></td></tr></tbody></table><button class="btn btn_col_add">Add col</button><button class="btn btn_col_del">Remove col</button><button class="btn btn_row_add">Add row</button><button class="btn btn_row_del">Remove row</button></div>';
		$this.HTMLCodeBlock = '<pre class="item item_codeblock lastset" data-type="codeblock" data-theme="default" data-lang="text"><code class="nohighlight" contenteditable="true"></code></pre>';
		$this.HTMLLinkBox = '<div class="item" data-type="link_box"><a href="[url]" target="_blank" class="link_box clearfix" draggable="false"><div class="img_area"><img src="[imgSrc]" alt="미리보기 이미지" class="img" draggable="false"></div><div class="text_area"><p class="link_title ellipsis">[title]</p><p class="link_description ellipsis">[description]</p><p class="link_domain">[domain]</p></div></a></div>';
		$this.HTMLOption = '<option value="[value]">[text]</option>';
		$this.HTMLPositionBar = '<div class="position_bar"></div>';

		$this.urlReg = new RegExp('https?:\\/\\/(\\w*:\\w*@)?[-\\w.]+(:\\d+)?(\\/([\\w\\/_.]*(\\?\\S+)?)?)?', 'gi');
		$this.numberReg = new RegExp('[0-9]', 'g');
		$this.colorClassReg = new RegExp('color_.*', 'i');
		$this.sizeClassReg = new RegExp('size_.*', 'i');
		$this.alignClassReg = new RegExp('align_.*', 'i');

		$this.messageNotSelecImage = typeof options.messageNotSelecImage !== 'string' ? `You didn't select image` : options.messageNotSelecImage;
		$this.messageWrongURL = typeof options.messageWrongURL !== 'string' ? `Please enter a valid URL.\nYou must enter http or https first.` : options.messageWrongURL;
		$this.messageNotSelect = typeof options.messageNotSelect !== 'string' ? `No element selected Please try again.` : options.messageNotSelect;
		$this.messageNoData = typeof options.messageNoData !== 'string' ? `Could not get data` : options.messageNoData;
		$this.messageExceedSize = typeof options.messageExceedSize !== 'string' ? `Can't exceed [size]px` : options.messageExceedSize;

		$this.linkBoxData = {};
		$this.contentData = {
			'ko' : {},
			'en' : {},
			'ja' : {}
		};
		$this.logData = [];
	}

	bindingEvent(){
		let $this = this;
		$this.activeElement = $this.wrap;

		if($this.windowWidth > $this.changePint){
			$this.contentAddList.classList.add('act');
		}else if($this.windowWidth < $this.changePint){
			$this.contentAddList.classList.remove('act');
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
							if(!item.classList.contains($this.popOptionsName.substr(1))){
								item.classList.remove('act');
							}
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
						if($btnPop !== btn){
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
		/*
		$this.contentArea.addEventListener('mouseup', function(e){
			if(e.button === 0 || e.isTrusted === false){
				let $childs = $this.getElList($this.contentAreaName + ' > *:not(:nth-child(1))');

				$this.contentCheckByMouse(e.target, 'mouseup');
				$this.checkOptionsValue(e.target);
				
				// 드레그 이벤트 언바인딩
				$this.clickCehck = false;
				$childs.forEach(function($child){
					$child.removeAttribute('draggable');
					$child.removeEventListener('dragstart', dragStartFn);
					$child.removeEventListener('dragover', dragOverFn);
					$child.removeEventListener('dragend', dragEndFn);
				});
			}
		});

		$this.contentArea.addEventListener('mousedown', function(e){
			let $childs = $this.getElList($this.contentAreaName + ' > *:not(:nth-child(1))');
			let $target = $this.findParent(e.target, 'item');
				$target = $target === false ? $this.findParent(e.target, 'btn') : $target;
			let event = document.createEvent('HTMLEvents');
				event.initEvent('dragstart', true, true);
				event.eventName = 'dragstart';

			// 단어 선택 초기화
			if ($this.selection.empty){
				$this.selection.empty();
			}else if($this.selection.removeAllRanges){
				$this.selection.removeAllRanges();
			}
			$this.startTextCursor = 0;
			$this.endTextCursor = 0;

			// 드레그 이벤트 바인딩 및 0.8초뒤 실행
			$this.clickCehck = true;
			if($target !== false){
				setTimeout(function(){
					if($this.clickCehck === true){
						$childs.forEach(function($child){
							$child.setAttribute('draggable', true);
							$child.addEventListener('dragstart', dragStartFn);
							$child.addEventListener('dragover', dragOverFn);
							$child.addEventListener('dragend', dragEndFn);
						});
						$target.dispatchEvent(event);
					}
				}, 800);
			}
		});
		*/

		$this.contentArea.addEventListener('click', function(e){
			if(e.button === 0 || e.isTrusted === false){
				let $childs = $this.getElList($this.contentAreaName + ' > *:not(:nth-child(1))');

				$this.contentCheckByMouse(e.target, 'click');
				$this.checkOptionsValue(e.target);
			}
		});

		// $this.contentArea.addEventListener('touchstart', function(e){
		// 	let $childs = $this.getElList($this.contentAreaName + ' > *:not(:nth-child(1))');
		// 	let $target = $this.findParent(e.target, 'item');
		// 		$target = $target === false ? $this.findParent(e.target, 'btn') : $target;
		// 	let event = document.createEvent('HTMLEvents');
		// 		event.initEvent('touchmove', true, true);
		// 		event.eventName = 'touchmove';

		// 	// 단어 선택 초기화
		// 	if ($this.selection.empty){
		// 		$this.selection.empty();
		// 	}else if($this.selection.removeAllRanges){
		// 		$this.selection.removeAllRanges();
		// 	}
		// 	$this.startTextCursor = 0;
		// 	$this.endTextCursor = 0;

		// 	// 드레그 이벤트 바인딩 및 0.8초뒤 실행
		// 	$this.clickCehck = true;
		// 	if($target !== false){
		// 		setTimeout(function(){
		// 			if($this.clickCehck === true){
		// 				$childs.forEach(function($child){
		// 					$child.addEventListener('touchmove', dragOverFn);
		// 				});
		// 				$target.dispatchEvent(event);
		// 			}
		// 		}, 800);
		// 	}
		// });

		// $this.contentArea.addEventListener('toucend', function(e){
		// 	if(e.button === 0 || e.isTrusted === false){
		// 		let $childs = $this.getElList($this.contentAreaName + ' > *:not(:nth-child(1))');

		// 		$this.contentCheckByMouse(e.target, 'mouseup');
		// 		$this.checkOptionsValue(e.target);
				
		// 		// 드레그 이벤트 언바인딩
		// 		$this.clickCehck = false;
		// 		$childs.forEach(function($child){
		// 			$child.removeEventListener('touchmove', dragOverFn);
		// 		});
		// 	}
		// });

		let overFn;
		$this.contentArea.addEventListener('mouseover', function(e){
			clearTimeout(overFn);
			overFn = setTimeout(() => {
				if($this.windowWidth > $this.changePint){
					let $junk = $this.getElList('.position_bar');
					if($junk !== false){
						$junk.forEach(function($bar){
							$bar.remove();
						});
					}
					$this.contentCheckByMouse(e.target, 'mouseover');
					$this.checkOptionsValue(e.target);
				}
			}, 250);
		});

		$this.editorSection.addEventListener('mouseleave', function(e){
			if($this.windowWidth > $this.changePint){
				let $activeEl = document.activeElement;
				let $lastset = $this.getEl('.lastset');

				if($lastset !== false && $activeEl.constructor.name === 'HTMLBodyElement'){
					$lastset.classList.remove('lastset');
				}
				$this.popOptions.classList.remove('act');
			}
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
				let $lastEl = $this.contentArea.querySelector('.lastset');
				let $target = $lastEl === null ? $this.contentArea.children[childCount - 1] : $lastEl

				$target.classList.remove('lastset');
				switch(type){
					case 'text':
						$this.addTextBlock($target);
					break;
					case 'image':
						$this.addBtn($target, $this.imageIconId, 'image', 'Add on image');
						$this.fileInput.setAttribute('accept', 'image/*');
						$this.fileInput.click();
					break;
					case 'sticker':
						let url = this.dataset['url'];
						$this.addSticker($target, url, $this.stickerSize, $this.stickerType);
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

		// switch editor section
		$this.changeAreaBtn.addEventListener('click', function(){
			let $target = $this.editorSection;
			let status = $target.dataset['status'];
			let value = status === 'editor' ? 'options' : 'editor';
			let $pop = $this.getElList('.pop.act');

			$this.editorSection.dataset['status'] = value;
			$this.popLang.classList.toggle('hidden');
			this.classList.toggle('act');

			// go to send area
			if(value === 'options'){
				let nodesArr = $this.dataToArray();
				$this.jsonForm(nodesArr);
			// go to contents area
			}else{

			}

			if($pop !== false){
				$pop.forEach(function(item){
					item.classList.remove('act');
				});
			}

			if($target.classList.contains('mobile') === true){
				$target.classList.remove('mobile');
				$this.viewBtn.classList.remove('act');
			}

			if(status === 'editor'){
				// add json
			}else{
				$this.contentAddList.classList.add('act');
			}
		});

		// send editor data
		
		// $this.getElList

		// pop btns work
		$this.popBtns.forEach(function($btn){
			$btn.addEventListener('click', function(){
				let status = $this.editorSection.dataset['status'];
				let target = this.dataset['target'];
				let $el = $this.getEl(target);

				if(status !== 'options'){
					this.classList.toggle('act');
					$el.removeAttribute('style');
					$el.classList.toggle('act');
				}else{
					return false;
				}
			});
		});

		$this.popCloseBtns.forEach(function($btn){
			$btn.addEventListener('click', function(){
				let status = $this.editorSection.dataset['status'];
				let target = this.dataset['target'];
				let $el = $this.getEl(target);

				if(status !== 'options'){
					$el.removeAttribute('style');
					$el.classList.toggle('act');
				}else{
					return false;
				}
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
			let $target = $this.contentArea.querySelector('.lastset');

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

		// 텍스트 링크 추가
		$this.addLinkBtn.addEventListener('click', function(){
			let url = $this.urlInput.value;

			if($this.urlReg.test(url) === true){
				$this.wrapElement('link', url);
			}else{
				alert($this.messageWrongURL);
			}
		});

		// image size
		let imageSizeFn;
		$this.sizeInput.addEventListener('keyup', function(e){
			clearTimeout(imageSizeFn);
			imageSizeFn = setTimeout(() => {
				if($this.numberReg.test(e.key) || e.key === 'Backspace'){
					let value = this.value;
					let $el = $this.getEl('.lastset .img');
					let massage = $this.messageExceedSize.replace('[size]', $this.maxImageWidth);
					
					if($el !== false){
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
						alert($this.messageNotSelecImage);
					}
				}else if(e.key !== 'Backspace'){
					e.preventDefault();
				}
			}, 250);
		});












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
		if($el.constructor.name !== 'HTMLBodyElement'){
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
			if(constructorName !== 'Text'){
				target = node;
			}else{
				target = node.parentElement;
			}

			let hasAttr = target.getAttribute('contenteditable');

			if(hasAttr === 'true'){
				return target;
			}else{
				return this.findContenteditable(target);
			}
		}else{
			return false;
		}
	}

	closeLoding(){
		this.popBgArea.classList.remove('act');
		this.lodingArea.classList.remove('act');
	}

	addTextBlock($target, content = '', position = 'afterend'){
		let html = this.HTMLTextBlock.replace('[content]', content);

		$target.insertAdjacentHTML(position, html);
		$target.nextElementSibling.focus();
	}

	addBtn($target, icon, type, text){
		let html = this.HTMLBtn.replace(/\[icon_id\]/g, icon)
					.replace(/\[type\]/g, type)
					.replace(/\[text\]/g, text);

		$target.insertAdjacentHTML('afterend', html);
	}

	addSticker($target, url, size, type){
		let html = this.HTMLSvgSticker.replace(/\[url\]/g, url)
					.replace(/\[size\]/g, size);

		$target.insertAdjacentHTML('afterend', html);
	}

	addList($target, tag, type = null, content = ''){
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
		$target.insertAdjacentHTML('afterend', this.HTMLQuote);
		$target.nextElementSibling.children[0].focus();
	}

	addTable($target){
		$target.insertAdjacentHTML('afterend', this.HTMLTable);
		$target.nextElementSibling.querySelector('caption').focus();
	}

	addCodeBlock($target){
		$target.insertAdjacentHTML('afterend', this.HTMLCodeBlock);
		$target.nextElementSibling.children[0].focus();
	}

	addLinkBox($target, data, position = 'afterend'){
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

	dataToArray(){
		let $contentsBox = document.querySelectorAll('.content_area'),
			contentsItems = $contentsBox[0].childNodes,
			contentsArr = [],
			forIndex = 0;

		contentsItems.forEach(function(item){
			if(forIndex !== 0){
				if(forIndex < contentsItems.length - 1){
					if(forIndex % 2 === 1) {
						contentsArr.push(item);
					}
				}
			}

			forIndex += 1;
		});

		return contentsArr;
	}

	// save json data
	jsonForm(list){
		let resultArr = [];

		for(let i = 0; i < list.length; i++){
			let $self = list[i],
				obj = {};

			// button
			if($self.classList.contains('btn')){
				obj.type = 'btn';
				
				switch($self.dataset.type){
					case 'btn':
						obj.dataType = 'btn';
						obj.dataValue = 'image';
						obj.textContent = 'Add on image';
						break;
					case 'youtube':
						obj.dataType = 'youtube';
						obj.dataValue = 'youtube';
						obj.textContent = 'Add Youtube';
						break;
					case 'codepen':
						obj.dataType = 'codepen';
						obj.dataValue = 'codepen';
						obj.textContent = 'Add Codepen';
						break;
					default:
						obj.dataType = 'btn';
						obj.dataValue = 'image';
						obj.textContent = 'Add on image';
						break;
				}

				obj.icon = {
					"type" : "svg",
					"viewBox" : "0 0 50 50",
					"class" : ["icon"],
					"url" : "#icon_image"
				};

			}else if($self.classList.contains('item')){
				if($self.classList.length === 1){
					obj = {
						"type" : "text",
						"dataType" : "text",
						"isItem" : true,
						"class" : ["item"],
						"textContent" : $self.textContent
					};
				}else if($self.classList.contains('item_image')){
					obj = {
						"type" : "image",
						"dataType" : "img",
						"isItem" : true,
						"class" : ["item", "item_image"],
						"hasWebp" : false,
						"size" : 600,
						"alt" : "",
						"src" : $self.querySelector('img').getAttribute('src'),
						"defaultFormat" : "jpg"
					};
				}else if($self.classList.contains('item_video')){
					obj = {
						"type" : "video",
						"dataType" : "youtube",
						"format" : "iframe",
						"hasWebm" : false,
						"src" : $self.querySelector('iframe').getAttribute('src'),
						"options" : ["allow=\"accelerometer; encrypted-media; gyroscope; picture-in-picture\"","allowfullscreen"],
						"class" : ["item", "item_video"]
					};
				}else if($self.classList.contains('item_codepen')){
					obj = {
						"type" : "codepen",
						"dataType" : "codepen",
						"src" : $self.querySelector('iframe').getAttribute('src'),
						"height" : 673,
						"title" : "loli",
						"options" : ["allowfullscreen"]
					};
				}else if($self.classList.contains('item_list')){
					if($self.type === 'i'){
						obj = {
							"type" : "list",
							"dataType" : "list",
							"tag" : "ul",
							"listType" : null,
							"class" : ["item", "item_list"],
							"child" : [
								{
									"class" : [],
									"textContent" : "1"
								}
							]
						};
					}else{
						obj = {
							"type" : "list",
							"dataType" : "list",
							"tag" : "ul",
							"listType" : null,
							"class" : ["item", "item_list"],
							"child" : [
								{
									"class" : [],
									"textContent" : "1"
								}
							]
						};
					}
				}else if($self.classList.contains('item_quote')){
					obj = {
						"type" : "quote",
						"dataType" : "quote",
						"class" : ["item", "item_quote"],
						"text" : $self.querySelector('.text').textcontent,
						"author" : $self.querySelector('.author').textcontent
					};
				}else if($self.classList.contains('item_table_area')){

				}else if($self.classList.contains('item_codeblock')){
					obj = {
						"type" : "codeblock",
						"dataType" : "codeblock",
						"theme" : "default",
						"language" : "text",
						"class" : ["item", "item_codeblock"],
						"code" : {
							"class" : [],
							"textContent" : $self.querySelector('code').textContent
						}
					};
				}else if($self.classList.contains('link_box')){
					obj = {
						"type" : "linkblock",
						"dataType" : "link_box",
						"url" : $self.getAttribute('href'),
						"imgSrc" : "https://dico.me/img/dico.png",
						"title" : $self.querySelector('.text_area .link_title').textContent,
						"description" : $self.querySelector('.text_area .link_description').textContent,
						"domain" : $self.querySelector('.link_domain').textContent,
						"class" : ["item", "link_box"]
					}
				}

			}else if($self.classList.contains('title')){
				obj = {
					"type" : "title",
					"dataType" : null,
					"isItem" : false,
					"class" : ["title"],
					"textContent" : $self.textContent
				};
			}

			resultArr.push(obj);
		}

		console.log(resultArr);
	}

	getLastSetOrFocus($target){
		let $activeEl = document.activeElement;
		let $item, $btn = false;

		if($activeEl.constructor.name !== 'HTMLBodyElement'){
			$item = this.findParent($activeEl, 'item');
		}else{
			$item = this.findParent($target, 'item');
			$btn = $item === false ? this.findParent($target, 'btn') : $item;
		}
		let $el = $item === false ? $btn : $item;
		return $el;
	}

	setLastElement($target, children){
		children.forEach(function($child){
			$child.classList.remove('lastset');
		});
		$target.classList.add('lastset');
	}

	openOptionPop(offset, type){
		let y = offset.top + offset.height + 5;
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
		let x =  (this.windowWidth - this.popOptions.getBoundingClientRect().width) / 2;
		this.popOptions.style.cssText = 'transform:translate('+ x +'px, '+ y +'px)';
	}

	contentCheckByMouse(target, eventType){
		let $target = this.getLastSetOrFocus(target);
		let base = this.selection.baseOffset;
		let extent = this.selection.extentOffset;

		if($target !== false){
			let offset = $target.getBoundingClientRect();
			let type = $target.dataset['type'];
			let $children = this.getElList(this.contentAreaName + ' > *');
			let isBtn = $target.classList.contains('btn');

			switch(true){
				case isBtn === true && eventType === 'click' : 
					if(typeof $target.dataset['value'] !== 'undefined'){
						let value = $target.dataset['value'];
						if(value === 'image'){
							this.fileInput.setAttribute('accept', 'image/*');
							this.fileInput.click();
						}
					}
				break;
				case base !== extent :
					this.focusNode = this.selection.focusNode;
					this.startTextCursor = base;
					this.endTextCursor = extent;
					type = 'word';
				break;
			}
			if(eventType === 'click'){
				this.activeElement = target;
			}
			this.setLastElement($target, $children);
			this.openOptionPop(offset, type);
		}
	}

	checkOptionsValue($el){
		let $target = this.findParent($el, 'item');
			$target = $target === false ? this.findParent($el, 'btn') : $target;
		let $activeEl = this.activeElement;

		if($target !== false){
			let type = $target.dataset['type'];
			let activeElName = $activeEl.constructor.name;

			this.urlInput.value == '';
			//size_100
			switch(true){
				case activeElName === 'HTMLAnchorElement' :
					let url = $activeEl.getAttribute('href');
					this.urlInput.value = url;
				case activeElName === 'HTMLTableCellElement' && $target.constructor.name === 'HTMLTableCellElement':
					let colNumber = parseInt($activeEl.dataset['x']) + 1;
					let size = $target.querySelector('col:nth-child('+ colNumber +')').classList.value;
					this.colSizeSelect.value = size;
				case activeElName === 'HTMLSpanElement' || activeElName === 'HTMLElement':
					let classList = [...$activeEl.classList];
					console.log(classList, $activeEl);
					let className = this.getClassName(classList, 'color');
				case type === 'text' :
				case type === 'img' :
				case type === 'youtube' :
				case type === 'codepen' :
				case type === 'list_u' :
				case type === 'list_o' :
				case type === 'quote' :
				case type === 'table' :
				case type === 'codeblock' :
				case type === 'link_box' :
				case type === 'btn' :
			}
			console.log($target, $activeEl);
		}
	}

	getClassName(list, type){
		let count = list.length;
		let number = -1;
		let regFn = {
			'color' : (i) => {
				return this.colorClassReg.test(list[i]);
			},
			'size' : (i) => {
				return this.colorClassReg.test(list[i]);
			},
			'align' : (i) => {
				return this.colorClassReg.test(list[i]);
			}
		};

		console.log(count );
		if(count > 0){
			for(let i = 0;i < count;i += 1){
				let check = regFn[type](i);
				console.log(type, check);

				if(check === true){
					number = parseInt(i);
					break;
				}
			}

			console.log(number);
		}else{
			return false;
		}
	}

	wrapElement(type, url = null){
		let node = this.focusNode;
		let $el = this.findContenteditable(this.focusNode);
		$el.innerHTML = $el.innerHTML; // 내부 구조 초기화. (부셔진 node 단위 결합용)
		let child = $el.childNodes;
		let count = child.length;
		let number,firstCursor,endCursor;

		// 노드 순서 구하기
		for(let i = 0;i <= count;i += 1){
			if(child[i].constructor.name === 'Text'){
				if(node.textContent === child[i].textContent){
					number = i;
					break;
				}
			}
		}

		console.log(number);
		console.log(this.startTextCursor);
		console.log(this.endTextCursor);
		console.log($el);
	}

	keybroadControl(event){
		console.log(event);
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
}

function ajax(method,url,data,type,fn){
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
			httpData = xmlhttp.responseText;
			let item = JSON.parse(httpData);
			fn(item);
		}
	}

	xmlhttp.send(data);
}