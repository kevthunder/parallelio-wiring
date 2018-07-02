Tiled = require('parallelio-tiles').Tiled
Direction = require('parallelio-tiles').Direction
Connected = require('./Connected')

class Wire extends Tiled
  @extend Connected
  constructor: (@wireType = 'red') ->
    super()

  @properties
    outputs:
      calcul: (invalidation)->
        parent = invalidation.prop('tile')
        invalidation.prop('adjacentTiles',parent).reduce (res,tile) =>
          res.concat(invalidation.prop('children',tile).filter (child) =>
              this.canConnectTo(child)
            .toArray())
        , []
    connectedDirections:
      calcul: (invalidation)->
        invalidation.prop('outputs').reduce (out,conn)=>
            if (d = @tile.findDirectionOf(conn)) and d not in out
              out.push(d)
            out
          , []

  canConnectTo: (target) ->
    Connected::canConnectTo.call(this,target) and (!target.wireType? or target.wireType == @wireType)

  onNewSignalType: (signal, op) ->
    @forwardSignal(signal, op)