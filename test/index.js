/**
 * Created by rdeso_000 on 6/14/2014.
 */

var JSPromise = require("../js-promise.js");

function myTimeout(ms, logMsg){
	return new JSPromise(function(onSuccess, onError){
        setTimeout(function(){
                console.info(logMsg || ("-- Timeout ended on: " + (new Date()).toISOString()));
                onSuccess(ms);
            },
            ms
        );
    });
}

var startTime = Date.now();

console.log("Testing chains of (1+2+3+5+6)=17 seconds on " + (new Date()).toISOString());

myTimeout(1000)
.then(function(delay){
        console.log("Done " + delay + " ms!");
        return myTimeout(2000);
    }
)
.then(function(delay){
        console.log("Done " + delay + " ms!");
        return myTimeout(3000);
    }
)
.then(function(delay){
        console.log("Done " + delay + " ms!");
        return testJoin();
    }
)
.then(testEmptyJoin)
.then(testSeries)
.done(function(){
        var totalSeconds = ( Date.now() - startTime ) / 1000;
        console.log("Test Passed! in " + totalSeconds + " Seconds, expected: 17");
    }
);

function testEmptyJoin() {
	console.log("Waiting for 3 joined promises to finishes in (2|1|5)=5 seconds on:" + (new Date()).toISOString());
	return JSPromise.join([]).then(function(){
		console.log("Done JSPromise.join empty list on: " + (new Date()).toISOString());
	});
}
function testJoin() {
    console.log("Waiting for 3 joined promises to finishes in (2|1|5)=5 seconds on:" + (new Date()).toISOString());
    return JSPromise.join([
        myTimeout(2000),
        myTimeout(1000),
        myTimeout(5000)
    ]).then(function(){
        console.log("Done JSPromise.join on: " + (new Date()).toISOString());
    })
}

function testSeries() {
    console.log("Testing a series of 3 timeouts (2+1+3) seconds total 6 ");
    return JSPromise.series([
        function() {
            return myTimeout(2000);
        },
        function() {
            return myTimeout(1000);
        },
        function() {
            console.log("No asynchronous calls");
            return "XX";
        },
        function() {
            return myTimeout(3000);
        }
    ]).then(function(result){
        console.log("JSPromise.series result = " + JSON.stringify(result));
        console.log("Done JSPromise.series on " + (new Date()).toISOString());
    })
}