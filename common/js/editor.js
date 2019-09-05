class dragonEditor{
	constructor(wrap, options){
		this.setting(options);
		console.log(wrap);
		console.log(this.lodingArea);
		this.closeLoding();
	}

	setting(options){
		let $this = this;
		$this.popBgArea = options.popBgArea === undefined ? $this.getEl('.pop_bg') : $this.getEl(options.popBgArea);
		$this.lodingArea = options.lodingArea === undefined ? $this.getEl('.pop_loding') : $this.getEl(options.lodingArea);
	}

	getEl(name){
		return document.querySelector(name);
	}

	closeLoding(){
		this.popBgArea.classList.remove('act');
		this.lodingArea.classList.remove('act');
	}
}