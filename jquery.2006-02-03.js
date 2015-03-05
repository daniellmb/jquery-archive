/*
 * JQuery (http://jquery.com/)
 * By John Resig (http://ejohn.org/)
 * Under an Attribution, Share Alike License
 */

function $(a,c) {
	if ( a == null ) return;
	// Since we're using Prototype's $ function,
	// be nice and have backwards compatability
	if ( typeof Prototype != "undefined" && a.constructor == String ) {
		var re = new RegExp( "[^a-zA-Z0-9_-]" );
		if ( !re.test(a) ) {
			var c = ((c&&c.documentElement) || document);
			if ( c.getElementsByTagName(a).length == 0 ) {
				var obj = c.getElementById(a);
				if ( obj != null ) return obj;
			}
		}
	}

	// Load Dynamic Function List
	var self = {
		cur: $.Select(a,c),
		
		// The only two getters
		size: function() {
			return this.get().length;
		},
		get: function(i) {
			if ( i == null )
				return this.$$unclean ? $.sibling(this.$$unclean[0]) : this.cur;
			else
				return (this.get())[i];
		},

		"_get": function(i) {
			if ( i == null )
				return this.cur;
			else
				return this.cur[i];
		},
		
		each: function(f) {
			for ( var i = 0; this.cur && i < this._get().length; i++ ) {
				if ( this._get(i) ) {
					this._get(i).$$tmpFunc = f;
					this._get(i).$$tmpFunc(i);
					this._get(i).$$tmpFunc = null;
				}
			}
			return this;
		},
		set: function(a,b) {
			return this.each(function(){
				if ( b == null )
					for ( var j in a )
						this[j] = a[j];
				else {
					if ( b.constructor != String ) {
						for ( var i in b ) {	
							var c = $.Select(i,this);
							for ( var j in c )
								c[j][a] = b[i];
						}
					} else
					  this[a] = b;
				}
			});
		},
		html: function(h) {
			return this.set( "innerHTML", h );
		},
		// Deprecated
		style: function(a,b){ return this.css(a,b); },
		
		css: function(a,b) {
			return this.each(function(){
				if ( !b )
					for ( var j in a )
						this.style[j] = a[j];
				else
					this.style[a] = b;
			});
		},
		toggle: function() {
			return this.each(function(){
				var d = $.getCSS(this,"display");
				if ( d == "none" || d == '' )
					$(this).show();
				else
					$(this).hide();
			});
		},
		show: function(a) {
			return this.each(function(){
				this.style.display = this.$$oldblock ? this.$$oldblock : 'block';
			});
		},
		hide: function(a) {
			return this.each(function(){
				this.$$oldblock = $.getCSS(this,"display");
				this.style.display = 'none';
			});
		},
		addClass: function(c) {
			return this.each(function(){
				if ($.hasWord(this,c)) return;
				this.className += ( this.className.length > 0 ? " " : "" ) + c;
			});
		},
		removeClass: function(c) {
			return this.each(function(){
				if (!$.hasWord(this,c)) return;
				var ret = "";
				var s = this.className.split( " " );
				for ( var i = 0; i < s.length; i++ )
					if ( s[i] != c )
						ret += ( ret.length > 0 ? " " : "" ) + s[i];
				this.className = ret;
			});
		},
		remove: function() {
			this.each(function(){this.parentNode.removeChild( this );});
			this.cur = [];
			return this;
		},
		
		wrap: function() {
			var a = $.clean(arguments);
			return this.each(function(){
				var b = a[0].cloneNode(true);
				this.parentNode.insertBefore( b, this );
				while ( b.firstChild ) b = b.firstChild;
				b.appendChild( this );
			});
		},
		
		append: function() {
			var a = $.clean(arguments);
			return this.each(function(){
				for ( var i in a )
					if ( a[i].cloneNode != null )
					this.appendChild( a[i].cloneNode(true) );
			});
		},

		appendTo: function() {
			var self = this;
			var a = arguments;
			return this.each(function(){
				for ( var i = 0; i < a.length; i++ ) {
					if ( self.$$unclean )
					  $(a[i]).append( self.get() );
					else
					  $(a[i]).append( this );
				}
			});
		},
		
		prepend: function() {
			var a = $.clean(arguments);
			return this.each(function(){
				for ( var i = a.length - 1; i >= 0; i-- )
					this.insertBefore( a[i].cloneNode(true), this.firstChild );
			});
		},
		
		before: function() {
			var a = $.clean(arguments);
			return this.each(function(){
				for ( var i in a )
					this.parentNode.insertBefore( a[i].cloneNode(true), this );
			});
		},
		
		after: function() {
			var a = $.clean(arguments);
			return this.each(function(){
				for ( var i = a.length - 1; i >= 0; i-- )
					this.parentNode.insertBefore( a[i].cloneNode(true), this.nextSibling );
			});
		},
		
		bind: function(t,f) {
			return this.each(function(){addEvent(this,t,f);});
		},
		unbind: function(t,f) {
			return this.each(function(){removeEvent(this,t,f);});
		},
		
		find: function(t) {
			var old = [], ret = [];
			this.each(function(){
				old.push( this );
				ret = $.merge( ret, $.Select(t,this) );
			});
			this.old = old;
			this.cur = ret;
			return this;
		},
		end: function() {
			this.cur = this.old;
			return this;
		},
		filter: function(t) {
			this.cur = $.filter(t,this.cur).r;
			return this;
		},
		not: function(t) {
			if ( t.constructor == String )
				this.cur = $.filter(t,this.cur,false).r;
			else
				this.cur = $.grep(this.cur,function(a){return a != t;});
			return this;
		},
		add: function(t) {
			if ( t.constructor == String )
				this.cur = $.merge(this.cur,$.Select(t));
			else if ( t.constructor == Array )
				this.cur = $.merge(this.cur,t);
			else
				this.cur = $.merge(this.cur,new Array(t));
			return this;
		}
	};
	for ( var i in $.fn ) {
		if ( self[i] != null )
			self["_"+i] = self[i];
		self[i] = $.fn[i];
	}
	
	if ( typeof Prototype != "undefined" && a.constructor != String ) {
		for ( var i in self ) {(function(j){
			try {
				if ( j.indexOf('on') != 0 || j == "onready" ) {
					a[j] = function() {
						return self[j].apply(self,arguments);
					};
				}
			} catch (e){}
		})(i);}
		return a;
	}
	
	return self;
}

function $C(a) {
  if ( a.indexOf('<') >= 0 ) {
    if ( a.indexOf('<tr') >= 0 ) {
      var r = $C("table").html("<tbody>"+a+"</tbody>");
      r.$$unclean = r.get(0).childNodes[0].childNodes;
    } else {
      var r = $C("div").html(a);
      r.$$unclean = r.get(0).childNodes;
    }
    return r;
  } else {
    return $(document.createElement(a),document);
  }
}

$.getCSS = function(e,p) {
  if (e.style[p])
    return e.style[p];
  else if (e.currentStyle)
    return e.currentStyle[p];
  else if (document.defaultView && document.defaultView.getComputedStyle) {
    p = p.replace(/([A-Z])/g,"-$1");
    p = p.toLowerCase();
    return document.defaultView.getComputedStyle(e,"").getPropertyValue(p);
  } else
    return null;
};

$.clean = function(a) {
	var r = new Array();
	for ( var i = 0; i < a.length; i++ ) {
		if ( a[i].constructor == String ) {
			//a[i] = a[i].replace( /#([a-zA-Z0-9_-]+)/g, " id='$1' " );
			//a[i] = a[i].replace( /\.([a-zA-Z0-9_-]+)/g, " class='$1' " );
			var div = document.createElement("div");
			div.innerHTML = a[i];
			for ( var j = 0; j < div.childNodes.length; j++ )
				r.push( div.childNodes[j] );
		} else if ( a[i].length ) {
			for ( var j = 0; j < a[i].length; j++ )
				r.push( a[i][j] );
		} else {
			r.push( a[i] ); //.cloneNode(true) );
		}
	}
	return r;
};

$.g = {
	'': "m[2] == '*' || a.nodeName.toUpperCase() == m[2].toUpperCase()",
	'#': "a.id == m[2]",
	':': {
		lt: "i < m[3]-0",
		gt: "i > m[3]-0",
		nth: "m[3] - 0 == i",
		eq: "m[3] - 0 == i",
		first: "i == 0",
		last: "i == r.length - 1",
		even: "i % 2 == 0",
		odd: "i % 2 == 1",
		"first-child": "$.sibling(a,0).cur",
		"nth-child": "(m[3] == 'even'?$.sibling(a,m[3]).n % 2 == 0 :(m[3] == 'odd'?$.sibling(a,m[3]).n % 2 == 1:$.sibling(a,m[3]).cur))",
		"last-child": "$.sibling(a,0,true).cur",
		"nth-last-child": "$.sibling(a,m[3],true).cur",
		"first-of-type": "$.ofType(a,0)",
		"nth-of-type": "$.ofType(a,m[3])",
		"last-of-type": "$.ofType(a,0,true)",
		"nth-last-of-type": "$.ofType(a,m[3],true)",
		"only-of-type": "$.ofType(a) == 1",
		"only-child": "$.sibling(a).length == 1",
		parent: "a.childNodes.length > 0",
		empty: "a.childNodes.length == 0",
		lang: "a.lang == m[3]",
		root: "a == ( a.ownerDocument ? a.ownerDocument : document ).documentElement",
		contains: "(a.innerText || a.innerHTML).indexOf(m[3]) != -1",
		visible: "(!a.type || a.type != 'hidden') && ($.getCSS(a,'display') != 'none' && $.getCSS(a,'visibility') != 'hidden')",
		hidden: "(a.type && a.type == 'hidden') || $.getCSS(a,'display') == 'none' || $.getCSS(a,'visibility') == 'hidden'",
		enabled: "a.disabled == false",
		disabled: "a.disabled",
		checked: "a.checked",
		indeterminate: "a.checked != null && !a.checked"
	},
	".": "$.hasWord(a.className,m[2]) || $.hasWord(a.getAttribute('class'),m[2])",
	"@": {
		"=": "a.getAttribute(m[3]) == m[4]",
		"!=": "a.getAttribute(m[3]) != m[4]",
		"~=": "$.hasWord(a.getAttribute(m[3]),m[4])",
		"|=": "a.getAttribute(m[3])?a.getAttribute(m[3]).indexOf(m[4])==0:false",
		"^=": "a.getAttribute(m[3])?a.getAttribute(m[3]).indexOf(m[4])==0:false",
		"$=": "a.getAttribute(m[3]) != null ? a.getAttribute(m[3]).substr( a.getAttribute(m[3]).length - m[4].length, m[4].length ) == m[4] : false",
		"*=": "a.getAttribute(m[3])?a.getAttribute(m[3]).indexOf(m[4]) != -1 : false",
		"": "m[3] == '*' ? a.attributes.length > 0 : a.getAttribute(m[3])"
	},
	"[": "$.Select(m[2],a).length > 0"
};

// Frequently-used Accessors
window.cssQuery = $.Select;
document.getElementsByClass = function(a){return $.Select("."+a)};
document.getElementsBySelector = $.Select;

$.fn = {};

$.Select = function( t, context ) {
  if ( context == null )
    var context = document;
	
	if ( t.constructor != String )
		return new Array( t );
	
	if ( t.indexOf("//") == 0 ) {
		context = context.documentElement;
		t = t.substr(2,t.length);
	} else if ( t.indexOf("/") == 0 ) {
		context = context.documentElement;
		t = t.substr(1,t.length);
		// Assume the root element is right :(
		if ( t.indexOf('/') )
			t = t.substr(t.indexOf('/'),t.length);
	}
	
	// Make Xpath Axes Sane
	var re = new RegExp( "/?descendant::", "i" );
	t = t.replace( re, " " );
	var re = new RegExp( "/?child::", "i" );
	t = t.replace( re, "/" );
	// If only...
	//var re = new RegExp( "/?following-sibling::", "i" );
	//t = t.replace( re, " + " );
	var re = new RegExp( "/?preceding-sibling::", "i" );
	t = t.replace( re, " ~ " );
	var re = new RegExp( "/?self::", "i" );
	t = t.replace( re, "" );
	var re = new RegExp( "/?parent::", "i" );
	t = t.replace( re, " .. " );
	
	// following
	// preceding
	// ancestor
	// ancestor-or-self
	// descendant-or-self
	
	var ret = new Array( context );
  var done = new Array();
	var last = null;
  
  while ( t.length > 0 && last != t ) {
    var r = new Array();
		last = t;
    
    t = $.cleanSpaces(t);
    
    var re = new RegExp( "^//", "i" );
    t = t.replace( re, "" );

    if ( t.indexOf('..') == 0 || t.indexOf('/..') == 0 ) {
			if ( t.indexOf('/') == 0 )
				t = t.substr(1,t.length);
      r = $.map( ret, function(a){ return a.parentNode; } );
			t = t.substr(2,t.length);
			t = $.cleanSpaces(t);
    } else if ( t.indexOf('>') == 0 || t.indexOf('/') == 0 ) {
      r = $.map( ret, function(a){ return ( a.childNodes.length > 0 ? $.sibling( a.firstChild ) : null ); } );
			t = t.substr(1,t.length);
			t = $.cleanSpaces(t);
    } else if ( t.indexOf('+') == 0 ) {
      r = $.map( ret, function(a){ return $.sibling(a).next; } );
			t = t.substr(1,t.length);
			t = $.cleanSpaces(t);
    } else if ( t.indexOf('~') == 0 ) {
      r = $.map( ret, function(a){
        var r = new Array();
        var s = $.sibling(a);
        if ( s.n > 0 )
          for ( var i = s.n; i < s.length; i++ )
            r.push( s[i] );
        return r;
      } );
			t = t.substr(1,t.length);
			t = $.cleanSpaces(t);
    } else if ( t.indexOf(',') == 0 || t.indexOf('|') == 0 ) {
      if ( ret[0] == context ) ret.shift();
      done = $.merge( done, ret );
      r = ret = new Array( context );
			t = " " + t.substr(1,t.length);
    } else {
      var re = new RegExp( "^([#.]?)([a-z0-9\\*-]*)", "i" );
      var m = re.exec(t);
			if ( m[1] == "#" ) {
				var oid = document.getElementById(m[2]);
				if ( oid != null ) r = [ oid ];
				else r = [];
			}
			if ( m[2] == "" || m[1] == "." ) m[2] = "*";
			else t = t.replace( re, "" );
			for ( var i = 0; i < ret.length; i++ ) {
				var o = ret[i];
				if ( o ) {
					switch( m[2] ) {
						case '*':
							r = $.merge( $.getAll(o), r );
						break;
						case 'text': case 'radio': case 'checkbox': case 'hidden':
						case 'button': case 'submit': case 'image': case 'password':
						case 'reset': case 'image': case 'file':
							r = $.merge( $.grep( o.getElementsByTagName( "input" ), 
										function(a){ return a.type == m[2] }), r );
						break;
						case 'input':
							r = $.merge( o.getElementsByTagName( "input" ), r );
							r = $.merge( o.getElementsByTagName( "select" ), r );
							r = $.merge( o.getElementsByTagName( "textarea" ), r );
						break;
						default:
							r = $.merge( o.getElementsByTagName( m[2] ), r );
						break;
					}
				}
			}
    }
		
		var val = $.filter(t,r);
		r = val.r;
		t = val.t;

    t = $.cleanSpaces(t);
    ret = r;
  }

  if ( ret && ret[0] == context ) ret.shift();
  done = $.merge( done, ret );
  return done;
};

$.filter = function(t,r,not) {
	var g = $.grep;
	if ( not == false ) var g = function(a,f) {return $.grep(a,f,true);};
	
	while ( t.length > 0 && t.match(/^[:\\.#\\[a-zA-Z\\*]/) ) {
		var re = new RegExp( "^\\[ *@([a-z0-9\\(\\)-]+) *([~!\\|\\*$^=]*) *'?\"?([^'\"]*)'?\"? *\\]", "i" );
		var m = re.exec(t);
		
		if ( m != null ) {
			m = new Array( '', '@', m[2], m[1], m[3] );
		} else {
			var re = new RegExp( "^(\\[) *([^\\]]*) *\\]", "i" );
			var m = re.exec(t);
			
			if ( m == null ) {
				var re = new RegExp( "^(:)([a-z0-9\\*-]*)\\( *[\"']?([^ \\)'\"]*)['\"]? *\\)", "i" );
				var m = re.exec(t);
				
				if ( m == null ) {
					var re = new RegExp( "^([:\\.#]*)([a-z0-9\\*-]*)", "i" );
					var m = re.exec(t);
				}
			}
		}
		t = t.replace( re, "" );
		
		if ( m[1] == ":" && m[2] == "not" )
			r = $.filter(m[3],r,false).r;
		else {
			if ( $.g[m[1]].constructor == String )
				var f = $.g[m[1]];
			else if ( $.g[m[1]][m[2]] )
				var f = $.g[m[1]][m[2]];
						
			if ( f != null ) {
				eval("f = function(a,i){return " + f + "}");
				r = g( r, f );
			}
		}
	}
	return { r: r, t: t };
};

$.cleanSpaces = function(t) {
	var re = new RegExp("^\\s+");
	t = t.replace( re, "" );
	var re = new RegExp("\\s+$");
	t = t.replace( re, "" );
	return  t;
};

$.ofType = function(a,n,e) {
	var t = $.grep($.sibling(a),function(b){return b.nodeName == a.nodeName});
	if ( e ) n = t.length - n - 1;
	return n != null ? t[n] == a : t.length;
};

$.sibling = function(a,n,e) {
  var type = new Array();
  var tmp = a.parentNode.childNodes;
  for ( var i = 0; i < tmp.length; i++ ) {
    if ( tmp[i].nodeType == 1 )
      type.push( tmp[i] );
    if ( tmp[i] == a )
      type.n = type.length - 1;
  }
  if ( e ) n = type.length - n - 1;
  type.cur = ( type[n] == a );
  type.prev = ( type.n > 0 ? type[type.n - 1] : null );
  type.next = ( type.n < type.length - 1 ? type[type.n + 1] : null );
  return type;
};

$.hasWord = function(e,a) {
  if ( e == null ) return false;
	if ( e.className != null ) e = e.className;
  var s = e.split( " " );
  for ( var i = 0; i < s.length; i++ )
    if ( s[i] == a ) return true;
  return false;
};

$.getAll = function(o,r) {
	if(!r) var r = new Array();
	var s = o.childNodes;
	for ( var i = 0; i < s.length; i++ ) {
		if ( s[i].nodeType == 1 ) {
			r.push(s[i]);
			$.getAll( s[i], r );
		}
	}
	return r;
};

$.merge = function(a,b) {
  for ( var i = 0; i < a.length; i++ ) {
    var c = true;
    for ( var j = 0; j < b.length; j++ )
      if ( a[i] == b[j] )
        c = false;
		if ( c )
			b.push( a[i] );
  }
	return b;
};

$.grep = function(a,f,s) {
  var r = new Array();
	if ( a != null )
		for ( var i = 0; i < a.length; i++ )
			if ( (!s && f(a[i],i)) || (s && !f(a[i],i)) )
				r.push( a[i] );
  return r;
};

$.map = function(a,f) {
  var r = new Array();
  for ( var i = 0; i < a.length; i++ ) {
    var t = f(a[i],i);
    if ( t != null ) {
      if ( t.constructor != Array ) t = new Array(t);
			r = $.merge( t, r );
		}
  }
  return r;
};

// addEvent/removeEvent
// Original by Dean Edwards
// Modified by John Resig

function addEvent(element, type, handler) {
	if (!handler.$$guid) handler.$$guid = addEvent.guid++;
	if (!element.events) element.events = {};
	var handlers = element.events[type];
	if (!handlers) {
		handlers = element.events[type] = {};
		if (element["on" + type])
			handlers[0] = element["on" + type];
	}
	handlers[handler.$$guid] = handler;
	element["on" + type] = handleEvent;
};
addEvent.guid = 1;

function removeEvent(element, type, handler) {
	if (element.events) {
		if (type && element.events[type]) {
			if ( handler ) {
				delete element.events[type][handler.$$guid];
			} else {
				for ( var i in element.events[type] )
					removeEvent( element, type, element.events[type][i] );
			}
		} else {
			for ( var i in element.events )
				removeEvent( element, i );
		}
	}
};

function handleEvent(event) {
	var returnValue = true;
	event = event || fixEvent(window.event);
	var handlers = [];
	for ( var i in this.events[event.type] )
		handlers.push( this.events[event.type][i] );
	
	//var handlers = this.events[event.type];
	for (var i in handlers) {
		try {
			if ( handlers[i].constructor == Function ) {
				this.$$handleEvent = handlers[i];
				if (this.$$handleEvent(event) === false) {
					event.preventDefault();
					event.stopPropagation();
					returnValue = false;
				}
			}
		} catch(e){}
	}
	return returnValue;
};

function fixEvent(event) {
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
};
fixEvent.preventDefault = function() {
	this.returnValue = false;
};
fixEvent.stopPropagation = function() {
	this.cancelBubble = true;
};

// Move to module

$.fn.text = function(e) {
	if ( !e ) var e = this.cur;
	var t = "";
	for ( var j = 0; j < e.length; j++ ) {
		for ( var i = 0; i < e[j].childNodes.length; i++ )
		 	t += e[j].childNodes[i].nodeType != 1 ?
				e[j].childNodes[i].nodeValue :
				$.fn.text(e[j].childNodes[i].childNodes);
	}
	return t;
};

setTimeout(function(){
  if ( typeof Prototype != "undefined" && $.g == null && $.clean == null )
    throw "Error: You are overwriting jQuery, please include jQuery last.";
}, 1000);
