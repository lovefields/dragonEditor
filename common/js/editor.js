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

		$this.changeAreaBtn = $this.checkOptionElement(options.changeAreaBtn, '.btn_change_area');
		$this.popBtns = $this.checkOptionElement(options.popBtn, '.btn_pop', 'multi');
		$this.popBgArea = $this.checkOptionElement(options.popBgArea, '.pop_bg');
		$this.lodingArea = $this.checkOptionElement(options.lodingArea, '.pop_loding');
	}

	checkOptionElement(name, defaultName, type = 'single'){
		if(type ===  'single'){
			return name === undefined ? this.getEl(defaultName) : this.getEl(name);
		}else{
			return name === undefined ? this.getElList(defaultName) : this.getElList(name);
		}
	}

	getEl(name){
		let $el = document.querySelector(name);

		if($el === null){
			console.error('Can not find Element : ' + name);
		}else{
			return $el;
		}
	}

	getElList(name){
		let $el = document.querySelectorAll(name);

		if($el.length < 1){
			console.error('Can not find Element List : ' + name);
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

	 					if($btnPop === false){
							$popEl.forEach(function(item){
								item.classList.remove('act');
							});
						}

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

		// switch editor section
		$this.changeAreaBtn.addEventListener('click', function(){
			let status = $this.editorSection.dataset['status'];
			let value = status === 'editor' ? 'options' : 'editor';
			let pop = $this.getElList('.pop.act');

			$this.editorSection.dataset['status'] = value;
			this.classList.toggle('act');

			pop.forEach(function(item){
				item.classList.remove('act');
			});
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
}