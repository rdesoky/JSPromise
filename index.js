/**
 * Created by Ramy on 6/13/2014.
 */

function CPromise( init ) {
    var states = {
        pending: 0,
        success: 1,
        failed: 2,
        cancelled: 3
    };
    var noSuccessHandler = function(result){
        console.error( "Missing Promise Success Handler." + ( (result !== undefined ) ? " result=" + JSON.stringify(result) : "" ) );
        return result;
    };
    var noErrorHandler = function(err){
        console.error( "Missing Promise Error Handler." + ( (err !== undefined ) ? " error=" + JSON.stringify(err) : "" ) );
        return err;
    };
    var promise = {
        _callbacklist: [],
        _state: states.pending, //0: pending, 1:success, 2: failed, 3: cancelled

        then: function (onSuccess, onFailure) {
            var thenPromise = new CPromise();//then of
            this._callbacklist.push({
                onSuccess: onSuccess||noSuccessHandler,
                onFailure: onFailure||noErrorHandler,
                thenPromise: thenPromise
            });
            this._notifyListeners();
            return thenPromise;
        },
        done: function (onSuccess, onFailure) {
            this._callbacklist.push({
                onSuccess: onSuccess||noSuccessHandler,
                onFailure: onFailure||noErrorHandler
            });
            this._notifyListeners();
            // doesn't return a new promise
        },
        _notifyListeners: function () {// notify onSuccess callbacks if promise is fulfilled
            if( (this._value !== undefined) && (this._value !== null) && (this._value.constructor === CPromise) ){
                return;//wait for new promise to be fulfilled
            }

            if( this._state == states.success || this._state == states.failed ){
                while( this._callbacklist.length ){
                    var cb = this._callbacklist[0];
                    this._callbacklist.splice(0, 1);//remove the callback node

                    var then_ret = (this._state == states.success) ?
                        cb.onSuccess(this._value) :
                        cb.onFailure(this._value) ;

                    if (cb.thenPromise) {
                        //chain to returned promise
                        (this._state == states.success)?
                            cb.thenPromise.fulfill(then_ret):
                            cb.thenPromise.reject(then_ret);
                    }
                }
            }
        },
        cancel:function(){
            this._state = states.cancelled;
            this._callbacklist.length = 0;
            return this;
        },
        reject:function(err_val){
            this._value = err_val;
            this._state = states.failed;
            this._notifyListeners();
            return this;
        },
        fulfill: function (val) {
            if( (val !== undefined) && (val !== undefined) && (val.constructor === CPromise) ) {
                //if value is a promise, wait for the fulfillment
                val.done(this.fulfill.bind(this), this.reject.bind(this));
                return this;
            }
            this._state = states.success;
            this._value = val;
            this._notifyListeners();
            return this;
        }
    };

    // extend this object
    for (var k in promise) {
        this[k] = promise[k];
    }

    ( init && init(promise.fulfill.bind(this),promise.reject.bind(this)) );

}

CPromise.as = function(val){
    return (new CPromise()).fulfill(val);
};

CPromise.is = function(val){
    return( val && (val.constructor == CPromise) );
};

CPromise.join = function(list){
    var ret = new CPromise();
    var doneCount = 0;
    var doneHandler = function(){
        if(++doneCount >= list.length){
            ret.fulfill();
        }
    };
    list.forEach(function(pr){
        pr.done(doneHandler, doneHandler);
    });
    return ret;
};

CPromise.timeout = function(ms){
    return new CPromise(function(onSuccess){
        setTimeout(onSuccess,ms);
    });
};

CPromise.error = function(err){
    return new CPromise(function(onSuccess,onError){
        onError(err);
    });
};

CPromise.series = function(fncList, options){
    var ret = new CPromise();
    var ret_vals = {success:{},errors:{}};

    (function runProcess(ndx, options){
        if(ndx>=fncList.length){
            ret.fulfill(ret_vals);
            return;
        }
        var process = fncList[ndx];
        var prVal = process(options);
        if(CPromise.is(prVal)){
            prVal.done(
                function(results){
                    ret_vals.success[ndx] = results;
                    runProcess(ndx+1,results);
                },
                function(err){
                    ret_vals.errors[ndx] = err;
                    ret.reject(ret_vals);
                }
            );
        }else{
            ret_vals.success[ndx] = prVal;
            runProcess(ndx+1,prVal);
        }
    })(0,options);

    return ret;
};

module.exports = CPromise;
