(function(definition){var SignalOperation=definition(typeof Parallelio!=="undefined"?Parallelio:this.Parallelio);SignalOperation.definition=definition;if(typeof module!=="undefined"&&module!==null){module.exports=SignalOperation;}else{if(typeof Parallelio!=="undefined"&&Parallelio!==null){Parallelio.SignalOperation=SignalOperation;}else{if(this.Parallelio==null){this.Parallelio={};}this.Parallelio.SignalOperation=SignalOperation;}}})(function(dependencies){if(dependencies==null){dependencies={};}
var Element = dependencies.hasOwnProperty("Element") ? dependencies.Element : require('spark-starter').Element;
var SignalOperation, extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;
SignalOperation = (function(superClass) {
  extend(SignalOperation, superClass);

  function SignalOperation() {
    SignalOperation.__super__.constructor.call(this);
    this.queue = [];
    this.limiters = [];
  }

  SignalOperation.prototype.addOperation = function(funct, priority) {
    if (priority == null) {
      priority = 1;
    }
    if (priority) {
      return this.queue.unshift(funct);
    } else {
      return this.queue.push(funct);
    }
  };

  SignalOperation.prototype.addLimiter = function(connected) {
    if (!this.findLimiter(connected)) {
      return this.limiters.push(connected);
    }
  };

  SignalOperation.prototype.findLimiter = function(connected) {
    return this.limiters.indexOf(connected) > -1;
  };

  SignalOperation.prototype.start = function() {
    var results;
    results = [];
    while (this.queue.length) {
      results.push(this.step());
    }
    return results;
  };

  SignalOperation.prototype.step = function() {
    var funct;
    if (this.queue.length === 0) {
      return this.done();
    } else {
      funct = this.queue.shift(funct);
      return funct(this);
    }
  };

  SignalOperation.prototype.done = function() {};

  return SignalOperation;

})(Module);

return(SignalOperation);});