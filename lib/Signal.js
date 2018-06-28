(function(definition){var Signal=definition(typeof Parallelio!=="undefined"?Parallelio:this.Parallelio);Signal.definition=definition;if(typeof module!=="undefined"&&module!==null){module.exports=Signal;}else{if(typeof Parallelio!=="undefined"&&Parallelio!==null){Parallelio.Signal=Signal;}else{if(this.Parallelio==null){this.Parallelio={};}this.Parallelio.Signal=Signal;}}})(function(dependencies){if(dependencies==null){dependencies={};}
var Element = dependencies.hasOwnProperty("Element") ? dependencies.Element : require('spark-starter').Element;
var Signal, extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;
Signal = (function(superClass) {
  extend(Signal, superClass);

  function Signal(origin, type, exclusive) {
    this.origin = origin;
    this.type = type != null ? type : 'signal';
    this.exclusive = exclusive != null ? exclusive : false;
    Signal.__super__.constructor.call(this);
    this.last = this.origin;
  }

  Signal.prototype.withLast = function(last) {
    var signal;
    signal = new this.__proto__.constructor(this.origin, this.type, this.exclusive);
    signal.last = last;
    return signal;
  };

  Signal.prototype.copy = function() {
    var signal;
    signal = new this.__proto__.constructor(this.origin, this.type, this.exclusive);
    signal.last = this.last;
    return signal;
  };

  Signal.prototype.match = function(signal, checkLast, checkOrigin) {
    if (checkLast == null) {
      checkLast = false;
    }
    if (checkOrigin == null) {
      checkOrigin = this.exclusive;
    }
    return (!checkLast || signal.last === this.last) && (checkOrigin || signal.origin === this.origin) && signal.type === this.type;
  };

  return Signal;

})(Element);

return(Signal);});