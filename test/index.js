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

myTimeout(1000)
    .then(function(delay){
        console.log("Done " + delay + " ms!");
        return myTimeout(2000);
    })
    .then(function(delay){
        console.log("Done " + delay + " ms!");
        return myTimeout(3000);
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