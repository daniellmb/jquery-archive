/*
 * jQuery - New Wave Javascript
 *
 * Copyright (c) 2006 John Resig (jquery.com)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * $Date: 2006-07-01 10:05:50 -0400 (Sat, 01 Jul 2006) $
 * $Rev: 110 $
 */

// Global undefined variable
window.undefined = window.undefined;

/**
 * Create a new jQuery Object
 * @constructor
 */
function jQuery(a,c) {
	// Watch for when a jQuery object is passed in as an arg
	if ( a && a.jquery )
		return a;
	
	// If the context is global, return a new object
	if ( window == this )
		return new jQuery(a,c);
	
	// Find the matching elements and save them for later
	this.cur = jQuery.Select(
		a || jQuery.context || document,
		c && c.jquery && c.get(0) || c
	);
}

/**
 * The jQuery query object.
 */
if ( !window.$ )
  var $ = jQuery;

/*
 * Handle support for overriding other $() functions. Way too many libraries
 * provide this function to simply ignore it and overwrite it.
 */
else
  var $ = function(a,c) {
    // Check to see if this is a possible collision case
    if ( !c && a.constructor == String && 
      
        // Make sure that the expression is a colliding one
        !/[^a-zA-Z0-9_-]/.test(a) &&
        
        // and that there are no elements that match it
        // (this is the one truly ambiguous case)
        !document.getElementsByTagName(a).length ) {
          
      // Only return the element if it's  found
      var obj = document.getElementById(a);
      if ( obj ) return obj;
      
    }
    
    return jQuery(a,c);
  };

jQuery.fn = jQuery.prototype = {
	/**
	 * The current SVN version of jQuery.
	 *
	 * @private
	 * @type String
	 */
	jquery: "$Rev: 110 $",
	
	/**
	 * The number of elements currently matched.
	 *
	 * @type Number
	 */
	size: function() {
		return this.get().length;
	},
	
	/**
	 * Access the elements matched. If a number is provided,
	 * the Nth element is returned, otherwise, an array of all
	 * matched items is returned.
	 *
	 * @type Array,DOMElement
	 */
	get: function(num) {
		return num == undefined ? this.cur : this.cur[num];
	},
	
	each: function(f) {
		for ( var i = 0; i < this.size(); i++ )
			f.apply( this.get(i), [i] );
		return this;
	},
	set: function(a,b) {
		return this.each(function(){
			if ( b === undefined )
				for ( var j in a )
					jQuery.attr(this,j,a[j]);
			else
				jQuery.attr(this,a,b);
		});
	},
	html: function(h) {
		return h == undefined && this.size() ?
			this.get(0).innerHTML : this.set( "innerHTML", h );
	},
	val: function(h) {
		return h == undefined && this.size() ?
			this.get(0).value : this.set( "value", h );
	},
	text: function(e) {
		e = e || this.get();
		var t = "";
		for ( var j = 0; j < e.length; j++ )
			for ( var i = 0; i < e[j].childNodes.length; i++ )
				t += e[j].childNodes[i].nodeType != 1 ?
					e[j].childNodes[i].nodeValue :
					jQuery.fn.text(e[j].childNodes[i].childNodes);
		return t;
	},
	
	css: function(a,b) {
		return a.constructor != String || b ?
			this.each(function(){
				if ( b === undefined )
					for ( var j in a )
						jQuery.attr(this.style,j,a[j]);
				else
					jQuery.attr(this.style,a,b);
			}) : jQuery.css( this.get(0), a );
	},
	toggle: function() {
		return this.each(function(){
			var d = jQuery.css(this,"display");
			if ( !d || d == "none" )
				$(this).show();
			else
				$(this).hide();
		});
	},
	show: function() {
		return this.each(function(){
			this.style.display = this.oldblock ? this.oldblock : "";
			if ( jQuery.css(this,"display") == "none" )
				this.style.display = "block";
		});
	},
	hide: function() {
		return this.each(function(){
			this.oldblock = jQuery.css(this,"display");
			if ( this.oldblock == "none" )
				this.oldblock = "block";
			this.style.display = "none";
		});
	},
	addClass: function(c) {
		return this.each(function(){
			jQuery.className.add(this,c);
		});
	},
	removeClass: function(c) {
		return this.each(function(){
			jQuery.className.remove(this,c);
		});
	},

	toggleClass: function(c) {
		return this.each(function(){
			if (jQuery.hasWord(this,c))
				jQuery.className.remove(this,c);
			else
				jQuery.className.add(this,c);
		});
	},
	remove: function() {
		this.each(function(){this.parentNode.removeChild( this );});
		return this.pushStack( [] );
	},
	
	wrap: function() {
		var a = jQuery.clean(arguments);
		return this.each(function(){
			var b = a[0].cloneNode(true);
			this.parentNode.insertBefore( b, this );
			while ( b.firstChild )
				b = b.firstChild;
			b.appendChild( this );
		});
	},
	
	append: function() {
		var clone = this.size() > 1;
		var a = jQuery.clean(arguments);
		return this.domManip(function(){
			for ( var i = 0; i < a.length; i++ )
				this.appendChild( clone ? a[i].cloneNode(true) : a[i] );
		});
	},
	
	appendTo: function() {
		var a = arguments;
		return this.each(function(){
			for ( var i = 0; i < a.length; i++ )
				$(a[i]).append( this );
		});
	},
	
	prepend: function() {
		var clone = this.size() > 1;
		var a = jQuery.clean(arguments);
		return this.domManip(function(){
			for ( var i = a.length - 1; i >= 0; i-- )
				this.insertBefore( clone ? a[i].cloneNode(true) : a[i], this.firstChild );
		});
	},
	
	before: function() {
		var clone = this.size() > 1;
		var a = jQuery.clean(arguments);
		return this.each(function(){
			for ( var i = 0; i < a.length; i++ )
				this.parentNode.insertBefore( clone ? a[i].cloneNode(true) : a[i], this );
		});
	},
	
	after: function() {
		var clone = this.size() > 1;
		var a = jQuery.clean(arguments);
		return this.each(function(){
			for ( var i = a.length - 1; i >= 0; i-- )
				this.parentNode.insertBefore( clone ? a[i].cloneNode(true) : a[i], this.nextSibling );
		});
	},
	
	empty: function() {
		return this.each(function(){
			while ( this.firstChild )
				this.removeChild( this.firstChild );
		});
	},
	
	bind: function(t,f) {
		return this.each(function(){jQuery.event.add(this,t,f);});
	},
	unbind: function(t,f) {
		return this.each(function(){jQuery.event.remove(this,t,f);});
	},
	trigger: function(t) {
		return this.each(function(){jQuery.event.trigger(this,t);});
	},
	
	pushStack: function(a) {
		if ( !this.stack ) this.stack = [];
		this.stack.unshift( this.cur );
		if ( a ) this.cur = a;
		return this;
	},
	
	find: function(t) {
		var ret = [];
		this.each(function(){
			ret = jQuery.merge( ret, jQuery.Select(t,this) );
		});
		this.pushStack( ret );
		return this;
	},
	
	end: function() {
		this.cur = this.stack.shift();
		return this;
	},
	
	parent: function(a) {
		var ret = jQuery.map(this.cur,"d.parentNode");
		if ( a ) ret = jQuery.filter(a,ret).r;
		return this.pushStack(ret);
	},
	
	parents: function(a) {
		var ret = jQuery.map(this.cur,jQuery.parents);
		if ( a ) ret = jQuery.filter(a,ret).r;
		return this.pushStack(ret);
	},
	
	siblings: function(a) {
		// Incorrect, need to exclude current element
		var ret = jQuery.map(this.cur,jQuery.sibling);
		if ( a ) ret = jQuery.filter(a,ret).r;
		return this.pushStack(ret);
	},
	
	filter: function(t) {
		return this.pushStack( jQuery.filter(t,this.cur).r );
	},
	not: function(t) {
		return this.pushStack( t.constructor == String ?
			jQuery.filter(t,this.cur,false).r :
			jQuery.grep(this.cur,function(a){ return a != t; }) );
	},
	add: function(t) {
		return this.pushStack( jQuery.merge( this.cur, t.constructor == String ?
			jQuery.Select(t) : t.constructor == Array ? t : [t] ) );
	},
	
	/**
	 * A wrapper function for each() to be used by append and prepend.
	 * Handles cases where you're trying to modify the inner contents of
	 * a table, when you actually need to work with the tbody.
	 *
	 * @member jQuery
	 * @param {String} expr The expression with which to filter
	 * @type Boolean
	 */
	is: function(expr) {
		return jQuery.filter(expr,this.cur).r.length > 0;
	},
	
	/**
	 * A wrapper function for each() to be used by append and prepend.
	 * Handles cases where you're trying to modify the inner contents of
	 * a table, when you actually need to work with the tbody.
	 *
	 * @private
	 * @member jQuery
	 * @param {Function} fn The function doing the DOM manipulation.
	 * @type jQuery
	 */
	domManip: function(fn){
		return this.each(function(){
			var obj = this;
			
			if ( this.nodeName == "TABLE" ) {
				var tbody = this.getElementsByTagName("tbody");

				if ( !tbody.length ) {
					obj = document.createElement("tbody");
					this.appendChild( obj );
				} else
					obj = tbody[0];
			}
	
			fn.apply( obj );
		});
	}
};

jQuery.className = {
	add: function(o,c){
		if (jQuery.hasWord(o,c)) return;
		o.className += ( o.className ? " " : "" ) + c;
	},
	remove: function(o,c){
		o.className = !c ? "" :
			o.className.replace(
				new RegExp("(^|\\s*\\b[^-])"+c+"($|\\b(?=[^-]))", "g"), "");
	}
};

(function(){
	var b = navigator.userAgent.toLowerCase();

	// Figure out what browser is being used
	jQuery.browser =
		( /webkit/.test(b) && "safari" ) ||
		( /opera/.test(b) && "opera" ) ||
		( /msie/.test(b) && "msie" ) ||
		( !/compatible/.test(b) && "mozilla" ) ||
		"other";

	// Check to see if the W3C box model is being used
	jQuery.boxModel = ( jQuery.browser != "msie" || document.compatMode == "CSS1Compat" );
})();

jQuery.css = function(e,p) {
	// Adapted from Prototype 1.4.0
	if ( p == "height" || p == "width" ) {

		// Handle extra width/height provided by the W3C box model
		var ph = (!jQuery.boxModel ? 0 :
			jQuery.css(e,"paddingTop") + jQuery.css(e,"paddingBottom") +
			jQuery.css(e,"borderTopWidth") + jQuery.css(e,"borderBottomWidth")) || 0;

		var pw = (!jQuery.boxModel ? 0 :
			jQuery.css(e,"paddingLeft") + jQuery.css(e,"paddingRight") +
			jQuery.css(e,"borderLeftWidth") + jQuery.css(e,"borderRightWidth")) || 0;

		var oHeight, oWidth;

		if (jQuery.css(e,"display") != 'none') {
			oHeight = e.offsetHeight || parseInt(e.style.height) || 0;
			oWidth = e.offsetWidth || parseInt(e.style.width) || 0;
		} else {
			var els = e.style;
			var ov = els.visibility;
			var op = els.position;
			var od = els.display;
			els.visibility = "hidden";
			els.position = "absolute";
			els.display = "";
			oHeight = e.clientHeight || parseInt(e.style.height);
			oWidth = e.clientWidth || parseInt(e.style.width);
			els.display = od;
			els.position = op;
			els.visibility = ov;
		}

		return p == "height" ?
			(oHeight - ph < 0 ? 0 : oHeight - ph) :
			(oWidth - pw < 0 ? 0 : oWidth - pw);
	}
	
	var r;

	if (e.style[p])
		r = e.style[p];
 	else if (e.currentStyle)
		r = e.currentStyle[p];
	else if (document.defaultView && document.defaultView.getComputedStyle) {
		p = p.replace(/([A-Z])/g,"-$1").toLowerCase();
		var s = document.defaultView.getComputedStyle(e,"");
		r = s ? s.getPropertyValue(p) : null;
 	}
	
	return /top|right|left|bottom/i.test(p) ? parseFloat( r ) : r;
};

jQuery.clean = function(a) {
	var r = [];
	for ( var i = 0; i < a.length; i++ ) {
		if ( a[i].constructor == String ) {

			if ( !a[i].indexOf("<tr") ) {
				var tr = true;
				a[i] = "<table>" + a[i] + "</table>";
			} else if ( !a[i].indexOf("<td") || !a[i].indexOf("<th") ) {
				var td = true;
				a[i] = "<table><tbody><tr>" + a[i] + "</tr></tbody></table>";
			}

			var div = document.createElement("div");
			div.innerHTML = a[i];

			if ( tr || td ) {
				div = div.firstChild.firstChild;
				if ( td ) div = div.firstChild;
			}

			for ( var j = 0; j < div.childNodes.length; j++ )
				r[r.length] = div.childNodes[j];
		} else if ( a[i].length && !a[i].nodeType )
			for ( var k = 0; k < a[i].length; k++ )
				r[r.length] = a[i][k];
		else if ( a[i] !== null )
			r[r.length] =
				a[i].nodeType ? a[i] : document.createTextNode(a[i].toString());
	}
	return r;
};

jQuery.g = {
	"": "m[2]== '*'||a.nodeName.toUpperCase()==m[2].toUpperCase()",
	"#": "a.getAttribute('id')&&a.getAttribute('id')==m[2]",
	":": {
		lt: "i<m[3]-0",
		gt: "i>m[3]-0",
		nth: "m[3]-0==i",
		eq: "m[3]-0==i",
		first: "i==0",
		last: "i==r.length-1",
		even: "i%2==0",
		odd: "i%2==1",
		"first-child": "jQuery.sibling(a,0).cur",
		"nth-child": "(m[3]=='even'?jQuery.sibling(a,m[3]).n%2==0:(m[3]=='odd'?jQuery.sibling(a,m[3]).n%2==1:jQuery.sibling(a,m[3]).cur))",
		"last-child": "jQuery.sibling(a,0,true).cur",
		"nth-last-child": "jQuery.sibling(a,m[3],true).cur",
		"first-of-type": "jQuery.ofType(a,0)",
		"nth-of-type": "jQuery.ofType(a,m[3])",
		"last-of-type": "jQuery.ofType(a,0,true)",
		"nth-last-of-type": "jQuery.ofType(a,m[3],true)",
		"only-of-type": "jQuery.ofType(a)==1",
		"only-child": "jQuery.sibling(a).length==1",
		parent: "a.childNodes.length",
		empty: "!a.childNodes.length",
		root: "a==(a.ownerDocument||document).documentElement",
		contains: "(a.innerText||a.innerHTML).indexOf(m[3])!=-1",
		visible: "(!a.type||a.type!='hidden')&&(jQuery.css(a,'display')!='none'&&jQuery.css(a,'visibility')!= 'hidden')",
		hidden: "(a.type&&a.type=='hidden')||jQuery.css(a,'display')=='none'||jQuery.css(a,'visibility')== 'hidden'",
		enabled: "!a.disabled",
		disabled: "a.disabled",
		checked: "a.checked"
	},
	".": "jQuery.hasWord(a,m[2])",
	"@": {
		"=": "jQuery.attr(a,m[3])==m[4]",
		"!=": "jQuery.attr(a,m[3])!=m[4]",
		"~=": "jQuery.hasWord(jQuery.attr(a,m[3]),m[4])",
		"|=": "!jQuery.attr(a,m[3]).indexOf(m[4])",
		"^=": "!jQuery.attr(a,m[3]).indexOf(m[4])",
		"$=": "jQuery.attr(a,m[3]).substr( jQuery.attr(a,m[3]).length - m[4].length,m[4].length )==m[4]",
		"*=": "jQuery.attr(a,m[3]).indexOf(m[4])>=0",
		"": "m[3]=='*'?a.attributes.length>0:jQuery.attr(a,m[3])"
	},
	"[": "jQuery.Select(m[2],a).length"
};

jQuery.token = [
	"\\.\\.|/\\.\\.", "a.parentNode",
	">|/", "jQuery.sibling(a.firstChild)",
	"\\+", "jQuery.sibling(a).next",
	"~", function(a){
		var r = [];
		var s = jQuery.sibling(a);
		if ( s.n > 0 )
			for ( var i = s.n; i < s.length; i++ )
				r[r.length] = s[i];
		return r;
	}
];

jQuery.Select = function( t, context ) {
	context = context || jQuery.context || document;
	if ( t.constructor != String )
		return t.constructor == Array ? t : [t];

	if ( !t.indexOf("//") ) {
		context = context.documentElement;
		t = t.substr(2,t.length);
	} else if ( !t.indexOf("/") ) {
		context = context.documentElement;
		t = t.substr(1,t.length);
		// FIX Assume the root element is right :(
		if ( t.indexOf("/") >= 1 )
			t = t.substr(t.indexOf("/"),t.length);
	}

	var ret = [context];
	var done = [];
	var last = null;

	while ( t.length > 0 && last != t ) {
    var r = [];
		last = t;

    t = jQuery.cleanSpaces(t).replace( /^\/\//i, "" );
		
		var foundToken = false;
		
		for ( var i = 0; i < jQuery.token.length; i += 2 ) {
			var re = new RegExp("^(" + jQuery.token[i] + ")");
			var m = re.exec(t);
			
			if ( m ) {
				r = ret = jQuery.map( ret, jQuery.token[i+1] );
				t = jQuery.cleanSpaces( t.replace( re, "" ) );
				foundToken = true;
			}
		}
		
		if ( !foundToken ) {

			if ( !t.indexOf(",") || !t.indexOf("|") ) {
				if ( ret[0] == context ) ret.shift();
				done = jQuery.merge( done, ret );
				r = ret = [context];
				t = " " + t.substr(1,t.length);
			} else {
				var re2 = /^([#.]?)([a-z0-9\\*\.:_-]*)/i;
				var re2NoDotAndColon = /^([#.]?)([a-z0-9\\*_-]*)/i;
				var m = re2.exec(t);

				if ( m[1] == "#" ) {
					// Ummm, should make this work in all XML docs
					var oid = document.getElementById(m[2]);
					if (!oid) {
						re2 = re2NoDotAndColon;
						m = re2.exec(t);
						oid = document.getElementById(m[2]);
					}
					r = ret = oid ? [oid] : [];
					t = t.replace( re2, "" );
				} else {
					if ( !m[2] || m[1] == "." ) m[2] = "*";

					for ( var i = 0; i < ret.length; i++ ) {
						if (m[2] == "*") r = jQuery.merge( r, jQuery.getAll(ret[i]));
						else {
							var elems = ret[i].getElementsByTagName(m[2]);
							if (elems.length == 0) {
								m = re2NoDotAndColon.exec(t);
								if ( !m[2] || m[1] == "." ) m[2] = "*";
								elems = ret[i].getElementsByTagName(m[2]);
							}
							r = jQuery.merge( r, elems);
						}
					}
				}
			}
			
		}

		if ( t ) {
			var val = jQuery.filter(t,r);
			ret = r = val.r;
			t = jQuery.cleanSpaces(val.t);
		}
	}

	if ( ret && ret[0] == context ) ret.shift();
	done = jQuery.merge( done, ret );

	return done;
};

jQuery.getAll = function(o,r) {
	r = r || [];
	var s = o.childNodes;
	for ( var i = 0; i < s.length; i++ )
		if ( s[i].nodeType == 1 ) {
			r[r.length] = s[i];
			jQuery.getAll( s[i], r );
		}
	return r;
};

jQuery.attr = function(o,a,v){
	if ( a && a.constructor == String ) {
		var fix = {
			"for": "htmlFor",
			"class": "className",
			"float": "cssFloat"
		};
		a = (fix[a] && fix[a].replace && fix[a]) || a;
		var r = /-([a-z])/ig;
		a = a.replace(r,function(z,b){return b.toUpperCase();});
		if ( v != undefined ) {
			o[a] = v;
			if ( o.setAttribute && a != "disabled" )
				o.setAttribute(a,v);
		}
		return o[a] || o.getAttribute(a) || "";
	} else
		return "";
};

jQuery.filter = function(t,r,not) {
	var g = jQuery.grep;
	if ( not === false )
		g = function(a,f) {return jQuery.grep(a,f,true);};

	while ( t && t.match(/^[:\\.#\\[a-zA-Z\\*]/) ) {
		var re = /^\[ *@([a-z0-9*()_-]+) *([~!|*$^=]*) *'?"?([^'"]*)'?"? *\]/i;
		var m = re.exec(t);

		if ( m )
			m = ["", "@", m[2], m[1], m[3]];
		else {
			re = /^(\[) *([^\]]*) *\]/i;
			m = re.exec(t);

			if ( !m ) {
				re = /^(:)([a-z0-9*_-]*)\( *["']?([^ \)'"]*)['"]? *\)/i;
				m = re.exec(t);

				if ( !m ) {
					re = /^([:\.#]*)([a-z0-9*_-]*)/i;
					m = re.exec(t);
				}
			}
		}
		t = t.replace( re, "" );

		if ( m[1] == ":" && m[2] == "not" )
			r = jQuery.filter(m[3],r,false).r;
		else {
			var f = null;

			if ( jQuery.g[m[1]].constructor == String )
				f = jQuery.g[m[1]];
			else if ( jQuery.g[m[1]][m[2]] )
				f = jQuery.g[m[1]][m[2]];

			if ( f ) {
				eval("f = function(a,i){return " + f + "}");
				r = g( r, f );
			}
		}
	}

	return { r: r, t: t };
};

jQuery.parents = function(a){
	var b = [];
	var c = a.parentNode;
	while ( c && c != document ) {
		b[b.length] = c;
		c = c.parentNode;
	}
	return b;
};

jQuery.cleanSpaces = function(t){
	return t.replace(/^\s+|\s+$/g, "");
};

jQuery.ofType = function(a,n,e) {
	var t = jQuery.grep(jQuery.sibling(a),function(b){ return b.nodeName == a.nodeName; });
	if ( e ) n = t.length - n - 1;
	return n != undefined ? t[n] == a : t.length;
};

jQuery.sibling = function(a,n,e) {
	var type = [];
	var tmp = a.parentNode.childNodes;
	for ( var i = 0; i < tmp.length; i++ ) {
		if ( tmp[i].nodeType == 1 )
			type[type.length] = tmp[i];
		if ( tmp[i] == a )
			type.n = type.length - 1;
	}
	if ( e ) n = type.length - n - 1;
	type.cur = ( type[n] == a );
	type.prev = ( type.n > 0 ? type[type.n - 1] : null );
	type.next = ( type.n < type.length - 1 ? type[type.n + 1] : null );
	return type;
};

jQuery.hasWord = function(e,a) {
	if ( e == undefined ) return;
	if ( e.className ) e = e.className;
	return new RegExp("(^|\\s)" + a + "(\\s|$)").test(e);
};

jQuery.merge = function(a,b) {
	var d = [];
	for ( var k = 0; k < b.length; k++ ) d[k] = b[k];

	for ( var i = 0; i < a.length; i++ ) {
		var c = true;
		for ( var j = 0; j < b.length; j++ )
			if ( a[i] == b[j] )
				c = false;
		if ( c ) d[d.length] = a[i];
	}

	return d;
};

jQuery.grep = function(a,f,s) {
	if ( f.constructor == String )
		f = new Function("a","i","return " + f);
	var r = [];
	if ( a )
		for ( var i = 0; i < a.length; i++ )
			if ( (!s && f(a[i],i)) || (s && !f(a[i],i)) )
				r[r.length] = a[i];
	return r;
};

jQuery.map = function(a,f) {
	if ( f.constructor == String )
		f = new Function("a","return " + f);
	
	var r = [];
	for ( var i = 0; i < a.length; i++ ) {
		var t = f(a[i],i);
		if ( t !== null ) {
			if ( t.constructor != Array ) t = [t];
			r = jQuery.merge( t, r );
		}
	}
	return r;
};

jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function(element, type, handler) {
		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( jQuery.browser == "msie" && element.setInterval != undefined )
			element = window;
	
		if (!handler.guid) handler.guid = jQuery.event.guid++;
		if (!element.events) element.events = {};
		var handlers = element.events[type];
		if (!handlers) {
			handlers = element.events[type] = {};
			if (element["on" + type])
				handlers[0] = element["on" + type];
		}
		handlers[handler.guid] = handler;
		element["on" + type] = jQuery.event.handle;
	},
	
	guid: 1,
	
	// Detach an event or set of events from an element
	remove: function(element, type, handler) {
		if (element.events)
			if (type && element.events[type])
				if ( handler )
					delete element.events[type][handler.guid];
				else
					for ( var i in element.events[type] )
						delete element.events[type][i];
			else
				for ( var j in element.events )
					jQuery.event.remove( element, j );
	},
	
	trigger: function(element,type,data) {
		data = data || [ jQuery.event.fix({ type: type }) ];
		if ( element && element["on" + type] )
			element["on" + type].apply( element, data );
	},
	
	handle: function(event) {
		if ( !event && !window.event ) return;
	
		var returnValue = true, handlers = [];
		event = event || jQuery.event.fix(window.event);
	
		for ( var j in this.events[event.type] )
			handlers[handlers.length] = this.events[event.type][j];
	
		for ( var i = 0; i < handlers.length; i++ ) {
			if ( handlers[i].constructor == Function ) {
				this.handleEvent = handlers[i];
				if (this.handleEvent(event) === false) {
					event.preventDefault();
					event.stopPropagation();
					returnValue = false;
				}
			}
		}
		return returnValue;
	},
	
	fix: function(event) {
		event.preventDefault = function() {
			this.returnValue = false;
		};
		
		event.stopPropagation = function() {
			this.cancelBubble = true;
		};
		
		return event;
	}

};
// We're overriding the old toggle function, so
// remember it for later
jQuery.prototype._toggle = jQuery.prototype.toggle;

/**
 * Toggle between two function calls every other click.
 */
jQuery.prototype.toggle = function(a,b) {
	// If two functions are passed in, we're
	// toggling on a click
	return a && b ? this.click(function(e){
		// Figure out which function to execute
		this.last = this.last == a ? b : a;
		
		// Make sure that clicks don't pass through
		e.preventDefault();
		
		// and execute the function
		return this.last.apply( this, [e] ) || false;
	}) :
	
	// Otherwise, execute the old toggle function
	this._toggle();
};

/**
 * Toggle between two function calls on mouse over/out.
 */
jQuery.prototype.hover = function(f,g) {
	
	// A private function for haandling mouse 'hovering'
	function handleHover(e) {
		// Check if mouse(over|out) are still within the same parent element
		var p = e.fromElement || e.toElement || e.relatedTarget;
		while ( p && p != this ) p = p.parentNode;
		
		// If we actually just moused on to a sub-element, ignore it
		if ( p == this ) return false;
		
		// Execute the right function
		return (e.type == "mouseover" ? f : g).apply(this, [e]);
	}
	
	// Bind the function to the two event listeners
	return this.mouseover(handleHover).mouseout(handleHover);
};

/**
 * Bind a function to fire when the DOM is ready.
 */
jQuery.prototype.ready = function(f) {
	// If the DOM is already ready
	if ( jQuery.isReady )
		// Execute the function immediately
		f.apply( document );
		
	// Otherwise, remember the function for later
	else {
		// Add the function to the wait list
		jQuery.readyList.push( f );
	}

	return this;
};

(function(){
	/*
	 * Bind a number of event-handling functions, dynamically
	 */
	var e = ("blur,focus,contextmenu,load,resize,scroll,unload,click,dblclick," +
		"mousedown,mouseup,mouseenter,mouseleave,mousemove,mouseover,mouseout," +
		"change,reset,select,submit,keydown,keypress,keyup").split(",");

	// Go through all the event names, but make sure that
	// it is enclosed properly
	for ( var i = 0; i < e.length; i++ ) {(function(){
			
		var o = e[i];
		
		// Handle event binding
		jQuery.prototype[o] = function(f){ return this.bind(o, f); };
		
		// Handle event unbinding
		jQuery.prototype["un"+o] = function(f){ return this.unbind(o, f); };
		
		// Handle event triggering
		jQuery.prototype["do"+o] = function(){ return this.trigger(o); };
		
		// Finally, handle events that only fire once
		jQuery.prototype["one"+o] = function(f){
			// Attach the event listener
			return this.bind(o, function(e){
				// TODO: Remove the event listener, instead of this hack
				
				// If this function has already been executed, stop
				if ( this[o+f] !== null )
					return true;
				
				// Otherwise, mark as having been executed
				this[o+f]++;
				
				// And execute the bound function
				return f.apply(this, [e]);
			});
		};
			
	})();}
		
	/*
	 * All the code that makes DOM Ready work nicely.
	 */
	 
	jQuery.isReady = false;
	jQuery.readyList = [];
	
	// Handle when the DOM is ready
	jQuery.ready = function() {
		// Make sure that the DOM hasn't already loaded
		if ( !jQuery.isReady ) {
			// Remember that the DOM is ready
			jQuery.isReady = true;
			
			// If there are functions bound, to execute
			if ( jQuery.readyList ) {
				// Execute all of them
				for ( var i = 0; i < jQuery.readyList.length; i++ )
					jQuery.readyList[i].apply( document );
				
				// Reset the list of functions
				jQuery.readyList = null;
			}
		}
	};
	
	// If Mozilla is used
	if ( jQuery.browser == "mozilla" || jQuery.browser == "opera" ) {
		// Use the handy event callback
		jQuery.event.add( document, "DOMContentLoaded", jQuery.ready );
	
	// If IE is used, use the excellent hack by Matthias Miller
	// http://www.outofhanwell.com/blog/index.php?title=the_window_onload_problem_revisited
	} else if ( jQuery.browser == "msie" ) {
	
		// Only works if you document.write() it
		document.write("<scr" + "ipt id=__ie_init defer=true " + 
			"src=javascript:void(0)><\/script>");
	
		// Use the defer script hack
		var script = document.getElementById("__ie_init");
		script.onreadystatechange = function() {
			if ( this.readyState == "complete" )
				jQuery.ready();
		};
	
		// Clear from memory
		script = null;
	
	// If Safari  is used
	} else if ( jQuery.browser == "safari" ) {
		// Continually check to see if the document.readyState is valid
		jQuery.safariTimer = setInterval(function(){
			// loaded and complete are both valid states
			if ( document.readyState == "loaded" || 
				document.readyState == "complete" ) {
	
				// If either one are found, remove the timer
				clearInterval( jQuery.safariTimer );
				jQuery.safariTimer = null;
	
				// and execute any waiting functions
				jQuery.ready();
			}
		}, 10);
	}
	
	// A fallback to window.onload, that will always work
	jQuery.event.add( window, "load", jQuery.ready );
	
})();
// overwrite the old show method
jQuery.prototype._show = jQuery.prototype.show;

/**
 * The effects module overloads the show method to now allow 
 * for a speed to the show operation. What actually happens is 
 * that the height, width, and opacity to the matched elements 
 * are changed dynamically. The only three current speeds are 
 * "slow", "normal", and "fast". For example:
 *   $("p").show("slow");
 * Note: You should not run the show method on things 
 * that are already shown. This can be circumvented by doing this:
 *   $("p:hidden").show("slow");
 */
jQuery.prototype.show = function(speed,callback){
	return speed ? this.animate({
		height: "show", width: "show", opacity: "show"
	}, speed, callback) : this._show();
};

// We're overwriting the old hide method
jQuery.prototype._hide = jQuery.prototype.hide;


/**
 * The hide function behaves very similary to the show function, 
 * but is just the opposite.
 *   $("p:visible").hide("slow");
 */
jQuery.prototype.hide = function(speed,callback){
	return speed ? this.animate({
		height: "hide",
		width: "hide",
		opacity: "hide"
	}, speed, callback) : this._hide();
};

/**
 * This function increases the height and opacity for all matched 
 * elements. This is very similar to 'show', but does not change 
 * the width - creating a neat sliding effect.
 *   $("p:hidden").slideDown("slow");
 */
jQuery.prototype.slideDown = function(speed,callback){
	return this.animate({height: "show"}, speed, callback);
};

/**
 * Just like slideDown, only it hides all matched elements.
 *   $("p:visible").slideUp("slow");
 */
jQuery.prototype.slideUp = function(speed,callback){
	return this.animate({height: "hide"}, speed, callback);
};

/**
 * Adjusts the opacity of all matched elements from a hidden, 
 * to a fully visible, state.
 *   $("p:hidden").fadeIn("slow");
 */
jQuery.prototype.fadeIn = function(speed,callback){
	return this.animate({opacity: "show"}, speed, callback);
};

/**
 * Same as fadeIn, but transitions from a visible, to a hidden state.
 *   $("p:visible").fadeOut("slow");
 */
jQuery.prototype.fadeOut = function(speed,callback){
	return this.animate({opacity: "hide"}, speed, callback);
};

/**
 * ...
 */
jQuery.prototype.fadeTo = function(speed,to,callback){
	return this.animate({opacity: to}, speed, callback);
};

/**
 *
 */
jQuery.prototype.animate = function(prop,speed,callback) {
	return this.queue(function(){
		var i = 0;
		for ( var p in prop ) {
			var e = new jQuery.fx( this, jQuery.speed(speed,callback,i++), p );
			if ( prop[p].constructor == Number )
				e.custom( e.cur(), prop[p] );
			else
				e[ prop[p] ]();
		}
	});
};

jQuery.speed = function(s,o,i) {
	o = o || {};
	
	if ( o.constructor == Function )
		o = { complete: o };
	
	var ss = {"slow":600,"fast":200};
	o.duration = (s && s.constructor == Number ? s : ss[s]) || 400;

	// Queueing
	o.oldComplete = o.complete;
	o.complete = function(){
		jQuery.dequeue(this, "fx");
		if ( o.oldComplete && o.oldComplete.constructor == Function )
			o.oldComplete.apply( this );
	};
	
	if ( i > 0 )
		o.complete = null;

	return o;
};

jQuery.queue = {};

jQuery.dequeue = function(elem,type){
	type = type || "fx";

	if ( elem.queue && elem.queue[type] ) {
		// Remove self
		elem.queue[type].shift();

		// Get next function
		var f = elem.queue[type][0];
	
		if ( f )
			f.apply( elem );
	}
};

jQuery.prototype.queue = function(type,fn){
	if ( !fn ) {
		fn = type;
		type = "fx";
	}

	return this.each(function(){
		if ( !this.queue )
			this.queue = {};

		if ( !this.queue[type] )
			this.queue[type] = [];

		this.queue[type].push( fn );
	
		if ( this.queue[type].length == 1 )
			fn.apply(this);
	});
};

jQuery.setAuto = function(e,p) {
	var a = e.style[p];
	var o = jQuery.css(e,p);
	e.style[p] = "auto";
	var n = jQuery.css(e,p);
	if ( o != n )
		e.style[p] = a;
};

/*
 * I originally wrote fx() as a clone of moo.fx and in the process
 * of making it small in size the code became illegible to sane
 * people. You've been warned.
 */

jQuery.fx = function( elem, options, prop ){

	var z = this;

	// The users options
	z.o = {
		duration: options.duration || 400,
		complete: options.complete
	};

	// The element
	z.el = elem;

	// The styles
	var y = z.el.style;

	// Simple function for setting a style value
	z.a = function(){
		if ( prop == "opacity" ) {
			if (z.now == 1) z.now = 0.9999;
			if (window.ActiveXObject)
				y.filter = "alpha(opacity=" + z.now*100 + ")";
			y.opacity = z.now;
		} else
			y[prop] = z.now+"px";
	};

	// Figure out the maximum number to run to
	z.max = function(){
		return z.el["orig"+prop] || z.cur();
	};

	// Get the current size
	z.cur = function(){
		return parseFloat( jQuery.css(z.el,prop) );
	};

	// Start an animation from one number to another
	z.custom = function(from,to){
		z.startTime = (new Date()).getTime();
		z.now = from;
		z.a();

		z.timer = setInterval(function(){
			z.step(from, to);
		}, 13);
	};

	// Simple 'show' function
	z.show = function(){
		y.display = "block";
		z.o.auto = true;
		z.custom(0,z.max());
	};

	// Simple 'hide' function
	z.hide = function(){
		// Remember where we started, so that we can go back to it later
		z.el["orig"+prop] = this.cur();

		// Begin the animation
		z.custom(z.cur(),0);
	};

	// IE has trouble with opacity if it doesn't have layout
	if ( jQuery.browser == "msie" && !z.el.currentStyle.hasLayout )
		y.zoom = 1;

	// Remember  the overflow of the element
	z.oldOverflow = y.overflow;

	// Make sure that nothing sneaks out
	y.overflow = "hidden";

	// Each step of an animation
	z.step = function(firstNum, lastNum){
		var t = (new Date()).getTime();

		if (t > z.o.duration + z.startTime) {
			// Stop the timer
			clearInterval(z.timer);
			z.timer = null;

			z.now = lastNum;
			z.a();

			// Reset the overflow
			y.overflow = z.oldOverflow;

			// If the element was shown, and not using a custom number,
			// set its height and/or width to auto
			if ( (prop == "height" || prop == "width") && z.o.auto )
				jQuery.setAuto( z.el, prop );

			// If a callback was provided, execute it
			if( z.o.complete.constructor == Function ) {

				// Yes, this is a weird place for this, but it needs to be executed
				// only once per cluster of effects.
				// If the element is, effectively, hidden - hide it
				if ( y.height == "0px" || y.width == "0px" )
					y.display = "none";

				// Execute the complete function
				z.o.complete.apply( z.el );
			}
		} else {
			// Figure out where in the animation we are and set the number
			var p = (t - this.startTime) / z.o.duration;
			z.now = ((-Math.cos(p*Math.PI)/2) + 0.5) * (lastNum-firstNum) + firstNum;

			// Perform the next step of the animation
			z.a();
		}
	};

};
// AJAX Plugin
// Docs Here:
// http://jquery.com/docs/ajax/

/**
 * Load HTML from a remote file and inject it into the DOM
 */
jQuery.prototype.load = function( url, params, callback ) {
	// I overwrote the event plugin's .load
	// this won't happen again, I hope -John
	if ( url && url.constructor == Function )
		return this.bind("load", url);

	// Default to a GET request
	var type = "GET";

	// If the second parameter was provided
	if ( params ) {
		// If it's a function
		if ( params.constructor == Function ) {
			// We assume that it's the callback
			callback = params;
			params = null;
			
		// Otherwise, build a param string
		} else {
			params = jQuery.param( params );
			type = "POST";
		}
	}
	
	var self = this;
	
	// Request the remote document
	jQuery.ajax( type, url, params,function(res){
			
		// Inject the HTML into all the matched elements
		self.html(res.responseText).each(function(){
			// If a callback function was provided
			if ( callback && callback.constructor == Function )
				// Execute it within the context of the element
				callback.apply( self, [res.responseText] );
		});
		
		// Execute all the scripts inside of the newly-injected HTML
		$("script", self).each(function(){
			eval( this.text || this.textContent || this.innerHTML || "");
		});

	});
	
	return this;
};

/**
 * Load a remote page using a GET request
 */
jQuery.get = function( url, callback, type ) {
	// Build and start the HTTP Request
	jQuery.ajax( "GET", url, null, function(r) {
		if ( callback ) callback( jQuery.httpData(r,type) );
	});
};

/**
 * Load a remote page using a POST request.
 */
jQuery.post = function( url, data, callback, type ) {
	// Build and start the HTTP Request
	jQuery.ajax( "POST", url, jQuery.param(data), function(r) {
		if ( callback ) callback( jQuery.httpData(r,type) );
	});
};

// If IE is used, create a wrapper for the XMLHttpRequest object
if ( jQuery.browser == "msie" )
	XMLHttpRequest = function(){
		return new ActiveXObject(
			(navigator.userAgent.toLowerCase().indexOf("msie 5") >= 0) ?
			"Microsoft.XMLHTTP" : "Msxml2.XMLHTTP"
		);
	};

// Attach a bunch of functions for handling common AJAX events
(function(){
	var e = "ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess".split(',');
	
	for ( var i = 0; i < e.length; i++ ){ (function(){
		var o = e[i];
		jQuery.fn[o] = function(f){return this.bind(o, f);};
	})();}
})();

/**
 * A common wrapper for making XMLHttpRequests
 */
jQuery.ajax = function( type, url, data, ret ) {
	// If only a single argument was passed in,
	// assume that it is a object of key/value pairs
	if ( !url ) {
		ret = type.complete;
		var success = type.success;
		var error = type.error;
		data = type.data;
		url = type.url;
		type = type.type;
	}
	
	// Watch for a new set of requests
	if ( ! jQuery.ajax.active++ )
		jQuery.event.trigger( "ajaxStart" );

	// Create the request object
	var xml = new XMLHttpRequest();

	// Open the socket
	xml.open(type || "GET", url, true);
	
	// Set the correct header, if data is being sent
	if ( data )
		xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

	// Set header so calling script knows that it's an XMLHttpRequest
	xml.setRequestHeader("X-Requested-With", "XMLHttpRequest");

	// Make sure the browser sends the right content length
	if ( xml.overrideMimeType )
		xml.setRequestHeader("Connection", "close");

	// Wait for a response to come back
	xml.onreadystatechange = function(){
		// The transfer is complete and the data is available
		if ( xml.readyState == 4 ) {
			// Make sure that the request was successful
			if ( jQuery.httpSuccess( xml ) ) {
			
				// If a local callback was specified, fire it
				if ( success ) success( xml );
				
				// Fire the global callback
				jQuery.event.trigger( "ajaxSuccess" );
			
			// Otherwise, the request was not successful
			} else {
				// If a local callback was specified, fire it
				if ( error ) error( xml );
				
				// Fire the global callback
				jQuery.event.trigger( "ajaxError" );
			}
			
			// The request was completed
			jQuery.event.trigger( "ajaxComplete" );
			
			// Handle the global AJAX counter
			if ( ! --jQuery.ajax.active )
				jQuery.event.trigger( "ajaxStop" );

			// Process result
			if ( ret ) ret(xml);
		}
	};

	// Send the data
	xml.send(data);
};

// Counter for holding the number of active queries
jQuery.ajax.active = 0;

// Determines if an XMLHttpRequest was successful or not
jQuery.httpSuccess = function(r) {
	return ( r.status && ( r.status >= 200 && r.status < 300 ) || 
		r.status == 304 ) || !r.status && location.protocol == "file:";
};

// Get the data out of an XMLHttpRequest
jQuery.httpData = function(r,type) {
	// Check the headers, or watch for a force override
	return r.getResponseHeader("content-type").indexOf("xml") > 0 || 
		type == "xml" ? r.responseXML : r.responseText;
};

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function(a) {
	var s = [];
	
	// If an array was passed in, assume that it is an array
	// of form elements
	if ( a.constructor == Array )
		// Serialize the form elements
		for ( var i = 0; i < a.length; i++ )
			s.push( a[i].name + "=" + encodeURIComponent( a[i].value ) );
		
	// Otherwise, assume that it's an object of key/value pairs
	else
		// Serialize the key/values
		for ( var j in a )
			s.push( j + "=" + encodeURIComponent( a[j] ) );
	
	// Return the resulting serialization
	return s.join("&");
};
