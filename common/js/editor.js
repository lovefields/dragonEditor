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
		$this.windowWidth = window.innerWidth;
		$this.windowHeight = window.innerHeight;
		$this.changePint = typeof options.changePint !== 'string' ? 1120 : options.changePint;
		$this.maxImageWidth = typeof options.maxImageWidth !== 'string' ? 800 : options.maxImageWidth;

		$this.stickerListName = typeof options.stickerList !== 'string' ? '.pop_sticker' : options.stickerList;
		$this.imageIconId = typeof options.imageIconId !== 'string' ? '#icon_image' : options.imageIconId;
		$this.youtubeIconId = typeof options.youtubeIconId !== 'string' ? '#icon_youtube' : options.youtubeIconId;
		$this.codepenIconId = typeof options.codepenIconId !== 'string' ? '#icon_codepen' : options.codepenIconId;
		$this.stickerSize = typeof options.stickerSize !== 'string' ? '0 0 100 100' : options.stickerSize;
		$this.stickerType = options.stickerType === 'image' ? 'image' : 'svg';
		$this.contentAreaName = typeof options.contentArea !== 'string' ? '.content_area' : options.contentArea;
		$this.popOptionsName = typeof options.popOptions !== 'string' ? '.pop_options' : options.popOptions;
		$this.popLinkName = typeof options.popLink !== 'string' ? '.pop_link_box' : options.popLink;
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
		$this.HTMLList = '<[tag] [type] class="item item_list lastset" data-type="list">[child]</[tag]>';
		$this.HTMLChildList = '<li contenteditable="true">[content]</li>';
		$this.HTMLQuote = '<blockquote class="item item_quote lastset" data-type="quote"><p class="text" contenteditable="true"></p><p class="author" contenteditable="true"></p></blockquote>';
		$this.HTMLTable = '<div class="item item_table_area lastset" data-type="table"><table class="item_table"><caption contenteditable="true"></caption><colgroup><col class="size_100"><col class="size_100"><col class="size_100"><col class="size_100"></colgroup><thead><tr><th contenteditable="true"></th><th contenteditable="true"></th><th contenteditable="true"></th><th contenteditable="true"></th></tr></thead><tbody><tr><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td></tr></tbody></table></div></div>';
		$this.HTMLCodeBlock = '<pre class="item item_codeblock lastset" data-type="codeblock" data-theme="default" data-lang="text"><code class="nohighlight" contenteditable="true"></code></pre>';
		$this.HTMLLinkBox = '<a href="[url]" target="_blank" class="item link_box lastset" data-type="link_box"><div class="img_area"><img src="[imgSrc]" alt="미리보기 이미지" class="img"></div><div class="text_area"><p class="link_title ellipsis">[title]</p><p class="link_description ellipsis">[description]</p><p class="link_domain">[domain]</p></div></a>';
		$this.HTMLOption = '<option value="[value]">[text]</option>';

		$this.urlReg = new RegExp('https?:\\/\\/(\\w*:\\w*@)?[-\\w.]+(:\\d+)?(\\/([\\w\\/_.]*(\\?\\S+)?)?)?', 'gi');
		$this.numberReg = new RegExp('[0-9]', 'g');

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

		// resize
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
							if(!item.classList.contains($this.popOptionsName.substr(1)) && !item.classList.contains($this.contentAddListName.substr(1))){
								item.classList.remove('act');
							}
						}else{
							let name = $btnPop.dataset['target'];

							if(item !== $this.getEl(name) && !item.classList.contains($this.contentAddListName.substr(1))){
								item.classList.remove('act');
							}
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
						actionPrev();
					}else if(ctrl === true && e.shiftKey === true){
						e.preventDefault();
						actionNext();
					}
				}
			}
		});

		window.addEventListener('scroll', function(e){
			//if($this.windowWidth > $this.changePint){
			//	document.activeElement.blur();
			//	$this.popOptions.classList.remove('act');
			//}
		});

		$this.contentArea.addEventListener('mouseup', function(e){
			if(e.button === 0){
				$this.contentCheckByMouse(e.target, 'mouseup');
				$this.checkOptionsValue(e.target);
				// 드레그 이벤트 언바인딩
			}
		});

		$this.contentArea.addEventListener('mousedown', function(e){
			// 단어 선택 초기화
			if ($this.selection.empty){
				$this.selection.empty();
			}else if($this.selection.removeAllRanges){
				$this.selection.removeAllRanges();
			}
			$this.startTextCursor = 0;
			$this.endTextCursor = 0;

			// 드레그 이벤트 바인딩 및 2초뒤 실행
			console.log('down');
			console.log(e.target);
		});

		$this.contentArea.addEventListener('mouseover', function(e){
			if($this.windowWidth > $this.changePint){
				$this.contentCheckByMouse(e.target, 'mouseover');
				$this.checkOptionsValue(e.target);
			}
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

			if($pop !== false){
				$pop.forEach(function(item){
					item.classList.remove('act');
				});
			}

			if($target.classList.contains('mobile') === true){
				$target.classList.remove('mobile');
				$this.viewBtn.classList.remove('act');
			}
		});

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

					if(target === $this.stickerListName || target === $this.popLinkName){
						$this.contentAddList.classList.remove('act');
					}
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
		let attribute = type === null ? '' : 'type="'+ type +'"';
		let child = this.HTMLChildList.replace(/\[content\]/g, content);
		let html = this.HTMLList.replace(/\[tag\]/g, tag)
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
		this.activeElement = '';
		let $target = this.getLastSetOrFocus(target);
		let base = this.selection.baseOffset;
		let extent = this.selection.extentOffset;

		if($target !== false){
			let offset = $target.getBoundingClientRect();
			let type = $target.dataset['type'];
			let $children = this.getElList(this.contentAreaName + ' > *');
			let isBtn = $target.classList.contains('btn');

			switch(true){
				case isBtn === true && eventType === 'mouseup' : 
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
			this.setLastElement($target, $children);
			this.openOptionPop(offset, type);
		}
	}

	checkOptionsValue(target){
		console.log(target);
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
}