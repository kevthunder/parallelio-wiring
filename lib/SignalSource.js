(function(definition){var SignalSource=definition(typeof Parallelio!=="undefined"?Parallelio:this.Parallelio);SignalSource.definition=definition;if(typeof module!=="undefined"&&module!==null){module.exports=SignalSource;}else{if(typeof Parallelio!=="undefined"&&Parallelio!==null){Parallelio.SignalSource=SignalSource;}else{if(this.Parallelio==null){this.Parallelio={};}this.Parallelio.SignalSource=SignalSource;}}})(function(dependencies){if(dependencies==null){dependencies={};}
var Connected = dependencies.hasOwnProperty("Connected") ? dependencies.Connected : require('Connected');
var Signal = dependencies.hasOwnProperty("Signal") ? dependencies.Signal : require('Signal');
var SignalSource, extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;
SignalSource = (function(superClass) {
  extend(SignalSource, superClass);

  function SignalSource() {
    return SignalSource.__super__.constructor.apply(this, arguments);
  }

  SignalSource.properties({
    activated: {
      change: function() {
        var op;
        op = new SignalOperation();
        if (this.activated) {
          this.forwardSignal(this.signal, op);
        } else {
          this.stopForwardedSignal(this.signal, op);
        }
        return op.start();
      }
    },
    signal: {
      calcul: function() {
        return new Signal(this, 'power', true);
      }
    }
  });

  return SignalSource;

})(Connected);

return(SignalSource);});