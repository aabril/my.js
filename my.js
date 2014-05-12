/*
  ==============================================
  Created by Massimo Di Pierro on March 10, 2014
  License BSDv3
  ==============================================

  [1,2,3].indexOf(2)                   // -> 1
  [1,2,3].remove(2)                    // -> [1,3]
  "abc".capitalize()                   // -> "Abc"
  "a test".title()                     // -> "A Test"       
  " abc ".trim()                       // -> "abc"      
  " abc ".ltrim()                      // -> "abc "      
  " abc ".rtrim()                      // -> " abc"      
  "{0}{1}{2}".format(['a','b','c'])    // -> "abc"
  "abc".escapeRegExp()                 // -> "abc"
  "abc".startsWith('a')                // -> true
  "abc".endsWith('c')                  // -> true
  "-".times(4)                         // -> "----" 
         
  my.range(1,5)                        // -> [1,2,3,4]                     
  my.len([1,2,3])                      // -> 3
  my.len({a:'b',c:'d'})                // -> 2
  my.keys({a:'b',c:'d'})               // -> ['a', 'b']
  my.values({a:'b',c:'d'})             // -> ['c', 'd']
  my.items({a:'b',c:'d'})              // -> [['a','b'], ['c','d']]
  my.clone({a:'b',c:'d'})              // -> {a:'b',c:'d'}

  my.debounce(function(){..,},250)        
  my.throttle(function(){...},250) 

  my.tag('div')('hello',my.tag('span',{class:'x',id:'y'})('world')).toString()

  my.run(function(){...}).then(...).then(...).then(...) 
  my.sleep(1000).then(function(){alert('Oh My!');});

  var obj = my.model({a:1, b:function(){return this.a+1;}});
  obj.onChangeCall(function(name,oldval,newval){alert(name+'='+newval);});
  // <div id="mytemplate">
  //   <input my-bind="a" value="{{a}}"/> + 1 = <span>{{b}}</span>
  // </div>
  obj.linkToTemplate('#mytemplate');  
*/
Array.prototype.indexOf = function(v){
    for(var i=0;i<this.length;i++) if(this[i]===v) return i; return -1;
};
Array.prototype.remove = function(v) {
    var k=this.indexOf(v); if(k>=0) return this.splice(k,1); else return this;
};
String.prototype.capitalize = function() {
    if(this.length==0) return "";
    return this.charAt(0).toUpperCase()+this.splice(1);
};
String.prototype.title = function() {
    return this.split(' ').map(function(t){return r.capitalize();}).join(' ');
};
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/gm,'');
};
String.prototype.ltrim = function() {
    return this.replace(/^\s+/gm,'');
};
String.prototype.rtrim = function() {
    return this.replace(/\s+$/gm,'');
};
String.prototype.format = function(args) {
    return this.replace(/{(\d+)}/g, function(match, number) { 
	    return (args[number]!=undefined)?args[number]:match;
	});
};
String.prototype.escapeRegExp = function() {
    return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};
String.prototype.startsWith = function(s) {
    return this.substring(0,s.length)==s;
};
String.prototype.endsWith = function(s) {
    return this.substring(this.length-s.length)==s;
};
String.prototype.times = function(n) {
    var s; for(k=0;k<n;k++) s=s+this; return s;
};
/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * MIT license
 */
if(!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", {
	        enumerable: false,
		configurable: true,
		writable: false,
		value: function(prop, handler) {
		var oldval = this[prop], newval = oldval;
		var getter = function () { return newval; };
		var setter = function (val) {
		    oldval = newval;
		    return newval = handler.call(this, prop, oldval, val);
		};
		if (delete this[prop]) { // can't watch constants
		    Object.defineProperty(this, prop, {
			    get: getter,
			    set: setter,
			    enumerable: true,
			    configurable: true
				});
		}
	    }
	});
} 
// object.unwatch
if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, "unwatch", {
	    enumerable: false,
	    configurable: true,
	    writable: false,
	    value: function (prop) {
		var val = this[prop];
		delete this[prop]; // remove accessors
		this[prop] = val;
	    }
	});
}

my = (function(){
	var my = {};
	my.range = function(a, b, step) {
	    if(b==undefined) {b=a; a=0;}
	    var A= [];
	    for(var k=a; k<b; k+=(step||1)) A.push(k);
	    return A;
	};
	my.sum = function(obj,zero) {
	    var s = 0; for(var k=0; k<obj.length; k++) s+=obj[k]; return s;
	};
	my.keys = function(obj,sorted) {
	    var A=[];
	    for(var key in obj) A.push(key);
	    if(sorted) A.sort();
	    return A;
	};
	my.values = function(obj) {
	    return keys(obj).map(function(key){return obj[key];});
	};
	my.items = function(obj) {
	    return keys(obj).map(function(key){return [key,obj[key]];});
	};
	my.len = function(obj) {
	    if(obj instanceof Array) return obj.length;
	    else return keys(obj).length;
	};
	my.clone = function(obj) {
	    return JSON.parse(JSON.stringify(obj)); 
	};
	my.debounce = function(fn, delay) {
	    delay || (delay = 250);
	    var timer = null;
	    return function () {
		var context = this, args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function () { 
			fn.apply(context, args); }, delay);
	    };
	};
	my.throttle = function(fn, threshhold, scope) {
	    threshhold || (threshhold = 250);
	    var last, deferTimer;
	    return function () {
		var context = scope || this;
		var now = +new Date,
		    args = arguments;
		if (last && now < last + threshhold) {
		    clearTimeout(deferTimer);
		    deferTimer = setTimeout(function () {
			    last = now; fn.apply(context, args);
			}, threshhold);
		} else {
		    last = now;
		    fn.apply(context, args);
		}
	    };
	};
	my.tag = function(name,attributes) {
	    name = name || 'div';
	    attributes = attributes || {};
	    var _tag = function() { 
		var callee = arguments.callee;
		var components = [];
		for(var k in arguments) components[k] = arguments[k];
		if(!callee.Tag)
		    callee.Tag = function(name,components,attributes) {
			this.name = name;
			this.components = components;
			this.attrtibutes = attributes;;
			this.toString = function() {	    
			    var a = '';
			    for(var k in attributes) 
				a = '{0} {1}="{2}"'.format([a,k,attributes[k]]);
			    if('img br link'.split(' ').indexOf(name)<0) {
				var b = components.map(function(x){
					return x.toString();
				    }).join('');
				return '<{0}{1}>{2}</{0}>'.format([name,a,b]);
			    } else {
				return '<{0}{1}/>'.format([name,a]);
			    }
			};
		    };
		return new arguments.callee.Tag(name,components,attributes);
	    };
	    return _tag;
	};
	my.events = {};
	my.when = function(name,fn,once) {
	    if(name in my.events) my.events[name].push([fn,once]);
	    else my.events[name] = [[fn,once]];	    
	};
	my.go = function(name,obj) {
	    if(name in my.events)
		my.events[name] = my.events[name].filter(function(item){
			item[0](obj);
			if(!item[1]) return item;
		    });
	};
	/*
	  my.promise() inspired to Q.js
	 */
	my.promise_counter = 0;
	my.run = function(fn,obj) {
	    var d = my.promise();
	    try { d.resolve(fn(obj)); } catch(e) { d.reject(e); }
	    return d;
	};
	my.promise = function() {	    
	    var promise = function() {
		this.code =  my.promise_counter++;
		this.resolved = false;
		this.rejected = false;
		this.obj = null;
		this.resolve = function(obj) {
		    this.resolved = true;
		    this.obj = obj;
		    my.go(this.code+':resolved',obj);
		};
		this.reject = function(obj) {
		    this.rejected = true;
		    this.obj = obj;
		    my.go(this.code+':rejected',obj);
		};
		this.then = function(f,g) {
		    f = f || function(obj){ return obj; };
		    if(g=='always') g=f;
		    g = g || function(e){ throw e; };
		    if(this.resolved) {
			return my.run(f,this.obj);
		    } else if(this.rejected) {
			return my.run(g,this.obj); 
		    } else {
			var d = my.promise(); 
			my.when(this.code+':resolved', function(obj) {
				try {
				    d.resolve(f(obj));
				} catch(e) {
				    d.reject(e);
				}
			    });
			my.when(this.code+':rejected', function(obj) {
                                try {
                                    d.resolve(g(obj));
                                } catch(e) {
                                    d.reject(e);
                                }
			    });
			return d;
		    }
		};
	    };
	    return new promise();
	};
	my.sleep = function(dt) {
	    var d = my.promise();
	    setTimeout(function(){d.resolve();},dt);
	    return d;
	};

	function isFunction(fn) {
	    return fn && {}.toString.call(fn) === '[object Function]';
	}

	my.model_counter = 0;
	my.model = function(obj) {
	    var code = my.model_counter++; 
	    var name = 'model-change:{0}'.format([code]);
	    delete my.events[name];
	    for(var key in obj) {
		if(!isFunction(obj[key])) {
		    obj.watch(key,function(key, oldval, newval) {
			    if(newval!=oldval) {
				my.go(name, [key, oldval, newval]);
			    }
			    return newval;
			});
		}
	    }
	    obj.onChangeCall = function(fn) { 		
		my.when(name, function(p){fn.apply(null,p);}); 
	    };
	    obj.linkToTemplate = function(selector) { 
		var div = jQuery(selector);
		var source = div.html();
		var render = function() { 
		    var output = Mustache.render(source, obj);
		    div.html(output);
		    div.find('[my-bind]')
		    .each(function() {			   
			    var self = jQuery(this);
			    var id = self.attr('id');
			    var fn = function() {
				var key = self.attr('my-bind');
				obj[key] = self.val();
				render();
				input = jQuery('[my-bind={0}]'.format([key]));
				input.focus().val('').val(obj[key]);
			    };
			    self.on('keyup change',my.throttle(fn,1000));
			});
		};
		render();		
	    };
	    return obj;
	};
	return my;
    })();
