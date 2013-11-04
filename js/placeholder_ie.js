/**
 * @authors Damon
 * @date    2013-09-07 17:53:01
 * @version 0.1.2
 */

;(function(window, document, undefined){
	/**
	 * [placeholder --- user <label> to make placeholder effect for browser that don't support placeholder]
	 * @param  {[type]} tagNameOrId [DOMs' tag name or ID]
	 * @return {[type]} new Placeholder(dom) [Instantiation]
	 */
	function placeholder(tagNameOrId){
		// 'class'
		function Placeholder(ele){
			this.init(ele);
		}

		Placeholder.prototype = function(){

			// @private method
			_getPlaceholder = function(dom){
				var placeholder, _placeholder = dom.getAttribute('placeholder');
				if(_placeholder != null){
					placeholder = _placeholder;
				} else { // Compatible with IE7 which under IE10, otherwise dom.getAttribute('placeholder') will return null
					placeholder = dom.getAttributeNode('placeholder').nodeValue;
				}
				return placeholder;
			}

			_createLabel = function(dom){
			 	var id, placeholder;
			 	if(dom.getAttribute('id') == undefined || dom.getAttribute('id') == null || dom.getAttribute('id') == ''){
			 		id = 'placeholder' + String((new Date()).valueOf()).substr(-5) + Math.random();
			 		dom.setAttribute('id', id);
			 	} else {
			 		id = dom.getAttribute('id');
			 	}
			 	return '<label for="' + id + '">' + _getPlaceholder(dom) + '</label>';
			}

			_setLabel = function(dom){
				var html = _createLabel(dom);
			 	dom.parentNode.innerHTML += html;
			 	dom = _updateDom(dom);
			 	_setLabelStyle(dom); // init style
			}

			_updateDom = function(dom){
				return document.getElementById(dom.getAttribute('id'));
			}

			_listenInput = function(dom){ 
				_setParentStyle(dom);
				_setLabel(dom);
				dom = _updateDom(dom);
				dom.onkeyup = function (e) {
		        		if(this.value.length > 0){
		        			_getLabelNode(this).style.display = 'none';
		        		} else {
		        			_getLabelNode(this).style.display = 'block';
		        		}
		            }
		        }

			_getLabelNode = function(dom){
				var childDomList = dom.parentNode.childNodes, childDom;
				for(var i = 0, len = childDomList.length; i < len; i++){
					childDomList[i].nodeName.toLowerCase() == 'label' ? childDom = childDomList[i] : false;
				}
				if(!childDom){
					console.log('Can not find <label>');
				} else {
					return childDom;
				}
			}

			_setLabelStyle = function(dom){
				var labelDom = _getLabelNode(dom),
					css =   'position:absolute;' +
						    'left:15px;' +
						    'display:block;' +
						    'top:10px;' + 
						    'color:#b8b8b8;' +
						    'font-size:14px;';
				addCss(labelDom, css);
			}

			_setParentStyle = function (dom) {
				var parent = dom.parentNode,
					css = 'position:relative;';
				addCss(parent, css);
			}

			// @public
			init = function(dom){
				_listenInput(dom);
			}

			return {
				init: init
			}
		}();

		var returnDomObj = function(attribute){
			return attribute == 'input' ? document.getElementsByTagName(attribute) : document.getElementById(attribute);
		},

		addCss = function(element, css) {
			css = css.replace(/\-([a-z])/gi, function($1, $2) { return $2.toUpperCase(); });
			css = css.match(/[^:;]+/g); 
			var len = css.length, i = 0;
			if (len > 1 && 0 == len % 2) {
			    while (i < len) {
			    element.style[css[i++]] = css[i++];
			   }   
			}
		};

		return function(tagNameOrId){
			var el = returnDomObj(tagNameOrId),
				supportPlaceholder = 'placeholder' in document.createElement('input');
			if (!supportPlaceholder && /MSIE 9|MSIE 8|MSIE 7|MSIE 6/g.test(navigator.userAgent)) {
				if(el.length != undefined){
					for(var i = 0, len = el.length; i < len; i++){
						new Placeholder(el[i]);
					}
				} else {
					new Placeholder(el);
				}
			} else {
				return false;
			}
		}(tagNameOrId);
	}

	window.placeholder = placeholder;

})(window, document);