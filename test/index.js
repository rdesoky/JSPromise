/**
 * Created by rdeso_000 on 6/14/2014.
 */

var JSPromise = require("..");//default to index.js

function myTimeout(ms){
    return new JSPromise(function(onSuccess){
        setTimeout(onSuccess, ms);
    });
}

console.log("Testing JSPromise...");

myTimeout(3000).then(function(){
    console.log("Test Passed!");
    console.log("Testing chaining JSPromise.timeout(3000) ...");
    return JSPromise.timeout(3000);
}).done(function(){
    console.log("Test Passed!");
});
