class dragonEditor{
	constructor(wrap = '.aditor_area', options = {}){
		this.setting(wrap, options);
		this.bindingEvent();
		this.closeLoding();
	}

	setting(wrap, options){
		let $this = this;
		$this.wrap = wrap === '' ? $this.getEl('.pop_bg') : $this.getEl(wrap);
		$this.popBgArea = options.popBgArea === undefined ? $this.getEl('.pop_bg') : $this.getEl(options.popBgArea);
		$this.lodingArea = options.lodingArea === undefined ? $this.getEl('.pop_loding') : $this.getEl(options.lodingArea);
	}

	getEl(name){
		let $el = document.querySelector(name);

		if($el === null){
			console.error('Can not find Element : ' + name);
		}else{
			return $el;
		}
	}

	bindingEvent(){
		let $this = this;

		document.addEventListener('contextmenu', function(e){
			e.preventDefault();
		});
	}

	closeLoding(){
		this.popBgArea.classList.remove('act');
		this.lodingArea.classList.remove('act');
	}
}