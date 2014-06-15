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

    var noFunc = function(){
        console.log("Missing promise callback function");
    };
    var inst = {
        _callbacklist: [],
        _state: states.pending, //0: pending, 1:success, 2: failed, 3: cancelled

        then: function (onSuccess, onFailure) {
            var thenPromise = new CPromise();//then of
            this._callbacklist.push({
                onSuccess: onSuccess||noFunc,
                onFailure: onFailure||noFunc,
                thenPromise: thenPromise
            });
            this._notifyListeners();
            return thenPromise;
        },
        done: function (onSuccess, onFailure) {
            this._callbacklist.push({
                onSuccess: onSuccess||noFunc,
                onFailure: onFailure||noFunc
            });
            this._notifyListeners();
            // doesn't return a new promise
        },
        _notifyListeners: function () {// notify onSuccess callbacks if promise is fulfilled
            if( (this._value !== undefined) && (this._value.constructor === CPromise) ){
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
            if( (val !== undefined) && val.constructor === CPromise) {
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

    ( init && init(inst.fulfill.bind(this),inst.reject.bind(this)) );

    // extend this object
    for (var k in inst) {
        this[k] = inst[k];
    }

}

CPromise.as = function(val){
    return (new CPromise()).fulfill(val);
};

CPromise.timeout = function(ms){
    return new CPromise(function(onSuccess){
        setTimeout(onSuccess,ms);
    });
};

module.exports = CPromise;
