assert = require('chai').assert
Tile = require('parallelio-tiles').Tile
TileContainer = require('parallelio-tiles').TileContainer




describe 'Wire', ->
  it 'can connect to other wire of same type', ->
    wire1 = new Wire("red")
    wire2 = new Wire("red")
    assert.isTrue(wire1.canConnectTo(wire2))

  it 'cant connect to wires of different type', ->
    wire1 = new Wire("red")
    wire2 = new Wire("blue")
    assert.isFalse(wire1.canConnectTo(wire2))

  it 'can detect close wires', ->
    container = (new TileContainer).tap ->
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

    ref = container.getTile(2,1).children[0]
    assert.include(ref.outputs,container.getTile(1,1).children[0])
    assert.notInclude(ref.outputs,container.getTile(1,1).children[1])
    assert.include(ref.outputs,container.getTile(3,1).children[0])
    assert.include(ref.outputs,container.getTile(2,0).children[0])
    assert.include(ref.outputs,container.getTile(2,2).children[0])

    ref = container.getTile(1,2).children[0]
    assert.include(ref.outputs,container.getTile(1,1).children[1])
    assert.notInclude(ref.outputs,container.getTile(1,1).children[0])
    assert.include(ref.outputs,container.getTile(1,3).children[0])
    assert.notInclude(ref.outputs,container.getTile(2,2).children[0])
    assert.include(ref.outputs,container.getTile(0,2).children[0])