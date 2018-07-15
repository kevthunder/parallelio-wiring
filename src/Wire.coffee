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
        if parent
          invalidation.prop('adjacentTiles',parent).reduce (res,tile) =>
            res.concat(invalidation.prop('children',tile).filter (child) =>
                this.canConnectTo(child)
              .toArray())
          , []
        else 
          []
    connectedDirections:
      calcul: (invalidation)->
        invalidation.prop('outputs').reduce (out,conn)=>
            @findDirectionsTo(conn).forEach (d)->
              if d not in out
                out.push(d)
            out
          , []

  findDirectionsTo: (conn)->
    directions = if conn.tiles?
      conn.tiles.map (tile)=>
        @tile.findDirectionOf(tile)
    else
      [@tile.findDirectionOf(conn)]
    directions.filter (d)->
      d?

  canConnectTo: (target) ->
    Connected::canConnectTo.call(this,target) and (!target.wireType? or target.wireType == @wireType)

  onNewSignalType: (signal, op) ->
    @forwardSignal(signal, op)