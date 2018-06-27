Tiled = require('parallelio-tiles').Tiled
Connected = require('./Connected')

class Wire extends Tiled
  @extends Connected
  constructor: (@wireType = 'red') ->
    super()

  @properties
    outputs:
      calcul: (invalidation)->
        res = []
        tile = invalidation.prop('tile')
        for tile in @tile.getAdjacents()
          for child in invalidation.prop('children',tile)
            if this.canConnectTo(child)
              res.push(child)
        res

  canConnectTo: (target) ->
    Connected.canConnectTo.call(this,target) and (!target.wireType? or target.wireType == @wireType)

