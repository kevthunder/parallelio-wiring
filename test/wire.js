(function() {
  var Direction, EventEmitter, Signal, Tile, TileContainer, Wire, assert, createLoopWireStage, createWireStage;

  assert = require('chai').assert;

  EventEmitter = require('spark-starter').EventEmitter;

  Tile = require('parallelio-tiles').Tile;

  TileContainer = require('parallelio-tiles').TileContainer;

  Direction = require('parallelio-tiles').Direction;

  Wire = require('../lib/Wire');

  Signal = require('../lib/Signal');

  createWireStage = function() {
    return (new TileContainer).tap(function() {
      var b, m, n, r;
      // tile with red wire
      r = function(opt) {
        return (new Tile(opt.x, opt.y)).tap(function() {
          return this.addChild(new Wire("red"));
        });
      };
      // tile with blue wire
      b = function(opt) {
        return (new Tile(opt.x, opt.y)).tap(function() {
          return this.addChild(new Wire("blue"));
        });
      };
      // tile with red and blue wire
      m = function(opt) {
        return (new Tile(opt.x, opt.y)).tap(function() {
          this.addChild(new Wire("red"));
          return this.addChild(new Wire("blue"));
        });
      };
      // tile with no wire
      n = function(opt) {
        return new Tile(opt.x, opt.y);
      };
      return this.loadMatrix([[n, b, r, n], [r, m, r, r], [b, b, r, n], [n, b, r, n]]);
    });
  };

  createLoopWireStage = function() {
    return (new TileContainer).tap(function() {
      var b, m, n, r;
      // tile with red wire
      r = function(opt) {
        return (new Tile(opt.x, opt.y)).tap(function() {
          return this.addChild(new Wire("red"));
        });
      };
      // tile with blue wire
      b = function(opt) {
        return (new Tile(opt.x, opt.y)).tap(function() {
          return this.addChild(new Wire("blue"));
        });
      };
      // tile with red and blue wire
      m = function(opt) {
        return (new Tile(opt.x, opt.y)).tap(function() {
          this.addChild(new Wire("red"));
          return this.addChild(new Wire("blue"));
        });
      };
      // tile with no wire
      n = function(opt) {
        return new Tile(opt.x, opt.y);
      };
      return this.loadMatrix([[n, b, r, n], [r, m, r, r], [r, b, r, n], [r, r, r, n]]);
    });
  };

  describe('Wire', function() {
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
    it('can detect close wires', function() {
      var container, ref;
      container = createWireStage();
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
    it('can forward Signal', function() {
      var container, signal, startWire, testSignal;
      container = createWireStage();
      startWire = container.getTile(2, 0).children.get(0);
      signal = new Signal(null, 'test');
      startWire.addSignal(signal);
      testSignal = function(wire, type) {
        return wire.signals.find(function(s) {
          return s.type === type;
        });
      };
      assert.exists(testSignal(container.getTile(2, 3).children.get(0), signal.type));
      assert.exists(testSignal(container.getTile(3, 1).children.get(0), signal.type));
      return assert.exists(testSignal(container.getTile(0, 1).children.get(0), signal.type));
    });
    it('can forward Signal when there is a loop', function() {
      var container, signal, startWire, testSignal;
      container = createLoopWireStage();
      startWire = container.getTile(2, 0).children.get(0);
      signal = new Signal(null, 'test');
      startWire.addSignal(signal);
      testSignal = function(wire, type) {
        return wire.signals.find(function(s) {
          return s.type === type;
        });
      };
      assert.exists(testSignal(container.getTile(2, 3).children.get(0), signal.type));
      assert.exists(testSignal(container.getTile(3, 1).children.get(0), signal.type));
      return assert.exists(testSignal(container.getTile(0, 1).children.get(0), signal.type));
    });
    it('can forward exclusive Signal', function() {
      var container, signal1, signal2, start1, start2, testSignal;
      container = createWireStage();
      start1 = container.getTile(2, 0).children.get(0);
      start2 = container.getTile(3, 1).children.get(0);
      signal1 = new Signal('test1', 'test', true);
      signal2 = new Signal('test2', 'test', true);
      start1.addSignal(signal1);
      start2.addSignal(signal2);
      testSignal = function(wire, signal) {
        return wire.signals.find(function(s) {
          return s.type === signal.type && s.origin === signal.origin;
        });
      };
      assert.exists(testSignal(container.getTile(2, 3).children.get(0), signal1));
      assert.exists(testSignal(container.getTile(0, 1).children.get(0), signal1));
      assert.notExists(testSignal(container.getTile(2, 3).children.get(0), signal2));
      return assert.notExists(testSignal(container.getTile(0, 1).children.get(0), signal2));
    });
    it('can forward non-exclusive Signal', function() {
      var container, signal1, signal2, start1, start2, testSignal;
      container = createWireStage();
      start1 = container.getTile(2, 0).children.get(0);
      start2 = container.getTile(3, 1).children.get(0);
      signal1 = new Signal('test1', 'test', false);
      signal2 = new Signal('test2', 'test', false);
      start1.addSignal(signal1);
      start2.addSignal(signal2);
      testSignal = function(wire, signal) {
        return wire.signals.find(function(s) {
          return s.type === signal.type && s.origin === signal.origin;
        });
      };
      assert.exists(testSignal(container.getTile(2, 3).children.get(0), signal1));
      assert.exists(testSignal(container.getTile(0, 1).children.get(0), signal1));
      assert.exists(testSignal(container.getTile(2, 3).children.get(0), signal2));
      return assert.exists(testSignal(container.getTile(0, 1).children.get(0), signal2));
    });
    it('can forward Signal to later added wire', function() {
      var container, signal, startWire, testSignal, wire;
      container = createWireStage();
      startWire = container.getTile(2, 0).children.get(0);
      signal = new Signal(null, 'test');
      startWire.addSignal(signal);
      testSignal = function(wire, type) {
        return wire.signals.find(function(s) {
          return s.type === type;
        });
      };
      assert.exists(testSignal(container.getTile(2, 3).children.get(0), signal.type));
      wire = new Wire("red");
      container.getTile(3, 3).addChild(wire);
      return assert.exists(testSignal(wire, signal.type));
    });
    return it('can find connected directions', function() {
      var container;
      container = createWireStage();
      assert.include(container.getTile(1, 2).children.get(0).connectedDirections, Direction.up);
      assert.include(container.getTile(1, 2).children.get(0).connectedDirections, Direction.down);
      assert.include(container.getTile(1, 2).children.get(0).connectedDirections, Direction.left);
      assert.notInclude(container.getTile(1, 2).children.get(0).connectedDirections, Direction.right);
      assert.notInclude(container.getTile(0, 1).children.get(0).connectedDirections, Direction.up);
      assert.notInclude(container.getTile(0, 1).children.get(0).connectedDirections, Direction.down);
      assert.notInclude(container.getTile(0, 1).children.get(0).connectedDirections, Direction.left);
      return assert.include(container.getTile(0, 1).children.get(0).connectedDirections, Direction.right);
    });
  });

}).call(this);
