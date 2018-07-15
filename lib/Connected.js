(function(definition){var Connected=definition(typeof Parallelio!=="undefined"?Parallelio:this.Parallelio);Connected.definition=definition;if(typeof module!=="undefined"&&module!==null){module.exports=Connected;}else{if(typeof Parallelio!=="undefined"&&Parallelio!==null){Parallelio.Connected=Connected;}else{if(this.Parallelio==null){this.Parallelio={};}this.Parallelio.Connected=Connected;}}})(function(dependencies){if(dependencies==null){dependencies={};}
var Element = dependencies.hasOwnProperty("Element") ? dependencies.Element : require('spark-starter').Element;
var SignalOperation = dependencies.hasOwnProperty("SignalOperation") ? dependencies.SignalOperation : require('./SignalOperation');
var Connected, extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;
Connected = (function(superClass) {
  extend(Connected, superClass);

  function Connected() {
    return Connected.__super__.constructor.apply(this, arguments);
  }

  Connected.properties({
    signals: {
      collection: true
    },
    inputs: {
      collection: true
    },
    outputs: {
      collection: true,
      itemAdded: function(output, i) {
        return this.forwardedSignals.forEach((function(_this) {
          return function(signal) {
            return _this.forwardSignalTo(signal, output);
          };
        })(this));
      },
      itemRemoved: function(output, i) {
        return this.forwardedSignals.forEach((function(_this) {
          return function(signal) {
            return _this.stopForwardedSignalTo(signal, output);
          };
        })(this));
      }
    },
    forwardedSignals: {
      collection: true
    }
  });

  Connected.prototype.canConnectTo = function(target) {
    return typeof target.addSignal === "function";
  };

  Connected.prototype.acceptSignal = function(signal) {
    return true;
  };

  Connected.prototype.onAddConnection = function(conn) {};

  Connected.prototype.onRemoveConnection = function(conn) {};

  Connected.prototype.onNewSignalType = function(signal) {};

  Connected.prototype.onAddSignal = function(signal, op) {};

  Connected.prototype.onRemoveSignal = function(signal, op) {};

  Connected.prototype.onRemoveSignalType = function(signal, op) {};

  Connected.prototype.onReplaceSignal = function(oldSignal, newSignal, op) {};

  Connected.prototype.containsSignal = function(signal, checkLast, checkOrigin) {
    if (checkLast == null) {
      checkLast = false;
    }
    return this.signals.find(function(c) {
      return c.match(signal, checkLast, checkOrigin);
    });
  };

  Connected.prototype.addSignal = function(signal, op) {
    var autoStart;
    if (!(op != null ? op.findLimiter(this) : void 0)) {
      if (!op) {
        op = new SignalOperation();
        autoStart = true;
      }
      op.addOperation((function(_this) {
        return function() {
          var similar;
          if (!_this.containsSignal(signal, true) && _this.acceptSignal(signal)) {
            similar = _this.containsSignal(signal);
            _this.signals.push(signal);
            _this.onAddSignal(signal, op);
            if (!similar) {
              return _this.onNewSignalType(signal, op);
            }
          }
        };
      })(this));
      if (autoStart) {
        op.start();
      }
    }
    return signal;
  };

  Connected.prototype.removeSignal = function(signal, op) {
    var autoStart;
    if (!(op != null ? op.findLimiter(this) : void 0)) {
      if (!op) {
        op = new SignalOperation;
        autoStart = true;
      }
      op.addOperation((function(_this) {
        return function() {
          var existing;
          if ((existing = _this.containsSignal(signal, true)) && _this.acceptSignal(signal)) {
            _this.signals.splice(_this.signals.indexOf(existing), 1);
            _this.onRemoveSignal(signal, op);
            op.addOperation(function() {
              var similar;
              similar = _this.containsSignal(signal);
              if (similar) {
                return _this.onReplaceSignal(signal, similar, op);
              } else {
                return _this.onRemoveSignalType(signal, op);
              }
            }, 0);
          }
          if (stepByStep) {
            return op.step();
          }
        };
      })(this));
      if (autoStart) {
        return op.start();
      }
    }
  };

  Connected.prototype.prepForwardedSignal = function(signal) {
    if (signal.last === this) {
      return signal;
    } else {
      return signal.withLast(this);
    }
  };

  Connected.prototype.forwardSignal = function(signal, op) {
    var next;
    this.forwardedSignals.add(signal);
    next = this.prepForwardedSignal(signal);
    return this.outputs.forEach(function(conn) {
      if (signal.last !== conn) {
        return conn.addSignal(next, op);
      }
    });
  };

  Connected.prototype.forwardAllSignalsTo = function(conn, op) {
    return this.signals.forEach((function(_this) {
      return function(signal) {
        var next;
        next = _this.prepForwardedSignal(signal);
        return conn.addSignal(next, op);
      };
    })(this));
  };

  Connected.prototype.stopForwardedSignal = function(signal, op) {
    var next;
    this.forwardedSignals.remove(signal);
    next = this.prepForwardedSignal(signal);
    return this.outputs.forEach(function(conn) {
      if (signal.last !== conn) {
        return conn.removeSignal(next, op);
      }
    });
  };

  Connected.prototype.stopAllForwardedSignalTo = function(conn, op) {
    return this.signals.forEach((function(_this) {
      return function(signal) {
        var next;
        next = _this.prepForwardedSignal(signal);
        return conn.removeSignal(next, op);
      };
    })(this));
  };

  Connected.prototype.forwardSignalTo = function(signal, conn, op) {
    var next;
    next = this.prepForwardedSignal(signal);
    if (signal.last !== conn) {
      return conn.addSignal(next, op);
    }
  };

  Connected.prototype.stopForwardedSignalTo = function(signal, conn, op) {
    var next;
    next = this.prepForwardedSignal(signal);
    if (signal.last !== conn) {
      return conn.removeSignal(next, op);
    }
  };

  return Connected;

})(Element);

return(Connected);});