JSPromise
=========
Require less than 100 lines of javascript code to utilize Promise class for implementing asynchronous processes with chaining capability.

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
    });

```
