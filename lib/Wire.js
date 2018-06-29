(function(definition){var Wire=definition(typeof Parallelio!=="undefined"?Parallelio:this.Parallelio);Wire.definition=definition;if(typeof module!=="undefined"&&module!==null){module.exports=Wire;}else{if(typeof Parallelio!=="undefined"&&Parallelio!==null){Parallelio.Wire=Wire;}else{if(this.Parallelio==null){this.Parallelio={};}this.Parallelio.Wire=Wire;}}})(function(dependencies){if(dependencies==null){dependencies={};}
var Tiled = dependencies.hasOwnProperty("Tiled") ? dependencies.Tiled : require('parallelio-tiles').Tiled;
var Connected = dependencies.hasOwnProperty("Connected") ? dependencies.Connected : require('./Connected');
var Wire, extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;
Wire = (function(superClass) {
  extend(Wire, superClass);

  Wire.extend(Connected);

  function Wire(wireType) {
    this.wireType = wireType != null ? wireType : 'red';
    Wire.__super__.constructor.call(this);
  }

  Wire.properties({
    outputs: {
      calcul: function(invalidation) {
        var parent;
        parent = invalidation.prop('tile');
        return invalidation.prop('adjacentTiles', parent).reduce((function(_this) {
          return function(res, tile) {
            return res.concat(invalidation.prop('children', tile).filter(function(child) {
              return _this.canConnectTo(child);
            }).toArray());
          };
        })(this), []);
      }
    }
  });

  Wire.prototype.canConnectTo = function(target) {
    return Connected.prototype.canConnectTo.call(this, target) && ((target.wireType == null) || target.wireType === this.wireType);
  };

  Wire.prototype.onNewSignalType = function(signal, op) {
    return this.forwardSignal(signal, op);
  };

  return Wire;

})(Tiled);

return(Wire);});