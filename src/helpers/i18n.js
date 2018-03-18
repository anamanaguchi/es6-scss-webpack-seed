module.exports = function(key) {
	const translation = this.htmlWebpackPlugin && this.htmlWebpackPlugin.options && this.htmlWebpackPlugin.options.translation;
	if(translation && translation[key]){
		return translation[key]
	}else{
		return key;
	}

};