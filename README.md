JSPromise
=========
Require about 100 lines of javascript code to utilize Promise class for implementing asynchronous processes with chaining and joining capabilities.

package.json
------------
``` Javascript
{
  "dependencies": {
    "js-promise": "*"
  }
}
```

Sample usage
------------
``` Javascript
var JSPromise = require("js-promise");

function myTimeout(ms){
    return new JSPromise(function(onSuccess, onError){
        setTimeout(function(){onSuccess(ms);}, ms);
    });
}

console.log("Waiting ... ");

myTimeout(3000)
    .then(function(delay){
        console.log("Done " + delay + " ms!");
        return myTimeout(2000);
    })
    .then(function(delay){
        console.log("Done " + delay + " ms!");
        return myTimeout(1000);
    })
    .done(function(delay){
        console.log("Done " + delay + " ms!");
        testJoin();
    });

function testJoin() {
    console.log("Waiting for 3 joined promises to finishes in 5 seconds on:" + (new Date()).toISOString());

    JSPromise.join([
        myTimeout(2000),
        myTimeout(1000),
        myTimeout(5000),
    ]).done(function(){
        console.log("Done on: " + (new Date()).toISOString());
        console.log("Test Passed!");
    })
}

```
