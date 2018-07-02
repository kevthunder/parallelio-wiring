assert = require('chai').assert
EventEmitter = require("wolfy87-eventemitter")
Tile = require('parallelio-tiles').Tile
TileContainer = require('parallelio-tiles').TileContainer
Direction = require('parallelio-tiles').Direction
Wire = require('../lib/Wire')
Signal = require('../lib/Signal')


createWireStage = ->
  (new TileContainer).tap ->
      # tile with red wire
      r = (opt) ->
        (new Tile(opt.x,opt.y)).tap ->
          @addChild(new Wire("red"))
      # tile with blue wire
      b = (opt) ->
        (new Tile(opt.x,opt.y)).tap ->
          @addChild(new Wire("blue"))
      # tile with red and blue wire
      m = (opt) ->
        (new Tile(opt.x,opt.y)).tap ->
          @addChild(new Wire("red"))
          @addChild(new Wire("blue"))
      # tile with no wire
      n = (opt) ->
        new Tile(opt.x,opt.y)
      @loadMatrix([
        [n, b, r, n],
        [r, m, r, r],
        [b, b, r, n],
        [n, b, r, n],
      ]);

createLoopWireStage = ->
  (new TileContainer).tap ->
      # tile with red wire
      r = (opt) ->
        (new Tile(opt.x,opt.y)).tap ->
          @addChild(new Wire("red"))
      # tile with blue wire
      b = (opt) ->
        (new Tile(opt.x,opt.y)).tap ->
          @addChild(new Wire("blue"))
      # tile with red and blue wire
      m = (opt) ->
        (new Tile(opt.x,opt.y)).tap ->
          @addChild(new Wire("red"))
          @addChild(new Wire("blue"))
      # tile with no wire
      n = (opt) ->
        new Tile(opt.x,opt.y)
      @loadMatrix([
        [n, b, r, n],
        [r, m, r, r],
        [r, b, r, n],
        [r, r, r, n],
      ]);

describe 'Wire', ->
  before ->
    Wire = Wire.definition()
    Wire.include EventEmitter.prototype

    Tile = Tile.definition()
    Tile.include EventEmitter.prototype

  it 'can connect to other wire of same type', ->
    wire1 = new Wire("red")
    wire2 = new Wire("red")
    assert.isTrue(wire1.canConnectTo(wire2))

  it 'cant connect to wires of different type', ->
    wire1 = new Wire("red")
    wire2 = new Wire("blue")
    assert.isFalse(wire1.canConnectTo(wire2))

  it 'can detect close wires', ->
    container = createWireStage()

    ref = container.getTile(2,1).children.get(0)
    assert.include(   ref.outputs.toArray(), container.getTile(1,1).children.get(0))
    assert.notInclude(ref.outputs.toArray(), container.getTile(1,1).children.get(1))
    assert.include(   ref.outputs.toArray(), container.getTile(3,1).children.get(0))
    assert.include(   ref.outputs.toArray(), container.getTile(2,0).children.get(0))
    assert.include(   ref.outputs.toArray(), container.getTile(2,2).children.get(0))

    ref = container.getTile(1,2).children.get(0)
    assert.include(   ref.outputs.toArray(), container.getTile(1,1).children.get(1))
    assert.notInclude(ref.outputs.toArray(), container.getTile(1,1).children.get(0))
    assert.include(   ref.outputs.toArray(), container.getTile(1,3).children.get(0))
    assert.notInclude(ref.outputs.toArray(), container.getTile(2,2).children.get(0))
    assert.include(   ref.outputs.toArray(), container.getTile(0,2).children.get(0))

  it 'can forward Signal', ->
    container = createWireStage()
    startWire = container.getTile(2,0).children.get(0)

    signal = new Signal(null,'test')
    startWire.addSignal(signal)

    testSignal = (wire,type) ->
      wire.signals.find (s)->
        s.type == type

    assert.exists testSignal(container.getTile(2,3).children.get(0),signal.type)
    assert.exists testSignal(container.getTile(3,1).children.get(0),signal.type)
    assert.exists testSignal(container.getTile(0,1).children.get(0),signal.type)

  it 'can forward Signal when there is a loop', ->
    container = createLoopWireStage()
    startWire = container.getTile(2,0).children.get(0)

    signal = new Signal(null,'test')
    startWire.addSignal(signal)

    testSignal = (wire,type) ->
      wire.signals.find (s)->
        s.type == type

    assert.exists testSignal(container.getTile(2,3).children.get(0),signal.type)
    assert.exists testSignal(container.getTile(3,1).children.get(0),signal.type)
    assert.exists testSignal(container.getTile(0,1).children.get(0),signal.type)

  it 'can forward exclusive Signal', ->
    container = createWireStage()
    start1 = container.getTile(2,0).children.get(0)
    start2 = container.getTile(3,1).children.get(0)

    signal1 = new Signal('test1','test',true)
    signal2 = new Signal('test2','test',true)
    start1.addSignal(signal1)
    start2.addSignal(signal2)

    testSignal = (wire,signal) ->
      wire.signals.find (s)->
        s.type == signal.type and s.origin == signal.origin

    assert.exists testSignal(container.getTile(2,3).children.get(0),signal1)
    assert.exists testSignal(container.getTile(0,1).children.get(0),signal1)

    assert.notExists testSignal(container.getTile(2,3).children.get(0),signal2)
    assert.notExists testSignal(container.getTile(0,1).children.get(0),signal2)

  it 'can forward non-exclusive Signal', ->
    container = createWireStage()
    start1 = container.getTile(2,0).children.get(0)
    start2 = container.getTile(3,1).children.get(0)

    signal1 = new Signal('test1','test',false)
    signal2 = new Signal('test2','test',false)
    start1.addSignal(signal1)
    start2.addSignal(signal2)

    testSignal = (wire,signal) ->
      wire.signals.find (s)->
        s.type == signal.type and s.origin == signal.origin

    assert.exists testSignal(container.getTile(2,3).children.get(0),signal1)
    assert.exists testSignal(container.getTile(0,1).children.get(0),signal1)

    assert.exists testSignal(container.getTile(2,3).children.get(0),signal2)
    assert.exists testSignal(container.getTile(0,1).children.get(0),signal2)

  it 'can find connected directions', ->
    container = createWireStage()

    assert.include container.getTile(1,2).children.get(0).connectedDirections, Direction.up
    assert.include container.getTile(1,2).children.get(0).connectedDirections, Direction.down
    assert.include container.getTile(1,2).children.get(0).connectedDirections, Direction.left
    assert.notInclude container.getTile(1,2).children.get(0).connectedDirections, Direction.right

    assert.notInclude container.getTile(0,1).children.get(0).connectedDirections, Direction.up
    assert.notInclude container.getTile(0,1).children.get(0).connectedDirections, Direction.down
    assert.notInclude container.getTile(0,1).children.get(0).connectedDirections, Direction.left
    assert.include container.getTile(0,1).children.get(0).connectedDirections, Direction.right
