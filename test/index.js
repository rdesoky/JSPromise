/**
 * Created by rdeso_000 on 6/14/2014.
 */

var JSPromise = require("../index.js");

function myTimeout(ms){
    return new JSPromise(function(onSuccess, onError){
        setTimeout(onSuccess, ms);
    });
}

console.log("Testing ...");

myTimeout(3000).done(function(){
    console.log("Test Passed!");
});
