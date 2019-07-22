Element = require('spark-starter').Element

module.exports = class Signal extends Element
  constructor: (@origin, @type = 'signal', @exclusive = false) ->
    super()
    @last = @origin
  withLast: (last) ->
    signal = new @__proto__.constructor(@origin, @type, @exclusive)
    signal.last = last
    signal
  copy: ->
    signal = new @__proto__.constructor(@origin, @type, @exclusive)
    signal.last = @last
    signal
  match: (signal, checkLast = false, checkOrigin = @exclusive) ->
    (!checkLast or signal.last == @last) and (checkOrigin or signal.origin == @origin) and signal.type == @type
