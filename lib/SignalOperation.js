(function(definition){var SignalOperation=definition(typeof Parallelio!=="undefined"?Parallelio:this.Parallelio);SignalOperation.definition=definition;if(typeof module!=="undefined"&&module!==null){module.exports=SignalOperation;}else{if(typeof Parallelio!=="undefined"&&Parallelio!==null){Parallelio.SignalOperation=SignalOperation;}else{if(this.Parallelio==null){this.Parallelio={};}this.Parallelio.SignalOperation=SignalOperation;}}})(function(dependencies){if(dependencies==null){dependencies={};}
var Element = dependencies.hasOwnProperty("Element") ? dependencies.Element : require('spark-starter').Element;
var SignalOperation;
SignalOperation = class SignalOperation extends Element {
  constructor() {
    super();
    this.queue = [];
    this.limiters = [];
  }

  addOperation(funct, priority = 1) {
    if (priority) {
      return this.queue.unshift(funct);
    } else {
      return this.queue.push(funct);
    }
  }

  addLimiter(connected) {
    if (!this.findLimiter(connected)) {
      return this.limiters.push(connected);
    }
  }

  findLimiter(connected) {
    return this.limiters.indexOf(connected) > -1;
  }

  start() {
    var results;
    results = [];
    while (this.queue.length) {
      results.push(this.step());
    }
    return results;
  }

  step() {
    var funct;
    if (this.queue.length === 0) {
      return this.done();
    } else {
      funct = this.queue.shift(funct);
      return funct(this);
    }
  }

  done() {}

};

return(SignalOperation);});