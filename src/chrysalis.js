$(function($){
	var Chrysalis = {
		template : function(idOrText, isText) {
			var template = null;
			var el = null;
			switch(typeof idOrText) {
				case 'string':
					if(isText || (!(el = $(idOrText)).length && idOrText.length>100)) {
						template = idOrText;
						break;
					}
				case 'object':
					el = el || $(idOrText);
					if(el.length)
						template = el.html();
					else
						throw "Template not found";
					break;
				default:
					throw "Wrong type for template";
			}
			alert(template);
			return template;
		}
	};

	$.fn.extend({
		template: function(options) {
			if (typeof options == 'boolean')
				options = {isText: options};
			else
				options = options || {};

			$(this)._template = Chrysalis.template(this, options.isText);
		}
	});

});
