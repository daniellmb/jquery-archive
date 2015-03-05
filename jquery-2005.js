/* 
	$(document).bind("ready",init);

	addEvent( document, "ready", function(){
		// ....
	});

	var rows = $("#table tr:gt(0)");
	$("#table th").bind("click",function(){
		if ( removeClass( this, "asc" ) ) {
			addClass( this, "desc" );
			rows.reverse();
		} else {
			removeClass( this, "desc" );
			addClass( this, "asc" );
			rows.sort( ofType(this).n );
		}
	});
*/

function $(a,c) {
  var cur = Select(a,c);
	
	/*
		window: "load",
		document: "ready",
		form: "submit",
		input: "change"
	*/

	var e = ["blur","focus","contextmenu","load","resize","scroll","unload",
	"click","dblclick","mousedown","mouseup","mouseenter","mouseleave",
	"mousemove","mouseover","mouseout","change","reset","select","submit",
	"keydown","keypress","keyup","abort","error","ready"];
	
	for ( var i = 0; i < e.length; i++ ) {
		this["on" + e[i].replace(/^(.)/,e[i].charAt(0).toUpperCase())] =
			function(f){ return this.bind(e[i], f); };
	}
	
  function size() {
		return cur.length;
	}
	function get(i) {
		if ( i == null )
			return cur;
		else
			return cur[i];
	}
	function addClass(c) {
		for ( var i = 0; i < cur.length; i++ )
			addClass( cur[i], c );
		return this;
	},
	function removeClass(c) {
		for ( var i = 0; i < cur.length; i++ )
			removeClass( cur[i], c );
		return this;
	}
	function html(h) {
		return this.set({ innerHTML: h });
	}
	function set(s) {
		for ( var i = 0; i < cur.length; i++ )
			for ( var j in s )
				cur[i][j] = s[j];
		return this;
	}
	function style() {
		if ( arguments.length == 1 )
			for ( var i = 0; i < cur.length; i++ )
				for ( var j in arguments[0] )
					cur[i].style[j] = arguments[0][j];
		else
			for ( var i = 0; i < cur.length; i++ )
				cur[i].style[ arguments[0] ] = arguments[1];
		return this;
	}
	function show() {
		return this.style( "display", "block" );
	}
	function hide() {
		return this.style( "display", "none" );
	}
	function bind(t,f) {
		if ( typeof f == 'string' )
			f = new Function( f );
		for ( var i = 0; i < cur.length; i++ )
			addEvent( cur[i], t, f );
		return this;
	}
	function unbind(t,f) {
		if ( typeof f == 'string' )
			f = new Function( f );
		for ( var i = 0; i < cur.length; i++ )
			removeEvent( cur[i], t, f );
		return this;
	}
	function exec(f) {
		for ( var i = 0; i < cur.length; i++ ) {
			cur[i].$$tmpFunc = f;
			cur[i].$$tmpFunc();
			delete cur[i].$$tmpFunc;
		}
		return this;
	}
	function sort(f) {
		cur = cur.sort(function(a,b){
			if ( typeof f == 'object' )
				var ret = f(a,b);
			else
				var ret = genericSort(a,b,f);

			if ( a < b )
				b.parentNode.insertBefore( a, b );
			else if ( a > b )
				a.parentNode.insertBefore( b, a );
			return ret;
		});
		return this;
	}
	function reverse() {
		cur[0].parentNode.appendChild( cur[0] );
		for ( var i = 1; i < cur.length; i++ )
			cur[i-1].parentNode.insertBefore( cur[i], cur[i-1] );
		cur = cur.reverse();
		return this;
	}
	
  return this;
}

function addEvent( obj, type, fn ) {
	if ( type == "ready" ) {
		obj.$$timer = setInterval( function(){
			if ( typeof obj.getElementsByTagName != 'undefined' &&
				   typeof obj.getElementById != 'undefined' ) {
				var old = obj[type];
				obj[type] = fn;
				obj[type]();
				obj[type] = old;
				clearInterval( obj.$$timer );
			} 
		}, 13 );
	} else if ( obj.attachEvent ) {
		obj["do"+type] = function() {
			var old = obj[type];
			obj[type] = fn;
			obj[type]();
			obj[type] = old;
		};
		obj.attachEvent( "on"+type, obj["do"+type] );
	} else if ( obj.addEventListener )
		obj.addEventListener( type, fn, false );
	else
		obj["on"+type] = fn;
}

function removeEvent( obj, type, fn ) {
	if ( type == "ready" ) {
		clearInterval( obj.$$timer );
	} else if ( obj.attachEvent )
		obj.removeEvent( "on"+type, obj["do"+type] );
	else if ( obj.addEventListener )
		obj.removeEventListener( type, fn );
	else
		delete obj["on"+type];
}

function genericSort(a,b,c) {
	if ( typeof a == "string" || typeof b == "string" ) {
	} else if ( c != null ) {
		a = sibling(a.firstChild)[c].innerText;
		b = sibling(b.firstChild)[c].innerText;
	} else {
		a = a.innerText;
		b = b.innerText;
	}
	
	// Case insensitive
	a = a.toLowerCase();
	b = b.toLowerCase();
	
	// Figure out if it's an American-style date
	var re = new RegExp( "^(\d{2}).(\d{2}).(\d{2,4})$" );
	var ma = re.exec(a);
	var mb = re.exec(b);
	
	if ( ma.length && mb.length ) {
		a = ma.reverse().join('');
		b = mb.reverse().join('');
	}
	
	// If it contains a number, sort on that only
	if ( a.match(/\d/) ) {
		var re = new RegExp("[^0-9.-]","ig");
		a = parseFloat( a.replace( re, "" ) );
		b = parseFloat( b.replace( re, "" ) );
	}
	
	return ( a < b ? -1 : ( a > b ? 1 : 0 ) );
}
