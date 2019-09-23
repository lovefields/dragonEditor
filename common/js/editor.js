class dragonEditor{
	constructor(wrap = '.aditor_area', options = {}){
		this.setting(wrap, options);
		console.log(this.wrap);
		this.bindingEvent();
		this.closeLoding();
	}

	setting(wrap, options){
		let $this = this;
		$this.wrap = $this.checkOptionElement(wrap, '.aditor_area');
		$this.editorSection = $this.checkOptionElement(options.editorSection, '.editor_section');
		$this.contentArea = $this.checkOptionElement(options.contentArea, '.content_area');
		$this.contentAddList = $this.checkOptionElement(options.contentAddList, '.pop_content_list');
		$this.stickerListName = options.stickerListName === undefined ? '.pop_sticker' : options.stickerListName;

		$this.contentAddBtn = $this.checkOptionElement(options.contentAddBtn, '.btn_add_content', 'multi');
		$this.viewBtn = $this.checkOptionElement(options.viewBtn, '.btn_mod');
		$this.changeAreaBtn = $this.checkOptionElement(options.changeAreaBtn, '.btn_change_area');
		$this.popBtns = $this.checkOptionElement(options.popBtn, '.btn_pop', 'multi');

		$this.popBgArea = $this.checkOptionElement(options.popBgArea, '.pop_bg');
		$this.lodingArea = $this.checkOptionElement(options.lodingArea, '.pop_loding');

		$this.HTMLTextBlock = '<p class="item item_text" contenteditable="true">[content]</p>';
	}

	checkOptionElement(name, defaultName, type = 'single'){
		let $item;
		if(type ===  'single'){
			$item = name === undefined ? this.getEl(defaultName) : this.getEl(name);
		}else{
			$item = name === undefined ? this.getElList(defaultName) : this.getElList(name);
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
								item.classList.remove('act');
							}else{
								let name = $btnPop.dataset['target'];

								if(item !== $this.getEl(name)){
									item.classList.remove('act');
								}
							}
						});

						if($pop !== false){
							$pop.classList.add('act');
						}
					break;

					case 2 : 
						let $area = $this.findParent(target, 'content_area');
						let x = e.pageX;
						let y = e.pageY;
						let $list = $this.getEl('.pop_content_list');

						if($area !== false){
							$list.style.cssText = 'top:0;left:0;transform:translate('+ x +'px, '+ y +'px)';
							$list.classList.add('act');
						}
					break;
				}
			}
		});

		$this.contentArea.addEventListener('mouseup', function(e){
			console.log('up');
			console.log(e.target);
		});

		$this.contentArea.addEventListener('mousedown', function(e){
			console.log('down');
			console.log(e.target);
		});

		$this.contentArea.addEventListener('keyup', function(e){
			console.log('keyup');
			console.log(e.target);
		});

		$this.contentAddBtn.forEach(function($btn){
			$btn.addEventListener('click', function(){
				let type = this.dataset['value'];

				$this.contentAddList.classList.remove('act');
				switch(type){
					case 'text':
						$this.addTextBlock();
					break;
					case 'image':
						//$this.addImageBtn();
					break;
					case 'sticker':
					break;
					case 'youtube':
					break;
					case 'codepen':
					break;
					case 'bulletedlist':
					break;
					case 'numberedlist':
					break;
					case 'quote':
					break;
					case 'table':
					break;
					case 'codeblock':
					break;
				}
				console.log(type);
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
		$this.popBtns.forEach(function(btn){
			btn.addEventListener('click', function(){
				let status = $this.editorSection.dataset['status'];
				let target = this.dataset['target'];
				let $el = $this.getEl(target);

				if(status !== 'options'){
					this.classList.toggle('act');
					$el.removeAttribute('style');
					$el.classList.toggle('act');

					if(target === $this.stickerListName){
						$this.contentAddList.classList.remove('act');
					}
				}else{
					return false;
				}
			});
		});
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

	addTextBlock(content = ''){
		let $lastEl = this.contentArea.querySelector('.lastset');
		let childCount = this.contentArea.childElementCount;
		let html = this.HTMLTextBlock.replace('[content]', content);
		let target = $lastEl === null ? this.contentArea.querySelector('*:nth-child('+ childCount +')') : $lastEl

		target.insertAdjacentHTML('afterend', html);
		target.nextElementSibling.focus();
	}

	addImageBtn(){

	}
}