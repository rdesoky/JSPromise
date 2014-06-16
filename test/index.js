/**
 * Created by rdeso_000 on 6/14/2014.
 */

var JSPromise = require("..");//default to index.js

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
        console.log("Test Passed!");
    });
