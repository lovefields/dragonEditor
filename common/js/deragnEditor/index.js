import setting from './setting';
import { setContent, getContentJSON, bindingEvent } from './content';

export function init(wrap, options = {}){
	wrap = wrap === null ? '.editor_area' : wrap;
	global.storage = new setting(wrap, options);

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

		bindingEvent();
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

export function setContentData(json){
	storage.contentData = json;
	setContent(storage.contentData[storage.langStatus]);
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

export function addLanguage(lang){
	if(storage.contentData[lang] === undefined){
		storage.contentData[lang] = [];
		return true;
	}else{
		console.error(`"${lang}" is already exists.`);
		return false;
	}
}