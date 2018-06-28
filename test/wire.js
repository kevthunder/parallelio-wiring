(function() {
  var EventEmitter, Tile, TileContainer, Wire, assert;

  assert = require('chai').assert;

  EventEmitter = require("wolfy87-eventemitter");

  Tile = require('parallelio-tiles').Tile;

  TileContainer = require('parallelio-tiles').TileContainer;

  Wire = require('../lib/Wire');

  describe('Wire', function() {
    before(function() {
      Wire = Wire.definition();
      Wire.include(EventEmitter.prototype);
      Tile = Tile.definition();
      return Tile.include(EventEmitter.prototype);
    });
    it('can connect to other wire of same type', function() {
      var wire1, wire2;
      wire1 = new Wire("red");
      wire2 = new Wire("red");
      return assert.isTrue(wire1.canConnectTo(wire2));
    });
    it('cant connect to wires of different type', function() {
      var wire1, wire2;
      wire1 = new Wire("red");
      wire2 = new Wire("blue");
      return assert.isFalse(wire1.canConnectTo(wire2));
    });
    return it('can detect close wires', function() {
      var container, ref;
      container = (new TileContainer).tap(function() {
        var b, m, n, r;
        r = function(opt) {
          return (new Tile(opt.x, opt.y)).tap(function() {
            return this.addChild(new Wire("red"));
          });
        };
        b = function(opt) {
          return (new Tile(opt.x, opt.y)).tap(function() {
            return this.addChild(new Wire("blue"));
          });
        };
        m = function(opt) {
          return (new Tile(opt.x, opt.y)).tap(function() {
            this.addChild(new Wire("red"));
            return this.addChild(new Wire("blue"));
          });
        };
        n = function(opt) {
          return new Tile(opt.x, opt.y);
        };
        return this.loadMatrix([[n, b, r, n], [r, m, r, r], [b, b, r, n], [n, b, r, n]]);
      });
      ref = container.getTile(2, 1).children.get(0);
      assert.include(ref.outputs.toArray(), container.getTile(1, 1).children.get(0));
      assert.notInclude(ref.outputs.toArray(), container.getTile(1, 1).children.get(1));
      assert.include(ref.outputs.toArray(), container.getTile(3, 1).children.get(0));
      assert.include(ref.outputs.toArray(), container.getTile(2, 0).children.get(0));
      assert.include(ref.outputs.toArray(), container.getTile(2, 2).children.get(0));
      ref = container.getTile(1, 2).children.get(0);
      assert.include(ref.outputs.toArray(), container.getTile(1, 1).children.get(1));
      assert.notInclude(ref.outputs.toArray(), container.getTile(1, 1).children.get(0));
      assert.include(ref.outputs.toArray(), container.getTile(1, 3).children.get(0));
      assert.notInclude(ref.outputs.toArray(), container.getTile(2, 2).children.get(0));
      return assert.include(ref.outputs.toArray(), container.getTile(0, 2).children.get(0));
    });
  });

}).call(this);
