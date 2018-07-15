(function(definition){var Wire=definition(typeof Parallelio!=="undefined"?Parallelio:this.Parallelio);Wire.definition=definition;if(typeof module!=="undefined"&&module!==null){module.exports=Wire;}else{if(typeof Parallelio!=="undefined"&&Parallelio!==null){Parallelio.Wire=Wire;}else{if(this.Parallelio==null){this.Parallelio={};}this.Parallelio.Wire=Wire;}}})(function(dependencies){if(dependencies==null){dependencies={};}
var Tiled = dependencies.hasOwnProperty("Tiled") ? dependencies.Tiled : require('parallelio-tiles').Tiled;
var Direction = dependencies.hasOwnProperty("Direction") ? dependencies.Direction : require('parallelio-tiles').Direction;
var Connected = dependencies.hasOwnProperty("Connected") ? dependencies.Connected : require('./Connected');
var Wire, extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
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
        if (parent) {
          return invalidation.prop('adjacentTiles', parent).reduce((function(_this) {
            return function(res, tile) {
              return res.concat(invalidation.prop('children', tile).filter(function(child) {
                return _this.canConnectTo(child);
              }).toArray());
            };
          })(this), []);
        } else {
          return [];
        }
      }
    },
    connectedDirections: {
      calcul: function(invalidation) {
        return invalidation.prop('outputs').reduce((function(_this) {
          return function(out, conn) {
            _this.findDirectionsTo(conn).forEach(function(d) {
              if (indexOf.call(out, d) < 0) {
                return out.push(d);
              }
            });
            return out;
          };
        })(this), []);
      }
    }
  });

  Wire.prototype.findDirectionsTo = function(conn) {
    var directions;
    directions = conn.tiles != null ? conn.tiles.map((function(_this) {
      return function(tile) {
        return _this.tile.findDirectionOf(tile);
      };
    })(this)) : [this.tile.findDirectionOf(conn)];
    return directions.filter(function(d) {
      return d != null;
    });
  };

  Wire.prototype.canConnectTo = function(target) {
    return Connected.prototype.canConnectTo.call(this, target) && ((target.wireType == null) || target.wireType === this.wireType);
  };

  Wire.prototype.onNewSignalType = function(signal, op) {
    return this.forwardSignal(signal, op);
  };

  return Wire;

})(Tiled);

return(Wire);});