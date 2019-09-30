class dragonEditor{
	constructor(wrap = '.editor_area', options = {}){
		this.setting(wrap, options);
		console.log(this.wrap);
		this.bindingEvent();
		this.closeLoding();
	}

	setting(wrap, options){
		let $this = this;

		$this.windowWidth = window.innerWidth;
		$this.windowHeight = window.innerHeight;
		$this.changePint = typeof options.changePint !== 'string' ? 1120 : options.changePint;

		$this.stickerListName = typeof options.stickerList !== 'string' ? '.pop_sticker' : options.stickerList;
		$this.imageIconId = typeof options.imageIconId !== 'string' ? '#icon_image' : options.imageIconId;
		$this.youtubeIconId = typeof options.youtubeIconId !== 'string' ? '#icon_youtube' : options.youtubeIconId;
		$this.codepenIconId = typeof options.codepenIconId !== 'string' ? '#icon_codepen' : options.codepenIconId;
		$this.stickerSize = typeof options.stickerSize !== 'string' ? '0 0 100 100' : options.stickerSize;
		$this.stickerType = options.stickerType === 'image' ? 'image' : 'svg';
		$this.contentAreaName = typeof options.contentArea !== 'string' ? '.content_area' : options.contentArea;
		$this.popOptionsName = typeof options.popOptions !== 'string' ? '.pop_options' : options.popOptions;
		$this.popLinkName = typeof options.popLink !== 'string' ? '.pop_link_box' : options.popLink;

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
		$this.contentDelBtn = $this.checkOptionElement(options.contentDelBtn, '.btn_del_content');
		$this.contentAddBtn = $this.checkOptionElement(options.contentAddBtn, '.btn_add_content', 'multi');
		$this.viewBtn = $this.checkOptionElement(options.viewBtn, '.btn_mod');
		$this.popBtns = $this.checkOptionElement(options.popBtn, '.btn_pop', 'multi');
		$this.popCloseBtns = $this.checkOptionElement(options.popCloseBtns, '.btn_pop_close', 'multi');
		$this.changeAreaBtn = $this.checkOptionElement(options.changeAreaBtn, '.btn_change_area');

		$this.HTMLTextBlock = '<p class="item item_text" contenteditable="true" data-type="text">[content]</p>';
		$this.HTMLBtn = '<button class="btn" data-type="btn" data-value="[type]"><svg viewbox="0 0 50 50" class="icon"><use class="path" xlink:href="[icon_id]" href="[icon_id]" /></svg>[text]</button>';
		$this.HTMLSvgSticker = '<svg viewbox="[size]" class="item item_sticker" data-type="sticker"><use class="path" xlink:href="[url]" href="[url]" /></svg>';
		$this.HTMLList = '<[tag] [type] class="item item_list" data-type="list">[child]</[tag]>';
		$this.HTMLChildList = '<li contenteditable="true">[content]</li>';
		$this.HTMLQuote = '<blockquote class="item item_quote" data-type="quote"><p class="text" contenteditable="true"></p><p class="author" contenteditable="true"></p></blockquote>';
		$this.HTMLTable = '<div class="item item_table_area" data-type="table"><table class="item_table"><caption contenteditable="true"></caption><colgroup><col class="size_100"><col class="size_100"><col class="size_100"><col class="size_100"></colgroup><thead><tr><th contenteditable="true"></th><th contenteditable="true"></th><th contenteditable="true"></th><th contenteditable="true"></th></tr></thead><tbody><tr><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td><td contenteditable="true"></td></tr></tbody></table></div></div>';
		$this.HTMLCodeBlock = '<pre class="item item_codeblock" data-type="codeblock" data-theme="default" data-lang="text"><code class="nohighlight" contenteditable="true"></code></pre>';
		$this.HTMLLinkBox = '<a href="[url]" target="_blank" class="item link_box" data-type="link_box"><div class="img_area"><img src="[imgSrc]" alt="미리보기 이미지" class="img"></div><div class="text_area"><p class="link_title ellipsis">[title]</p><p class="link_description ellipsis">[description]</p><p class="link_domain">[domain]</p></div></a>';

		$this.linkBoxData = {};
	}

	bindingEvent(){
		let $this = this;

		// right click block and content menu open
		document.addEventListener('contextmenu', function(e){
			e.preventDefault();
		});

		document.addEventListener('mouseup', function(e){
			if(typeof e === 'object'){
				let target = e.target;
				switch(e.button){
					case 0 : 
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
						});

						$this.popBtns.forEach(function(btn){
							if($btnPop !== btn){
								btn.classList.remove('act');
							}
						});

						if($pop !== false){
							$pop.classList.add('act');
						}
					break;

					case 2 : 
						if($this.windowWidth > $this.changePint){
							let $area = $this.findParent(target, 'content_area');
							let x = e.clientX;
							let y = e.clientY;
							let $list = $this.getEl('.pop_content_list');

							if($area !== false){
								$list.classList.add('act');
								let listHeight = $list.getBoundingClientRect().height;

								if(y > $this.windowHeight - listHeight){
									$list.style.cssText = 'top:0;left:0;transform:translate('+ x +'px, '+ ($this.windowHeight - listHeight - 40) + 'px)';
								}else{
									$list.style.cssText = 'top:0;left:0;transform:translate('+ x +'px, '+ y +'px)';
								}
							}
						}
					break;
				}
			}
		});

		// resize
		window.addEventListener('resize', function(){
			$this.windowWidth = window.innerWidth;
			$this.windowHeight = window.innerHeight;
			return;
		});

		$this.contentArea.addEventListener('mouseup', function(e){
			if(e.button === 0){
				let $target = $this.getLastSetOrFocus(e.target);

				if($target !== false){
					let offset = $target.getBoundingClientRect();
					let type = $target.dataset['type'];
					let children = $this.getElList($this.contentAreaName + ' > *');

					children.forEach(function($child){
						$child.classList.remove('lastset');
					});
					$target.classList.add('lastset');
					$this.openOptionPop(offset, type);

					if($this.windowWidth < $this.changePint){
						// lastset 된 엘리먼트와 옵션창이 모바일 화면에 들어오도록 스크롤 조절.
					}
				}
			}
		});

		$this.contentArea.addEventListener('mousedown', function(e){
			console.log('down');
			console.log(e.target);
		});

		$this.contentArea.addEventListener('mouseover', function(e){
			if($this.windowWidth > $this.changePint){
				let $target = $this.getLastSetOrFocus(e.target);

				if($target !== false){
					let offset = $target.getBoundingClientRect();
					let type = $target.dataset['type'];
					let children = $this.getElList($this.contentAreaName + ' > *');

					children.forEach(function($child){
						$child.classList.remove('lastset');
					});
					$target.classList.add('lastset');
					$this.openOptionPop(offset, type);
				}
			}
		});

		// mobile scroll event
		//if($this.windowWidth < $this.changePint){
		//	window.addEventListener('scroll', function(){
		//		let $target = $this.getLastSetOrFocus($this.contentArea);
//
		//		if($target !== false){
		//			let offset = $target.getBoundingClientRect();
		//			let type = $target.dataset['type'];
		//			$this.openOptionPop(offset, type);
		//		}
		//	});
		//}
	

		$this.editorSection.addEventListener('mouseleave', function(e){
			if($this.windowWidth > $this.changePint){
				$this.popOptions.classList.remove('act');
			}
		});

		// key event control
		$this.contentArea.addEventListener('keydown', function(e){
			console.log('keydown');
			console.log(e.target);
		});

		// content add event
		$this.contentAddBtn.forEach(function($btn){
			$btn.addEventListener('click', function(){
				let type = this.dataset['value'];
				let childCount = $this.contentArea.childElementCount;
				let $lastEl = $this.contentArea.querySelector('.lastset');
				let $target = $lastEl === null ? $this.contentArea.children[childCount - 1] : $lastEl

				$this.contentAddList.classList.remove('act');
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
				let urlReg = new RegExp('https?:\\/\\/(\\w*:\\w*@)?[-\\w.]+(:\\d+)?(\\/([\\w\\/_.]*(\\?\\S+)?)?)?', 'gi');

				if(urlReg.test(url)){
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
							$viewEl.innerHTML = '데이터를 가져올 수 없습니다.';
						}
					});
				}else{
					alert('URL을 정확히 입력하세요.\nhttp 혹은 https 부터 입력하셔야 합니다.');
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
				alert('선택된 요소가 없습니다.\n 다시 선택해보세요.');
			}
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

	openOptionPop(offset, type){
		let top = offset.top + offset.height + 5;
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
		this.popOptions.style.cssText = 'transform:translate(-50%, '+ top +'px)';
	}
}