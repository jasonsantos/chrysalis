$(function($){

  var merge = function(obj1, obj2, obj3) {
     var res = {};
     if(obj1) for (attrname in obj1) { res[attrname] = obj1[attrname]; };
     if(obj2) for (attrname in obj2) { res[attrname] = obj2[attrname]; };
     if(obj3) for (attrname in obj3) { res[attrname] = obj3[attrname]; };
     return res;
  }

  var Template = {
    '.prototype': 'template',
    _id: 0,
    pattern: /[$][{]([\w\-]+)([:]([\w\-]+)(\[\[(.*)\]\])?)?[}]/g,
    separator: '',
    options: {
      foreach: function(item, idx, list) {
        var template = this;
      }
    },
    render: function(data, options) {
      var options = merge(Template, options);
      if(!this.rawText)
        throw new Error("Cannot render an empty or uninitialized template");
      return this.rawText.replace(this.pattern, function(m, key, _, param, __, optional) {
		    if (param && typeof options[key] == 'function') {
			    var fn = options[key];
			    var res = [];
			    var n = 1;
			    var o = data[param];
			    if(!o)
			      throw new Error("object "+param+" not found for action '"+key+"'");
			    if(typeof o == 'object' && typeof o.length=='number') {
				    n = o.length;
			    }
			    for(var i=0;i<n;i++) {
				    res.push(fn(o[i], i, o, optional));
			    }
			    return res.join('');
		    } else {
			    return (data[key] || '' );
			  }
      });
    }
  };

  var _lastid = 0;
  var templatify = function(strTemplate) {
    return (typeof strTemplate=='object' || strTemplate._template) || merge(Template, {_id: ++_lastid, rawText: strTemplate});
  }

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
					el = el  || $(idOrText);
					if(el.length)
						template = el._template || el.html();
					else
						throw new Error("Template not found");
					break;
				default:
					throw new Error("Wrong type for template");
			}

			return templatify(template);
		}
	};

  var renderToObject = function(data, options) {
    var me = this;
    var options = options || {};
    var template = this._template || options.template;

    if(!template)
      throw new Error("Cannot render without a template");

    if(me['.prototype']=='template')
      return template.render(data, options);
    else
      return me.html(template.render(data, options));
	};

	$.fn.extend({
		template: function(options) {
		  var tpl = (this[0]==window.document) ? $('#chrysalis-template') : this;
			if (typeof options == 'string') {
  			tpl = options;
				options = {isText: true};
			} else if (typeof options == 'boolean')
				  options = {returnTemplate: options};
			  else
				  options = options || {};

			var obj = (this[0]==window.document) ? $('#chrysalis-target') : this;
			if(obj[0]==tpl[0] && this._template)
			  obj._template = this._template;
			else
  			obj._template = Chrysalis.template(tpl, options.isText);
			obj.render = renderToObject;

			if(options.returnTemplate)
			  return obj._template;

			return obj;
		},

		render: renderToObject
	});

});

