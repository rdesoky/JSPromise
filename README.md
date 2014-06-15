JSPromise
=========
  
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
       setTimeout(onSuccess, ms);
    });
  }

  console.log("Waiting ... ");

  myTimeout(3000).done(function(){
    console.log("Done!");
  });

```
