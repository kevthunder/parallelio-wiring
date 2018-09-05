(function(definition){var Signal=definition(typeof Parallelio!=="undefined"?Parallelio:this.Parallelio);Signal.definition=definition;if(typeof module!=="undefined"&&module!==null){module.exports=Signal;}else{if(typeof Parallelio!=="undefined"&&Parallelio!==null){Parallelio.Signal=Signal;}else{if(this.Parallelio==null){this.Parallelio={};}this.Parallelio.Signal=Signal;}}})(function(dependencies){if(dependencies==null){dependencies={};}
var Element = dependencies.hasOwnProperty("Element") ? dependencies.Element : require('spark-starter').Element;
var Signal;
Signal = class Signal extends Element {
  constructor(origin, type = 'signal', exclusive = false) {
    super();
    this.origin = origin;
    this.type = type;
    this.exclusive = exclusive;
    this.last = this.origin;
  }

  withLast(last) {
    var signal;
    signal = new this.__proto__.constructor(this.origin, this.type, this.exclusive);
    signal.last = last;
    return signal;
  }

  copy() {
    var signal;
    signal = new this.__proto__.constructor(this.origin, this.type, this.exclusive);
    signal.last = this.last;
    return signal;
  }

  match(signal, checkLast = false, checkOrigin = this.exclusive) {
    return (!checkLast || signal.last === this.last) && (checkOrigin || signal.origin === this.origin) && signal.type === this.type;
  }

};

return(Signal);});