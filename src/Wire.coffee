Tiled = require('parallelio-tiles').Tiled
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

  canConnectTo: (target) ->
    Connected::canConnectTo.call(this,target) and (!target.wireType? or target.wireType == @wireType)

