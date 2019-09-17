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

		// right click block
		document.addEventListener('contextmenu', function(e){
			e.preventDefault();
		});

		// switch editor section
		$this.changeAreaBtn.addEventListener('click', function(){
			let status = $this.editorSection.dataset['status'];
			let value = status === 'editor' ? 'options' : 'editor';
			let nowText = this.textContent;
			let saveText = this.dataset['text'];

			$this.editorSection.dataset['status'] = value;
			this.dataset['text'] = nowText;
			this.textContent = saveText;
		});

		// pop btns work
		$this.popBtns.forEach(function(btn){
			btn.addEventListener('click', function(){
				let target = this.dataset['target'];
				let $el = $this.getEl(target);

				this.classList.toggle('act');
				$el.classList.toggle('act');
			});
		});

		
	}

	closeLoding(){
		this.popBgArea.classList.remove('act');
		this.lodingArea.classList.remove('act');
	}
}