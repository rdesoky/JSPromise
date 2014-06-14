JSPromise
=========
package.json
{
  "dependencies": {
    "JSPromise": "git+https://github.com/rdesoky/JSPromise.git"
  }
}

========
Sample usage
========

var JSPromise = require("JSPromise");

function myTimeout(ms){
    return new JSPromise(function(onSuccess, onError){
       setTimeout(onSuccess, ms);
    });
}

console.log("Waiting ... ");

myTimeout(3000).done(function(){
   console.log("Done!");
});
