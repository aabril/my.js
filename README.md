# Oh My!

## What is this?

This is yet another JS library in the style of Angular.js, Ember.js, and Backbone.js.

## Why should you use it?

I am not saying you should.

## Why did I write it?

Because I wanted something simpler than the alternatives that provides 
the functionalities I needed and no more.

## How big is it?

The minimized version is ~6K (not including jQuery.js and mustache.js).

## What does it depend on?

The dynamic templates of `my.js` depends on jQuery.js and mustache.js.
The rest of the code does not depend on anything.


## Does it work well?

Trust no one! Can you help with testing?

## How do you use it?

Look into the index.html example.

## What does it give you?

### Some useful methods

    [1,2,3].indexOf(2)                   // -> 1
    [1,2,3].remove(2)                    // -> [1,3]
    "abc".capitalize()                   // -> "Abc"
    "a test".title()                     // -> "A Test"       
    " abc ".trim()                       // -> "abc"      
    " abc ".ltrim()                      // -> "abc "      
    " abc ".rtrim()                      // -> " abc"      
    "{0}{1}{2}".format(['a','b','c'])    // -> "abc"
    "abc".escapeRegExp()                 // -> "abc"
    "a&c".escapeHTML()                   // -> "a&amp;c"
    "abc".startsWith('a')                // -> true
    "abc".endsWith('c')                  // -> true
    "-".times(4)                         // -> "----" 

### Some useful functions (in the my object)
         
    my.range(1,5)                        // -> [1,2,3,4]                     
    my.len([1,2,3])                      // -> 3
    my.len({a:'b',c:'d'})                // -> 2
    my.keys({a:'b',c:'d'})               // -> ['a', 'b']
    my.values({a:'b',c:'d'})             // -> ['c', 'd']
    my.items({a:'b',c:'d'})              // -> [['a','b'], ['c','d']]
    my.clone({a:'b',c:'d'})              // -> {a:'b',c:'d'}
    my.isUndefined(obj)                  // -> true, false
    my.isFunction(obj)                   // -> true, false

### Throttle and debounce methods:

Lean more: http://remysharp.com/2010/07/21/throttling-function-calls/

    my.debounce(function() { console.log('tick!'); }, 250)        
    my.throttle(function() { console.log('tick!'); }, 250) 

### A helper system to generate HTML programmatically

In the style of web2py helpers:

    var DIV = my.tag('div');
    var SPAN = my.tag('span',{class:'x',id:'y'});
    var content = DIV('hello',' ',SPAN('world'));
    jQuery('#target').html(content.toString())

(notice the text is always automatically escaped).

Try it: http://jsfiddle.net/WF9ny/

### Promises like Q.js

Learn more: https://github.com/kriskowal/q

    my.run(function()     { return 'Oh My!';        })
      .then(function(msg) { alert(msg); return msg; })
      .then(function(msg) { throw msg;              })
      .then(function(msg) { alert('success:'+msg);  },
            function(err) { alert('error:'+err);    }); 

    my.sleep(1000).then(function() { alert('Oh My!'); });

Try it: http://jsfiddle.net/JJhLt/

### Generic events

    my.register('kick it', function(msg) { alert(msg); });
    my.sleep(1000).then(function(){ my.trigger('kick it','Oh My!'); });

Try it: http://jsfiddle.net/TgNs6/

### Dynamic Templates

A model is just an object wrapped in model, for example:

    var obj = my.model({a:1, b:function(){return this.a+1;}});

You can register a function to be called when the object changes:

    obj.onChangeCall(function(name,oldval,newval){alert(name+'='+newval);});

You can also bind the model to a template:

    <div id="mytemplate">
        <input my-bind="a" value="{{a}}"/> + 1 = <span>{{b}}</span>
    </div>

using this JS code:

    obj.linkToTemplate('#mytemplate');  

When the input changes, `a` changes, `b` is recomputed, the template is refreshed! Templates support the full mustache.js syntax. Learn more: https://github.com/janl/mustache.js

Try it: http://jsfiddle.net/96zfW/
